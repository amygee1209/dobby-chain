from flask import *
import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ksea-token.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db = SQLAlchemy(app)

class User(db.Model):
  # Common User Controls
  uid = db.Column(db.Integer, primary_key=True, unique=True)
  name = db.Column(db.String(128), index=True)
  email = db.Column(db.Text)
  address = db.Column(db.Text, unique=True)
  img = db.Column(db.String(200))
  rank = db.Column(db.Integer)

  # Application specific 
  num_points = db.Column(db.Integer)
  curr_sem = db.Column(db.Boolean)

  def __repr__(self):
      return '<User {}>'.format(self.name)


class Event(db.Model):
  eid = db.Column(db.Integer, primary_key=True)
  event_name = db.Column(db.Text)
  current_time = db.Column(db.DateTime, default=datetime.datetime.utcnow)
  password = db.Column(db.Text)
  time_limit = db.Column(db.Integer)
  point_amount = db.Column(db.Integer)
  event_details = db.Column(db.Text)

  def __repr__(self):
      return '<Event {}>'.format(self.event_name)


class Checkin(db.Model):
  cid = db.Column(db.Integer, primary_key=True)
  event = db.Column(db.Integer) # Link to Event Table
  user = db.Column(db.Integer) # Link to User Table
  current_time = db.Column(db.DateTime, default=datetime.datetime.utcnow)

  def __repr__(self):
      return '<Checkin {} for {}>'.format(self.cid, self.user)


class Auction(db.Model):
  aid = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(20), nullable=False)
  img = db.Column(db.String(200))
  contractAddr = db.Column(db.String(50))
  duration = db.Column(db.Integer)
  highestBid = db.Column(db.Integer)
  highestBidder = db.Column(db.String(20))

  def __repr__(self):
      return '<Auction {} for {}>'.format(self.aid, self.name)


class MyAuctionBid(db.Model):
  mid = db.Column(db.Integer, primary_key=True)
  myBid = db.Column(db.Integer)
  auction = db.Column(db.Integer)  # Link to Auction Table
  user = db.Column(db.Integer)  # Link to User Table

  def __repr__(self):
    return '<MyAuctionBid {} for {}>'.format(self.mid, self.myBid)


if __name__ == "__main__":
    app.run(debug=True)
