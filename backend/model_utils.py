from __future__ import annotations
import numpy as np
import pandas as pd

def _standardize(X: np.ndarray):
    if X.ndim == 1:
        X = X.reshape(-1, 1)
    means = np.mean(X[:, 1:], axis=0)
    stds  = np.std(X[:, 1:], axis=0) + 1e-7
    Xn    = np.hstack((X[:, :1], (X[:, 1:] - means) / stds))
    return Xn, means, stds

def ridge_predict(X: np.ndarray,
                  weights: np.ndarray,
                  means: np.ndarray | None = None,
                  stds:  np.ndarray | None = None):
    XX = np.hstack((np.ones((X.shape[0], 1)), X))
    if means is not None and stds is not None:
        Xs = np.hstack((XX[:, :1], (XX[:, 1:] - means) / stds))
    else:
        Xs, _, _ = _standardize(XX)
    return Xs @ weights

def gb_predict(X: np.ndarray,
               init_pred: float,
               trees: list,
               learning_rate: float):
    preds = np.full(X.shape[0], init_pred, dtype=float)
    for t in trees:
        preds += learning_rate * t.predict(X)
    return preds

def predict_with_model(df: pd.DataFrame, model: dict) -> np.ndarray:
    """
    • `df`  …… features DataFrame (raw or already engineered)
    • `model` … dict saved with joblib from your notebook
    """
    # guaranteeing all training‑time columns exist
    need = model["feature_names"]
    for col in need:
        if col not in df.columns:
            df[col] = 0
    X = df[need].values

    # calling Ridge or GBDT
    if "weights" in model:      # Ridge
        y = ridge_predict(X,
                          model["weights"],
                          model["means"],
                          model["stds"])
    else:         # GBDT
        y = gb_predict(X,
                       model["initial_pred"],
                       model["trees"],
                       model["learning_rate"])

    # reversing log‑transform if needed
    if model.get("is_log_model", False):
        y = np.expm1(y)

    return y
