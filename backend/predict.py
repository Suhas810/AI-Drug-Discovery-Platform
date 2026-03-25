from pydantic import BaseModel
import pandas as pd
import os
from fastapi import HTTPException
from .model_loader import model

# --- Dynamic Label Encoding Mapping ---
# Cleaned and training rows align perfectly since they were generated simultaneously.
cleaned_path = os.path.join(os.path.dirname(__file__), "..", "data", "cleaned_dataset.csv")
train_path = os.path.join(os.path.dirname(__file__), "..", "data", "training_dataset.csv")

cleaned_df = pd.read_csv(cleaned_path, usecols=['drug', 'drug_code', 'target'])
train_df = pd.read_csv(train_path, usecols=['drug_code', 'target_code'])

drug_mapping = dict(zip(cleaned_df['drug_code'], train_df['drug_code']))
target_mapping = dict(zip(cleaned_df['target'], train_df['target_code']))

unique_drugs = cleaned_df[['drug_code', 'drug']].drop_duplicates().dropna()
prediction_options = {
    "drugs": [{"code": str(row['drug_code']), "name": str(row['drug'])} for _, row in unique_drugs.iterrows()],
    "targets": sorted(list(cleaned_df['target'].dropna().unique()))
}

def get_prediction_options():
    return prediction_options

class PredictionRequest(BaseModel):
    binding_affinity: float
    drug_code: str
    target_protein: str

def make_prediction(request: PredictionRequest):
    if request.drug_code not in drug_mapping:
         raise HTTPException(status_code=400, detail=f"Invalid drug code: {request.drug_code}. Please select a valid ChEMBL identifier.")
    if request.target_protein not in target_mapping:
         raise HTTPException(status_code=400, detail=f"Invalid target protein: {request.target_protein}")

    numeric_drug_id = drug_mapping[request.drug_code]
    numeric_target_id = target_mapping[request.target_protein]

    data = {"binding_affinity": [request.binding_affinity],
            "drug_code": [numeric_drug_id],
            "target_code": [numeric_target_id]}
    df = pd.DataFrame(data)
    
    prediction = model.predict(df)[0]
    
    probs = model.predict_proba(df)[0]
    confidence_score = float(max(probs))
    
    return {
        "predicted_disease": int(prediction),
        "confidence_score": confidence_score
    }
