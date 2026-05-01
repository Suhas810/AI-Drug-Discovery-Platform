import joblib
import os

def load_model():
    # Model is located at ../models/drug_model.pkl from the backend directory
    model_path = os.path.join(os.path.dirname(__file__), "..", "models", "drug_model.pkl")
    return joblib.load(model_path)

model = load_model()
