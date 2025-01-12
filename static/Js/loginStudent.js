import { showAnnounce } from "./anounce.js"
import { closeLoading, showLoading } from "./showLoading.js";

document.addEventListener("DOMContentLoaded", function () {
    // Xử lý sự kiện bấm nút đăng nhập
    document.querySelector(".loginStudent__buttonBox__loginBtn").addEventListener("click", (e) => {
        e.preventDefault()
        showLoading()

        let loginFormStudent = document.querySelector(".loginStudent")
        let formData = new FormData(loginFormStudent)
        let keyAccess = localStorage.getItem("keyAccess")
    
        if (keyAccess) {
            formData.append("keyAccess", keyAccess)
        } else formData.append("keyAccess", "")
    
        fetch("/handleLoginStudent", {
            method: "POST",
            body: formData,
        })
            .then((data) => data.json())
            .then((data) => {
                closeLoading()
                let getStatus = data.status
    
                if(getStatus == "E") {
                    showAnnounce(data, 5)
                } 
    
                if(getStatus == "S") {
                    document.querySelector(".loginStudent").reset()
                    localStorage.setItem("keyAccess", data.keyAccess)
                    localStorage.setItem("login", "true")
                    setTimeout(() => {
                        window.location.href = "/mainPageStudent"
                    }, 500)
                }
            })
    
            .catch(error => {
                closeLoading()
                console.log(error)
            })
    })
});