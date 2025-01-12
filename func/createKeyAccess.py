import datetime
from func.De_EnCode import EnCode

# Giá trị của key sau khi giải mã:  xxxxxxxx@st.hcmuaf.edu.vn&2024-10-23 23:48:49.410635
# xxxxxxxx là mã số sinh viên
#Key bị vô hiệu hóa khi người dùng thoát trang 
def CreateKeyAccess (gmail) :
    dataOfKey = f"{gmail}&{str(datetime.datetime.now())}"
    return EnCode(dataOfKey)