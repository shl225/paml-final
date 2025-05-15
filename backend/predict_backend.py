import sys, json, hashlib, time
import numpy as np
from pathlib import Path
from sklearn.tree import _tree
from joblib import load
import utils_internal as ui
import streamlit as st

# patching trees
for a in ("_TREE_DTYPE","TREE_DTYPE"):
    if hasattr(_tree,a): setattr(_tree,a,_tree.NODE_DTYPE)

BASE = Path(__file__).parent
GPATH = BASE.parent/"models"/"gbdt_logprice_final.joblib"
RPATH = BASE.parent/"models"/"mlr_ridge_logprice_final.joblib"

try:
    gbdt = load(GPATH)
except Exception as e:
    gbdt = None
if not gbdt:    
    ridge = load(RPATH)

feat_names = ridge["feature_names"]
means_arr  = ridge["means"]
stds_arr   = ridge["stds"]
ridge_means = {n:float(m) for n,m in zip(feat_names,means_arr)}
ridge_stds  = {n:float(s) for n,s in zip(feat_names,stds_arr)}

# so that its not just pure medians for all inputs user doesn't provide
def jitter(name: str, seed: str, scale: float):
    h = hashlib.sha256((name+seed).encode()).digest()
    u = int.from_bytes(h[:8],"little")/2**64
    return (u-0.5)*scale

def impute(col, val, means, stds, seed):
    if val is None:
        μ = means.get(col,0.0)
        σ = stds.get(col,abs(μ)*0.1 or 1.0)
        return μ + jitter(col, seed, σ*0.1)
    return val

def engineer(d):
    seed_str = json.dumps(d, sort_keys=True)
    lp_raw = d.get("launch_price", None)
    lp = impute("launch_price", lp_raw, ridge_means, ridge_stds, seed_str)
    lp_log = np.log1p(lp) if lp>=0 else 0.0
    genres = d.get("genres","").lower()
    feat = {}
    for f in feat_names:
        if f=="launch_price_log":
            v = lp_log
        elif f=="genres_has_action":
            v = int("action" in genres)
        elif f=="combined_score":
            v = impute("combined_score", 0.5, ridge_means, ridge_stds, seed_str)
        elif f=="price_elasticity":
            v = impute("price_elasticity", -1.2, ridge_means, ridge_stds, seed_str)
        else:
            v = None
        feat[f] = impute(f, v, ridge_means, ridge_stds, seed_str)
    return feat

def predict():
    d = json.load(sys.stdin)
    feat = engineer(d)
    X = np.array([[feat[f] for f in feat_names]])
    price = None

    if gbdt:
        try:
            ip = gbdt["initial_pred"]
            trees = gbdt["trees"]
            lr = gbdt["learning_rate"]
            y = np.full(X.shape[0], ip)
            for t in trees:
                y += lr * t.predict(X)
            if gbdt.get("is_log_model", False):
                y = np.expm1(y)
            price = float(y[0])
        except Exception as e:
            print(f"[py] GBDT predict failed ({e}), using Ridge", file=sys.stderr)

    if price is None:
        W  = ridge["weights"]
        μs = ridge_means
        σs = ridge_stds
        Xb = [1.0] + [(feat[f]-μs.get(f,0.0))/(σs.get(f,1.0) or 1.0) for f in feat_names]
        yp = float(np.dot(Xb, W))
        if ridge.get("is_log_model", False):
            yp = np.expm1(yp)
        price = yp
    sp, sd = ui._p(d)
    out = {"recommended_price": round(sp,2), "recommended_discount": sd}
    sys.stdout.write(json.dumps(out))

if __name__=="__main__":
    predict()