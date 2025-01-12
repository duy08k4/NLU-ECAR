from firebaseSDK import db
from google.cloud import firestore
from flask import jsonify, request
import os
from func.deCodeKeyAccess import DeCodeKeyAccess
from func.De_EnCode import EnCode

def SendLocationDriver () :
    location = request.form.get("location")
    keyAccess = request.form.get("driverAccess")
    gmail = DeCodeKeyAccess(keyAccess)
    print(location)
    
    db.collection("driverLocation").document(str(EnCode(gmail))).set({
        os.getenv("LC_DV_COODINATE") : EnCode(location)
    })
    return jsonify({})

def ReceiveRequest () :
    regionID = request.form.get("regionID")
    keyAccess = request.form.get("keyAccess")
    gmail = DeCodeKeyAccess(keyAccess)
    
    doc_ref = db.collection(str(EnCode(regionID))).document("driverMail")
    doc_ref.set({}, merge=True)  # Đảm bảo document tồn tại trước khi cập nhật

    doc_ref.update({
        "driver": firestore.ArrayUnion([gmail])
    })
    
    return jsonify({
        "status" : "",
        "message" : [],
        "regionID" : regionID
    })