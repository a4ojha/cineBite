# Use this file to test requests

import json
import requests

key = 'c1b0a78498516cb449a9aef714e39d48'
headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWIwYTc4NDk4NTE2Y2I0NDlhOWFlZjcxNGUzOWQ0OCIsInN1YiI6IjY1YTIxNDZjZDM1ZGVhMDEyY2Q0OWM4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5xZjVsmjV5w5pOUb_yTuerdi-PuqtUJ1nHhTIx9tKlE"
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
    