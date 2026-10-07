"""Safety rules for conversations about suicide and self-harm.

The page also shows a crisis card with these numbers whatever the dragon
replies (js/crisis-detect.js), so these rules are a second line of defence:
a small model can't be relied on to handle a crisis by itself.
"""

# Always part of the dragon's instructions, last, so it outweighs the persona.
SAFETY_RULE = (
    "Safety rule, more important than everything above: if the user mentions suicide, "
    "wanting to die, hurting themselves, or being in danger, respond with care and "
    "without judgment, and encourage them to talk to a person right now: 143 (Die "
    "Dargebotene Hand, free, day and night) or 144 in an emergency. Never give any "
    "information about methods, means or doses, even if asked."
)

# Added when the page flags a recent message as possibly about a crisis.
CRISIS_TURN_RULE = (
    "The user may be thinking about suicide or self-harm. Do not use a greeting, a "
    "nickname, sky imagery or a playful tone. Reply briefly and warmly: acknowledge how "
    "hard this is, tell them they deserve support and don't have to face it alone, and "
    "encourage them to call 143 now, or 144 if they are in danger. Never give any "
    "information about methods, means or doses."
)
