"""The HTTP routes: GET /health and POST /chat."""

import threading
import time

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from starlette.concurrency import iterate_in_threadpool

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


async def stream_events(events, stop, request_id, on_end):
    """Passes the events through. If the response ends early (the server noticed
    the browser hang up), it stops generating too. `on_end` runs either way."""
    finished = False
    try:
        async for event in iterate_in_threadpool(events):
            yield event
        finished = True
    finally:
        if not finished:
            stop.set()
            log("chat.stopped", request_id=request_id, reason="response ended early")
        on_end()


def create_api(tokenizer, model):
    api = FastAPI(title="Cloud Dragon Chat API")
    limiter = RateLimiter(MESSAGES_PER_MINUTE, MESSAGES_PER_HOUR, MESSAGES_PER_DAY)
    # Replies still generating, by the random ID the page sent, so the Stop button
    # can end them (POST /stop). Modal's proxy keeps the connection open after the
    # browser hangs up, so the server can't notice a stop by itself.
    generating = {}
    allow_any_origin(api)
    log_requests(api)

    @api.get("/health")
    def health():
        return {"ok": True, "model": MODEL_ID}

    @api.post("/stop")
    def stop_reply(data: dict, request: Request):
        stop = generating.get(str(data.get("reply_id", "")))
        if stop:
            stop.set()
            log("chat.stopped", request_id=request.state.log_id, reason="stop button")
        return {"stopped": bool(stop)}

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

        stop = threading.Event()
        reply_id = chat_request.reply_id
        if reply_id:
            generating[reply_id] = stop
        pieces = stream_reply(tokenizer, model, messages, request_id, stop)
        events = to_events(log_when_done(pieces, request_id, started))

        def forget():
            generating.pop(reply_id, None)

        return StreamingResponse(stream_events(events, stop, request_id, forget), media_type=MEDIA_TYPE, headers=HEADERS)

    return api
