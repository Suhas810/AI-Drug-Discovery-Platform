import pandas as pd
from rdkit import Chem
from rdkit.Chem import AllChem

df = pd.read_csv('data/cleaned_dataset.csv')
failed = []
invalid = []

for idx, row in df.iterrows():
    smiles = row['smiles']
    if not isinstance(smiles, str): continue
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        invalid.append(smiles)
        continue
    
    frags = Chem.GetMolFrags(mol, asMols=True)
    if len(frags) > 1:
        mol = max(frags, key=lambda m: m.GetNumAtoms())
        
    mol = Chem.AddHs(mol)
    res = AllChem.EmbedMolecule(mol, randomSeed=42)
    if res == -1:
        res = AllChem.EmbedMolecule(mol, useRandomCoords=True, randomSeed=42)
        if res == -1:
            failed.append(smiles)

print(f"Total: {len(df)}")
print(f"Invalid SMILES: {len(invalid)}")
print(f"Failed to embed: {len(failed)}")
if invalid: print("Sample invalid:", invalid[0])
if failed: print("Sample failed:", failed[0])
