"""Loads Qwen from the weights baked into the image."""

import time

from transformers import AutoModelForCausalLM, AutoTokenizer

from .config import LOG_TEXT_PREVIEWS, MODEL_DIR, MODEL_ID
from .logs import log


def load_model():
    started = time.perf_counter()
    log("startup.loading_model", model=MODEL_ID)

    # The tokenizer maps text to token IDs; the model predicts the next IDs.
    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForCausalLM.from_pretrained(MODEL_DIR, torch_dtype="auto", device_map="auto")
    model.eval()

    log("startup.ready", device=str(model.device), seconds=round(time.perf_counter() - started, 2), text_previews=LOG_TEXT_PREVIEWS)
    return tokenizer, model
