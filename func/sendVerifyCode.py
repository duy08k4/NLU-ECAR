import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import random
import datetime
from flask import session, jsonify

def sendVerifyCode (receiverMail) :    
    # Cấu hình thông tin đăng nhập
    email_sender = "nluecar240@gmail.com"
    password = "ktag xkkl rbgr xduy"
    email_receiver = receiverMail

    # Tạo kết nối với máy chủ SMTP của Gmail
    def create_email_session():
        session = smtplib.SMTP('smtp.gmail.com', 587)
        session.starttls()  # Bắt đầu TLS (Transport Layer Security) để bảo mật kết nối
        session.login(email_sender, password)
        return session

    # Hàm gửi email với nội dung tuỳ chỉnh
    def send_email(subject, body):
        session = create_email_session()

        # Tạo cấu trúc email
        message = MIMEMultipart()
        message['From'] = email_sender
        message['To'] = email_receiver
        message['Subject'] = subject

        # Đính kèm nội dung email
        message.attach(MIMEText(body, 'plain'))

        # Gửi email
        session.sendmail(email_sender, email_receiver, message.as_string())
        session.quit()

    # Nội dung email
    verifyCode = generate_verification_code()
    subject = "NLU-ECAR: MÃ XÁC NHẬN"
    body = f"Mã xác nhận của bạn: {verifyCode}"

    # Gửi email
    send_email(subject, body)
    
    return verifyCode
    
#Hàm random VerifyCode
def generate_verification_code():
    verifyCode = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    return verifyCode