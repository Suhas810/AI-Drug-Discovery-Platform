import pandas as pd

drug_codes = {
    'Ivermectin': 'CHEMBL739',
    'Ritonavir': 'CHEMBL163',
    'Sofosbuvir': 'CHEMBL2010609',
    'Ribavirin': 'CHEMBL1102',
    'Lopinavir': 'CHEMBL729',
    'Dexamethasone': 'CHEMBL384467',
    'Baricitinib': 'CHEMBL2105754',
    'Remdesivir': 'CHEMBL4292899',
    'Favipiravir': 'CHEMBL1969871',
    'Paxlovid': 'CHEMBL4879201',
    'Azithromycin': 'CHEMBL345',
    'Chloroquine': 'CHEMBL76',
    'Hydroxychloroquine': 'CHEMBL522046',
    'Molnupiravir': 'CHEMBL4292850',
    'Tocilizumab': 'CHEMBL1201584'
}

for filename in ['cleaned_dataset.csv', 'combined_dataset.csv', 'covid-19_dataset.csv']:
    path = f'data/{filename}'
    df = pd.read_csv(path)
    
    # insert 'drug_code' immediately after 'drug'
    if 'drug_code' not in df.columns:
        df.insert(1, 'drug_code', df['drug'].map(drug_codes))
        df.to_csv(path, index=False)
        print(f"Added drug_code to {filename}")
    else:
        print(f"{filename} already has drug_code")
