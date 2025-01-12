function showAnnounce(respone, duration) {    
    let getBodyTag = document.querySelector("body")
    let createAnnouceForm

    if (document.querySelector(".announceForm")) {
        createAnnouceForm = document.querySelector(".announceForm")

    } else {
        createAnnouceForm = document.createElement("div")
        createAnnouceForm.className = "announceForm"
    }

    getBodyTag.appendChild(createAnnouceForm)

    let getAnnounceForm = document.querySelector(".announceForm")

    let statusNotification = {
        E: "error",
        S: "success",
        W: "warning",
        I: "info"
    }

    let titleNotification = {
        E: "Thất bại",
        S: "Thành công",
        W: "Cảnh báo",
        I: "Nhắc nhở"
    }

    let typeOfNotification = statusNotification[respone.status] ? statusNotification[respone.status] : ""
    let titleOfNotification = titleNotification[respone.status] ? titleNotification[respone.status] : ""
    let allMessage = respone.message
    let randomIDForNotification = randomAnnounceID()

    if (getAnnounceForm && typeOfNotification != "") {
        let createAnnounceTag = document.createElement("div")
        createAnnounceTag.classList.add(`announceForm__announceTag`)
        createAnnounceTag.classList.add("noneSelect")
        createAnnounceTag.classList.add(typeOfNotification)
        createAnnounceTag.id = randomIDForNotification
        createAnnounceTag.innerHTML = `
            <div class="announceForm__announceTag__iconBox">
                <div class="announceForm__announceTag__iconBox--icon"></div>
            </div>

            <div class="announceForm__announceTag__contentBox">
                <h3 class="announceForm__announceTag__contentBox--title">${titleOfNotification}</h1>
                
                <ul class="announceForm__announceTag__contentBox--content">
                    ${allMessage.map(message => `<li>${message}</li>`).join('')}
                </ul>
            </div>
        `

        getAnnounceForm.appendChild(createAnnounceTag)

        setTimeout(() => {
            let getNotification = document.querySelector(`#${randomIDForNotification}`)
            getNotification.remove()
        }, duration * 1000)
    }
}

function randomAnnounceID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return "ID" + result;
}

export { showAnnounce }