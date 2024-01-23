# Use this file to test requests

import json
import requests

key = ''
headers = {
    "accept": "application/json",
    "Authorization": ""
}


title = "Kill Bill: Vol. 1"

url = f"https://api.themoviedb.org/3/search/movie?api_key={key}&query={title}"
output = requests.get(url, headers=headers)
if output.status_code == 200:
    output = output.json()
    output = output['results'][0]



file_path = f'./test.json'

with open(file_path, 'w', encoding='utf-8') as json_file:
    json.dump(output, json_file, indent=4, ensure_ascii=False)
    print('saved in: ' + file_path)
    
