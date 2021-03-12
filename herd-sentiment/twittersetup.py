import requests
import os
import json
import config


# build this incredibly long query
# that does not work - returns 404 with v 1.1 and  client forbidden with v2 
def create_url():
    search_terms = 'covid,vaccine,covid+vaccine,covid-19+vaccine,pfizer,moderna&'
    # time_frame = 'start_time=2020-12-02T00:00:00Z&end_time=2020-12-03T00:00:00Z&'
    max_results = 'max_results=11&'
    tweet_fields = 'tweet.fields=author_id,conversation_id,created_at,geo,id,lang,public_metrics,possibly_sensitive,source,text&'
    user_fields = 'user.fields=id,public_metrics,username,verified'
    
    base_url ='https://api.twitter.com/1.1/tweets/search/all?query='

    url = base_url+search_terms+max_results+tweet_fields+user_fields

    return url

def create_headers(bearer_token):
    headers ={f'Authorization': 'Bearer '+bearer_token}
    return headers

def connect_to_endpoint(url, headers):
    response = requests.request("GET", url, headers=headers)
    print(response.status_code)
    if response.status_code != 200:
        raise Exception(response.status_code, response.text)
    return response.json()

def main():
    bearer_token = config.bearer_token
    url = create_url()
    headers = create_headers(bearer_token)
    json_response = connect_to_endpoint(url, headers)
    print(json.dumps(json_response, indent=4, sort_keys=True))

if __name__ == "__main__":
    main()