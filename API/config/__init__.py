from flask import Flask
import secrets
from .routes.user_routes import nav
from .routes.notes_route import nav2
from .models import db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
cors = CORS(app, resources={
    r"/*": {
        "origins": "*"
    }
})
app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/keepnote'
app.register_blueprint(nav, url_prefix="")
app.register_blueprint(nav2, url_prefix="")


def init_initial():
    db.init_app(app)


def init_db():
    db.init_app(app)
    db.app = app
    db.create_all()
