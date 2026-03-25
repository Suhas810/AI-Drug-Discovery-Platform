import json, urllib.request, urllib.error
req = urllib.request.Request(
    'http://localhost:8000/predict',
    data=json.dumps({'binding_affinity': 5.0, 'drug_code': 'CHEMBL739', 'target_protein': 'Spike Protein'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
try:
    urllib.request.urlopen(req)
except urllib.error.HTTPError as e:
    with open('out.json', 'w') as f:
        f.write(e.read().decode('utf-8'))
