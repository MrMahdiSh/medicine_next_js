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

  const [modalTitle, setModalTitle] = useState("");

  const [isModalPaginated, setIsModalPaginate] = useState(true);

  useEffect(() => {
    setRole(localStorage.getItem("user_role"));
    setTheUserDetail(JSON.parse(localStorage.getItem("user_details")));
    setUserToken(localStorage.getItem("token"));
    fetchDoctors();
    fetchPatients(localStorage.getItem("token"));
    fetchPharmacy(localStorage.getItem("token"));
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
    "گزارشات پزشکان": 1,
    "لیست داروخانه ها": 1,
    "لیست کاربران": 1,
    "لیست پرداختی ها": 1,
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
    "لیست داروخانه ها": ["نام داروخانه", "عملگر"],
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

  async function fetchPharmacy(token) {
    const getPharmacy = await fetchData("Admin/pharmacy", "GET", null, token);
    setPharmacy(getPharmacy["data"]);
  }

  async function fetchPatients(token) {
    const getPatient = await fetchData("Admin/patient", "GET", null, token);
    setPatients(getPatient["data"]);
  }

  async function doctorProfileClick(id) {
    setModalIsOpen(true);
    setModalTitle("پروفایل دکتر");
    const docy = await fetchData(
      "Admin/doctor_prescriptions",
      "GET",
      null,
      localStorage.getItem("token")
    );
    setModalRows(docy);
  }

  async function doctorHistoryClick(id, page = 1) {
    setModalIsOpen(true);
    setModalTitle("گزارشات دکتر");
    try {
      const docy = await fetchData(
        "Admin/doctor_prescriptions?doctor_id=" + id,
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
  };

  if (pageName != "صفحه اصلی") {
    return (
      <div className="w-full h-[10px] mb-[26rem] relative">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
          overlayClassName="fixed inset-0"
        >
          <div className="bg-white w-[85%] p-10 rounded-lg shadow-lg">
            <h1 className="text-right mb-5">{modalTitle}</h1>

            <Table
              paginated={isModalPaginated}
              columns={modalColumns[modalTitle]}
              rows={modalRows}
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
            <button
              onClick={() => optionClick("صفحه اصلی")}
              className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
            >
              بازگشت
            </button>

            {doctors && (
              <Table
                paginated={true}
                columns={columns[pageName]}
                changePage={(page) => {
                  if (page == 1) {
                    fetchDoctors(paginationInfo[pageName] + 1);
                    paginationInfo[pageName] += 1;
                  } else {
                    fetchDoctors(paginationInfo[pageName] - 1);
                    paginationInfo[pageName] -= 1;
                  }
                }}
                rows={
                  pageName == "لیست پزشکان"
                    ? doctors
                    : pageName == "لسیت داروخانه ها"
                    ? Pharmacy
                    : pageName == "لیست کاربران"
                    ? Patients
                    : pageName == "لیست پرداختی ها" ?? transactions
                }
              />
            )}
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
