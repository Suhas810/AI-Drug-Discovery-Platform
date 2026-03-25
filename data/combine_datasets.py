import pandas as pd

# Load datasets
covid = pd.read_csv("data/covid-19_dataset.csv")
cancer = pd.read_csv("data/cancer_dataset.csv")
dengue = pd.read_csv("data/dengue_dataset.csv")
malaria = pd.read_csv("data/malaria_dataset.csv")
tb = pd.read_csv("data/tuberculosis_dataset.csv")

# Combine datasets
combined_data = pd.concat(
    [covid, cancer, dengue, malaria, tb],
    ignore_index=True
)

# Save combined dataset
combined_data.to_csv("data/combined_dataset.csv", index=False)

# Show dataset info
print("Datasets combined successfully!")
print("Total rows:", combined_data.shape[0])
print("Total columns:", combined_data.shape[1])