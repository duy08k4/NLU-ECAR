// Xóa Verify code trước đó đã được lưu
if(localStorage.getItem("verifyCode")) {
    localStorage.removeItem("verifyCode")
}

// Xem hướng dẫn - RegisterPage for Student
let instructionStudentButton = document.querySelector(".registerStudent__buttonBox__otherBtn_changeToRegister")

let getInstructStudent = async function () {
    let getData = fetch("/getInstructStudent", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => data)
    return getData
}

async function showInstructStudent () {
    let dataShow = (await getInstructStudent()).data
    let dataName = dataShow.userName
    let dataGmail = dataShow.gmail
    let dataVerify = dataShow.verifyCode
    let dataPassword = dataShow.password

    let instructName = document.querySelector(".registerLayout__instructionForm__view__instructionBox__contentForm1")
    let instructGmail = document.querySelector(".registerLayout__instructionForm__view__instructionBox__contentForm2")
    let instructVerifyCode = document.querySelector(".registerLayout__instructionForm__view__instructionBox__contentForm3")
    let instructPassword = document.querySelector(".registerLayout__instructionForm__view__instructionBox__contentForm4")
    
    dataName.forEach((val) => {
        let li = `<li>${val}</li>`
        instructName.innerHTML += li
    })

    dataGmail.forEach((val) => {
        let li = `<li>${val}</li>`
        instructGmail.innerHTML += li
    })

    dataVerify.forEach((val) => {
        let li = `<li>${val}</li>`
        instructVerifyCode.innerHTML += li
    })

    dataPassword.forEach((val) => {
        let li = `<li>${val}</li>`
        instructPassword.innerHTML += li
    })
}

if (instructionStudentButton) {
    // Open Instruction For Register - Student
    showInstructStudent()
    document.querySelector(".registerStudent__buttonBox__otherBtn_changeToRegister").addEventListener("click", function(e) {
        e.preventDefault()
        
        document.querySelector(".registerLayout__instructionForm").classList.add("open")
    })
    
    // Close Instruction For Register - Student
    document.querySelector(".registerLayout__instructionForm__view__buttonClose").addEventListener("click", () => {
        document.querySelector(".registerLayout__instructionForm").classList.remove("open")
    })
}

// Xem hướng dẫn - RegisterPage for Driver
let instructionDriver = document.querySelector(".registerDriver__buttonBox__otherBtn_changeToRegister")

let getInstructDriver = async function () {
    let getData = fetch("/getInstructDriver", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => data)
    return getData
}

async function showInstructDriver () {
    let dataShow = (await getInstructDriver()).data
    let dataName = dataShow.driverName
    let dataGmail = dataShow.driverMail
    let dataVerify = dataShow.driverPhone
    let dataPassword = dataShow.driverPassword

    let instructName = document.querySelector(".registerLayout__instructionForm__view__instructionBox__contentForm1")
    let instructGmail = document.querySelector(".registerLayout__instructionForm__view__instructionBox__contentForm2")
    let instructVerifyCode = document.querySelector(".registerLayout__instructionForm__view__instructionBox__contentForm3")
    let instructPassword = document.querySelector(".registerLayout__instructionForm__view__instructionBox__contentForm4")
    
    dataName.forEach((val) => {
        let li = `<li>${val}</li>`
        instructName.innerHTML += li
    })

    dataGmail.forEach((val) => {
        let li = `<li>${val}</li>`
        instructGmail.innerHTML += li
    })

    dataVerify.forEach((val) => {
        let li = `<li>${val}</li>`
        instructVerifyCode.innerHTML += li
    })

    dataPassword.forEach((val) => {
        let li = `<li>${val}</li>`
        instructPassword.innerHTML += li
    })
}

if (instructionDriver) {
    // Open Instruction For Register - Driver
    showInstructDriver()
    document.querySelector(".registerDriver__buttonBox__otherBtn_changeToRegister").addEventListener("click", function(e) {
        e.preventDefault()
    
        document.querySelector(".registerLayout__instructionForm").classList.add("open")
    })
    
    // Close Instruction For Register - Driver
    document.querySelector(".registerLayout__instructionForm__view__buttonClose").addEventListener("click", () => {
        document.querySelector(".registerLayout__instructionForm").classList.remove("open")
    })
}