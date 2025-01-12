window.addEventListener("beforeunload", () => {
  localStorage.removeItem("driverLogin")
  localStorage.removeItem("driverAccess")
})

import { allPickUpPoint, boundaryNLU, defaultDistance, distance } from "./boundaryNLU.js";
import { closeLoading, showLoading } from "./showLoading.js";
import { createLectureHallCard } from "./createLectureHallCard.js"
import { showAnnounce } from "./anounce.js";

// Kiểm tra tình trạng đăng nhập
let loginStatus = localStorage.getItem("driverLogin")

if (!loginStatus) {
  window.location.href = "/login/driver"
}

// Khởi tạo bản đồ
let map = L.map("driverMap").setView([51.505, -0.09], 13);
let userMarker;
var gpsStatus = false;
let userMoveMap = false;
let endPoint
let userLocation = false;
// let userLocation = [10.869926174412782, 106.78890099232211]

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Theo dỏi thao tác di chuyển bản đồ của người dùng
map.on("dragstart", () => {
  userMoveMap = true;
});

// Trang cài đặt -------------------------------------------------------------------------------------------------------
document.querySelector(".mainPageDriver__funcBar__buttonConfig").addEventListener("click", () => {  
  showAnnounce({
    status: "I",
    message: [`Liên hệ quản trị viên để xóa tài khoản`]
  }, 5)
});

// Bật tắt GPS ----------------------------------------------------------------------------------------------------------\
document.querySelector(".mainPageDriver__funcBar__buttonGpsStatus").addEventListener("click", changeStatusGPS);

function changeStatusGPS() {
  gpsStatus = !gpsStatus;
  if (gpsStatus) {
    document.querySelector(".mainPageDriver__funcBar__buttonGpsStatus").classList.add("open")
    //Đây là hàm demo, nên xóa đi
    // map.setView(userLocation, map.getZoom())
    // userMarker = L.marker([userLocation[0], userLocation[1]])
    //         .addTo(map)
    //         .bindPopup("Vị trí của bạn")
    //         .openPopup();
    // -------------------------------------------------------------
    getRealtimeLocation(() => {
      if (userMoveMap === false) {
        map.setView(userLocation, map.getZoom());
      }
    })

  } else {
    document.querySelector(".mainPageDriver__funcBar__buttonGpsStatus").classList.remove("open")
    removePickUpPoint()
    if (userMarker != null) {
      stopGetRealtimeLocation();
      removeLocationFromDatabase()
    }
  }
}

