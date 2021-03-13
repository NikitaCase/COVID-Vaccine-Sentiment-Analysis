# covid-vaccine-sentiments


### Goal
The goal of this projec is to perform sentiment analysis of tweets relating to the COVID-19 Vaccines. These sentiments will be used along with geographical data to highlight area of positive and negative sentiment across Canada.

### How it Works

##### Data Source

Twitter API V2

Tweets which meet the following criteria will be gathered: 
- Posted in English
- Mention the following: Covid Vaccine, Covid-19 Vaccine, Pfizer, Pfizer-BioNTech, Moderna or Astra Zeneca
- Are not themselves retweets


##### Data Collection
The Twitter API will be accessed using the Tweepy Module which is recommended and maintained by twitter

```python 
# Tweepy search parameters
search_terms = ['covid+vaccine OR covid-19+vaccine\ 
              OR pfizer OR pfizer-biontech OR pfizerbiontech\ 
              OR moderna \
              OR astrazeneca OR astra+zeneca \
              -filter:retweets']

# Tweet collection
tweets = tweepy.Cursor(api.search, max_id = max_id, lang ='en', q=search_terms, tweet_mode='extended').items(limit)
```

##### Transformation and Analysis

Gathered tweets will be 



### Limitations

##### Time
Twitter allows a maximum of 900 API calls every 15 mins from their api 




Analysis: Tweets I'm gathering are any that were posted by users in Canada about the COVID 19 vaccines. 
Id _str will be used to verify no tweets are duplicated in the dataset. 
Retweeted_status will be used to remove all retweets. 
Text will be used for sentiment analysis using Microsoft Azure's text analytics to categorise tweets as having positive, neutral or negative sentiments. There will be comparison of the percentage of positive vs negative tweets based on location of tweets (For example: percentage of positive vs negative tweets originating from Toronto or Vancouver).
There will be comparison of the average number of retweets (using retweet_count) and replies (using reply_count) of tweets with positive vs negative sentiments. 
The average number of likes received by tweets with negative sentiments will be compared to the average number of likes of tweets with positive sentiments.

There will be a randomly displayed tweet on the app depending on sentiment of the tweets the user wants to explore. It will be a single tweet at a time. The tweet will be selected using the Math JavaScript library (Math.random). The selected tweet will be displayed as a normal individual tweet and Twitter card.

Hope this is enough detail, 
Nikita
