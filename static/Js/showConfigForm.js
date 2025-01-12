import { showAnnounce } from "./anounce.js"
import { showLoading, closeLoading } from "./showLoading.js"

async function createConfigForm() {
    let configForm = document.createElement("div")
    configForm.classList.add("configContainer")
    configForm.innerHTML = `
        <div class="configForm">
            <div class="configForm__titleBox">
                <h3 class="configForm__titleBox--content">Xóa tài khoản</h3>
            </div> 

            <div class="configForm__inputBox">
                <input type="password" class="configForm__inputBox--verifyCode" placeholder="Mã xác nhận">
                <button class="configForm__inputBox--verifyButton">Gửi</button>
            </div>

            <div class="configForm__buttonBox">
                <button class="configForm__buttonBox--backBtn">Quay lại</button>
                <button class="configForm__buttonBox--deleteAccountBtn">Xóa</button>
            </div>
        </div>
    `

    document.body.appendChild(configForm)

    // Gửi mã xác nhận
    document.querySelector(".configForm__inputBox--verifyButton").addEventListener("click", () => {
        if(!localStorage.getItem("removeCode")) {
            let getKeyAccess = localStorage.getItem("keyAccess")
            let data = new URLSearchParams()
            data.append("keyAccess", getKeyAccess)
    
            fetch("/sendRemoveAccountCode", {
                method: "POST",
                body: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            }).then((response) => response.json())
            .then((res) => {
                localStorage.setItem("removeCode", res.verifyCode)
                showAnnounce(res, 3)
            })
        } else {
            showAnnounce({
                status : "W",
                message: ["Mã xác nhận đã được gửi"]
            }, 3)
        }
    })
    
    // Bấm nút quay lại
    document.querySelector(".configForm__buttonBox--backBtn").addEventListener("click", () => {
        localStorage.removeItem("removeCode")
        document.querySelector(".configContainer").remove()
    })

    // Bấm nút xác nhận xóa tài khoản
    document.querySelector(".configForm__buttonBox--deleteAccountBtn").addEventListener("click", () => {
        showLoading()
        let getRemoveCode = localStorage.getItem("removeCode")
        let getInputVerifyCode = document.querySelector(".configForm__inputBox--verifyCode").value
        let getKeyAccess = localStorage.getItem("keyAccess")
        let data = new URLSearchParams()
        data.append("T_code", getRemoveCode)
        data.append("I_code", getInputVerifyCode)
        data.append("keyAccess", getKeyAccess)
        
        fetch("/removeAccount", {
            method: "POST",
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        })
        .then((respone) => respone.json())
        .then((respone) => {
            setTimeout(() => {
                closeLoading()
                if (respone.status != "S") {
                    showAnnounce(respone, 3)
                } else {
                    localStorage.removeItem("removeCode")
                    localStorage.removeItem("verifyCode")
                    localStorage.removeItem("keyAccess")
                    window.location.href = "/login/student"
                }
                
            }, 500);
        })
    })
}

export { createConfigForm }