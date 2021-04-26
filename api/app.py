from flask import *
import datetime
from flask_sqlalchemy import SQLAlchemy
#from flask_cors import CORS
import ast
import os

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#CORS(app)
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
  event = db.Column(db.Integer)  # Link to Event Table
  user = db.Column(db.Integer)  # Link to User Table
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


@app.route("/")
def index():
  # return app.send_static_file('index.html')

  """ View the top winners of that semester """
  curr_sem_users = User.query.filter(User.curr_sem == True).all()
  curr_sem_users.sort(key=lambda x: x.num_points, reverse=True)
  return {"curr_sem_users": [c.name for c in curr_sem_users], "curr_sem_points": [c.num_points for c in curr_sem_users]}


@app.route("/members", methods=["GET", "DELETE"])
def all_members():
  if request.method == "GET":
    all_members = User.query.all()
    return jsonify(
        [{
            "uid": member.uid,
            "name": member.name,
            "email": member.email,
            "address": member.address,
            "img": member.img,
            "num_points": member.num_points,
            "curr_sem": member.curr_sem,
            "rank": member.rank
        } for member in all_members]
    )

  else:
    all_members = User.query.all()
    for member in all_members:
      db.session.delete(member)
      db.session.commit()
    return jsonify({"success": True})


@app.route("/member", methods=["GET", "POST", "PUT", "DELETE"])
def member():
  if request.method == "GET":
    """ View the number of points a member has """
    address = request.args.get("address").lower()
    curr_member = User.query.filter(User.address == address).first()
    return {
        "name": curr_member.name,
        "email": curr_member.email,
        "address": curr_member.address,
        "img": curr_member.img,
        "num_points": curr_member.num_points,
        "curr_sem": curr_member.curr_sem,
        "rank": curr_member.rank
    }

  elif request.method == "POST":
    # Add new member
    name = request.json['name']
    img = request.json['img']
    num_points = request.json['num_points']
    email = request.json['email']
    address = request.json['address'].lower()
    assert type(address) == str

    new_member = User(
        name=name,
        email=email,
        num_points=num_points,
        img=img,
        address=address,
        curr_sem=True,
        rank=0
    )

    db.session.add(new_member)
    db.session.commit()
    return jsonify({"success": True})

  elif request.method == "PUT":
    # Edit member info
    address = request.values['address'].lower()
    curr_member = User.query.filter(User.address == address).first()

    name = request.values['name']
    email = request.values['email']
    curr_member.name = name
    curr_member.email = email

    db.session.commit()
    return jsonify({"status": "success"})

  elif request.method == "DELETE":
    address = request.args.get("address")
    curr_member = User.query.filter(User.address == address).first()
    db.session.delete(curr_member)
    db.session.commit()
    return jsonify({"status": '%s deleted' % curr_member.name})


@app.route("/award", methods=["POST"])
def award():
    """ Award points to members """
    if request.method == "POST":
        members = request.values['members']
        members = ast.literal_eval("[" + members + "]")
        points = int(request.values['points'])
        for address in members:
            awardee = User.query.filter(User.address == hex(address)).first()
            if not awardee:
                raise Exception("[ERROR] No Awardee {}".format(address))
            awardee.num_points += points
        db.session.commit()


@app.route("/awardevent", methods=["POST"])
def award_event():
  """ Award points to members """
  if request.method == "POST":
      event = request.values['event']
      event_to_award = Event.query.filter(Event.event_name == event)
      members = Checkin.query.filter(Checkin.event == event_to_award.eid).all()
      awardees = [m.user for m in members]
      awardee_names = [User.query.filter(
          User.uid == an).first().name for an in awardees]
      for u in awardees:
          awardee = User.query.filter(User.uid == u).first()
          if not awardee:
              raise Exception("[ERROR] No Awardee {}".format(address))
          awardee.num_points += points
      db.session.commit()
      return {"awardees": awardee_names}


@app.route("/createcheckin", methods=["POST"])
def create_checkin():
  """ Create a Checkin Event with Password """
  password = request.values['password']
  time_limit = int(request.values['timeLimit'])
  event_name = request.values['eventName']
  point_amount = request.values['eventPoint']
  event_details = request.values['eventDetails']
  curr_checkin = Event(
      event_name=event_name,
      password=password,
      time_limit=time_limit,
      event_details=event_details,
      point_amount=point_amount
  )
  db.session.add(curr_checkin)
  db.session.commit()
  return jsonify({"status": "success"})


@app.route("/checkedinMembers", methods=["GET"])
def checkedin_members():
  eventId = request.args.get("eventId")
  all_checkedin_members = Checkin.query.filter(Checkin.event == eventId)
  member_addr_lists = [c.user for c in all_checkedin_members]
  name_lists = []
  for addr in member_addr_lists:
    member_name = User.query.filter(User.address == addr).first().name
    name_lists.append(member_name)

  return jsonify({
      'addresses': member_addr_lists,
      'names': name_lists
  })


