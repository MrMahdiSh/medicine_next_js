"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaRegUser,
  FaBookMedical,
  FaSyringe,
  FaDollarSign,
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
        <div className="w-full h-full absolute flex flex-col gap-20 mt-20 lg:gap-0 lg:mt-0 lg:flex-row justify-around items-center">
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

function Content({ optionClick, pageName }) {
  const [role, setRole] = useState(undefined);

  const [theUserDetail, setTheUserDetail] = useState(undefined);

  const [userToken, setUserToken] = useState(undefined);

  const [pharmacyPresList, setPharmacyPresList] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [NewmodalIsOpen, setNewModalIsOpen] = useState(false);

  const [NewmodalTitle, setNewModalTitle] = useState(false);

  const [modalTitle, setModalTitle] = useState("");

  const [isModalPaginated, setIsModalPaginate] = useState(true);

  const [latestID, setLatestID] = useState(undefined);

  const [allDoctors, setAllDoctors] = useState([]);

  const [userDetails, setUserDetails] = useState([]);

  const handleUserInfoUpdate = (e, enName) => {
    setUserDetails({
      ...userDetails,
      [enName]: e.target.value,
    });
  };

  useEffect(() => {
    setRole(localStorage.getItem("user_role"));
    setTheUserDetail(JSON.parse(localStorage.getItem("user_details")));
    setUserToken(localStorage.getItem("token"));
    fetchDoctors();
    fetchPatients(localStorage.getItem("token"));
    fetchPharmacy();
  }, []);

  const [hoveredOption, setHoveredOption] = useState(null);

  const options = [
    {
      name: "لیست پرداختی ها",
      icon: FaDollarSign,
    },
    {
      name: "لیست کاربران",
      icon: FaRegUser,
    },
    {
      name: "لیست داروخانه ها",
      icon: FaBookMedical,
    },
    {
      name: "لیست پزشکان",
      icon: FaSyringe,
    },
  ];

  const userRole = role === "admin" ? "user" : role;

  const [rows, setRows] = useState([]);

  const [doctors, setDoctors] = useState([]);

  const [Pharmacy, setPharmacy] = useState([]);

  const [Patients, setPatients] = useState([]);

  const [transactions, setTransactions] = useState([]);

  const [paginationInfo, setPaginationInfo] = useState({
    "لیست پزشکان": 1,
    "گزارشات دکتر": 1,
    "لیست داروخانه ها": 1,
    "لیست کاربران": 1,
    "لیست پرداختی ها": 1,
    "پروفایل داروخانه": 1,
    "گزارشات داروخانه": 1,
  });

  const columns = {
    "لیست پرداختی ها": [
      "نام کاربر",
      "نام خانوادگی کاربر",
      "مقدار",
      "نام داروخانه",
      "نام پزشک",
    ],
    "لیست کاربران": ["نام", "نام خانوادگی", "عملگر"],
    "لیست داروخانه ها": ["نام داروخانه", "آدرس", "عملگر"],
    "لیست پزشکان": ["نام", "نام خانوادگی", "تخصص", "عملگر"],
  };

  const [modalRows, setModalRows] = useState([]);

  async function fetchDoctors(page = 1) {
    const getDoctors = await fetchData(
      "Admin/doctors?page=" + page,
      "GET",
      null,
      localStorage.getItem("token")
    );

    setAllDoctors(getDoctors["data"]);

    const doctorFilter = getDoctors["data"].map((doctor) => {
      return {
        name: doctor.user.name,
        last_name: doctor.user.last_name,
        expert: doctor.expertise,
        action: (
          <div>
            <button
              onClick={() => {
                doctorProfileClick(doctor.user_id);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              پروفایل
            </button>
            <button
              onClick={() => {
                doctorHistoryClick(doctor.user_id);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5"
            >
              گزارشات
            </button>
          </div>
        ),
      };
    });

    setDoctors({
      data: doctorFilter,
      current_page: getDoctors["current_page"],
      total: getDoctors["last_page"],
    });
  }

  async function pharmacyProfileClick(id) {
    setModalIsOpen(true);
    setModalTitle("پروفایل داروخانه");
    try {
      const docy = await fetchData(
        "Admin/get_pharmacy?pharmacy_id=" + id,
        "GET",
        null,
        localStorage.getItem("token")
      );

      setIsModalPaginate(false);

      const docyFilter = {
        name: docy.name,
        docName: docy.user.name,
        docLastName: docy.user.last_name,
        meli_code: docy.user.meli_code,
        technical_assistant_code: docy.technical_assistant_code,
        phone: docy.user.phone,
        Office_license: docy.Office_license,
        created_at: docy.created_at,
      };

      setModalRows([docyFilter]);
    } catch (error) {}
  }

  async function pharmacyHistoryClick(id, page = 1) {
    console.log(id);
    setModalIsOpen(true);
    setLatestID(id);
    setModalTitle("گزارشات داروخانه");
    setIsModalPaginate(true);
    try {
      const docy = await fetchData(
        "Admin/pharmacy_prescriptions?pharmacy_user_id=" + id + "&page=" + page,
        "GET",
        null,
        localStorage.getItem("token")
      );
      const filter = docy["data"].map((theFIlter) => {
        console.log(theFIlter.prescription.doctor_details);
        return {
          patient_name:
            theFIlter.prescription.user.name +
            " " +
            theFIlter.prescription.user.last_name,
          doctor_name:
            theFIlter.prescription.doctor_details.name +
            " " +
            theFIlter.prescription.doctor_details.last_name,
          prescription: theFIlter.prescription.prescription,
          reason_for_referral: theFIlter.prescription.reason_for_referral,
          status:
            theFIlter.status === "pending"
              ? "در انتظار"
              : theFIlter.status === "accepted"
              ? "تایید شده"
              : theFIlter.status,
          created_at: theFIlter.created_at,
        };
      });
      setIsModalPaginate(true);
      setModalRows({
        data: filter,
        current_page: docy["current_page"],
        total: docy["last_page"],
      });
    } catch (error) {}
  }

  async function fetchPharmacy(page = 1) {
    const getPharmacy = await fetchData(
      "Admin/pharmacy?page=" + page,
      "GET",
      null,
      localStorage.getItem("token")
    );

    const filter = getPharmacy["data"].map((pharm) => {
      return {
        name: pharm["name"],
        address: pharm["address"],
        action: (
          <div>
            <button
              onClick={() => {
                pharmacyProfileClick(pharm.id);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              پروفایل
            </button>
            <button
              onClick={() => {
                pharmacyHistoryClick(pharm.id, paginationInfo[modalTitle]);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5"
            >
              گزارشات
            </button>
          </div>
        ),
      };
    });

    setPharmacy({
      data: filter,
      current_page: getPharmacy["current_page"],
      total: getPharmacy["last_page"],
    });
  }

  async function fetchPatients(token) {
    const getPatient = await fetchData("Admin/patient", "GET", null, token);
    setPatients(getPatient["data"]);
  }

  async function doctorProfileClick(id) {
    setModalIsOpen(true);
    setModalTitle("پروفایل دکتر");
    try {
      const docy = await fetchData(
        "Admin/get_doctor?doctor_id=" + id,
        "GET",
        null,
        localStorage.getItem("token")
      );

      setIsModalPaginate(false);

      const docyFilter = {
        name: docy.user.name,
        last_name: docy.user.last_name,
        meli_code: docy.user.meli_code,
        instagram: docy.instagram,
        phone: docy.user.phone,
        created_at: docy.created_at,
      };

      setModalRows([docyFilter]);
    } catch (error) {}
  }

  async function doctorHistoryClick(id, page = 1) {
    setModalIsOpen(true);
    setLatestID(id);
    setModalTitle("گزارشات دکتر");
    try {
      const docy = await fetchData(
        "Admin/doctor_prescriptions?doctor_id=" + id + "&page=" + page,
        "GET",
        null,
        localStorage.getItem("token")
      );
      const doctorFilter = docy["data"].map((doctor) => {
        return {
          name: doctor.prescription,
          reason_for_referral: doctor.reason_for_referral,
        };
      });
      setIsModalPaginate(true);
      setModalRows({
        data: doctorFilter,
        current_page: docy["current_page"],
        total: docy["last_page"],
      });
    } catch (error) {}
  }

  const modalColumns = {
    "پروفایل دکتر": [
      "نام",
      "نام خانوادگی",
      "کدملی",
      "اینستاگرام",
      "شماره",
      "تاریخ عضویت",
    ],
    "گزارشات دکتر": ["نسخه", "دلیل مراجعه"],
    "پروفایل داروخانه": [
      "نام داروخانه",
      "نام پزشک داروساز",
      "نام خانوادگی پزشک داروساز",
      "کدملی پزشک داروساز",
      "کد مسئول فنی",
      "شماره",
      "شماره جواز",
      "تاریخ عضویت",
    ],
    "گزارشات داروخانه": [
      "نام بیمار",
      "نام دکتر",
      "نسخه",
      "دلیل مراجعه",
      "وضعیت",
      "تاریخ",
    ],
  };

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

  function createNewFunc(name) {
    setNewModalIsOpen(true);
    switch (name) {
      case "لیست پزشکان":
        setNewModalTitle("پزشک جدید");
        break;
      case "لیست داروخانه ها":
        setNewModalTitle("داروخانه جدید");

        break;
      case "لیست کاربران":
        setNewModalTitle("کاربر جدید");

        break;

      default:
        break;
    }
  }

  function getUserRoleByNewUserPageName(newUserPageName) {
    switch (newUserPageName) {
      case "پزشک جدید":
        return "doctor";

      case "داروخانه جدید":
        return "pharmacy";

      case "کاربر جدید":
        return "user";

      default:
        break;
    }
  }

  async function submitNewUser() {
    try {
      const role = getUserRoleByNewUserPageName(NewmodalTitle);

      userDetails["role"] = role;

      userDetails["status"] = "active";

      await fetchData(
        "Admin/users",
        "POST",
        userDetails,
        localStorage.getItem("token"),
        true
      );
      toast.success("با موفقیت انجام شد");
      setModalIsOpen(false);
      setNewModalIsOpen(false);
    } catch (e) {
      toast.error("مشکلی پیش آمده لطفا بعدا تلاش کنید");
    }
  }

  if (pageName != "صفحه اصلی") {
    return (
      <div className="w-full h-[10px] mb-[26rem] relative">
        <Modal
          isOpen={NewmodalIsOpen}
          onRequestClose={() => setNewModalIsOpen(false)}
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
          overlayClassName="fixed inset-0"
        >
          <div className="bg-white w-[85%] max-h-[80%] p-10 rounded-lg shadow-lg overflow-y-auto">
            <h1 className="text-right mb-5">{NewmodalTitle}</h1>

            {/* new modal data */}
            {NewmodalIsOpen &&
              userInfo[getUserRoleByNewUserPageName(NewmodalTitle)].map(
                (user, index) => {
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
                        editable={true}
                        placeholder={user.name}
                        type={user.type}
                      />
                    </div>
                  );
                }
              )}

            <div className="w-full flex flex-col items-end">
              <button
                className="mt-4 bg-green-500 hover:bg-green-600 w-[200px] text-white py-2 px-4 rounded"
                onClick={submitNewUser}
              >
                ثبت
              </button>
            </div>

            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              onClick={() => setNewModalIsOpen(false)}
            >
              خروج
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
          overlayClassName="fixed inset-0"
        >
          <div className="bg-white w-[85%] max-h-[80%] p-10 rounded-lg shadow-lg overflow-y-auto">
            <h1 className="text-right mb-5">{modalTitle}</h1>

            <Table
              paginated={isModalPaginated}
              columns={modalColumns[modalTitle]}
              rows={modalRows}
              changePage={(e) => {
                paginationInfo[modalTitle] += e;
                if (modalTitle == "گزارشات دکتر") {
                  doctorHistoryClick(latestID, paginationInfo[modalTitle]);
                }

                if (modalTitle == "گزارشات داروخانه") {
                  pharmacyHistoryClick(latestID, paginationInfo[modalTitle]);
                }

                // if (modalTitle == "گزارشات داروخانه") {
                //   pharmacyHistoryClick(latestID, paginationInfo[modalTitle]);
                // }
              }}
            />
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              onClick={() => setModalIsOpen(false)}
            >
              خروج
            </button>
          </div>
        </Modal>
        <div className="w-3/4 mx-auto ">
          <div className="container mx-auto py-4">
            <div className="flex gap-5">
              <button
                onClick={() => optionClick("صفحه اصلی")}
                className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
              >
                بازگشت
              </button>

              {pageName != "لیست پرداختی ها" && (
                <button
                  onClick={() => createNewFunc(pageName)}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 mb-10"
                >
                  جدید
                </button>
              )}
            </div>
            {
              <Table
                paginated={true}
                columns={columns[pageName]}
                changePage={(page) => {
                  if (page == 1) {
                    if (pageName == "لیست پزشکان") {
                      fetchDoctors(paginationInfo[pageName] + 1);
                    }
                    if (pageName == "لیست داروخانه ها") {
                      fetchPharmacy(paginationInfo[pageName] + 1);
                    }
                    paginationInfo[pageName] += 1;
                  } else {
                    if (pageName == "لیست پزشکان") {
                      fetchDoctors(paginationInfo[pageName] - 1);
                    }
                    if (pageName == "لیست داروخانه ها") {
                      fetchPharmacy(paginationInfo[pageName] - 1);
                    }
                    paginationInfo[pageName] -= 1;
                  }
                }}
                rows={
                  pageName == "لیست پزشکان"
                    ? doctors
                    : pageName == "لیست داروخانه ها"
                    ? Pharmacy
                    : pageName == "لیست کاربران"
                    ? Patients
                    : pageName == "لیست پرداختی ها" ?? transactions
                }
              />
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {userRole != undefined &&
        options.map((option, index) => {
          const isHovered = hoveredOption === option.name;
          const innerShadowStyle = isHovered
            ? { boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.2)" }
            : {};

          return (
            <div
              className="option-container lg:w-[20%] w-[354.33px]"
              key={index}
              onMouseEnter={() => setHoveredOption(option.name)}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={() => {
                optionClick(option.name);
              }}
            >
              <div
                className={` h-[354.33px] bg-white rounded-3xl cursor-pointer overflow-hidden shadow-2xl ${
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
