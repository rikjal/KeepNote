from flask import Blueprint, jsonify, request, make_response
from flask.globals import current_app
from ..models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import jwt
import datetime
from ..token import token_required

nav = Blueprint('nav', __name__)


@nav.route('/')
def home():
    return '<h1>Hello from KeepNote API</h1>'


@nav.route('/user')
@token_required
def get_all_users(current_user):
    if not current_user.email_id == 'a@a.in':
        return jsonify({'message': 'Not authorized to perform this action'}), 401
    users = User.query.all()
    output = []

    for user in users:
        user_data = {}
        user_data['email_id'] = user.email_id
        user_data['name'] = user.name
        user_data['password'] = user.password
        user_data['public_id'] = user.public_id
        output.append(user_data)
    return jsonify(output)


@nav.route('/getuser', methods=['GET'])
@token_required
def get_one_user(current_user):
    user = db.session.query(User).filter_by(
        public_id=current_user.public_id).first()
    if not user:
        return jsonify({'message': 'No User Found!'})

    user_data = {}
    user_data['public_id'] = user.public_id
    user_data['email_id'] = user.email_id
    user_data['name'] = user.name
    user_data['password'] = user.password
    return jsonify({'user': user_data})


@nav.route('/user', methods=['POST'])
def create_user():
    data = request.get_json()
    hashed_pass = generate_password_hash(data['password'], method='sha256')
    allUsers = db.session.query(User).all()
    new_user = User(email_id=data['email_id'],
                    name=data['name'], password=hashed_pass, public_id=str(uuid.uuid4()))
    for user in allUsers:
        if user.email_id == new_user.email_id:
            return jsonify({'message': 'Email already taken!'}), 400
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'New User Created!'}), 200


@nav.route('/user', methods=['PATCH'])
@token_required
def update_user(current_user):
    user = User.query.filter_by(public_id=current_user.public_id).first()
    data = request.get_json()
    if not user or not data:
        return jsonify({'message': 'Internal Server Error'}), 500

    if "email_id" in data:
        user.email_id = data['email_id']
    if 'name' in data:
        user.name = data['name']
    if 'password' in data:
        user.password = generate_password_hash(
            data['password'], method='sha256')
    db.session.commit()
    return jsonify({'message': 'Updated Successfully!'}), 200


@nav.route('/user', methods=['DELETE'])
@token_required
def delete_one_user(current_user):
    user = User.query.filter_by(public_id=current_user.public_id).first()
    if not user:
        return make_response("Error", 403, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User has been deleted!'}), 500


@nav.route('/login', methods=['POST'])
def login():
    from .. import app
    auth = request.get_json()["user"]
    if not auth:
        return jsonify({'message': 'Could not verify user!'}), 401

    user = User.query.filter_by(email_id=auth['email_id']).first()

    if not user:
        return jsonify({'message': 'User does not exist!'}), 402

    if check_password_hash(user.password, auth['password']):
        token = jwt.encode({'public_id': user.public_id, 'exp': datetime.datetime.utcnow() +
                            datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'token': token.decode('utf-8')})
    return jsonify({'message': 'Could not verify user!'}), 403
