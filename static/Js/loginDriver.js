import { showAnnounce } from "./anounce.js"
import { closeLoading, showLoading } from "./showLoading.js";
document.addEventListener("DOMContentLoaded", function () {
    // Xử lý logout khi người dùng bấm quay lại trang trước
    localStorage.removeItem("driverLogin")
    localStorage.removeItem("driverAccess")
    
    // Xử lý sự kiện bấm nút đăng nhập
    document.querySelector(".loginDriver__buttonBox__loginBtn").addEventListener("click", (e) => {
        e.preventDefault()
        showLoading()        
    
        let loginFormStudent = document.querySelector(".loginDriver")
        let formData = new FormData(loginFormStudent)
        let keyAccess = localStorage.getItem("driverAccess")
    
        if (keyAccess) {
            formData.append("keyAccess", keyAccess)
        } else formData.append("keyAccess", "")
    
        fetch("/handleLoginDriver", {
            method: "POST",
            body: formData,
        })
            .then((data) => data.json())
            .then((data) => {
                setTimeout(() => {
                    closeLoading()
                    let getStatus = data.status
                    if(getStatus == "E") {
                        showAnnounce(data, 5)
                    } 
        
                    if(getStatus == "S") {
                        console.log(data.keyAccess);
                        document.querySelector(".loginDriver").reset()
                        localStorage.setItem("driverAccess", data.keyAccess)
                        localStorage.setItem("driverLogin", "true")
                        window.location.href = "/mainPageDriver"
                    }
                }, 500)
            })
    
            .catch(error => console.log(error))
    })
});
