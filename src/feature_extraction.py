import pandas as pd

# Load cleaned dataset
data = pd.read_csv("../data/cleaned_dataset.csv")

# Convert categorical columns to numbers
data["drug_code"] = data["drug"].astype("category").cat.codes
data["target_code"] = data["target"].astype("category").cat.codes

# Select features for ML
features = data[[
    "binding_affinity",
    "drug_code",
    "target_code",
    "disease"
]]

# Save dataset
features.to_csv("../data/features_dataset.csv", index=False)

print("features_dataset.csv created successfully!")
print(features.head())