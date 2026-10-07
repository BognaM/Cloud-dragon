"""Modal entry point. Deploy with `modal deploy app.py`; it publishes two parts:

- web:  the chat API, running Qwen on a GPU (code in server/)
- site: the web page itself (index.html, styles/, js/, dragon/), served from a
        small, cheap CPU container. Open the URL Modal prints for it.
"""

from pathlib import Path

import modal

from server.config import MODEL_DIR, MODEL_ID

# Download the open model once while the image is built. At runtime the
# weights are already on disk; Hugging Face is not called for each chat.
DOWNLOAD_MODEL = (
    "python -c \"from huggingface_hub import snapshot_download; "
    f"snapshot_download(repo_id='{MODEL_ID}', local_dir='{MODEL_DIR}')\""
)

# These dependencies and weights live in Modal's image, not on your laptop.
image = (
    modal.Image.debian_slim(python_version="3.11")
    .uv_pip_install(
        "torch",
        "transformers>=4.52.4",
        "accelerate",
        "huggingface_hub",
        "fastapi[standard]",
    )
    .run_commands(DOWNLOAD_MODEL)
    .add_local_python_source("server")
)

# The page's files, uploaded from next to this file. Nothing else in the folder
# (server code, README, start.command) goes online.
HERE = Path(__file__).parent
site_image = (
    modal.Image.debian_slim(python_version="3.11")
    .uv_pip_install("fastapi[standard]")
    .add_local_file(HERE / "index.html", "/site/index.html")
    .add_local_file(HERE / "icon.svg", "/site/icon.svg")
    .add_local_dir(HERE / "styles", "/site/styles")
    .add_local_dir(HERE / "js", "/site/js")
    .add_local_dir(HERE / "dragon", "/site/dragon")
)

app = modal.App("ember-chat")


# Containers start on demand and stop after 300 idle seconds. The next
# request may wait for model loading. One container is not a spending cap.
@app.function(
    image=image,
    gpu="A10",
    timeout=300,
    scaledown_window=300,
    max_containers=1,
)
@modal.asgi_app()
def web():
    # Runs in the container at startup; the model is reused by every request.
    from server.api import create_api
    from server.model import load_model

    tokenizer, model = load_model()
    return create_api(tokenizer, model)


# The web page. No GPU: it only hands out files, so it starts in a second or
# two and costs next to nothing. The chat itself still runs in `web` above.
@app.function(image=site_image, scaledown_window=60)
@modal.asgi_app()
def site():
    from fastapi import FastAPI
    from fastapi.staticfiles import StaticFiles

    page = FastAPI()
    page.mount("/", StaticFiles(directory="/site", html=True))
    return page
