"""Model and generation settings."""

# TRY IT: another compatible Hugging Face causal model. Larger models need
# more GPU memory and may expect different chat templates.
MODEL_ID = "Qwen/Qwen3-4B"
MODEL_DIR = "/models/qwen3-4b"

# Reply length and variety.
MAX_NEW_TOKENS = 400  # reply budget in tokens, not words
TEMPERATURE = 0.7  # higher = more varied; keep above 0 when sampling
TOP_P = 0.9  # sample from the tokens covering 90% of the probability

# How much of the conversation the model sees.
MAX_MESSAGES = 10
MAX_MESSAGE_CHARS = 2000

# How many messages reach the model (server/rate_limit.py). Per visitor, then for
# everyone together: the daily cap bounds the GPU bill if the link spreads.
MESSAGES_PER_MINUTE = 6
MESSAGES_PER_HOUR = 60
MESSAGES_PER_DAY = 500

# Off: messages can contain health information, so the logs record only that a
# chat happened (lengths and timings), never what was said. Turn on only briefly
# to debug, and remember that anything typed then ends up in the Modal logs.
LOG_TEXT_PREVIEWS = False
