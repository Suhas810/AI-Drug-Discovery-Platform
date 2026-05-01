import pandas as pd

# Load combined dataset
data = pd.read_csv("../data/combined_dataset.csv")

print("Original shape:", data.shape)

# Remove duplicates
data = data.drop_duplicates()

# Remove missing values
data = data.dropna()

print("Cleaned shape:", data.shape)

# Save cleaned dataset
data.to_csv("../data/cleaned_dataset.csv", index=False)

print("cleaned_dataset.csv created successfully!")