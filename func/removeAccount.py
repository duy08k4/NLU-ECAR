from flask import jsonify, request
from func.deCodeKeyAccess import DeCodeKeyAccess
from func.sendVerifyCode import sendVerifyCode
from firebaseSDK import db

def SendAccountCode () :
    getKeyAccess = request.form.get("keyAccess")
    gmail = DeCodeKeyAccess(getKeyAccess)
    verifyCode = sendVerifyCode(gmail)
    
    return jsonify({
        "status" : "S",
        "message" : ["Đã gửi mã xác nhận"],
        "verifyCode": verifyCode
    })

def RemoveAccount () :
    getTrueCode = str(request.form.get("T_code"))
    getInputCode = str(request.form.get("I_code"))
    announce = {
        "status" : "",
        "message" : [],
    }

    if getInputCode == "" :
        announce["status"] = "E"
        announce["message"] = ["Hãy nhập mã xác nhận"]
        return jsonify(announce)
    
    if getInputCode == getTrueCode :
        gmail = DeCodeKeyAccess(request.form.get("keyAccess"))
        db.collection("account").document(gmail).delete()
        db.collection("keyAccess").document(gmail).delete()

        announce["status"] = "S"
        announce["message"] = ["Tài khoản đã được xóa"]
        return jsonify(announce)
    else :
        announce["status"] = "E"
        announce["message"] = ["Mã xác nhận không hợp lệ"]
        return jsonify(announce)