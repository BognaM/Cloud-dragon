"""Reads and checks the JSON the page sends to /chat.

Input: {"messages": [{"role": "user", "content": "Hello"}],
        "user_name": "...", "dragon_name": "...",
        "time_of_day": "dawn" | "day" | "dusk" | "night",
        "crisis": true | false,  (true when the page spotted possible crisis language)
        "reply_id": "..."}  (a random ID the page can send to POST /stop to end the reply)

These demo checks are not complete input validation or prompt-injection protection.
"""

import re
from dataclasses import dataclass

from .config import MAX_MESSAGE_CHARS, MAX_MESSAGES
from .persona import DEFAULT_DRAGON_NAME
from .prompt import TIMES_OF_DAY


@dataclass
class ChatRequest:
    messages: list
    user_name: str
    dragon_name: str
    time_of_day: str | None
    crisis: bool
    reply_id: str | None


def clean_name(value):
    """Names go into the prompt, so keep only letters, spaces, apostrophes and hyphens."""
    name = re.sub(r"[^\w '\-]", "", str(value or ""))
    return " ".join(name.split())[:24]


def clean_time_of_day(value):
    value = str(value)
    return value if value in TIMES_OF_DAY else None


def clean_messages(incoming):
    """Keeps recent user/assistant turns, shortened. Client system roles are ignored."""
    messages = []
    for message in incoming[-MAX_MESSAGES:]:
        role = message.get("role")
        content = str(message.get("content", "")).strip()
        if role in {"user", "assistant"} and content:
            messages.append({"role": role, "content": content[:MAX_MESSAGE_CHARS]})
    return messages


def clean_reply_id(value):
    """A random ID from the page (crypto.randomUUID), or None."""
    value = str(value or "")
    return value if re.fullmatch(r"[0-9a-f-]{8,64}", value) else None


def parse_chat_request(data):
    """Raises ValueError when there's no user message to answer."""
    messages = clean_messages(data.get("messages", []))
    if not messages or messages[-1]["role"] != "user":
        raise ValueError("A user message is required.")

    return ChatRequest(
        messages=messages,
        user_name=clean_name(data.get("user_name")),
        dragon_name=clean_name(data.get("dragon_name")) or DEFAULT_DRAGON_NAME,
        time_of_day=clean_time_of_day(data.get("time_of_day")),
        crisis=data.get("crisis") is True,
        reply_id=clean_reply_id(data.get("reply_id")),
    )
