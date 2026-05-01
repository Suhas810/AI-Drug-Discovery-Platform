import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load training dataset
data = pd.read_csv("../data/training_dataset.csv")

# Features and labels
X = data[["binding_affinity", "drug_code", "target_code"]]
y = data["disease_label"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=200)

model.fit(X_train, y_train)

# Evaluate model
accuracy = model.score(X_test, y_test)

print("Model Accuracy:", accuracy)

# Save trained model
joblib.dump(model, "../models/drug_model.pkl")

print("Model saved as drug_model.pkl")