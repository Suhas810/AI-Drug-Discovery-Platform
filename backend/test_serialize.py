import pandas as pd
import json

try:
    df = pd.read_csv('data/cleaned_dataset.csv')
    res = df.to_json(orient='records')
    obj = json.loads(res)
    print("Serialization OK, length:", len(obj))
except Exception as e:
    import traceback
    traceback.print_exc()
