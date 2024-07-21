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

      if (data.role[0] == "admin") {
        setUserValid(true);
      } else {
        setUserValid(false);
      }
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
      <Header
        title={title}
        changePage={() => {
          router.push("/admin");
          setTitle("صفحه اصلی");
        }}
      />

      <div className="h-[440px] w-full relative">
        <h1 className="text-center text-2xl absolute w-full font-bold mt-16">
          {title == "صفحه اصلی" ? "" : title}
        </h1>

        <div className="w-full h-full absolute flex flex-wrap gap-20 mt-20 justify-around items-center">
          <Content optionClick={handleOptionClick} pageName={title} />
        </div>
        <div className="w-full h-1/2 bg-[#A1BEE54F]"></div>
      </div>
    </div>
  );
}

function Header({ title, changePage }) {
  return (
    <div className="h-[200px] bg-white p-10 mr-10 flex justify-end items-center">
      <div className="flex items-center gap-2">
        <h1 onClick={changePage} className="hover:text-blue-700 cursor-pointer">
          صفحه اصلی
        </h1>
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

  const [allDoctors, setAllPatient] = useState([]);

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
    fetchPatients();
    fetchTransactions();
    fetchPharmacy();
  }, []);

  const [hoveredOption, setHoveredOption] = useState(null);

  const options = [
    {
      name: "لیست داروخانه ها",
      imageUrl: "pharmacy.png",
      imageUrlHover: "pharmacyHover.png",
    },
    {
      name: "لیست پزشکان",
      imageUrl: "doctorGroup.png",
      imageUrlHover: "doctorGroupHover.png",
    },

    {
      name: "لیست پرداختی ها",
      imageUrl: "cash.png",
      imageUrlHover: "cashHover.png",
    },
    {
      name: "لیست کاربران",
      imageUrl: "user.png",
      imageUrlHover: "userHover.png",
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
    "گزارشات کاربر": 1,
  });

  const columns = {
    "لیست پرداختی ها": [
      "نام داروخانه",
      "نام کاربر",
      "نحوه دریافت دارو",
      "مقدار پرداختی داروخانه",
      "مقدار پرداختی پیک",
      "مقدار پرداختی کل",
    ],
    "لیست کاربران": ["نام", "نام خانوادگی", " "],
    "لیست داروخانه ها": ["نام داروخانه", "آدرس", " "],
    "لیست پزشکان": ["نام پزشک", "تخصص", " "],
  };

  const [modalRows, setModalRows] = useState([]);

  async function fetchDoctors(page = 1) {
    const getDoctors = await fetchData(
      "Admin/doctors?page=" + page,
      "GET",
      null,
      localStorage.getItem("token")
    );

    setAllPatient(getDoctors["data"]);

    const doctorFilter = getDoctors["data"].map((doctor) => {
      return {
        name: doctor.user.name + "" + doctor.user.last_name,
        expert: doctor.expertise,
        action: (
          <div className="flex flex-col space-y-2 w-[160px] mx-auto">
            <button
              onClick={() => {
                doctorProfileClick(doctor.id);
              }}
              className="border border-[#EE8D20] text-[#EE8D20] font-bold py-2 px-4 rounded-lg"
            >
              پروفایل
            </button>
            <button
              onClick={() => {
                doctorHistoryClick(doctor.user_id);
              }}
              className="border border-[#EE8D20] text-[#EE8D20] font-bold py-2 px-4 rounded-lg"
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

  async function fetchTransactions(page = 1) {
    const getTransActions = await fetchData(
      "Admin/transactions?page=" + page,
      "GET",
      null,
      localStorage.getItem("token")
    );

    const transactionsFilter = getTransActions["data"].map((transaction) => {
      return {
        pharmacyName: transaction.pharmacy.name,
        patient_name: transaction.user.name + " " + transaction.user.last_name,
        type: (
          <span className="flex flex-row justify-center gap-2">
            {transaction.accepted_pres.type === "حضوری" ? (
              <Image
                width={25}
                height={25}
                alt="icon"
                src={"../dashboard/card.png"}
              />
            ) : (
              <Image
                width={25}
                height={25}
                alt="icon"
                src={"../dashboard/uber.png"}
              />
            )}
            {transaction.accepted_pres.type}
          </span>
        ),
        medicinePrice: (
          <p className="text-[#636363]">
            {parseInt(transaction.value) -
              parseInt(transaction.transportation_cost)}
            <span className="text-[#636363]">تومان</span>
          </p>
        ),
        transportationCost: (
          <p className="text-[#636363]">
            {transaction.transportation_cost}
            <span className="text-[#636363]">تومان</span>
          </p>
        ),
        totalPrice: (
          <p className="text-[#EE8D20]">
            {transaction.value}
            <span className="text-[#636363]">تومان</span>
          </p>
        ),
      };
    });

    setTransactions({
      data: transactionsFilter,
      current_page: getTransActions["current_page"],
      total: getTransActions["last_page"],
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
        return {
          patient_name:
            theFIlter.prescription.user.name +
            " " +
            theFIlter.prescription.user.last_name,
          created_at: theFIlter.prescription.created_at,
          type: (
            <span className="flex flex-row justify-center gap-2">
              {theFIlter.type === "حضوری" ? (
                <Image
                  width={25}
                  height={25}
                  alt="icon"
                  src={"../dashboard/card.png"}
                />
              ) : (
                <Image
                  width={25}
                  height={25}
                  alt="icon"
                  src={"../dashboard/uber.png"}
                />
              )}
              {theFIlter.type}
            </span>
          ),
          prescription: theFIlter.prescription.prescription,
          medicinePrice: (
            <p className="text-[#636363]">
              {theFIlter.type == "حضوری"
                ? theFIlter.transaction.value
                : parseFloat(theFIlter.transaction.value) -
                  parseFloat(theFIlter.transaction.transportation_cost)}
              <span className="text-[#636363]">تومان</span>
            </p>
          ),
          transactionsPrice: (
            <p className="text-[#636363]">
              {theFIlter.type == "حضوری"
                ? "0"
                : theFIlter.transaction.transportation_cost}
              <span className="text-[#636363]">تومان</span>
            </p>
          ),
          price: (
            <p className="text-[#EE8D20]">
              {theFIlter.transaction.value}{" "}
              <span className="text-[#636363]">تومان</span>
            </p>
          ),
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
          <div className="flex flex-col space-y-2 w-[160px] mx-auto">
            <button
              onClick={() => {
                pharmacyProfileClick(pharm.id);
              }}
              className="border border-[#EE8D20] text-[#EE8D20] font-bold py-2 px-4 rounded-lg"
            >
              پروفایل
            </button>
            <button
              onClick={() => {
                pharmacyHistoryClick(pharm.user_id, paginationInfo[modalTitle]);
              }}
              className="border border-[#EE8D20] text-[#EE8D20] font-bold py-2 px-4 rounded-lg"
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

  async function userProfileClick(id) {
    setModalIsOpen(true);
    setModalTitle("پروفایل کاربر");
    try {
      const docy = await fetchData(
        "Admin/get_patient?patient_id=" + id,
        "GET",
        null,
        localStorage.getItem("token")
      );

      setIsModalPaginate(false);

      const patientFilter = {
        name: docy.user.name,
        last_name: docy.user.last_name,
        phone: docy.user.phone,
        meli_code: docy.user.meli_code,
        created_at: docy.created_at,
      };

      setModalRows([patientFilter]);
    } catch (error) {}
  }

  async function userHistoryClick(id, page = 1) {
    setModalIsOpen(true);
    setLatestID(id);
    setModalTitle("گزارشات کاربر");
    try {
      const docy = await fetchData(
        "Admin/patient_prescriptions?patient_id=" + id + "&page=" + page,
        "GET",
        null,
        localStorage.getItem("token")
      );
      const patientPresListFilter = docy["data"].map((patientPres) => {
        return {
          patient_name:
            patientPres.prescription.user.name +
            " " +
            patientPres.prescription.user.last_name,
          created_at: patientPres.prescription.created_at,
          type: (
            <span className="flex flex-row justify-center gap-2">
              {patientPres.type === "حضوری" ? (
                <Image
                  width={25}
                  height={25}
                  alt="icon"
                  src={"../dashboard/card.png"}
                />
              ) : (
                <Image
                  width={25}
                  height={25}
                  alt="icon"
                  src={"../dashboard/uber.png"}
                />
              )}
              {patientPres.type}
            </span>
          ),
          prescription: patientPres.prescription.prescription,
          price: (
            <p className="text-[#EE8D20]">
              {patientPres.transaction.value}{" "}
              <span className="text-[#636363]">تومان</span>
            </p>
          ),
        };
      });
      setIsModalPaginate(true);
      setModalRows({
        data: patientPresListFilter,
        current_page: docy["current_page"],
        total: docy["last_page"],
      });
    } catch (error) {}
  }

  async function fetchPatients(page = 1) {
    const getPatient = await fetchData(
      "Admin/patient?page=" + page,
      "GET",
      null,
      localStorage.getItem("token")
    );

    const patientFilters = getPatient["data"].map((theUser) => {
      return {
        name: theUser.user.name,
        last_name: theUser.user.last_name,
        action: (
          <div className="flex flex-col space-y-2 w-[160px] mx-auto">
            <button
              onClick={() => {
                userProfileClick(theUser.user_id);
              }}
              className="border border-[#EE8D20] text-[#EE8D20] font-bold py-2 px-4 rounded-lg"
            >
              پروفایل
            </button>
            <button
              onClick={() => {
                userHistoryClick(theUser.user_id);
              }}
              className="border border-[#EE8D20] text-[#EE8D20] font-bold py-2 px-4 rounded-lg"
            >
              گزارشات
            </button>
          </div>
        ),
      };
    });

    setPatients({
      data: patientFilters,
      current_page: getPatient["current_page"],
      total: getPatient["last_page"],
    });
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
        expertise: docy.expertise,
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
          name: doctor.user.name + " " + doctor.user.last_name,
          created_at: doctor.created_at,
          prescription: doctor.prescription,
          type: doctor.Insurance,
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
      "تخصص",
      "تاریخ عضویت",
    ],
    "گزارشات دکتر": ["نام کاربری بیمار", "تاریخ مراجعه", "کد نسخه", "نوع بیمه"],
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
      "نام کاربر",
      "تاریخ مراجعه",
      "نحوه دریافت",
      "کدنسخه",
      "هزینه دارو",
      "هزینه پیک",
      "مقدار پرداختی کل",
    ],
    "پروفایل کاربر": ["نام", "نام خانوادگی", "شماره", "کدملی", "تاریخ عضویت"],
    "گزارشات کاربر": ["نام دکتر", "نسخه", "نحوه دریافت دارو", "وضعیت", "تاریخ"],
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

      if (role == "pharmacy") {
        userDetails["pharmacy_name"] = userDetails["name"];
      }

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
              onClick={() => {
                setNewModalIsOpen(false);
                setModalRows([]);
              }}
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

                if (modalTitle == "گزارشات کاربر") {
                  userHistoryClick(latestID, paginationInfo[modalTitle]);
                }
              }}
            />
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              onClick={() => {
                setModalIsOpen(false);
                setModalRows([]);
              }}
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
                    : pageName == "لیست پرداختی ها"
                    ? transactions
                    : ""
                }
              />
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-8 w-[70%]">
      {userRole !== undefined &&
        options.map((option, index) => {
          const isHovered = hoveredOption === option.name;
          const innerShadowStyle = isHovered
            ? { boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.2)" }
            : {};
          const innerShadowStyleText = isHovered
            ? { boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.1)" }
            : { boxShadow: "rgba(17, 12, 46, 0.15) 0px 0px 50px 0px" };

          return (
            <div
              className="option-container flex flex-col justify-between items-center"
              key={index}
            >
              <div
                onMouseEnter={() => setHoveredOption(option.name)}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => {
                  optionClick(option.name);
                }}
                className="w-[400px] h-[354.33px] bg-white rounded-[50px] cursor-pointer overflow-hidden shadow-2xl"
                style={innerShadowStyle}
              >
                <div className="h-[70%] flex justify-center items-center">
                  {option.icon ? (
                    <option.icon
                      size={120}
                      style={{ color: isHovered ? "#EE8D20" : "" }}
                    />
                  ) : isHovered ? (
                    <div className="w-[70%] h-[70%] relative">
                      <Image
                        src={"../dashboard/" + option.imageUrlHover}
                        alt={option.name}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  ) : (
                    <div className="w-[70%] h-[70%] relative">
                      <Image
                        src={"../dashboard/" + option.imageUrl}
                        alt={option.name}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  )}
                </div>
                <div className="h-[30%] flex justify-center items-center">
                  <div
                    style={innerShadowStyleText}
                    className="w-[70%] h-[50%] rounded-2xl mx-auto flex justify-center items-center"
                  >
                    <h1
                      className="font-bold text-lg"
                      style={{ color: isHovered ? "#EE8D20" : "#343434" }}
                    >
                      {option.name}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="mt-28">
                {/* Add any additional content or space below the boxes here */}
              </div>
            </div>
          );
        })}
    </div>
  );
}
