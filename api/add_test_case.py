from app import db, User

db.create_all()

users = [
    User(
      uid=2, 
      name="Brian Lee", 
      email="cluesbjberkeley.edu", 
      num_points=11,
      img="https://source.unsplash.com/random",
      address="0xce337c810b9ea86975a765b6b7f9ade6263ce936", 
      curr_sem=True,
      rank=0)
]

for u in users:
    if User.query.filter(User.uid == u.uid).first() == None:
        db.session.add(u)
    else:
        print("[ERROR] User {} already exists".format(u.name))

db.session.commit()
