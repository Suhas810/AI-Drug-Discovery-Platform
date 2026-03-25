import pandas as pd
import os
from sklearn.metrics import accuracy_score, classification_report
import joblib

def evaluate():
    try:
        model_path = os.path.join(os.path.dirname(__file__), "..", "models", "drug_model.pkl")
        model = joblib.load(model_path)
        
        data_path = os.path.join(os.path.dirname(__file__), "..", "data", "training_dataset.csv")
        df = pd.read_csv(data_path)
        
        X = df[['binding_affinity', 'drug_code', 'target_code']]
        y_true = df['disease_label']
        
        y_pred = model.predict(X)
        
        acc = accuracy_score(y_true, y_pred)
        
        # Determine target names from unique labels if necessary
        # The frontend mapping is {0: 'COVID-19', 1: 'Cancer', 2: 'Dengue', 3: 'Malaria', 4: 'Tuberculosis'}
        target_names = ["COVID-19", "Cancer", "Dengue", "Malaria", "Tuberculosis"]
        
        # Check if model has fewer classes (just in case training data doesn't have all 5)
        unique_labels = sorted(list(set(y_true)))
        actual_names = [target_names[i] for i in unique_labels if i < len(target_names)]
        
        report = classification_report(y_true, y_pred, target_names=actual_names)
        
        print(f"Model Accuracy: {acc * 100:.2f}%\n")
        print("Classification Report:")
        print(report)
        
    except Exception as e:
        print(f"Error evaluating model: {e}")

if __name__ == "__main__":
    evaluate()