function sendLocation() {
  if (userLocation != false) {
    let location = new URLSearchParams()
    location.append("location", userLocation)

    location.append("driverAccess", localStorage.getItem("driverAccess"))
    fetch("/sendLocationDriver", {
      method: "POST",
      body: location,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
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

    if ((userLocation && userLocation[0] != location[0] && userLocation[1] != location[1]) || userLocation == false) {
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

    if (endPoint) removeShareLocation()
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

// Xem danh sách các giảng đường ---------------------------------------------------------------------------------------
let addedPolygons = []
let intervalLoop

document.querySelector(".mainPageDriver__funcBar__buttonBuilding").addEventListener("click", () => {
  if(gpsStatus) {
    document.querySelector(".listLectureHallConatainer").classList.add("open");
    getRequestOfHalls()
  } else {
    showAnnounce({
      status: "I",
      message: [`Vui lòng bật định vị`]
    }, 5)
  }
});

function getRequestOfHalls() {
  showLoading()
  let allID = []
  let listName = []
  allPickUpPoint.forEach(val => {
    allID.push(val.regionID)
    listName.push(val.nameBuilding)
  })

  let listID = new URLSearchParams()
  listID.append("listID", allID)
  listID.append("listName", listName)

  fetch("/getRequest", {
    method: "POST",
    body: listID,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }
  })
    .then(response => response.json())
    .then(async (res) => {
      closeLoading()
      await createLectureHallCard(res.allHall)

      document.querySelectorAll(".lectureHallCard__button").forEach(button => {
        button.addEventListener("click", (e) => {
          let regionID = new URLSearchParams()
          regionID.append("regionID", e.target.name)
          regionID.append("keyAccess", localStorage.getItem("driverAccess"))

          fetch("/receiveRequest", {
            method: "POST",
            body: regionID,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            }
          })
          .then(response => response.json())
          .then(res => {
            showLoading()
            endPoint = res.regionID
            showPickUpPoint(res.regionID)
            document.querySelector(".listLectureHallConatainer__backBtn").click()
            
            let polygon = addedPolygons[0]

            if (polygon.getBounds().contains(userLocation)) {              
              sendLocation()
              removePickUpPoint()
              showAnnounce({
                status: "I",
                message: [`Bạn đang ở điểm đón`]
              }, 5)

              removeLocationFromDatabase(true)
              endPoint = undefined

            } else {
              document.querySelector(".mainPageDriver__removeRequest__buttonBox").classList.add("open")

              showAnnounce({
                status: "S",
                message: [`Đã xác định được điểm đến`]
              }, 5)
              
              intervalLoop = setInterval(() => {
                console.log(intervalLoop)
                sendLocation()
              }, 5000)

              //Đây là hàm demo, nên xóa đi
              // setTimeout(() => { 
              //   demo()
              // }, 3000)
            }

            closeLoading()
          })
        })
      })
    })
}

function removeShareLocation() {
  if (endPoint) {
    showPickUpPoint(endPoint)
    let polygon = addedPolygons[0]
  
    if (polygon.getBounds().contains(userLocation)) {
        removeLocationFromDatabase()
      return
    }
  }
}

async function removeLocationFromDatabase (statusOption) {
  clearInterval(intervalLoop)
  let data = new URLSearchParams()
  data.append("keyAccess", localStorage.getItem("driverAccess"))
  data.append("regionID", endPoint)

  fetch("/removeShareLocation", {
    method: "POST",
    body: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(() => {
    console.log("Thu hồi việc nhận yêu cầu");
    removePickUpPoint()
    
    if (gpsStatus && statusOption === undefined && endPoint != undefined) {
      endPoint = undefined
      document.querySelector(".mainPageDriver__removeRequest__buttonBox").classList.remove("open")
      showAnnounce({
        status: "S",
        message: [`Đã đến điểm đón`]
      }, 5)      
    }
  })
}

function showPickUpPoint(inputEndPoint) {
  let getEnPoint = inputEndPoint;
  let targetRegion = allPickUpPoint.find(({ regionID }) => getEnPoint == regionID);
  
  if (targetRegion) {
    removePickUpPoint();

    let createPolygon = L.polygon(targetRegion.coordinates, { color: "blue" });
    createPolygon.addTo(map);
    addedPolygons.push(createPolygon);
  }
}

function removePickUpPoint() {
  if (addedPolygons.length === 1) {
    map.removeLayer(addedPolygons[0]);
  }

  addedPolygons = [];
}

// Danh sách yêu cầu
document.querySelector(".listLectureHallConatainer__backBtn").addEventListener("click", () => {
  document.querySelector(".listLectureHallConatainer").classList.remove("open");
  document.querySelector(".listLectureHallCard").innerHTML = ""
});

document.querySelector(".listLectureHallConatainer__refeshBtn").addEventListener("click", () => {
  document.querySelector(".listLectureHallCard").innerHTML = ""
  getRequestOfHalls()
})

// Tìm vị trí của bản thân --------------------------------------------------------------------------------------------------
document.querySelector(".mainPageDriver__funcBar__buttonMyLocation").addEventListener("click", getMyLocation);

// Thu hồi điểm đón mà tài xế đã chọn
document.querySelector(".mainPageDriver__removeRequest__buttonBox").addEventListener("click", async () => {
  showLoading()
  await removeLocationFromDatabase(true)
  document.querySelector(".mainPageDriver__removeRequest__buttonBox").classList.remove("open")
  closeLoading()
  
  showAnnounce({
    status: "S",
    message: [`Đã hủy nhận yêu cầu`]
  }, 5)

})

function getMyLocation() {
  if (userLocation) {
    map.setView(userLocation, map.getZoom());
  }
}



// import { demoMoving } from "./demoMovingDriver.js";
// let demoInterval

// function demo() {
//   demoMoving((allDriverLocation) => {
//     let count = 0
//     demoInterval = setInterval(() => {
//       if(count < allDriverLocation.length) {
//         if (userMarker && userMarker != null) map.removeLayer(userMarker)
//         let getCoordinate = allDriverLocation[count]
//         let lat = getCoordinate[0]
//         let lng = getCoordinate[1]
//         // console.log(`Ket qua: ${lat} va ${lng}`)
//         userLocation = [lat, lng]
        
//         userMarker = L.marker([lat, lng])
//             .addTo(map)
//             .bindPopup("Vị trí của bạn")
//             .openPopup();
//         sendLocation()

//         let polygon = addedPolygons[0]

//         if (polygon.getBounds().contains(userLocation)) {
//           removeLocationFromDatabase()
//         }
        
//       } else {
//         clearInterval(demoInterval)
//       }
//       count += 1
//     }, 3000)
//   })
// }

// Xử lý sự kiện khi người dùng chuyển trang khác hoặc đóng trang
window.addEventListener("beforeunload", () => {
  if (endPoint) removeLocationFromDatabase()
})

window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && endPoint) {
    removeLocationFromDatabase()
        
  } else if (document.visibilityState === "visible") {
    showAnnounce({
      status: "I",
      message: [`Các chức năng sẽ tắt khi bạn rời trang`]
    }, 3)
  }
})