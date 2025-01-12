from flask import Flask, render_template

app = Flask(__name__, static_url_path='/static', static_folder='static')

@app.route("/")
def staterPage():
    return render_template("views/startPage.html")

# Route Login----------------------------------------------------------------
#Student
from func.loginStudent import HandleLoginStudent, RemoveKeyAccess
@app.route("/login/student")
def loginStudent() :
    return render_template("views/Student/loginStudent.html")

@app.route("/handleLoginStudent", methods=["POST"])
def handleLoginStudent () :
    return HandleLoginStudent()

@app.route("/removeKeyAccess", methods=["POST"])
def removeKeyAccess () :
    return RemoveKeyAccess()

#Driver
from func.loginDriver import HandleLoginDriver
@app.route("/login/driver")
def loginDriver() :
    return render_template("views/Driver/loginDriver.html")

@app.route("/handleLoginDriver", methods=["POST"])
def handleLoginDriver () :
    return HandleLoginDriver()
#End Login-------------------------------------------------------------------

# Route Register ------------------------------------------------------------
from func.registerStudent import HandleRegisterStudent, VerifyGmail
from func.getInstructStudent import GetInstructStudent
from func.getInstructDriver import GetInstructDriver
from func.registerDriver import HandleRegisterDriver

#Student
@app.route("/register/student")
def registerStudent():
    return render_template("views/Student/registerStudent.html")

# Affter Verify Gmail => Register Student
@app.route("/verifyGmail", methods=["POST"])
def verifyGmail() :
    return VerifyGmail()

@app.route("/getInstructStudent", methods=["GET"])
def getInstructStudent () :
    return GetInstructStudent()

# Student Register handle - API
@app.route("/registerStudentHandle", methods=["POST"])
def handleStudentRegister () :
    return HandleRegisterStudent()

#Driver
@app.route("/register/Driver")
def registerDriver():
    return render_template("views/Driver/registerDriver.html")

@app.route("/getInstructDriver", methods=["GET"])
def getInstructDriver () :
    return GetInstructDriver()

# Driver Register handle - API
@app.route("/registerDriverHandle", methods=["POST"])
def handleDriverRegister () :
    return HandleRegisterDriver()

#End Register ---------------------------------------------------------------

# Route MainPage ------------------------------------------------------------
#MainPage Driver
from func.sendLocationDr import SendLocationDriver, ReceiveRequest
from func.getRequest import GetRequest
from func.removeShareLocation import RemoveShareLocation
@app.route("/mainPageDriver")
def mainPageDriver ():
    return render_template("views/Driver/mainPageDriver.html")

@app.route("/sendLocationDriver", methods=["POST"])
def sendLocationDriver ():
    return SendLocationDriver()

@app.route("/receiveRequest", methods=["POST"])
def receiveRequest () :
    return ReceiveRequest()


@app.route("/getRequest", methods=["POST"])
def getRequestForDriver ():
    return GetRequest()

@app.route("/removeShareLocation", methods=["POST"])
def removeShareLocation ():
    return RemoveShareLocation()

#MainPage Student
from func.handleRequest import SendRequest, RemoveRequest
from func.removeAccount import SendAccountCode, RemoveAccount
from func.getDriverLocation import GetDriverLocation

@app.route("/sendRequest", methods=["POST"])
def sendRequest ():
    return SendRequest()

@app.route("/removeRequest", methods=["POST"])
def removeRequest ():
    return RemoveRequest()

@app.route("/mainPageStudent")
def mainPageStudent ():
    return render_template("views/Student/mainPageStudent.html")

@app.route("/sendRemoveAccountCode", methods=["POST"])
def sendRemoveCode () :
    return SendAccountCode()

@app.route("/removeAccount", methods=["POST"])
def removeCode () :
    return RemoveAccount()

@app.route("/getDriverLocation", methods=["POST"])
def getDriverLocation () :
    return GetDriverLocation()

#End MainPage----------------------------------------------------------------

#Forgot Password
@app.route("/forgotPassword")
def forgotPasswordPage () :
    return render_template("forgotPassword.html")

app.run(debug=True, host='0.0.0.0', port=4000)