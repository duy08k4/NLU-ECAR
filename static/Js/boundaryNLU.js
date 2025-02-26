let boundaryNLU = [
    [10.867973080413165, 106.7877949820595],
    [10.867920833931734, 106.79079085385638],
    [10.868651033716802, 106.79086471822643],
    [10.868709544844904, 106.79129215840112],
    [10.869868122497962, 106.79254884915792],
    [10.870352961342476, 106.79312804757456],
    [10.870569949697142, 106.79323589740505],
    [10.870588075837617, 106.79334776380148],
    [10.87050289234925, 106.79354807537692],
    [10.872343557908962, 106.79344506750851],
    [10.873547057756085, 106.79329165439691],
    [10.873740449747046, 106.79466799813196],
    [10.874336603900716, 106.79467806362294],
    [10.875024602612896, 106.79382771956557],
    [10.87719959749385, 106.78572017665533],
    [10.874539864724198, 106.78489843440843],
    [10.868127190765456, 106.78566381281371],
]

const defaultDistance = 30000

// Thuộc tính "flag" được dùng để xác định khoảng cách giữa người dùng đến điểm đón
// Nếu khoảng cách nằm trong phạm vi xxx mét thì sẽ hiển thị polygon của khu vực đó lên bản đồ
// Mục đích: tránh hiển thị những khu vực quá xa
// VD: Nếu người dùng đang ở Rạng Đông thì không nên hiển thị điểm đón là trạm xe buýt hay GD Hướng Dương
let allPickUpPoint = [
    {
        nameBuilding: "Rạng Đông",
        flag: [10.870591794158585, 106.79208688939843],
        regionID: "NLU_GD_rangdong",
        coordinates: [
            [10.870986067181974, 106.79142369963967],
            [10.870263626882803, 106.79143199183801],
            [10.870217272693466, 106.79145890653734],
            [10.870162575712143, 106.79150901742446],
            [10.870124803040895, 106.79156679595133],
            [10.87011830146703, 106.7916293518827],
            [10.870114992459676, 106.79187274551992],
            [10.870133728843044, 106.79195074155734],
            [10.870166812039571, 106.79199678541528],
            [10.870213369086585, 106.79202141665593],
            [10.870422096699627, 106.7920225911152],
            [10.870430695651052, 106.79252881811675],
            [10.870683938065454, 106.79277531341666],
            [10.87068314505791, 106.79301913839271],
            [10.87072574771075, 106.7930712149356],
            [10.87077464694211, 106.79308028949896],
            [10.870920399012988, 106.79307982201681],
            [10.870953591782794, 106.79304453935106],
            [10.870974806176648, 106.79299062433927],
            [10.870970536283323, 106.79269670362896],
            [10.870948436391373, 106.79264484545337],
            [10.870803913407073, 106.79250592782796],
            [10.870739990013078, 106.7924356337171],
            [10.870736946898177, 106.7921783202022],
            [10.870994546117501, 106.79218111042655],
        ]
    },
    {
        nameBuilding: "Phượng Vỹ",
        flag: [10.872001887505633, 106.792691007987],
        regionID: "NLU_GD_phuongvy",
        coordinates: [
            [10.87247762371861, 106.7922495228932],
            [10.87144217261519, 106.7922471506156],
            [10.871443779578016, 106.7931152980396],
            [10.872479392858892, 106.79309880281625],
        ]
    },
    {
        nameBuilding: "Cát Tường",
        flag: [10.87330431260358, 106.79199004256628],
        regionID: "NLU_GD_cattuong",
        coordinates: [
            [10.873420330465336, 106.79167036954709],
            [10.873174800729132, 106.79167692512885],
            [10.873179111495858, 106.79227130380218],
            [10.873429217884407, 106.79227502683011],
        ]
    },
    {
        nameBuilding: "Tường Vi",
        flag: [10.873633904806539, 106.79195675346222],
        regionID: "NLU_GD_tuongvi",
        coordinates: [
            [10.87376704286119, 106.79164415294161],
            [10.873457167556808, 106.79164534599039],
            [10.873474935390632, 106.79226368429374],
            [10.873504054447963, 106.79231361531038],
            [10.873774490452291, 106.79230981902765]
        ]
    },
    {
        nameBuilding: "Hướng Dương",
        flag: [10.873942448840978, 106.79198554040852],
        regionID: "NLU_GD_huongduong",
        coordinates: [
            [10.874096976552707, 106.79163604012967],
            [10.873789374442467, 106.79164407366369],
            [10.87381308223388, 106.79230590316047],
            [10.874099985968215, 106.79230528292925]
        ]
    },
    {
        nameBuilding: "Cẩm Tú",
        flag: [10.873463763074795, 106.79140436908006],
        regionID: "NLU_GD_camtu",
        coordinates: [
            [10.873768058192368, 106.79117348954219],
            [10.873466999855069, 106.79117078593003],
            [10.873169442011928, 106.79122215666206],
            [10.873142568205395, 106.79125644202907],
            [10.873035099032265, 106.79162529688114],
            [10.873770559227381, 106.79161430858233],
        ]
    },
    {
        nameBuilding: "Bến xe",
        flag: [10.868200948144363, 106.78746239512401],
        regionID: "NLU_BX_benxe",
        coordinates: [
            [10.867973818260594, 106.7877935892597],
            [10.868487975256969, 106.78782912822061],
            [10.868538779167906, 106.78709155560603],
            [10.867880710751677, 106.78705411296113],
            [10.867850621057741, 106.78769813728445],
        ]
    },
    {
        nameBuilding: "XCB thịt cá",
        flag: [10.873974639810697, 106.79138113329088],
        regionID: "NLU_XCB_thitca",
        coordinates: [
            [10.874135449220802, 106.79118375724028],
            [10.873778581221373, 106.79118199200605],
            [10.873785678091366, 106.79157808852881],
            [10.874136005126502, 106.79156251422216]
        ]
    },
    {
        nameBuilding: "Khoa MTTN",
        flag: [10.872101421475449, 106.78782855829036],
        regionID: "NLU_Khoa_MTTN",
        coordinates: [
            [10.872443967592119, 106.78754419673771],
            [10.871883822690677, 106.78744038530903],
            [10.871822751835083, 106.78755672096975],
            [10.871772955412538, 106.78773447495888],
            [10.871747143540247, 106.78790539877247],
            [10.871733988547703, 106.78813536347371],
            [10.872292025518377, 106.78825728647303]
        ]
    },
    {
        nameBuilding: "Hội quán NL",
        flag: [10.869926174412782, 106.78890099232211],
        regionID: "NLU_HQNL",
        coordinates: [
            [10.870144539047743, 106.78811117741691],
            [10.869660079147451, 106.78804121342858],
            [10.869678516827179, 106.78968155249095],
            [10.870155988156469, 106.78967430834871]
        ]
    },
    // {
    //     nameBuilding: "Demo",
    //     flag: [10.893710532483723, 106.59404161058711],
    //     regionID: "NLU_TP_demo",
    //     coordinates: [
    //         [10.894772022763519, 106.5933594638451],
    //         [10.89369037240509, 106.5925008617586],
    //         [10.89078635252747, 106.59345833522184],
    //         [10.890824505589336, 106.59548531814193],
    //         [10.894483796120781, 106.59556647575636]
    //     ]
    // },
    // {
    //     nameBuilding: "HQ",
    //     flag: [10.869826463768447, 106.78909145890003],
    //     regionID: "NLU_HQ_demo",
    //     coordinates: [
    //         [10.870138786052749, 106.78831084358103],
    //         [10.869583546210691, 106.78828514431206],
    //         [10.869570927111724, 106.78976285232221],
    //         [10.870164024202865, 106.7897500026886]
    //     ]
        
    // },
    // {
    //     nameBuilding: "TPHCM",
    //     flag: [10.794430732822804, 106.74647715706112],
    //     regionID: "TPHCM_demo",
    //     coordinates: [
    //         [10.89200078090903, 106.64270136826008],
    //         [10.740480083169487, 106.58586956788224],
    //         [10.621360670372638, 106.7680901910004],
    //         [10.75006888772468, 106.91011771146759],
    //         [10.917169580870265, 106.8153119956587]
    //     ]
    // }
]

// Bán kính Trái Đất tính bằng mét
// Hàm tính khoảng cách giữa 2 điểm, đầu vào là (vĩ độ, kinh độ)
function distance(point1, point2) {
    const R = 6378137;
    // Chuyển đổi từ độ sang radians
    const phi1 = point1[0] * Math.PI / 180;
    const phi2 = point2[0] * Math.PI / 180;
    const lambda1 = point1[1] * Math.PI / 180;
    const lambda2 = point2[1] * Math.PI / 180;

    // Công thức Haversine
    const a = Math.sin((phi2 - phi1) / 2) ** 2 +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin((lambda2 - lambda1) / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;  // Khoảng cách tính bằng mét
}

export { boundaryNLU, allPickUpPoint, distance, defaultDistance }