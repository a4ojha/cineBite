# Use this file to get data for a singular movie (very cool)

import json
import requests

key = ''
headers = {
    "accept": "application/json",
    "Authorization": ""
}

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
output = requests.get(url, headers=headers)
if output.status_code == 200:
    output = output.json()
    
movie = ""
if len(output['results']) > 0:
    
    for possible_movie in output['results']:
        print(f"Did you mean {possible_movie['title']} ({possible_movie['release_date'][:4]})? (y) or (n)")
        ans = input()
        if ans == "y":
            movie = possible_movie
            movie_name = possible_movie['title']
            break
        
        elif ans == "n":
            continue
        
        else:
            print("Please enter (y) or (n)")
    
    if movie == "":
        print("Sorry, couldn't find movie")
        quit()
        
    movie_data = {
        "imdbId": "",           # DONE
        "title": "",            # DONE
        "releaseDate": "",      # DONE
        "trailerLink": "",      # DONE
        "genres": [],           # DONE
        "poster": "",           # DONE
        "backdrops": [],        # DONE
        "overview": "",         # DONE
        "reviewIds": []         # DONE
    }

    # Set known quanities from original API request
    movie_data['title'] = movie['title']
    movie_data['releaseDate'] = movie['release_date']
    movie_data['poster'] = f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
    movie_data['overview'] = movie['overview']

    # Get and set IMDB ID, trailer link, genres
    external_ids_url = f"https://api.themoviedb.org/3/movie/{movie['id']}?api_key={key}&append_to_response=external_ids&append_to_response=videos"
    external_ids = requests.get(external_ids_url, headers=headers)

    if external_ids.status_code == 200:
        external_ids = external_ids.json()
        
        # IMDB id
        movie_data['imdbId'] = external_ids['imdb_id']
        
        # YouTube Trailer
        movie_data['trailerLink'] = f"https://youtube.com/watch?v={getTrailerLink(external_ids)}"
        
        # Genres
        for genre in external_ids['genres']:
            movie_data['genres'].append(genre['name'])


    # Backdrop paths
    images_url = f"https://api.themoviedb.org/3/movie/{movie['id']}/images?api_key={key}&language=en-US&include_image_language=null"
    images = requests.get(images_url, headers=headers)

    if images.status_code == 200:
        images = images.json()
        for backdrop in images['backdrops']:
            movie_data['backdrops'].append(f"https://image.tmdb.org/t/p/original{backdrop['file_path']}")
        

    final_data.append(movie_data)    
    print(f"Added: {movie['title']}")

else:
    print("Sorry, movie not found")


formatted_title = ''.join(ch for ch in movie_name if ch.isalnum())
file_path = f'./{formatted_title}.json'

with open(file_path, 'w', encoding='utf-8') as json_file:
    json.dump(final_data, json_file, indent=4, ensure_ascii=False)
    print('File saved in: ' + file_path)
