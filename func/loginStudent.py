from flask import jsonify, request
from firebaseSDK import db
from func.createKeyAccess import CreateKeyAccess
from func.De_EnCode import DeCode
from func.deCodeKeyAccess import DeCodeKeyAccess
from func.De_EnCode import EnCode
import os

def HandleLoginStudent () :
    studentID = request.form.get("loginStudent_StudentID")
    password = request.form.get("loginStudent_password")
    keyAccess = request.form.get("keyAccess")
    
    announce = {
        "status" : "",
        "message" : [],
        "keyAccess" : ""
    }
            
    if  not(studentID) or not(password) :
        announce["status"] = "E"
        announce["message"].append("Hãy nhập đầy đủ thông tin")
        return jsonify(announce)
    
    try :
        int(studentID)
        if(len(studentID) != 8) :
            announce["status"] = "E"
            announce["message"] = ["Tài khoản không hợp lệ"]
    
    except :
        announce["status"] = "E"
        announce["message"] = ["Tài khoản không hợp lệ"]
    
    gmail = studentID + "@st.hcmuaf.edu.vn"
    
    if db.collection("account").document(gmail).get().exists :
        key_pass = os.getenv("CR_ST_PASS")
        getDoc = db.collection("account").document(gmail).get()
        getPassword = getDoc.to_dict()[key_pass]
        
        if (keyAccess == "") :
            newKeyAccess = CreateKeyAccess(gmail)
            if db.collection("keyAccess").document(str(EnCode(gmail))).get().exists:
                db.collection("keyAccess").document(str(EnCode(gmail))).update({"keyAccess" : newKeyAccess})
            else :
                db.collection("keyAccess").document(str(EnCode(gmail))).set({"keyAccess" : newKeyAccess})
            
        else : newKeyAccess = keyAccess
        

        if(DeCode(getPassword) != password) :
            announce["status"] = "E"
            announce["message"] = ["Tài khoản không hợp lệ"]          
    else :
        announce["status"] = "E"
        announce["message"] = ["Tài khoản không hợp lệ"]
    
    if len(announce["message"]) != 0 :
        return jsonify(announce)
    else :
        announce["status"] = "S"
        announce["message"] = ["Đăng nhập thành công"]
        announce["keyAccess"] = str(newKeyAccess)
        return jsonify(announce)
    
def RemoveKeyAccess () :
    keyAccess = request.form.get("keyAccess")
    gmail = DeCodeKeyAccess(keyAccess)

    if db.collection("keyAccess").document(str(EnCode(gmail))).get().exists :
        db.collection("keyAccess").document(str(EnCode(gmail))).delete()
    
    return jsonify({})