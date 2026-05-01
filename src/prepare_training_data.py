import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Load features dataset
data = pd.read_csv("../data/features_dataset.csv")

# Encode disease labels
encoder = LabelEncoder()

data["disease_label"] = encoder.fit_transform(data["disease"])

# Remove original disease column
data = data.drop(columns=["disease"])

# Save training dataset
data.to_csv("../data/training_dataset.csv", index=False)

print("training_dataset.csv created successfully!")
print(data.head())