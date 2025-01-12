function showLoading() {
    let getLoaddingEffect = document.querySelector(".loadingEffect")
    if (!getLoaddingEffect) {
        let createLoadingEffect = document.createElement("div");
        createLoadingEffect.classList.add("loadingEffect");
        createLoadingEffect.innerHTML = `
            <div class="loadingContainer">
                <div class="point" style="--i: 1"></div>
                <div class="point" style="--i: 2"></div>
                <div class="point" style="--i: 3"></div>
                <div class="point" style="--i: 4"></div>
                <div class="point" style="--i: 5"></div>
                <div class="point" style="--i: 6"></div>
                <div class="point" style="--i: 7"></div>
                <div class="point" style="--i: 8"></div>
                <div class="point" style="--i: 9"></div>
                <div class="point" style="--i: 10"></div>
            </div>
        `;

        document.body.appendChild(createLoadingEffect);
    }
}

function closeLoading() {
    let getLoaddingEffect = document.querySelector(".loadingEffect")
    if (getLoaddingEffect) {
        getLoaddingEffect.remove()
    }
}

export { showLoading, closeLoading }