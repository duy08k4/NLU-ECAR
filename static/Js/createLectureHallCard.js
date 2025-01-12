async function createLectureHallCard (listIDHall) {
    await createCard(listIDHall)  // Tạo các thẻ thẻ giảng đường
}

async function createCard (listIDHall) {    
    listIDHall.forEach(val => {
        let createCard = document.createElement("div")
        createCard.classList.add("lectureHallCard")
        createCard.innerHTML = `
            <div class="lectureHallCard__imgBox">
                <img class="noneSelect lectureHallCard__img" src="../../../static/img/lectureHall.png" alt="Hình ảnh giảng đường">
            </div>
    
            <div class="noneSelect lectureHallCard__inforBox">
                <h3 class="lectureHallCard__inforBox__lectureHallName">${val.requestHall}</h3>
                <div class="lectureHallCard__inforBox__detail">
                    <h6 class="lectureHallCard__inforBox__detailInfor lectureHallCard__inforBox__detail--eCarRequest">Lượt yêu cầu: <p class="detailNumber"> ${val.requestCount}</p></h6>
                </div>
            </div>
    
            <div class="lectureHallCard__buttonBox">
                <button class="lectureHallCard__button" name="${val.requestID}">Đến</button>
            </div>
        `
        document.querySelector(".listLectureHallCard").appendChild(createCard)
    })
}

export { createLectureHallCard }
