# Import Libraries
# ----------------------------------------------------------------------------
import os
from flask import Flask, render_template, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
DB = os.environ.get('DATABASE_URL')


# ------------------------------------------------------------------------------
# Create an engine for the database
# ------------------------------------------------------------------------------
engine = create_engine(DB, echo=False)


# Reflect Database into ORM classes
Base = automap_base()
Base.prepare(engine, reflect=True)


# ------------------------------------------------------------------------------
# Flask Setup
# ------------------------------------------------------------------------------
app = Flask(__name__, static_url_path='',static_folder='static')


# Frontend Routes
# ------------------------------------------------------------------------------
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/data")
def data():
    return render_template("data.html")


# Backend Routes:

# Tweet Samples
# ------------------------------------------------------------------------------
@app.route('/sample')
def sample():

    tweets = Base.classes.sample
    session = Session(engine)
    
    rows = session.query(tweets.id_str, tweets.text, tweets.screen_name,tweets.retweet_count,tweets.tweet_favourite_count,tweets.Subjectivity,tweets.Polarity,tweets.Sentiment,tweets.manufacturer).all()

    twt = []
    
    for col in rows:
        twt.append({
            'id_str': col[0],
            'text': col[1],
            'screen_name': col[2],
            'retweets': col[3],
            'likes': col[4],
            'subjectivity': col[5],
            'polarity': col[6],
            'sentiment': col[7],
            'manufacturer': col[8],
        })
        
    session.close()
    return jsonify(twt)

 
# Popularity
# ------------------------------------------------------------------------------
@app.route('/popularity')
def popularity():

    tweets = Base.classes.popularity
    session = Session(engine)
    
    mo = session.query(tweets.retweets, tweets.likes, tweets.Sentiment).filter(tweets.manufacturer =='mo').all()
    az = session.query(tweets.retweets, tweets.likes, tweets.Sentiment).filter(tweets.manufacturer =='az').all()
    pf = session.query(tweets.retweets, tweets.likes, tweets.Sentiment).filter(tweets.manufacturer =='pf').all()

    companies = {'popularity': [
        {
            'name': 'Moderna',
            'retweets': [row[0] for row in mo],
            'likes': [row[1] for row in mo],
            'sentiment': [row[2] for row in mo]
        },
        {
            'name': 'AstraZeneca',
            'retweets': [row[0] for row in az],
            'likes': [row[1] for row in az],
            'sentiment': [row[2] for row in az]
        },    
        {
            'name': 'Pfizer-BioNTech',
            'retweets': [row[0] for row in pf],
            'likes': [row[1] for row in pf],
            'sentiment': [row[2] for row in pf]
        }
    ]}
    session.close()
    return jsonify(companies)

# Manufacturer
# ------------------------------------------------------------------------------
@app.route('/manufacturer')
def manufacturer():

    tweets = Base.classes.manufacturer
    session = Session(engine)
    
    mo = session.query(tweets.retweets, tweets.likes, tweets.Subjectivity, tweets.Polarity).filter(tweets.manufacturer =='mo').all()
    az = session.query(tweets.retweets, tweets.likes, tweets.Subjectivity, tweets.Polarity).filter(tweets.manufacturer =='az').all()
    pf = session.query(tweets.retweets, tweets.likes, tweets.Subjectivity, tweets.Polarity).filter(tweets.manufacturer =='pf').all()

    companies = {'companies': [
        {
            'name': 'moderna',
            'retweets': [row[0] for row in mo],
            'likes': [row[1] for row in mo],
            'subjectivity': [row[2] for row in mo],
            'polarity': [row[3] for row in mo]
        },
        {
            'name': 'astrazeneca',
            'retweets': [row[0] for row in az],
            'likes': [row[1] for row in az],
            'subjectivity': [row[2] for row in az],
            'polarity': [row[3] for row in az]
        },    
        {
            'name': 'pfizer',
            'retweets': [row[0] for row in pf],
            'likes': [row[1] for row in pf],
            'subjectivity': [row[2] for row in pf],
            'polarity': [row[3] for row in pf]
        }
    ]}
    session.close()
    return jsonify(companies)

if __name__ == "__main__":
    app.run()