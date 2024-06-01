"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaUserFriends,
  FaClipboardList,
  FaUser,
  FaClinicMedical,
} from "react-icons/fa";
import MainInput from "@/components/input";
import MainButton from "@/components/MainButton";
import Table from "@/components/Table";
import ROOT from "@/utils/ROOT";
import { fetchData } from "@/utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CheckUserLog from "@/utils/auth";
import Modal from "react-modal";

export default function Dashboard() {
  const [title, setTitle] = useState("صفحه اصلی");

  function handleOptionClick(name) {
    setTitle(name);
  }

  const [userValid, setUserValid] = useState(undefined);

  const router = useRouter();

  async function checkUserLog() {
    try {
      const data = await fetchData(
        "User/me",
        "GET",
        null,
        localStorage.getItem("token")
      );

      localStorage.setItem("user_details", JSON.stringify(data));

      setUserValid(true);
    } catch (error) {
      setUserValid(false);
    }
  }

  useState(() => {
    checkUserLog();
  }, []);

  if (userValid == false) {
    router.push("/");
  }

  if (!userValid) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        لطفا صبر کنید
      </div>
    );
  }

  return (
    <div className="h-dvh">
      <Header title={title} />
      <div className="h-[440px] w-full relative">
        <div className="w-full h-full absolute flex flex-row justify-around items-center">
          <Content optionClick={handleOptionClick} pageName={title} />
        </div>
        <div className="w-full h-1/2 bg-[#A1BEE54F]"></div>
      </div>
    </div>
  );
}

function Header({ title }) {
  return (
    <div className="h-[200px] bg-white p-10 flex justify-end items-center">
      <div className="flex items-center gap-2">
        <h1>{title}</h1>
        <div style={{ width: "30px", height: "30px" }}>
          <Image
            src={`${ROOT}/dashboard/home.png`}
            alt="Home"
            width={30}
            height={30}
          />
        </div>
      </div>
    </div>
  );
}

const userInfo = {
  user: [
    {
      name: "نام",
      type: "text",
      editable: true,
      enName: "name",
    },
    {
      name: "نام خانوادگی",
      type: "text",
      editable: true,
      enName: "last_name",
    },
    {
      name: "کدملی",
      type: "number",
      editable: true,
      enName: "meli_code",
    },
    {
      name: "شماره",
      type: "number",
      editable: false,
      enName: "phone",
    },
  ],
  doctor: [
    {
      name: "نام",
      type: "text",
      editable: true,
      enName: "name",
    },
    {
      name: "نام خانوادگی",
      type: "text",
      editable: true,
      enName: "last_name",
    },
    {
      name: "کدملی",
      type: "number",
      editable: true,
      enName: "meli_code",
    },
    {
      name: "نوع تخصص",
      type: "text",
      editable: true,
      enName: "expertise",
    },
    {
      name: "آدرس اینستاگرام",
      type: "text",
      editable: true,
      enName: "instagram",
    },
    {
      name: "شماره تماس",
      type: "number",
      editable: false,
      enName: "phone",
    },
  ],
  pharmacy: [
    {
      name: "نام",
      type: "text",
      editable: true,
      enName: "name",
    },
    {
      name: "نام خانوادگی",
      type: "text",
      editable: true,
      enName: "last_name",
    },
    {
      name: "آدرس اینستاگرام",
      type: "text",
      editable: true,
      enName: "instagram",
    },
    {
      name: "آدرس",
      type: "text",
      editable: true,
      enName: "address",
    },
    {
      name: "کد مسئول فنی",
      type: "text",
      editable: true,
      enName: "technical_assistant_code",
    },
    {
      name: "جواز مطب",
      type: "text",
      editable: true,
      enName: "Office_license",
    },
    {
      name: "شماره تماس",
      type: "number",
      editable: false,
      enName: "phone",
    },
  ],
};

