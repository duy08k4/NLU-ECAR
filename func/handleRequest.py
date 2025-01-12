from flask import jsonify, request
from func.deCodeKeyAccess import DeCodeKeyAccess
from func.De_EnCode import EnCode
from firebaseSDK import db
import os

def SendRequest () :
    regionName = request.form.get("regionName")
    regionID = request.form.get("regionID")
    keyAccess = request.form.get("keyAccess")
    gmail = DeCodeKeyAccess(keyAccess)

    db.collection(str(EnCode(regionID))).document(str(EnCode(gmail))).set({
        os.getenv("ST_QUEST_RG_NAME") : regionName,
        os.getenv("ST_QUEST_RG_ID") : regionID
    })

    return jsonify({"status" : "Somethings"})

def RemoveRequest () :
    regionName = request.form.get("regionName")
    regionID = request.form.get("regionID")
    keyAccess = request.form.get("keyAccess")
    if regionName and regionID and keyAccess :
        gmail = DeCodeKeyAccess(keyAccess)
        
        if db.collection(str(EnCode(regionID))).document(str(EnCode(gmail))).get().exists :
            db.collection(str(EnCode(regionID))).document(str(EnCode(gmail))).delete()
            return jsonify({"status" : "S", "message" : ["Đã hủy yêu cầu"]})
 
    return jsonify({})