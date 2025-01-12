import { showAnnounce } from "./anounce.js";
import { showLoading, closeLoading } from "./showLoading.js"
import { createConfirmForm } from "./confirmForm.js";

document.addEventListener("DOMContentLoaded", function () {
    let veriFyGmail = false
    // Send and verify code
    document.querySelector(".registerStudent__StudentVerifyInputBox__sendVerifyBtn").addEventListener("click", (e) => {
        e.preventDefault()
    
        let getVerifyCode = localStorage.getItem("verifyCode")
    
        if(getVerifyCode) {
            showAnnounce({
                status: "W",
                message: ["Mã xác nhận đã được gửi. Vui lòng kiểm tra lại gmail của bạn"]
            }, 5)
            return
        }
        showLoading()
        let userGmail = document.querySelector(".registerStudent__StudentGmailInputBox__input").value
        
        let userData = new URLSearchParams();
        userData.append('gmail', userGmail)
    
        fetch("/verifyGmail", {
            method: "POST",
            body: userData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setTimeout(() => {
                closeLoading()

                if (data.status == "S") {
                    localStorage.setItem("verifyCode", data.verifyCode)      
                    veriFyGmail = true      
                }
                
                showAnnounce(data, 5)
            }, 500)
        })
        .catch((err) => console.log(err))
    })
    
    // Register
    document.querySelector(".registerStudent__buttonBox__registerBtn").addEventListener("click", (e) => {
        e.preventDefault()
        showLoading()

        let registerFormStudent = document.querySelector(".registerStudent")
        let formData = new FormData(registerFormStudent)
        formData.append('trueVerify', localStorage.getItem("verifyCode"))
        formData.append('authorize', String(veriFyGmail))
        
        fetch("/registerStudentHandle", {
            method: "POST",
            body: formData,
        })
        .then((data) => data.json())
        .then((data) => { 
            setTimeout(async () => {
                closeLoading()
                showAnnounce(data, 5) 
                if (data.status != "E") {
                    localStorage.removeItem("verifyCode")
                    document.querySelector(".registerStudent").reset()
                    let confirm = await createConfirmForm("chuyển đến trang đăng nhập")
                    if(confirm) {
                        window.location.href = "/login/student"
                    }
                }
            }, 500)
        })
        .catch((err) => console.log(err))
    })
    
});