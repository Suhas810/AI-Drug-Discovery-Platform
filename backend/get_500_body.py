import urllib.request
import urllib.error
import sys

req = urllib.request.Request('http://127.0.0.1:8000/dataset')
try:
    with urllib.request.urlopen(req) as response:
        print("Success:", response.read().decode('utf-8')[:200])
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}")
    print("Response Body:")
    print(e.read().decode('utf-8'))
except Exception as e:
    print("Other error:", e)
