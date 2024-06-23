#localhost:5000/create_contact
from flask import request, jsonify
from config import app, database
from models import Contact

@app.route("/contacts", methods = ["GET"])
def get_contact():
    contact = Contact.query.all()
    json_contact = list(map(lambda x: x.to_json(), contact))
    return jsonify({"contacts": json_contact})

@app.route("/create_contact", methods = ["POST"])
def create_contact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")
    phone_num = request.json.get("phoneNum")

    if not first_name or not last_name or not email or not phone_num:
        return (
            jsonify({"message": "Must include First & Last names, email, and phone number"}), 
            400)
    
    new_contact = Contact(
        first_name = first_name, 
        last_name = last_name, 
        email = email,
        phone_num = phone_num)
    try:
        database.session.add(new_contact)
        database.session.commit()
    except Exception as evt:
        return jsonify({"message": str(evt)}), 400
    
    return jsonify({"message": "Contact created!"}), 201

@app.route("/update_contact/<int:contact_id>", methods = ["PATCH"])
def update_contact(contact_id): #Don't forget that input must be same as int accessor
    contact = Contact.query.get(contact_id)

    if not contact:
        return jsonify({"message": "Contact not found"}), 404
    
    data = request.json
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)
    contact.phone_num = data.get("phoneNum", contact.phone_num)

    database.session.commit()

    return jsonify({"message": "Contact Updated"}), 200

@app.route("/delete_contact/<int:contact_id>", methods = ["DELETE"])
def delete_contact(contact_id):
    contact = Contact.query.get(contact_id)

    if not contact:
        return jsonify({"message": "Contact not found"}), 404

    database.session.delete(contact)
    database.session.commit

    return jsonify({"message": "Contact deleted"}), 200

if __name__ == "__main__":
    with app.app_context():
        database.create_all()

    app.run(debug = True)
