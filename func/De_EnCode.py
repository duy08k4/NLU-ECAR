import base64
import ast

def EnCode(doc) :
    return base64.b64encode(doc.encode())

def DeCode(doc) :
    return base64.b64decode(doc).decode()

def StringToByte (string) :
    return ast.literal_eval(string)

def ByteToString (str_Byte) :
    return str(str_Byte)

def transferMail (gmail) :
    mailTransfer = gmail
    
    if "@" in gmail :
        pass

    if "_at_" in gmail :
        mailTransfer.replace("_at_", "@")
        mailTransfer.replace("_dot_", "")