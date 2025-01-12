from flask import jsonify, request
from firebaseSDK import db
from func.De_EnCode import DeCode, EnCode
import os
from datetime import datetime

def HandleRegisterDriver () :
    driverName = request.form.get("registerDriver_DriverName")
    driverMail = request.form.get("registerDriver_DriverGmail")
    driverPhone = request.form.get("registerDriver_DriverPhone")
    driverPassword = request.form.get("registerDriver_DriverPassword")
    announce = {
        "status" : "",
        "message" : []
    }
    
    if not(driverName) or not(driverMail) or not(driverPhone) or not(driverPassword) :
        announce["status"] = "E"
        announce["message"].append("Vui lòng nhập đầy đủ thông tin")
        return jsonify(announce)
    
    if(driverName != driverName.title()) :
        announce["message"].append("Họ Tên không đúng định dạng")

    if len(driverPassword) < 8 or len(driverPassword) > 20 :
        announce["message"].append("Mật khẩu không đúng định dạng")
    else :
        numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        numberInPassword = False
        
        for num in numbers :
            if(str(num) in driverPassword) :
                numberInPassword = True
                break
            
        if numberInPassword == False :
            announce["message"].append("Mật khẩu phải chứa số")
            
        if checkSpecialCharater(driverPassword) == False :
            announce["message"].append("Mật khẩu không chứa ký tự đặc biệt")
        
        if driverPassword == driverPassword.lower() :
            announce["message"].append("Mật khẩu phải chứa kí tự in hoa")
            
        
    verifyDriverAccount = verifyAccount(driverMail, driverPhone)
    if verifyDriverAccount != True : 
        announce["message"].append(verifyDriverAccount)
        
    if len(announce["message"]) != 0 :
        announce["status"] = "E"
        return jsonify(announce)
    
    createDriverAccount(driverName, driverMail, driverPhone, driverPassword)
    announce["status"] = "S"
    announce["message"] = ["Đăng ký thành công"]
    return jsonify(announce)


def verifyAccount (mail, phone) :
    if not("@gmail.com" in mail) :
        return "Gmail không đúng định dạng"
     
    elif db.collection("authorizeDriver").document(str(EnCode(mail))).get().exists :
    
        dataCheck = db.collection("authorizeDriver").document(str(EnCode(mail))).get().to_dict()[os.getenv("AT_DV_PHONE")] == str(EnCode(phone))
        
        if not(dataCheck) :
            return "Gmail và số điện thoại chưa được đăng ký"
        
        elif checkAccountExist(mail) :
            return "Tài khoản không hợp lệ"
        
        return True
    else :
        return "Gmail và số điện thoại chưa được đăng ký"    

def checkAccountExist(mail) :
    if db.collection("driverAccount").document(str(EnCode(mail))).get().exists :
        return True
    
    return False

def checkSpecialCharater (text) :
    specialCharater = ["<", ">", "( ",")","/", "?" ] 
    count = 0

    for char in specialCharater :
        if char in text : count += 1

    if count != 0 :
        return False # Có ký tự đặc biệt
    else : return True #Không có ký tự đặc biệt
    
def createDriverAccount (username, gmail, phone, password) :
    getDate = datetime.now().strftime("%H:%M:%S %Y-%m-%d")
    
    dataAccount = {
        os.getenv("CR_DV_NAME") : EnCode(username),    
        os.getenv("CR_DV_GMAIL") : EnCode(gmail),    
        os.getenv("CR_DV_PHONE") : EnCode(phone),    
        os.getenv("CR_DV_PASS") : EnCode(password),  
        os.getenv("CR_DV_CREATETIME") : getDate
    }
    
    db.collection("driverAccount").document(str(EnCode(gmail))).set(dataAccount)