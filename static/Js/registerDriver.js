import { showAnnounce } from "./anounce.js"
import { closeLoading, showLoading } from "./showLoading.js"
import { createConfirmForm } from "./confirmForm.js"

document.querySelector(".registerDriver__buttonBox__registerBtn").addEventListener("click", (e) => {
    e.preventDefault()
    showLoading()

    let registerFormDriver = document.querySelector(".registerDriver")
    let formData = new FormData(registerFormDriver)

    fetch("/registerDriverHandle", {
        method: "POST",
        body: formData
    })
    .then((res) => res.json())
    .then( async (data) => {
        closeLoading()

        if (data.status == "S") {
            document.querySelector(".registerDriver").reset()
            showAnnounce(data, 5)
            let confirm = await createConfirmForm("Quay lại trang đăng nhập")

            if(confirm) {
                window.location.href = "/login/driver"
            }
        }else {
            showAnnounce(data, 5)
        }
    })
})