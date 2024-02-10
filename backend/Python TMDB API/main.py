import json
import requests

key = ''

# URL represents the main API call. Can be a single movie or a list of movies


# response = requests.get(url)

# if response.status_code == 200:
#     response = response.json()
#     data = response['results']



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

with open('./Top 315 movies of 2000-2015.txt', 'r') as file:
    # Main movie database loop
    for title in file:
        url = f"https://api.themoviedb.org/3/search/movie?api_key={key}&query={formatString(title)}"
        output = requests.get(url)
        if output.status_code == 200:
            output = output.json()
            if len(output['results']) > 0:
                movie = output['results'][0]
            else:
                continue

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
            external_ids = requests.get(external_ids_url)

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
            images = requests.get(images_url)

            if images.status_code == 200:
                images = images.json()
                for backdrop in images['backdrops']:
                    movie_data['backdrops'].append(f"https://image.tmdb.org/t/p/original{backdrop['file_path']}")
                
            
            final_data.append(movie_data)    
            print(f"Added: {movie['title']}")


file_path = './data.json'

with open(file_path, 'w', encoding='utf-8') as json_file:
    json.dump(final_data, json_file, indent=4, ensure_ascii=False)
    print('saved in: ' + file_path)
