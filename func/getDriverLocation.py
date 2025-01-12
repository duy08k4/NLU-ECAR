from flask import request, jsonify
from firebaseSDK import db
from func.De_EnCode import EnCode, DeCode

def GetDriverLocation () :
    regionID = request.form.get("regionID")
    docRef = db.collection(str(EnCode(regionID))).document("driverMail").get()
    
    if docRef.exists :
        allDriver = docRef.to_dict()["driver"]
        allLocation = []
        for driver in allDriver : 
            # location = DeCode(db.collection("driverLocation").document(str(EnCode(driver))).get().to_dict()["location"])
            # location = db.collection("driverLocation").document(str(EnCode(driver)))
            
            if db.collection("driverLocation").document(str(EnCode(driver))).get().exists : 
                location = DeCode(db.collection("driverLocation").document(str(EnCode(driver))).get().to_dict()["location"])
                allLocation.append(location)
            
        return jsonify({
            "status" : "S",
            "allLocation" : allLocation
        })
    else :
        return jsonify({
            "status" : "E",
            "allLocation" : []
        })