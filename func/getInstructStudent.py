from firebaseSDK import db
from flask import jsonify

def GetInstructStudent() :
    data = db.collection("instruct").document("student").get().to_dict()
    return jsonify({"data": data})