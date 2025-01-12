from firebaseSDK import db
from func.De_EnCode import EnCode, DeCode
import os

regionName = "Demo"
regionID = "NLU_TP_demo"
gmail = "duytran.290804@gmail.com"
gmailSV = "22166013@st.hcmuaf.edu.vn"

# db.collection(str(EnCode(regionID))).document(str(EnCode(gmail))).set({
#     os.getenv("ST_QUEST_RG_NAME") : regionName,
#     os.getenv("ST_QUEST_RG_ID") : regionID
# })

db.collection(str(EnCode(regionID))).document(str(EnCode(gmailSV))).set({
    os.getenv("ST_QUEST_RG_NAME") : regionName,
    os.getenv("ST_QUEST_RG_ID") : regionID
})

# a = db.collection("driverLocation").document("b'ZHV5dHJhbi4yOTA4MDRAZ21haWwuY29t'").get().to_dict()["location"]
# print(DeCode(a))