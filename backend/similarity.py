from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit import DataStructs
import pandas as pd
import os

def get_similarity(target_smiles: str, top_k: int = 5):
    try:
        target_mol = Chem.MolFromSmiles(target_smiles)
        if target_mol is None:
            return {"error": "Invalid SMILES string"}
        target_fp = AllChem.GetMorganFingerprintAsBitVect(target_mol, 2, nBits=2048)
        
        csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "cleaned_dataset.csv")
        df = pd.read_csv(csv_path)
        
        results = []
        for idx, row in df.iterrows():
            smiles = row.get("smiles")
            if not isinstance(smiles, str):
                continue
            
            if smiles == target_smiles:
                continue
                
            try:
                mol = Chem.MolFromSmiles(smiles)
                if mol:
                    fp = AllChem.GetMorganFingerprintAsBitVect(mol, 2, nBits=2048)
                    sim = DataStructs.TanimotoSimilarity(target_fp, fp)
                    results.append({
                        "drug": row.get("drug"),
                        "smiles": smiles,
                        "target": row.get("target"),
                        "disease": row.get("disease"),
                        "binding_affinity": row.get("binding_affinity"),
                        "similarity": round(sim, 4)
                    })
            except:
                continue
        
        results.sort(key=lambda x: x["similarity"], reverse=True)
        unique_results = []
        seen = set()
        for res in results:
            if res["drug"] not in seen:
                seen.add(res["drug"])
                unique_results.append(res)
            if len(unique_results) >= top_k:
                break
                
        return unique_results
    except Exception as e:
        return {"error": str(e)}
