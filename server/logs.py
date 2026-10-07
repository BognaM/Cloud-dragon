"""One-line log events, readable with `modal app logs ember-chat`."""

import json

from .config import LOG_TEXT_PREVIEWS


def log(event, **details):
    """Modal captures stdout; JSON escapes newlines into one readable log line."""
    print(f"[Ember] {event} {json.dumps(details, ensure_ascii=True)}", flush=True)


def preview(text):
    """A short preview of chat text for the logs, unless previews are disabled."""
    if not LOG_TEXT_PREVIEWS:
        return "[disabled]"
    return text[:160] + ("..." if len(text) > 160 else "")
