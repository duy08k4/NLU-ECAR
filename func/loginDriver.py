from flask import jsonify, request
from firebaseSDK import db
from func.createKeyAccess import CreateKeyAccess
from func.De_EnCode import DeCode, EnCode
import os

def HandleLoginDriver () :
    driverGmail = request.form.get("loginDriver_Gmail")
    driverPassword = request.form.get("loginDriver_Password")
    keyAccess = request.form.get("keyAccess")
    
    announce = {
        "status" : "",
        "message" : [],
        "keyAccess" : ""
    }
    
    if driverGmail == "" or driverPassword == "" :
        announce["status"] = "E"
        announce["message"] = ["Hãy nhập đầy đủ thông tin"]
        return jsonify(announce)
    
    try:
        getDriverRef = db.collection("driverAccount").document(str(EnCode(driverGmail))).get()
        if getDriverRef.exists :
            getDriverPassword = getDriverRef.to_dict()[os.getenv("CR_DV_PASS")]

            if DeCode(getDriverPassword) == driverPassword :
                if (keyAccess == "") :
                    newKeyAccess = CreateKeyAccess(driverGmail)
                    if db.collection("driverAccessKey").document(driverGmail).get().exists:
                        db.collection("driverAccessKey").document(driverGmail).update({"keyAccess" : newKeyAccess})
                    else :
                        db.collection("driverAccessKey").document(driverGmail).set({"keyAccess" : newKeyAccess})
                else : newKeyAccess = keyAccess
                
                announce["status"] = "S"
                announce["message"] = "Đăng nhập thành công"
                announce["keyAccess"] = str(newKeyAccess)
                return jsonify(announce)

        announce["status"] = "E"
        announce["message"] = ["Tài khoản không hợp lệ 1"]
        return jsonify(announce)
    except : 
        announce["status"] = "E"
        announce["message"] = ["Tài khoản không hợp lệ 2"]
        return jsonify(announce)