@app.route("/checkin", methods=["GET", "POST", "DELETE"])
def checkin():
  curr_status = "waiting"
  if request.method == "POST":
    eventId = request.values['eventId']
    curr_checkin = Event.query.filter(Event.eid == eventId).first()
    due_date = curr_checkin.current_time + datetime.timedelta(minutes=5)
    if curr_checkin.current_time < datetime.datetime.utcnow():
      input_password = request.values['password']
      if input_password == curr_checkin.password:
        address = request.values['address']
        awardee = User.query.filter(User.address == address).first()
        curr_checkin = Checkin(event=curr_checkin.eid, user=awardee.address)
        db.session.add(curr_checkin)
        db.session.commit()
        curr_status = "success"
        return jsonify({"curr_status": curr_status})
      else:
        curr_status = "wrong_password"
        return jsonify({
            "curr_status": curr_status,
            "password": input_password,
            "correctpw": curr_checkin.password
        })
    else:
      curr_status = "overtime"
      return jsonify({"curr_status": curr_status})

  elif request.method == "GET":
    address = request.args.get("address")

    all_checkins = Checkin.query.filter(Checkin.user == address)
    completedIds = list(map(lambda c: c.event, all_checkins))
    all_events = Event.query.all()

    completed_events = []
    for comId in completedIds:
      completed_events.append(Event.query.get(comId))

    incompleted_events = []
    for event in all_events:
      if not event.eid in completedIds:
        incompleted_events.append(event)

    now = datetime.datetime.utcnow()
    missed_events = []
    upcoming_events = []
    for inevent in incompleted_events:
      limit = inevent.time_limit
      due = inevent.current_time + datetime.timedelta(minutes=limit)
      if now > due:
        missed_events.append(inevent)
      else:
        upcoming_events.append(inevent)

    return jsonify({
        'completed':  [{
            'eid': e.eid,
            'timeLimit': e.time_limit,
            'eventName': e.event_name,
            'dueDate': e.current_time,
            'pointAmount': e.point_amount,
            'eventDetails': e.event_details
        } for e in completed_events],

        'missed':  [{
            'eid': e.eid,
            'timeLimit': e.time_limit,
            'eventName': e.event_name,
            'dueDate': e.current_time,
            'pointAmount': e.point_amount,
            'eventDetails': e.event_details
        } for e in missed_events],

        'upcoming':  [{
            'eid': e.eid,
            'timeLimit': e.time_limit,
            'eventName': e.event_name,
            'dueDate': e.current_time,
            'pointAmount': e.point_amount,
            'eventDetails': e.event_details
        } for e in upcoming_events]

    })

  else:
    all_checkins = Checkin.query.all()
    for checkin in all_checkins:
      db.session.delete(checkin)
      db.session.commit()
      return jsonify({"curr_status": "all deleted"})


@app.route("/event", methods=["POST", "GET"])
def event():
  if request.method == "POST":
    event_name = request.form['eventName']
    name = request.form['members']
    points = int(request.form['points'])
    awardee = User.query.filter(User.name == name).first()
    awardee.num_points += points
    db.session.commit()
    return index()
  else:
    awardee = User.query.filter(User.name == name).first()
    awardee.num_points += points
    db.session.commit()
    return index()


# Auction
@app.route("/auction", methods=["POST", "GET", "PUT", "DELETE"])
def auction():
  if request.method == "POST":
    name = request.values['name']
    img = request.values['img']
    contractAddr = request.values['contractAddr']
    duration = request.values['duration']

    new_auction = Auction(
        name=name,
        img=img,
        contractAddr=contractAddr,
        duration=duration
    )

    db.session.add(new_auction)
    db.session.commit()

    return jsonify({"status": "success"})

  elif request.method == "GET":
    getAll = request.args.get("getAll")

    if getAll == 'true':
      all_auctions = Auction.query.all()
      return jsonify(
          [{
              "aid": a.aid,
              "name": a.name,
              "img": a.img,
              "contractAddr": a.contractAddr,
              "duration": a.duration,
              "highestBid": a.highestBid,
              "highestBidder": a.highestBidder,
              "myBid": a.myBid
          } for a in all_auctions]
      )

    else:
      aid = request.args.get("aid")
      auction = Auction.query.get(aid)
      return jsonify({"aid": auction.aid,
                      "highestBid": auction.highestBid,
                      "highestBidder": auction.highestBidder,
                      "myBid": auction.myBid})

  elif request.method == "PUT":
    aid = request.values['aid']
    highestBid = request.values['highestBid']
    highestBidder = request.values['highestBidder'].lower()
    myBid = int(request.values['myBid'])

    auction = Auction.query.get(aid)
    auction.highestBid = highestBid
    auction.myBid = myBid
    curr_member = User.query.filter(User.address == highestBidder).first()
    auction.highestBidder = curr_member.name

    db.session.commit()

    return jsonify({"aid": auction.aid,
                    "highestBid": auction.highestBid,
                    "highestBidder": auction.highestBidder,
                    "myBid": auction.myBid})

  else:
    all_auctions = Auction.query.all()
    for auction in all_auctions:
      db.session.delete(auction)
      db.session.commit()
    return jsonify({"success": True})


# once created new db
# 1.add me as a new member
# 2. updatedb.py then ranking.py(returning all variables)
# 3. testing with postman (check params or form-data)


if __name__ == "__main__":
    app.run(debug=True)
