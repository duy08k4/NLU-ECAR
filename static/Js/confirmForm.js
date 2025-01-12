async function createConfirmForm(title, description) {
    if (!document.querySelector(".confirmContainer")) {
        return new Promise((resolve) => {
            let confirmContainer = document.createElement("div")
            confirmContainer.classList.add("confirmContainer")

            if (description) {
                confirmContainer.innerHTML += `
                    <div class="confirmContainer__confirmForm">
                        <div class="confirmContainer__confirmForm__titleBox">
                            <h4 class="confirmContainer__confirmForm__title">${title}</h4>
                        </div>

                        <div class="confirmContainer__descripttionBox">
                            <p class="confirmContainer__descripttionBox--content">${description}</p>
                        </div>
            
                        <div class="confirmContainer__confirmForm__btnBox">
                            <button class="confirmContainer__confirmForm__btn confirmContainer__confirmForm__btn--cancelBtn">Hủy</button>
                            <button class="confirmContainer__confirmForm__btn confirmContainer__confirmForm__btn--acceptBtn">Xác nhận</button>
                        </div>
                    </div>
                `
            } else {
                confirmContainer.innerHTML += `
                    <div class="confirmContainer__confirmForm">
                        <div class="confirmContainer__confirmForm__titleBox">
                            <h4 class="confirmContainer__confirmForm__title">${title}</h4>
                        </div>
            
                        <div class="confirmContainer__confirmForm__btnBox">
                            <button class="confirmContainer__confirmForm__btn confirmContainer__confirmForm__btn--cancelBtn">Hủy</button>
                            <button class="confirmContainer__confirmForm__btn confirmContainer__confirmForm__btn--acceptBtn">Xác nhận</button>
                        </div>
                    </div>
                `
            }

            document.body.appendChild(confirmContainer)

            function removeConfirmForm() {
                document.querySelector(".confirmContainer").remove()
            }

            // Lắng nghe sự kiện khi chọn hủy
            document.querySelector(".confirmContainer__confirmForm__btn--cancelBtn").addEventListener("click", () => {
                resolve(false)
                removeConfirmForm()
            })

            // Lắng nghe sự kiện khi chọn xác nhận
            document.querySelector(".confirmContainer__confirmForm__btn--acceptBtn").addEventListener("click", () => {
                resolve(true)
                removeConfirmForm()
            })
        })
    }
}

export { createConfirmForm }