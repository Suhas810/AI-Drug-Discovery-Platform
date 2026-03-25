from rdkit import Chem
from rdkit.Chem import AllChem
from fastapi.responses import PlainTextResponse

def get_3d_sdf(smiles: str):
    try:
        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return PlainTextResponse("Invalid SMILES string", status_code=400)
            
        # If there are multiple disconnected fragments (salts/ions), use the largest one
        frags = Chem.GetMolFrags(mol, asMols=True)
        if len(frags) > 1:
            mol = max(frags, key=lambda m: m.GetNumAtoms())
            
        mol = Chem.AddHs(mol)
        
        # Embed in 3D using ETKDG algorithm
        res = AllChem.EmbedMolecule(mol, randomSeed=42)
        if res == -1:
            # Fallback to random coordinates if initial embedding fails
            res = AllChem.EmbedMolecule(mol, useRandomCoords=True, randomSeed=42)
            
        if res == -1:
            return PlainTextResponse("Could not compute 3D coordinates", status_code=400)
            
        # Gracefully optimize the structure (MMFF94 fails for some rare atoms)
        try:
            AllChem.MMFFOptimizeMolecule(mol)
        except Exception:
            pass
        
        mol_block = Chem.MolToMolBlock(mol)
        return PlainTextResponse(mol_block)
        
    except Exception as e:
        return PlainTextResponse(str(e), status_code=500)
