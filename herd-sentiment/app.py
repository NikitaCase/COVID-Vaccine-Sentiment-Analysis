# Import Libraries
# ----------------------------------------------------------------------------

from flask import Flask, render_template, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine


# ------------------------------------------------------------------------------
# Create an engine for the database
# ------------------------------------------------------------------------------
engine = create_engine(DATABASE_URL, echo=False)   

# Reflect Database into ORM classes
Base = automap_base()
Base.prepare(engine, reflect=True)


# ------------------------------------------------------------------------------
# Flask Setup
# ------------------------------------------------------------------------------
app = Flask(__name__, static_url_path='',static_folder='static')


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
# @app.route('/popularity')
# def popularity():

#     tweets = Base.classes.popularity
#     session = Session(engine)
    
#     rows = session.query(tweets.manufacturer, tweets.Sentiment, tweets.retweets, tweets.likes).all()

#     pop = {'popularity':[{
#         'manufacturer': [col[0] for col in rows], 
#         'sentiment': [col[1] for col in rows],
#         'retweets': [col[2] for col in rows],
#         'likes': [col[3] for col in rows]
#     }]}

#     session.close()
#     return jsonify(pop)


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