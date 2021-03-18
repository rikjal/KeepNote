from enum import unique
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email_id = db.Column(db.String(80), unique=True)
    name = db.Column(db.String(80))
    password = db.Column(db.String(80))
    public_id = db.Column(db.String(80), unique=True, nullable=False)


class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(80))
    text = db.Column(db.String(200))
    public_id = db.Column(db.String(80), unique=False, nullable=False)
