"""Model and generation settings."""

# TRY IT: another compatible Hugging Face causal model. Larger models need
# more GPU memory and may expect different chat templates.
MODEL_ID = "Qwen/Qwen3-0.6B"
MODEL_DIR = "/models/qwen3-0.6b"

# Reply length and variety.
MAX_NEW_TOKENS = 400  # reply budget in tokens, not words
TEMPERATURE = 0.7  # higher = more varied; keep above 0 when sampling
TOP_P = 0.9  # sample from the tokens covering 90% of the probability

# How much of the conversation the model sees.
MAX_MESSAGES = 10
MAX_MESSAGE_CHARS = 2000

# Text previews appear in Modal logs. Disable for private conversations.
LOG_TEXT_PREVIEWS = True
