from func.De_EnCode import EnCode
from firebaseSDK import db
from google.cloud import firestore
import time
import os

listCoordinates = [
    [10.861414355847657, 106.68028083271258],
    [10.870398019218229, 106.73402281816965],
    [10.87550455053362, 106.75765743001443],
    [10.870071953342247, 106.77509293297425],
    [10.867480455229355, 106.78782193582254],
    [10.869952495200621, 106.78903243194037]
]
regionName = "HQ"
regionID = "NLU_HQ_demo"
gmail = "duytran.290804@gmail.com"

# Demo Data
def sendLocationDemo () :
    for coordinate in listCoordinates :
        time.sleep(5)
        
        location = str(coordinate[0]) + "," + str(coordinate[1])
        
        db.collection("driverLocation").document(str(EnCode(gmail))).set({
            os.getenv("LC_DV_COODINATE") : EnCode(location)
        })
        
        print(location)
    
    print("Xóa sau 10s")
    time.sleep(10)
    doc_ref = db.collection(str(EnCode(regionID))).document("driverMail")
    doc_ref.set({}, merge=True)  # Đảm bảo document tồn tại trước khi cập nhật

    doc_ref.update({
        "driver": firestore.ArrayRemove([gmail])
    })
    
    print("Xóa dữ liệu cũ")
    removeLocationDemo()


def getRequest () :
    doc_ref = db.collection(str(EnCode(regionID))).document("driverMail")
    doc_ref.set({}, merge=True)  # Đảm bảo document tồn tại trước khi cập nhật

    doc_ref.update({
        "driver": firestore.ArrayUnion([gmail])
    })
    
def removeLocationDemo () :
    db.collection("driverLocation").document(str(EnCode(gmail))).delete()
    
getRequest()
time.sleep(5)
print("Bắt đầu gửi")
sendLocationDemo()