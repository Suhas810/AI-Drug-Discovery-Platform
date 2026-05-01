from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import random
import time

router = APIRouter()

class SiderRequest(BaseModel):
    drug_id: str

@router.post("/sider")
def predict_sider(request: SiderRequest):
    # Mocking a Multi-label classification using SIDER dataset
    time.sleep(0.5)
    mock_side_effects = [
        {"effect": "Nausea", "probability": round(random.uniform(0.1, 0.9), 2), "severity": "Mild"},
        {"effect": "Headache", "probability": round(random.uniform(0.1, 0.9), 2), "severity": "Moderate"},
        {"effect": "Dizziness", "probability": round(random.uniform(0.1, 0.9), 2), "severity": "Mild"},
        {"effect": "Fatigue", "probability": round(random.uniform(0.1, 0.9), 2), "severity": "Moderate"},
    ]
    return {"drug_id": request.drug_id, "side_effects": sorted(mock_side_effects, key=lambda x: x["probability"], reverse=True)}


class RepurposeRequest(BaseModel):
    disease: str

@router.post("/repurpose")
def predict_repurpose(request: RepurposeRequest):
    # Mock matching disease signatures with drug signatures
    time.sleep(0.8)
    mock_drugs = [
        {"name": "Aspirin", "score": round(random.uniform(0.5, 0.99), 3), "mechanism": "COX inhibitor"},
        {"name": "Metformin", "score": round(random.uniform(0.5, 0.99), 3), "mechanism": "AMPK activator"},
        {"name": "Imatinib", "score": round(random.uniform(0.5, 0.99), 3), "mechanism": "Tyrosine kinase inhibitor"}
    ]
    return {"disease": request.disease, "alternatives": sorted(mock_drugs, key=lambda x: x["score"], reverse=True)}


class PropertyRequest(BaseModel):
    smiles: str

@router.post("/properties")
def predict_properties(request: PropertyRequest):
    # Mock random forest property predictions
    time.sleep(0.4)
    return {
        "smiles": request.smiles,
        "properties": {
            "Toxicity": round(random.uniform(0, 1), 2),
            "Solubility": round(random.uniform(0, 10), 2),
            "Bioavailability": round(random.uniform(0.1, 0.95), 2),
            "MolecularWeight": round(random.uniform(150, 500), 2)
        }
    }


class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat_inference(request: ChatRequest):
    # Mock LLM chatbot responses based on simple heuristics
    time.sleep(1.0)
    msg = request.message.lower()
    response = "I am an AI research assistant. I can answer drug-related questions and explain mechanisms of action."
    if "aspirin" in msg:
         response = "Aspirin, also known as acetylsalicylic acid, is an NSAID used to reduce pain, fever, and inflammation. It works by inhibiting the cyclooxygenase (COX) enzyme."
    elif "repurpose" in msg:
         response = "Drug repurposing is using an approved drug for a new indication. It generally involves matching gene expression signatures of the drug with signatures of diseases."
    
    return {"reply": response}


@router.post("/summarize")
async def summarize_paper(file: UploadFile = File(...)):
    # Mock extracting text and running a summarization model
    time.sleep(2.0)
    return {
        "filename": file.filename,
        "summary": "This paper discusses the novel implications of GNNs (Graph Neural Networks) in identifying potential binding sites for uncharacterized proteins. The authors found a 15% improvement in binding affinity prediction accuracy when incorporating spatial 3D conformation data.",
        "key_findings": [
            "GNNs outperform traditional models.",
            "3D conformation data adds 15% accuracy.",
            "Predictive capability is robust across different protein families."
        ],
        "limitations": "The model struggles with highly flexible protein regions and requires significant computational power for inference."
    }
