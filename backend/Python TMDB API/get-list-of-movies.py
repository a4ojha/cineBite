# Use this file to get data for a singular movie (very cool)

import json
import requests

key = ''


search = input("Movie search: ")
movie_name = ""

final_data = []

# Get YouTube trailer link from TMDB external ids JSON file 
def getTrailerLink(external_ids):
    videos = external_ids['videos']['results']
    trailers = []
    youtube_url = ""
    
    for video in videos:
        if video['type'] == 'Trailer':
            trailers.append(video)
            youtube_url = video['key']
            
    for trailer in trailers:
        if trailer['name'] == 'Official Trailer' or trailer['name'] == 'Final Trailer':
            youtube_url = trailer['key']
        
    return youtube_url

def formatString(s):
    s = s.replace("·", "-")
    s = s.replace(" ", "+")
    return s


url = f"https://api.themoviedb.org/3/search/movie?api_key={key}&query={formatString(search)}"
output = requests.get(url)
if output.status_code == 200:
    output = output.json()
    
movie = ""
movie_list = output["results"]

file_path = "./search-results.json"

with open(file_path, 'w', encoding='utf-8') as json_file:
    json.dump(movie_list, json_file, indent=4, ensure_ascii=False)
    print('File saved in: ' + file_path)