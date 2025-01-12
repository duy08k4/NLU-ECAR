from flask import jsonify, request
from func.deCodeKeyAccess import DeCodeKeyAccess
from firebaseSDK import db
from google.cloud import firestore
from func.De_EnCode import EnCode

def RemoveShareLocation () :
    keyAccess = request.form.get("keyAccess")
    regionID = request.form.get("regionID")
    gmail = DeCodeKeyAccess(keyAccess)
    
    if db.collection(str(EnCode(regionID))).document("driverMail").get().exists :
        doc_ref = db.collection(str(EnCode(regionID))).document("driverMail")

        doc_ref.update({
            "driver": firestore.ArrayRemove([gmail])
        })
        
        db.collection("driverLocation").document(str(EnCode(gmail))).delete()
        
    return jsonify({})