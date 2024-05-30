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

export default function Dashboard() {
  const [title, setTitle] = useState("صفحه اصلی");

  function handleOptionClick(name) {
    setTitle(name);
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
    },
    {
      name: "نام خانوادگی",
      type: "text",
      editable: true,
    },
    {
      name: "کدملی",
      type: "number",
      editable: true,
    },
    {
      name: "phone",
      type: "number",
      editable: false,
    },
  ],
  doctor: [
    {
      name: "نام",
      type: "text",
      editable: true,
    },
    {
      name: "نام خانوادگی",
      type: "text",
      editable: true,
    },
    {
      name: "کدملی",
      type: "number",
      editable: true,
    },
    {
      name: "نوع تخصص",
      type: "text",
      editable: true,
    },
    {
      name: "شماره مطب",
      type: "number",
      editable: true,
    },
    {
      name: "سوابق کاری",
      type: "text",
      editable: true,
    },
    {
      name: "سوابق کاری",
      type: "text",
      editable: true,
    },
    {
      name: "آدرس اینستاگرام",
      type: "text",
      editable: true,
    },
    {
      name: "phone",
      type: "number",
      editable: false,
    },
  ],
  pharmacy: {
    name: "نام",
    type: "text",
  },
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

  useEffect(() => {
    setRole(localStorage.getItem("user_role"));
    setTheUserDetail(JSON.parse(localStorage.getItem("user_details")));
    setUserToken(localStorage.getItem("token"));
  }, []);

  const [hoveredOption, setHoveredOption] = useState(null);

  const options = {
    doctor: [
      {
        name: "تاریخچه گزارشات",
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

  const columns = ["دکتر", "نسخه", "تاریخ", "داروخانه های تایید شده", "عملگر"];

  const rows = [
    {
      doctor_id: "دکتر جلالی",
      prescription: "1111",
      created_at: "2024-05-19T09:36:19.000000Z",
      accepted_count: 1,
      actions: (
        <button
          onClick={() => alert("info")}
          className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
        >
          نمایش جزئیات
        </button>
      ),
    },

    // Add more rows as needed
  ];

  async function IsUserAwailable() {
    setIsLoading(true);
    setPrescriptionSubmited(true);
    try {
      await fetchData(
        "doctor/patient_info?meli_code" + inputValues["meli_code"],
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

  function ResetPrescription() {
    optionClick("صفحه اصلی");
    setIsLoading(false);
    setPrescriptionSubmited(false);
    setUserAwailablity(false);
    setNewUserPhone(undefined);
    setPredcriptionDone(false);
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

  if (pageName == "تاریخچه گزارشات") {
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

            <Table columns={columns} rows={rows} />
          </div>
        </div>
      </div>
    );
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
                        editable={user.editable}
                        placeholder={user.name}
                        type={user.type}
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
                  <MainButton isLoading={false} text={"ثبت"} />
                </div>
              </div>
            </div>
            <div className="w-[30%] relative">
              <div className="bg-white h-[80vh] shadow-xl rounded-2xl">
                {/* user profile */}
                <div className="h-[200px] w-full flex justify-center items-center">
                  <div className="rounded-full bg-gray-500 w-40 h-40 flex items-center justify-center">
                    <FaUser color="white" size={"40%"} />
                  </div>
                </div>
                {/* name */}
                <div className="mt-10">
                  <h1 className="text-center">{theUserDetail.name}</h1>
                </div>
                {/* history activity */}
                <div className="mt-10">
                  <div className="w-full flex flex-row-reverse justify-around">
                    <h1>{"<"} تاریخچه فعالیت</h1>
                    <h1 className="text-orange-400">0</h1>
                  </div>
                </div>
              </div>
              {/* logout */}
              <div className="absolute bottom-10 w-full">
                <h1 className="cursor-pointer text-red-500 text-center">
                  خروج از حساب کاربری
                </h1>
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
