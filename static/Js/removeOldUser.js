import { closeLoading, showLoading } from "./showLoading.js";


document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("login") && localStorage.getItem("keyAccess")) {
        showLoading()
    
        let data = new URLSearchParams()
        data.append("keyAccess", localStorage.getItem("keyAccess"))
    
        fetch("/removeKeyAccess", {
            method: "POST",
            body: data,
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(res => {
            localStorage.removeItem("keyAccess")
            localStorage.removeItem("login")
            closeLoading()
        })
        .catch(error => {
            console.log(error)
        })
    }
})
