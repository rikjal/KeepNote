from flask import jsonify, request, make_response, Blueprint
from ..models import Note, db
from ..token import token_required

nav2 = Blueprint('nav2', __name__)


@nav2.route('/note', methods=['GET'])
@token_required
def get_all_notes(curr_user):
    notes = Note.query.filter_by(public_id=curr_user.public_id).all()
    if not notes:
        return make_response("No note found!", 500, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    notes_array = []
    for note in notes:
        arr = {}
        arr['id'] = note.id
        arr['title'] = note.title
        arr['text'] = note.text
        arr['public_id'] = note.public_id
        notes_array.append(arr)
    return jsonify(notes_array), 200


@nav2.route('/note/<id>', methods=['GET'])
@token_required
def get_one_note(curr_user, id):
    note = Note.query.filter_by(id=id).first()
    if not note:
        return make_response("No note found with the id!", 500, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    op = {}
    op['id'] = note.id
    op['title'] = note.title
    op['text'] = note.text
    op['public_id'] = note.public_id
    return jsonify(op), 200


@nav2.route('/note', methods=['POST'])
@token_required
def create_note(curr_user):
    data = request.get_json()
    new_note = Note(title=data['title'], text=data['text'],
                    public_id=curr_user.public_id)
    db.session.add(new_note)
    db.session.commit()
    return jsonify({'success': True}), 200


@nav2.route('/note/<id>', methods=['PATCH'])
@token_required
def update_note(curr_user, id):
    data = request.get_json()
    note = db.session.query(Note).filter_by(id=id).first()
    if not data or not note:
        return jsonify("Error while fetching note!"), 500
    if "title" in data:
        note.title = data['title']
    if "text" in data:
        note.text = data['text']
    db.session.commit()
    return jsonify({"success": True}), 200


@nav2.route('/note/<id>', methods=['DELETE'])
@token_required
def delete_one_note(curr_user, id):
    note = db.session.query(Note).filter_by(id=id).first()
    if not note:
        return jsonify({"message": "Error while deleting note!"}), 500
    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted succesfully!"}), 200
