from flask import jsonify, request
from func.sendVerifyCode import sendVerifyCode
from firebaseSDK import db
from datetime import datetime
from func.De_EnCode import EnCode

import os

"""
- Hàm VerifyGmail dùng để kiểm tra xem cái code mà người dùng nhập vào 
có trùng với code mà đã gửi đến gmail của họ hay không.
- Trước khi kiểm tra thì phải kiểm tra xem gmail có phải định dạng của NLU hay không
"""
def VerifyGmail() :
    getGmail = request.form.get("gmail")
    announce = {
        "status" : "",
        "message" : [],
        "verifyCode": ""
    }

    if ("@st.hcmuaf.edu.vn" in getGmail) :
        getPrefixGmail = getGmail.replace("@st.hcmuaf.edu.vn", "")
        if (len(getPrefixGmail) != 8) :
            announce["status"] = "E"
            announce["message"] = ["Gmail không hợp lệ"]
            return jsonify(announce)
        else :
            try:
                int(getPrefixGmail)
            except :
                announce["status"] = "E"
                announce["message"] = ["Gmail không hợp lệ"]
                return jsonify(announce)
    else :
        announce["status"] = "E"
        announce["message"] = ["Gmail không hợp lệ"]
        return jsonify(announce)
    
    getVerifyCode = sendVerifyCode(getGmail)
    announce["status"] = "S"
    announce["message"] = ["Mã xác thực đã được gửi"]
    announce["verifyCode"] = getVerifyCode
    return jsonify(announce)

def HandleRegisterStudent() :    
    userName = request.form.get("registerStudent_StudentName")
    gmail = request.form.get("registerStudent_StudentGmail")
    verifyCode = request.form.get("registerStudent_StudentVerify")
    password = request.form.get("registerStudent_StudentPassword")
    trueVerifyCode = request.form.get("trueVerify")
    authorizeCode = request.form.get("authorize")
    announce = {
        "status" : "",
        "message" : []
    }
            
    if (userName == "" or gmail == "" or password == "" or verifyCode == "") :
        announce["status"] = "E"
        announce["message"] = ["Hãy nhập đầy đủ thông tin"]
        return jsonify(announce)
    
    #Kiểm tra ký tự đặc biệt
    userNameCheck = checkSpecialCharater(userName)
    gmailCheck = checkSpecialCharater(gmail)
    passwordCheck = checkSpecialCharater(password)
    verifyCodeCheck = checkSpecialCharater(verifyCode)
    
    if(not(userNameCheck) or not(gmailCheck) or not(passwordCheck) or not(verifyCodeCheck)) :
        if not(userNameCheck) : announce["message"].append("Họ và Tên chứa ký tự không hợp lệ")
        if not(gmailCheck) : announce["message"].append("Gmail chứa ký tự không hợp lệ")
        if not(passwordCheck) : announce["message"].append("Mật khẩu chứa ký tự không hợp lệ")
        if not(verifyCodeCheck) : announce["message"].append("Mã xác nhận chứa ký tự không hợp lệ")
        
        announce["status"] = "E"
        return jsonify(announce)
    
    # Kiểm tra userName
    if(userName != userName.title()) :
        announce["status"] = "E"
        announce["message"].append("Họ và Tên không đúng định dạng")
    
    if(len(verifyCode) != 6) :
        announce["status"] = "E"
        announce["message"].append("Mã xác nhận không đúng định dạng")
    
    if(len(password) >= 8 and len(password) <= 20) :
        number = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        numberInPassword = False
        uppercaseInPassword = False
        
        for num in number :
            if (str(num) in password) :
                numberInPassword = True
                break
            
        if(password != password.lower()) :
            uppercaseInPassword = True
            
        if (not(numberInPassword) or not(uppercaseInPassword)) :
            announce["status"] = "E"
            announce["message"].append("Mật khẩu không đúng định dạng")
        
    else : 
        announce["status"] = "E"
        announce["message"].append("Mật khẩu không đúng định dạng")
    
    if len(announce["message"]) != 0 :
        return jsonify(announce)
    else :
        if authorizeCode == "false" :
            announce["status"] = "E"
            announce["message"] = ["Bạn chưa thực hiện gửi mã xác thực"]
            return jsonify(announce)
        else :
            if(verifyCode != trueVerifyCode) :
                announce["status"] = "E"
                announce["message"].append("Mã xác nhận không đúng")
                return jsonify(announce)
            createAccountResult = CreateAccount(userName, gmail, password)
            
            if createAccountResult == False :
                announce["status"] = "E"
                announce["message"] = ["Tài khoản đã được đăng ký"]
            else :
                announce["status"] = "S"
                announce["message"] = ["Đăng ký thành công"]
            
            return jsonify(announce)    

#Hàm kiểm tra ký tự đặc biệt
def checkSpecialCharater (text) :
    specialCharater = ["<", ">", "( ",")","/", "?" ] 
    count = 0

    for char in specialCharater :
        if char in text : count += 1

    if count != 0 :
        return False # Có ký tự đặc biệt
    else : return True #Không có ký tự đặc biệt
    
    
# Tạo tài khoản
def CreateAccount (userName, gmail, password) :
    # Kiểm tra xem gmail đã được dùng để tạo tài khoản hay chưa
    checkAccount = db.collection("account").document(gmail).get()
    if checkAccount.exists :
        return False
    
    getDate = datetime.now().strftime("%H:%M:%S %Y-%m-%d")
    #Tạo userID
    userId = "nluer" + str(getDate)
    
    #Tạo tài khoản
    key_name = os.getenv("CR_ST_NAME")
    key_mail = os.getenv("CR_ST_GMAIL")
    key_pass= os.getenv("CR_ST_PASS")
    key_id = os.getenv("CR_ST_ID")
    key_createTime = os.getenv("CR_ST_CREATE_TIME")
    
    data = {
        key_name : EnCode(userName),
        key_mail : EnCode(gmail),
        key_pass : EnCode(password),
        key_id : EnCode(userId),
        key_createTime : getDate
    }
    
    db.collection("account").document(gmail).set(data)
    return True