"""Builds the system prompt: persona + bond tone + what the dragon knows about the user."""

from .bond_levels import BOND_LEVELS
from .persona import PERSONA

# The page sends the time of day its sky shows.
TIMES_OF_DAY = {"dawn": "early morning", "day": "daytime", "dusk": "evening", "night": "night"}


def build_system_prompt(dragon, user, bond, first_reply, time_of_day=None):
    level = BOND_LEVELS[bond]
    parts = [PERSONA.format(dragon=dragon), level["tone"]]

    # At the first level the dragon isn't told the name at all: a small model
    # uses any name it knows, whatever the instructions say.
    if user and bond > 0:
        parts.append(f"The user's name is {user}.")
    else:
        parts.append("You do not know the user's name, so never invent one.")

    # Time and greeting only set the mood of a chat's first reply.
    if first_reply and time_of_day:
        parts.append(f"It is {TIMES_OF_DAY[time_of_day]} where the user is now.")

    greeting = level["greeting"]
    if first_reply and greeting and (user or "{user}" not in greeting):
        parts.append(greeting.format(user=user))

    return "\n\n".join(parts)
