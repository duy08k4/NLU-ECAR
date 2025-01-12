from firebaseSDK import db
from func.De_EnCode import DeCode
import datetime

def DeCodeKeyAccess (key) :
    getKey = str(DeCode(eval(key)))
    getGmail = getKey.split("&")[0]

    return getGmail