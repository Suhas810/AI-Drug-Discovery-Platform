import joblib
import pandas as pd

from model_loader import load_model

model = load_model()
print("Model type:", type(model))

try:
    print("Has predict_proba:", hasattr(model, 'predict_proba'))
    df = pd.DataFrame({"binding_affinity": [0.8], "drug_code": [1], "target_code": [2]})
    probs = model.predict_proba(df)
    print("Probabilities:", probs)
except Exception as e:
    print("Error:", e)
