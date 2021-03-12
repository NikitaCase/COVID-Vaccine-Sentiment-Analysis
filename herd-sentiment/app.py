# Import Libraries
# ----------------------------------------------------------------------------

from flask import Flask, render_template, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from config import db


# ------------------------------------------------------------------------------
# Create an engine for the database
# ------------------------------------------------------------------------------

engine = create_engine(db, echo=False)   

# Reflect Database into ORM classes
# ------------------------------------------------------------------------------
Base = automap_base()
Base.prepare(engine, reflect=True)

# print(Base.classes.keys())

# ------------------------------------------------------------------------------
# Flask Setup
# ------------------------------------------------------------------------------
app = Flask(__name__)


# Frontend Route and Homepage
# ------------------------------------------------------------------------------
@app.route("/")
def home():
    return render_template("index.html")


# Backend Routes:
# Timeline
# ------------------------------------------------------------------------------

# for some reason doesnt work in flask but works in jupyter 
@app.route('/timeline2')
def timeline2():

    airlines = Base.classes.airlines
    session = Session(engine)
    
    lines = session.query(airlines.id_str, airlines.date, airlines.Sentiment, airlines.Polarity, airlines.retweet_count).all()

    lined = {'timeline':[{
        'id_str': [col[0] for col in lines], 
        'date': [col[1] for col in lines], 
        'sentiment': [col[2] for col in lines],
        'polarity': [col[3] for col in lines],
        'retweet_count': [col[4] for col in lines]  
    }]}

    session.close()
    return jsonify(lined)

# @app.route("/timeline")
# def timeline():
#     lines = session.query(airlines.id_str, airlines.date, airlines.Sentiment, airlines.Polarity, airlines.retweet_count).all()


#     time_line = []
#     for col in lines:
#         time_dict = {
#         'id_str': col[0], 
#         'date': col[1], 
#         'sentiment': col[2],
#         'polarity': col[3],
#         'retweet_count': col[4]
#         }
#         time_line.append(time_dict)
#     return jsonify(time_line)


# Map
# ------------------------------------------------------------------------------
@app.route('/map')
def map():

    airlines = Base.classes.airlines
    session = Session(engine)
    
    lines = session.query(airlines.id_str, airlines.latitude, airlines.longitude, airlines.Sentiment).all()

    loc = { 'loc':[{
            'id_str':[col[0] for col in lines], 
            'latitude': [col[1] for col in lines], 
            'longitude': [col[2] for col in lines],
            'sentiment': [col[3] for col in lines] }
            ]}
    
    session.close()
    return jsonify(loc)

      


if __name__ == "__main__":
    app.run()