function Content({ optionClick, pageName }) {
  const [role, setRole] = useState(undefined);

  const [theUserDetail, setTheUserDetail] = useState(undefined);

  const [userToken, setUserToken] = useState(undefined);

  const [isLoading, setIsLoading] = useState(false);

  const [prescriptionSubmited, setPrescriptionSubmited] = useState(false);

  const [userAwailabality, setUserAwailablity] = useState(undefined);

  const [newUserPhone, setNewUserPhone] = useState(undefined);

  const [prescriptionDone, setPredcriptionDone] = useState(false);

  const [theCount, setTheCount] = useState(0);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  // user behavior
  const prescirptionDetails = [
    {
      name: "کدملی",
      type: "number",
      enName: "meli_code",
    },
    {
      name: "نسخه",
      type: "number",
      enName: "prescription",
    },
    {
      name: "دلیل مراجعه",
      type: "text",
      enName: "reason_for_referral",
    },
  ];

  const [inputValues, setInputValues] = useState(
    prescirptionDetails.reduce((acc, detail) => {
      acc[detail.enName] = "";
      return acc;
    }, {})
  );

  const router = useRouter();

  useEffect(() => {
    setRole(localStorage.getItem("user_role"));
    setTheUserDetail(JSON.parse(localStorage.getItem("user_details")));
    getUserBehavior();
    setUserToken(localStorage.getItem("token"));
    history_count();
  }, []);

  const [hoveredOption, setHoveredOption] = useState(null);

  const options = {
    doctor: [
      {
        name: "تاریخچه",
        icon: FaClipboardList,
      },
      {
        name: "ثبت نسخه",
        icon: FaClinicMedical,
      },
      {
        name: "اطلاعات شخصی",
        icon: FaUserFriends,
      },
    ],
    user: [
      {
        name: "نسخه ها",
        icon: FaClipboardList,
      },
      {
        name: "اطلاعات شخصی",
        icon: FaUserFriends,
      },
    ],
    pharmacy: [
      {
        name: "تاریخچه",
        icon: FaClipboardList,
      },
      {
        name: "ثبت نسخه",
        icon: FaClinicMedical,
      },
      {
        name: "اطلاعات شخصی",
        icon: FaUserFriends,
      },
    ],
  };

  const userRole = role === "admin" ? "user" : role;

  const [UserInfo, setUserInfo] = useState([]);

  const columns = {
    doctor: ["نسخه", "دلیل مراجعه", "تاریخ"],
    user: [
      "دکتر",
      "نسخه",
      "تاریخ",
      "دلیل مراجعه",
      "داروخانه های تایید شده",
      "عملگر",
    ],
    pharmacy: ["دکتر", "نسخه", "تاریخ", "داروخانه های تایید شده", "عملگر"],
  };

  const [rows, setRows] = useState([]);

  async function IsUserAwailable() {
    setIsLoading(true);
    setPrescriptionSubmited(true);
    try {
      await fetchData(
        "doctor/patient_info?meli_code=" + inputValues["meli_code"],
        "GET",
        null,
        userToken,
        true
      );
      WritePrescription();
      setUserAwailablity(true);
    } catch (e) {
      setIsLoading(false);
      setUserAwailablity(false);
    }
  }

  async function NewUserPhone() {
    try {
      await fetchData(
        "doctor/create_patient",
        "POST",
        {
          meli_code: inputValues["meli_code"],
          phone: newUserPhone,
        },
        userToken,
        true
      );
      WritePrescription();
    } catch (e) {
      setIsLoading(false);
      toast.error("مشکلی پیش آمده");
    }
  }

  async function WritePrescription() {
    try {
      await fetchData(
        "doctor/prescription",
        "POST",
        {
          meli_code: inputValues["meli_code"],
          prescription: inputValues["prescription"],
          reason_for_referral: inputValues["reason_for_referral"],
        },
        userToken
      );
      setPredcriptionDone(true);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(true);
      toast.error("مشکلی پیش آمده");
    }
  }

  const handleInputChange = (e, enName) => {
    setInputValues({
      ...inputValues,
      [enName]: e.target.value,
    });
  };

  const handleUserInfoUpdate = (e, enName) => {
    setUserInfo({
      ...UserInfo,
      [enName]: e.target.value,
    });
  };

  function ResetPrescription() {
    optionClick("صفحه اصلی");
    setIsLoading(false);
    setPrescriptionSubmited(false);
    setUserAwailablity(false);
    setNewUserPhone(undefined);
    setPredcriptionDone(false);
  }

  async function getUserBehavior() {
    const temperoryUserRole = localStorage.getItem("user_role");

    try {
      const userBehave = await fetchData(
        temperoryUserRole == "doctor"
          ? "doctor/history"
          : temperoryUserRole == "user"
          ? "patient/patient_prescriptions"
          : "",
        "GET",
        null,
        localStorage.getItem("token")
      );

      if (temperoryUserRole == "doctor") {
        var filteredData = userBehave["hist_details"].map((behave) => {
          return {
            prescription: behave.prescription,
            reason_for_referral: behave.reason_for_referral,
            created_at: behave.created_at,
          };
        });
      }

      if (temperoryUserRole == "user") {
        var filteredData = userBehave["prescriptions"].map((behave) => {
          return {
            doctor: behave.doctor,
            prescription: behave.prescription,
            created_at: behave.created_at,
            reason_for_referral: behave.reason_for_referral,
            submited: behave.accepted_count,
            action: (
              <button
                onClick={() => {
                  setModalIsOpen(true);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                داروخانه ها
              </button>
            ),
          };
        });
      }

      setRows(filteredData);
    } catch (e) {}
  }

  if (pageName == "ثبت نسخه") {
    if (prescriptionSubmited && !isLoading && prescriptionDone) {
      return (
        <>
          <div className="w-full h-[10px] mb-[26rem] relative">
            <div className="w-3/4 mx-auto ">
              <div className="container mx-auto py-4">
                <div className="w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
                  <button
                    onClick={() => ResetPrescription()}
                    className="bg-green-400 text-white py-2 px-4 rounded hover:bg-green-500 mb-10"
                  >
                    صفحه اصلی
                  </button>

                  <h1>با موفقیت ثبت شد</h1>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    if (prescriptionSubmited && !isLoading && !userAwailabality) {
      return (
        <>
          <div className="w-full h-[10px] mb-[26rem] relative">
            <div className="w-3/4 mx-auto ">
              <div className="container mx-auto py-4">
                <div className="w-full bg-white rounded-3xl shadow-2xl p-10 text-right">
                  <h1>لطفا شماره تماس بیمار را وارد کنید</h1>
                  <MainInput
                    type={"number"}
                    theOnChange={(e) => {
                      setNewUserPhone(e.target.value);
                    }}
                    placeholder={"شماره تماس"}
                  />
                  <MainButton
                    onclick={() => {
                      NewUserPhone();
                    }}
                    isLoading={isLoading}
                    text={"ثبت"}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    return (
      <div className="w-full h-[10px] mb-[26rem] relative">
        <div className="w-3/4 mx-auto ">
          <div className="container mx-auto py-4">
            <button
              onClick={() => optionClick("صفحه اصلی")}
              className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
            >
              بازگشت
            </button>

            <div className="w-full bg-white rounded-3xl shadow-2xl p-10">
              <div
                style={{ direction: "rtl" }}
                className="flex flex-wrap justify-between gap-10"
              >
                {prescirptionDetails.map((prescription, index) => {
                  return (
                    <div className="min-w-[45%] m-0" key={index}>
                      {
                        <MainInput
                          theOnChange={(e) =>
                            handleInputChange(e, prescription.enName)
                          }
                          isLoading={isLoading}
                          type={prescription.type}
                          placeholder={prescription.name}
                        />
                      }
                    </div>
                  );
                })}
              </div>
              {
                <div className="mt-5 flex flex-row-reverse">
                  <div>
                    <MainButton
                      onclick={() => {
                        IsUserAwailable();
                      }}
                      isLoading={isLoading}
                      text={"ثبت"}
                    />
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageName == "تاریخچه") {
    return (
      <div className="w-full h-[10px] mb-[26rem] relative">
        <div className="w-3/4 mx-auto ">
          <div className="container mx-auto py-4">
            <button
              onClick={() => optionClick("صفحه اصلی")}
              className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
            >
              بازگشت
            </button>

            {rows && userRole && (
              <Table columns={columns[userRole]} rows={rows} />
            )}
          </div>
        </div>
      </div>
    );
  }

  const presDetailsCol = ["آدرس", "عملگر"];

  // const rows = ["آدرس","عملگر"];

  if (pageName == "نسخه ها") {
    return (
      <div className="w-full h-[10px] mb-[26rem] relative">
        <div className="w-3/4 mx-auto ">
          <div className="container mx-auto py-4">
            <button
              onClick={() => optionClick("صفحه اصلی")}
              className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
            >
              بازگشت
            </button>

            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
              overlayClassName="fixed inset-0"
            >
              <div className="bg-white w-[85%] p-10 rounded-lg shadow-lg">
                <h1 className="text-right mb-5">لیست داروخانه ها</h1>
                <Table
                  columns={presDetailsCol}
                  rows={[{ name: "fsd", s: "sd" }]}
                />
                <button
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  onClick={() => setModalIsOpen(false)}
                >
                  خروج
                </button>
              </div>
            </Modal>

            {rows && userRole && (
              <Table columns={columns[userRole]} rows={rows} />
            )}
          </div>
        </div>
      </div>
    );
  }

  function LogOut() {
    router.push("/");
  }

  async function UpdateUserInfo() {
    try {
      await fetchData("user/update", "PUT", UserInfo, userToken, true);
      const newData = await CheckUserLog();
      setTheUserDetail(newData);
      localStorage.setItem("user_details", JSON.stringify(newData));
      toast.success("با موفقیت انجام شد");
      optionClick("صفحه اصلی");
    } catch (e) {
      toast.error("مشکلی پیش آمده");
    }
  }

  const historyURL = {
    user: "patient/patientHistory",
    doctor: "",
    pharmacy: "",
  };

  async function history_count() {
    const temperoryUserRole = localStorage.getItem("user_role");
    try {
      const docy = await fetchData(
        temperoryUserRole == "doctor"
          ? "doctor/history"
          : temperoryUserRole == "user"
          ? "patient/patientHistory"
          : "",
        "GET",
        null,
        localStorage.getItem("token")
      );
      temperoryUserRole == "doctor"
        ? setTheCount(docy["doctor_history"])
        : setTheCount(docy["user_history"]);
    } catch (error) {}
  }

  if (pageName == "اطلاعات شخصی") {
    return (
      <div className="w-full h-[10px] mb-40 relative">
        <div className="w-3/4 mx-auto ">
          <div className="w-full flex flex-row gap-10 justify-around">
            <div className="w-[70%]">
              <div className="bg-white shadow-xl rounded-2xl p-16">
                {userInfo[userRole].map((user, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full flex flex-col gap-5 mt-5"
                    >
                      <h1 className="text-right">:{user.name}</h1>
                      <MainInput
                        theOnChange={(e) => {
                          handleUserInfoUpdate(e, user.enName);
                        }}
                        editable={user.editable}
                        placeholder={user.name}
                        type={user.type}
                        val={theUserDetail[user.enName] ?? ""}
                      />
                    </div>
                  );
                })}
                <div className="flex justify-around gap-5">
                  <MainButton
                    color={"#ef4444"}
                    isLoading={false}
                    text={"لغو"}
                    onclick={() => {
                      optionClick("صفحه اصلی");
                    }}
                  />
                  <MainButton
                    onclick={() => {
                      UpdateUserInfo();
                    }}
                    isLoading={false}
                    text={"ثبت"}
                  />
                </div>
              </div>
            </div>
            <div className="w-[30%]">
              <div className="bg-white h-[80vh] shadow-xl rounded-2xl relative">
                {/* user profile */}
                <div className="h-[200px] w-full flex justify-center items-center">
                  <div className="rounded-full bg-gray-500 w-40 h-40 flex items-center justify-center">
                    <FaUser color="white" size={"40%"} />
                  </div>
                </div>
                {/* name */}
                <div className="mt-10">
                  <h1 className="text-center">
                    {theUserDetail.name + " " + theUserDetail.last_name}
                  </h1>
                </div>
                {/* history activity */}
                <div className="mt-10">
                  <div className="w-full flex flex-row-reverse justify-around">
                    <h1>{"<"} تاریخچه فعالیت</h1>
                    <h1 className="text-orange-400">{theCount}</h1>
                  </div>
                </div>
                {/* logout */}
                <div onClick={LogOut} className="absolute bottom-10 w-full">
                  <h1 className="cursor-pointer text-red-500 text-center">
                    خروج از حساب کاربری
                  </h1>
                </div>
              </div>
            </div>
          </div>
          {/* extra space */}
          <div className="w-full h-[100px]"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {userRole != undefined &&
        options[userRole].map((option, index) => {
          const isHovered = hoveredOption === option.name;
          const innerShadowStyle = isHovered
            ? { boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.2)" }
            : {};

          return (
            <div
              className="option-container"
              key={index}
              onMouseEnter={() => setHoveredOption(option.name)}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={() => {
                optionClick(option.name);
              }}
            >
              <div
                className={`w-[354.33px] h-[354.33px] bg-white rounded-3xl cursor-pointer overflow-hidden shadow-2xl ${
                  isHovered ? "shadow-none" : ""
                }`}
                style={innerShadowStyle}
              >
                <div className="h-[70%] flex justify-center items-center">
                  <option.icon
                    size={100}
                    style={{ color: isHovered ? "#EE8D20" : "" }}
                  />
                </div>
                <div className="h-[30%] flex justify-center items-center">
                  <h1 style={{ color: isHovered ? "#EE8D20" : "" }}>
                    {option.name}
                  </h1>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
}
