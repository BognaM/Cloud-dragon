"""Builds the system prompt: persona + what the dragon knows about the user + safety."""

from .persona import PERSONA
from .safety import CRISIS_TURN_RULE, SAFETY_RULE

# The page sends the time of day its sky shows.
TIMES_OF_DAY = {"dawn": "early morning", "day": "daytime", "dusk": "evening", "night": "night"}


def build_system_prompt(dragon, user, first_reply, time_of_day=None, crisis=False):
    parts = [PERSONA.format(dragon=dragon)]

    if user:
        parts.append(f"The user's name is {user}.")
    else:
        parts.append("You do not know the user's name, so never invent one.")

    # The time only sets the mood of a chat's first reply, and never when the
    # user may be in crisis.
    if first_reply and time_of_day and not crisis:
        parts.append(f"It is {TIMES_OF_DAY[time_of_day]} where the user is now.")

    # Safety comes last, so it outweighs everything before it.
    parts.append(SAFETY_RULE)
    if crisis:
        parts.append(CRISIS_TURN_RULE)

    return "\n\n".join(parts)
