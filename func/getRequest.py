from firebaseSDK import db
from flask import jsonify, request
from func.De_EnCode import EnCode

def GetRequest():  # Xác định xem giảng đường nào đang có yêu cầu
    listID = request.form.get("listID").split(",")
    listName = request.form.get("listName").split(",")
    listExistsHall = []
    batch_queries = []
    
    for hallID in listID:
        encoded_id = str(EnCode(hallID))
        getCol = db.collection(encoded_id)
        batch_queries.append(getCol.stream())

    for index, (query, hallID) in enumerate(zip(batch_queries, listID)):
        documents = list(query) 
        if documents:
            driverMailExists = any(doc.id == "driverMail" for doc in documents)
            count = len(documents) - (1 if driverMailExists else 0)
            if count > 0 :
                listExistsHall.append({
                    "requestHall": listName[index],  
                    "requestID": hallID,
                    "requestCount": count
                })
    print(listExistsHall)
    return jsonify({"allHall": listExistsHall})
