import firebase_admin
from firebase_admin import credentials, firestore

import os
from dotenv import load_dotenv
import json
load_dotenv()

firebase_key = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

service_account = json.loads(firebase_key)
cred = credentials.Certificate(service_account)
firebase_admin.initialize_app(cred)

db = firestore.client()