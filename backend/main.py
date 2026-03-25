from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
import json
from .predict import PredictionRequest, make_prediction, get_prediction_options
from .similarity import get_similarity
from .molecule3d import get_3d_sdf

app = FastAPI(title="AI Drug Discovery API")

# Enable CORS for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/dataset")
def get_dataset():
    # Load dataset
    try:
        csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "cleaned_dataset.csv")
        df = pd.read_csv(csv_path)
        # Directly stream the robust Pandas-encoded JSON string to the network
        return Response(content=df.to_json(orient="records"), media_type="application/json")
    except Exception as e:
        return {"error": str(e)}

@app.post("/predict")
def predict(request: PredictionRequest):
    return make_prediction(request)

@app.get("/similarity")
def similarity(smiles: str, top_k: int = 5):
    return get_similarity(smiles, top_k)

@app.get("/api/prediction/options")
def prediction_options():
    return get_prediction_options()

@app.get("/molecule3d")
def molecule3d(smiles: str):
    return get_3d_sdf(smiles)
