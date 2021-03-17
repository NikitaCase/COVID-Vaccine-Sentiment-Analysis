# Import Libraries
# ----------------------------------------------------------------------------

from flask import Flask, render_template, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from config import conn


# ------------------------------------------------------------------------------
# Create an engine for the database
# ------------------------------------------------------------------------------
engine = create_engine(conn, echo=False)   

# Reflect Database into ORM classes
Base = automap_base()
Base.prepare(engine, reflect=True)


# ------------------------------------------------------------------------------
# Flask Setup
# ------------------------------------------------------------------------------
app = Flask(__name__)


# Frontend Route
# ------------------------------------------------------------------------------
@app.route("/")
def home():
    return render_template("index.html")


# Backend Routes:

# Map
# ------------------------------------------------------------------------------
@app.route('/map')
def map():

    tweets = Base.classes.twt100
    session = Session(engine)
    
    rows = session.query(tweets.id_str, tweets.created, tweets.Sentiment, tweets.location, tweets.geo_enabled, tweets.geo, tweets.coords).all()

    lined = {'location':[{
        'id_str': [col[0] for col in rows], 
        'created': [col[1] for col in rows], 
        'sentiment': [col[2] for col in rows],
        'location': [col[3] for col in rows],
        'geo_enabled': [col[4] for col in rows],
        'geo': [col[5] for col in rows],
        'coords': [col[6] for col in rows]
    }]}

    session.close()
    return jsonify(lined)


# Popularity
# ------------------------------------------------------------------------------
@app.route('/popularity')
def popularity():

    tweets = Base.classes.twt100
    session = Session(engine)
    
    rows = session.query(tweets.id_str, tweets.created, tweets.Sentiment, tweets.retweet_count, tweets.tweet_favourite_count, tweets.location).all()

    pop = {'popularity':[{
        'id_str': [col[0] for col in rows], 
        'created': [col[1] for col in rows], 
        'sentiment': [col[2] for col in rows],
        'retweets': [col[3] for col in rows],
        'likes': [col[4] for col in rows], 
        'location': [col[5] for col in rows]
    }]}

    session.close()
    return jsonify(pop)


if __name__ == "__main__":
    app.run()