import { allPickUpPoint, defaultDistance, distance } from "./boundaryNLU.js";
import { createConfirmForm } from "./confirmForm.js";
import { showAnnounce } from "./anounce.js";
import { createConfigForm } from "./showConfigForm.js";
import { closeLoading, showLoading } from "./showLoading.js";

window.addEventListener("beforeunload", () => {
    localStorage.removeItem("login")
    localStorage.removeItem("keyAccess")
})

// Kiểm tra tình trạng đăng nhập
let loginStatus = localStorage.getItem("login")

if (!loginStatus) {
    window.location.href = "/login/student"
}

// Thiết lập bản đồ và các chức năng
let map = L.map('StudentMap').setView([10.87122961559558, 106.79169069068973], 13);
let userMarker;
var gpsStatus = false;
let userMoveMap = false;
let userLocation = false;
// let userLocation = [10.87391957385384, 106.79202021598263]
let func = []
let showPickUpPoint_status = false

const driverIcon = L.icon({
    iconUrl: 'static/img/driverLocationIcon.gif',
    // static/img/figIcon.png, 
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -32],
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

map.on("dragstart", () => {
    userMoveMap = true;
});

// Di chuyển đến vị trí của bản thân---------------------------------------------------------------------------------
document.querySelector(".mainPageStudent__funcBar__buttonMyLocation").addEventListener("click", getMyLocation)

function getMyLocation() {
    if (userLocation != false) {
        map.setView(userLocation, map.getZoom());
    } else {

        if (userLocation != false) {
            showAnnounce({
                status: "W",
                message: ["Đang định vị. Vui lòng chờ"]
            }, 5)
        }
        showAnnounce({
            status: "I",
            message: ["Vui lòng bật định vị"]
        }, 5)
    }
}


// Bật tắt GPS -------------------------------------------------------------------------------------------------------
document.querySelector(".mainPageStudent__funcBar__locateDriver").addEventListener("click", changeStatusGPS)

async function changeStatusGPS() {
    gpsStatus = !gpsStatus;
    if (gpsStatus) {
        document.querySelector(".mainPageStudent__funcBar__locateDriver").classList.add("open")
        // Đây là demo
        // map.setView(userLocation, map.getZoom())
        // userMarker = L.marker([userLocation[0], userLocation[1]])
        //     .addTo(map)
        //     .bindPopup("Vị trí của bạn")
        //     .openPopup();
        // ----------------------------------------------------
        getRealtimeLocation(() => {
            if (userMoveMap === false) {
                map.setView(userLocation, map.getZoom());
            }
        });
    } else {

        if (func.length == 0) {
            if (userMarker != null) {
                stopGetRealtimeLocation();
                document.querySelector(".mainPageStudent__funcBar__locateDriver").classList.remove("open")
            }

        } else {
            let confirm = await createConfirmForm("Tắt GPS", "Các chức năng cũng sẽ ngưng hoạt động")
            if (confirm) {
                func = []
                removeRequest()

                if (addedPolygons.length != 0) {
                    removePickUpPoint()
                    showPickUpPoint_status = false
                }

                if (userMarker != null) {
                    stopGetRealtimeLocation();
                    document.querySelector(".mainPageStudent__funcBar__locateDriver").classList.remove("open")
                }
            }
        }

        if (requestStatus) {
            clearInterval(showDriverLocationInterval)
        }
    }
}

// Hàm định vị thời gian thực
function getRealtimeLocation(callback) {
    map.locate({
        setView: false,
        maxZoom: 19,
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 1000, //reduce cache to 1sec reduce stupid detection
        timeout: 5000, //update faster
        interval: 1000 //poll every second
    });

    map.on("locationfound", (e) => {
        let location = [e.latlng.lat, e.latlng.lng];

        if (
            (userLocation &&
                userLocation[0] != location[0] &&
                userLocation[1] != location[1]) ||
            userLocation == false
        ) {
            userLocation = location;

            if (userMarker == null) {
                userMarker = L.marker(e.latlng)
                    .addTo(map)
                    .bindPopup("Vị trí của bạn")
                    .openPopup();
            } else {
                userMarker.setLatLng(e.latlng);

                // map.addLayer(userMarker)
            }

            if (typeof callback === "function") {
                callback(userLocation);
            }
        }
    });
}

// Hàm dừng định vị thời gian thực
function stopGetRealtimeLocation() {
    map.stopLocate();
    map.off("locationfound");

    map.removeLayer(userMarker);
    userMarker = null;
    userLocation = false;
}


// Danh sách lượt đi-------------------------------------------------------------------------------------------------
let showStatusDriverLocation = false
let requestStatus = false
let driverMarkerGroup = L.layerGroup()
let showDriverLocationInterval
let myEndPoint
async function showDriverLocation() {
    await removeDriverLocation()

    fetch("/getDriverLocation", {
        method: "POST",
        body: recentRequest,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(res => {
            let allLocation = res.allLocation
            console.log(allLocation)
            console.log(userLocation)

            for (let index in allLocation) {
                let coords = allLocation[index]
                const [lat, lng] = coords.split(',').map(Number);
                const marker = L.marker([lat, lng], { icon: driverIcon });
                driverMarkerGroup.addLayer(marker);
                let calDistance = distance(userLocation, [lat, lng])
                console.log(calDistance)

                if (myEndPoint.getBounds().contains([lat, lng])) {
                    clearInterval(showDriverLocationInterval)
                    showStatusDriverLocation = false
                    document.querySelector(".mainPageStudent__requestBtnBox").classList.remove("cancel")
                    requestStatus = false
                    removeRequest(true)
                    removeDriverLocation()
                    showAnnounce({
                        status: "S",
                        message: ["Tài xế đã đến"]
                    }, 5)
                }
            }

            if (allLocation && allLocation.length != 0) {

                for (let index in allLocation) {
                    let coords = allLocation[index]
                    const [lat, lng] = coords.split(',').map(Number);
                    const marker = L.marker([lat, lng], { icon: driverIcon });
                    driverMarkerGroup.addLayer(marker);
                    let calDistance = distance(userLocation, [lat, lng])
                    console.log(calDistance)

                    if (myEndPoint.getBounds().contains([lat, lng])) {
                        clearInterval(showDriverLocationInterval)
                        showStatusDriverLocation = false
                        document.querySelector(".mainPageStudent__requestBtnBox").classList.remove("cancel")
                        requestStatus = false
                        removeRequest(true)
                        removeDriverLocation()
                        showAnnounce({
                            status: "S",
                            message: ["Tài xế đã đến"]
                        }, 5)
                    }
                }
            } else {
                clearInterval(showDriverLocationInterval)
                showStatusDriverLocation = false
                removeDriverLocation()
                setTimeout(() => {
                    showAnnounce({
                        status: "I",
                        message: ["Không có tài xế đang đến"]
                    }, 5)
                }, 500)
            }

            driverMarkerGroup.addTo(map)
        })
}

async function removeDriverLocation() {
    driverMarkerGroup.clearLayers();
}

// Xem vị trí các điểm đón---------------------------------------------------------------------------------------------
document.querySelector(".mainPageStudent__funcBar__listEndPoint").addEventListener("click", changeStatusOfShowPickUpPoint)

let addedPolygons = []
function changeStatusOfShowPickUpPoint() {
    if (gpsStatus) {
        if (!showPickUpPoint_status) {
            showPickUpPoint()
            func.push(1)
            showAnnounce({
                status: "I",
                message: ["Đã hiển thị các điểm đón"]
            }, 5)
        } else {
            func.pop()
            removePickUpPoint()
            showAnnounce({
                status: "I",
                message: ["Đã ẩn các điểm đón"]
            }, 5)
        }

        showPickUpPoint_status = !showPickUpPoint_status
    } else {
        showAnnounce({
            status: "I",
            message: ["Vui lòng bật định vị"]
        }, 5)
    }

}

function showPickUpPoint() {
    let allPickUpPoint_NLU = allPickUpPoint
    let allCoordinate = allPickUpPoint_NLU.map(({ nameBuilding, flag, regionID, coordinates }) => {
        let calculateDistance = distance(userLocation, flag)
        if (calculateDistance < defaultDistance) {
            let createPolygon = L.polygon(coordinates, { color: "blue" })
            createPolygon.addTo(map)
            addedPolygons.push(createPolygon)
        }

    })
}

function removePickUpPoint() {
    addedPolygons.forEach((polygon) => {
        map.removeLayer(polygon)
    })

    addedPolygons = []
}

// Trang cài đặt-------------------------------------------------------------------------------------------------------
document.querySelector(".mainPageStudent__funcBar__buttonConfig").addEventListener("click", async () => {
    if (func.length == 0 && !gpsStatus) {
        createConfigForm()
    } else {
        showAnnounce({
            status: "I",
            message: [`Vui lòng tắt định vị`]
        }, 5)
    }
})

// Gửi yêu cầu -------------------------------------------------------------------------------------------------------
let recentRequest
document.querySelector(".mainPageStudent_requestBtnSend").addEventListener("click", async () => {
    if (userLocation != false && gpsStatus) {
        showLoading()
        showPickUpPoint()
        requestStatus = true
        let region
        addedPolygons.forEach((polygon) => {
            if (polygon.getBounds().contains(userLocation)) {
                region = polygon
                myEndPoint = polygon
                return
            }
        })

        let [regionName, regionID] = await identifyRegion(region)

        removePickUpPoint()

        if (regionName == false) {
            showAnnounce({
                status: "E",
                message: ["Không tìm thấy điểm đón"]
            }, 5)
        } else {
            let requestTaks = new URLSearchParams()
            requestTaks.append('regionName', regionName)
            requestTaks.append('regionID', regionID)
            requestTaks.append('keyAccess', localStorage.getItem("keyAccess"))
            recentRequest = requestTaks

            fetch("/sendRequest", {
                method: "POST",
                body: requestTaks,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(async (res) => {
                    func.push(2)
                    closeLoading()
                    document.querySelector(".mainPageStudent__requestBtnBox").classList.add("cancel")
                    showAnnounce({
                        status: "I",
                        message: [`Bạn đang ở vị trí ${regionName}`]
                    }, 3)

                    showAnnounce({
                        status: "S",
                        message: ["Yêu cầu đã được gửi"]
                    }, 5)

                    await showDriverLocation()
                    showDriverLocationInterval = setInterval(async () => {
                        await showDriverLocation()
                    }, 1000)
                })

        }

    } else {
        showAnnounce({
            status: "I",
            message: ["Vui lòng bật định vị"]
        }, 5)
    }
})

async function identifyRegion(polygon) {
    let getCoordinate = polygon._latlngs[0]
    let regionName = false
    let regionID

    allPickUpPoint.forEach((val) => {
        if (val.coordinates.length == getCoordinate.length) {
            let isThisPolygon = true
            val.coordinates.forEach((coordinate, index) => {

                if (coordinate[0] != getCoordinate[index].lat || coordinate[1] != getCoordinate[index].lng) {
                    isThisPolygon = false
                    return
                }
            })
            if (isThisPolygon) {
                regionName = val.nameBuilding
                regionID = val.regionID
                return
            }
        }
    })

    return [regionName, regionID]
}

// Hủy gửi yêu cầu
document.querySelector(".mainPageStudent_requestBtnCancel").addEventListener("click", async () => {

    // Hiện Confirm Form trước
    requestStatus = false
    let confirm = await createConfirmForm("Thu hồi yêu cầu")
    if (confirm) {
        removeRequest()
        clearInterval(showDriverLocationInterval)
        removeDriverLocation()
        console.log("da xóa")
    } 
})

async function removeRequest(announceStatus) {
    removeDriverLocation()
    showLoading()
    fetch("/removeRequest", {
        method: "POST",
        body: recentRequest,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(res => {
            if (res.status) {
                document.querySelector(".mainPageStudent__requestBtnBox").classList.remove("cancel")
                if (announceStatus == undefined) showAnnounce(res, 5)
                func.pop()
            }
            closeLoading()
        })
}