"""Server-Sent Events: the format that streams the reply to the browser.

One `data: {"text": ...}` block per piece, then `data: [DONE]`.
Proxies pass event streams through without buffering them.
"""

import json

HEADERS = {"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
MEDIA_TYPE = "text/event-stream"


def to_events(pieces):
    for piece in pieces:
        yield f"data: {json.dumps({'text': piece})}\n\n"
    yield "data: [DONE]\n\n"
