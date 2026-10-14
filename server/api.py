"""The HTTP routes: GET /health and POST /chat."""

import time

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse

from .config import MESSAGES_PER_DAY, MESSAGES_PER_HOUR, MESSAGES_PER_MINUTE, MODEL_ID
from .events import HEADERS, MEDIA_TYPE, to_events
from .generation import stream_reply
from .logs import log, preview
from .middleware import allow_any_origin, log_requests
from .prompt import build_system_prompt
from .rate_limit import RateLimiter
from .request import parse_chat_request


def log_when_done(pieces, request_id, started):
    """Passes the reply through and logs it once it has finished streaming."""
    reply = []
    for piece in pieces:
        reply.append(piece)
        yield piece
    answer = "".join(reply).strip()
    log("chat.complete", request_id=request_id, characters=len(answer), seconds=round(time.perf_counter() - started, 2), text=preview(answer))


def create_api(tokenizer, model):
    api = FastAPI(title="Cloud Dragon Chat API")
    limiter = RateLimiter(MESSAGES_PER_MINUTE, MESSAGES_PER_HOUR, MESSAGES_PER_DAY)
    allow_any_origin(api)
    log_requests(api)

    @api.get("/health")
    def health():
        return {"ok": True, "model": MODEL_ID}

    @api.post("/chat")
    def chat(data: dict, request: Request):
        started = time.perf_counter()
        request_id = request.state.log_id

        # No database: the browser keeps the history and resends it every time.
        try:
            chat_request = parse_chat_request(data)
        except ValueError as error:
            raise HTTPException(status_code=400, detail=str(error))

        # Checked here rather than in a middleware, so the answer still gets the
        # CORS headers and the page can read how long to wait.
        wait = limiter.retry_after(request.client.host if request.client else "unknown")
        if wait:
            log("chat.limited", request_id=request_id, retry_after=wait)
            raise HTTPException(status_code=429, detail={"message": "Too many messages.", "retry_after": wait})

        system_prompt = build_system_prompt(
            chat_request.dragon_name,
            chat_request.user_name,
            first_reply=len(chat_request.messages) == 1,
            time_of_day=chat_request.time_of_day,
            crisis=chat_request.crisis,
        )
        messages = [{"role": "system", "content": system_prompt}, *chat_request.messages]
        log(
            "chat.prompt",
            request_id=request_id,
            messages=len(chat_request.messages),
            crisis=chat_request.crisis,
            text=preview(chat_request.messages[-1]["content"]),
        )

        pieces = stream_reply(tokenizer, model, messages, request_id)
        events = to_events(log_when_done(pieces, request_id, started))
        return StreamingResponse(events, media_type=MEDIA_TYPE, headers=HEADERS)

    return api
