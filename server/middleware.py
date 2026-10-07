"""CORS and request logging for the API."""

import time
from uuid import uuid4

from fastapi.middleware.cors import CORSMiddleware

from .logs import log


def allow_any_origin(api):
    """Demo setting so a static page anywhere can call the API.
    For a real product, restrict this to your frontend's origin."""
    api.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )


def log_requests(api):
    """Gives each request a short ID so its log lines can be matched up."""

    @api.middleware("http")
    async def request_logs(request, call_next):
        request.state.log_id = uuid4().hex[:8]
        started = time.perf_counter()
        log("request.received", request_id=request.state.log_id, method=request.method, path=request.url.path)
        try:
            response = await call_next(request)
        except Exception as error:
            log("request.failed", request_id=request.state.log_id, error_type=type(error).__name__)
            raise
        # Streaming headers arrive before the reply finishes; see chat.complete.
        log("response.headers", request_id=request.state.log_id, status=response.status_code, seconds=round(time.perf_counter() - started, 2))
        return response
