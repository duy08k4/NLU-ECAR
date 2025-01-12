from firebaseSDK import db
from flask import jsonify

def GetInstructDriver () :
    data = db.collection("instruct").document("driver").get().to_dict()
    # print(data)
    return jsonify({"data": data})