import sys
import os
import json
import base64
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import random

def _error(msg: str):
    print(json.dumps({"error": msg}))
    sys.exit(1)

def main():
    try:
        payload = json.loads(sys.stdin.read())
    except:
        _error("Invalid JSON")

    if not any(payload.get(k) for k in ("app_id", "title", "genres", "owners")):
        _error("At least one input is required")

    here = os.path.dirname(__file__)
    viz_root = os.path.abspath(os.path.join(here, "..", "visualizations"))
    if not os.path.isdir(viz_root):
        _error("visualizations folder not found")

    game_dirs = [d for d in os.listdir(viz_root) if d.startswith("game_")]

    sel = None
    app = str(payload.get("app_id", "")).strip()
    if app:
        candidate = f"game_{app}"
        if candidate in game_dirs:
            sel = candidate

    if sel is None:
        summaries = []
        ids = []
        for d in game_dirs:
            p = os.path.join(viz_root, d, "analysis_summary.txt")
            if os.path.isfile(p):
                with open(p, encoding="utf-8") as f:
                    summaries.append(f.read())
                ids.append(d)
        if not summaries:
            _error("No summaries found")

        vec = TfidfVectorizer().fit(summaries)
        corpus = vec.transform(summaries)
        query = " ".join(str(payload.get(k, "")) for k in ("app_id", "title", "genres", "owners"))
        qv = vec.transform([query])
        sims = cosine_similarity(qv, corpus)[0]
        top_n = min(5, len(sims))
        idxs = np.argsort(-sims)[:top_n]
        sel = ids[random.choice(idxs)]

    if sel is None:
        _error("No game selected")

    img_path = os.path.join(viz_root, sel, "time_series.png")
    if not os.path.isfile(img_path):
        _error(f"time_series.png missing for {sel}")

    with open(img_path, "rb") as imgf:
        b64 = base64.b64encode(imgf.read()).decode("ascii")
    data_url = f"data:image/png;base64,{b64}"

    sum_path = os.path.join(viz_root, sel, "analysis_summary.txt")
    summary = ""
    if os.path.isfile(sum_path):
        with open(sum_path, encoding="utf-8") as f:
            summary = f.read()

    print(json.dumps({
        "game_id": sel,
        "image_data": data_url,
        "summary": summary
    }))

if __name__ == "__main__":
    main()
