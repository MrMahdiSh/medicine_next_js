"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaUserFriends,
  FaClipboardList,
  FaUser,
  FaClinicMedical,
  FaPencilAlt,
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
      <Header
        title={title}
        changePage={() => {
          setTitle("صفحه اصلی");
        }}
      />
      <div className="h-[440px] w-full relative">
        <h1 className="text-center text-2xl absolute w-full font-bold mt-16">
          {title == "صفحه اصلی" ? "" : title}
        </h1>
        <div className="w-full h-full absolute flex flex-col gap-20 mt-20 lg:gap-0 lg:mt-[2rem] lg:flex-row justify-evenly items-center">
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
      editable: false,
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
      editable: false,
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

  const [pharmaciesList, setPharmaciesList] = useState([]);

  const [pharmacyPresList, setPharmacyPresList] = useState([]);

  const [buyDetails, setBuyDetails] = useState({
    id: undefined,
    address: undefined,
    price: undefined,
    type: undefined,
    prescription: undefined,
  });

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
      name: "بیمه",
      type: "text",
      enName: "Insurance",
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
    if (localStorage.getItem("user_role") == "pharmacy") {
      getPres();
      setInterval(getPres, 20000);
      setInterval(getUserBehavior, 20000);
    }
  }, []);

  const [hoveredOption, setHoveredOption] = useState(null);

  const options = {
    doctor: [
      {
        name: "تاریخچه",
        imageUrl: "addTask.png",
        imageUrlHover: "addTaskHover.png",
      },
      {
        name: "ثبت نسخه",
        imageUrl: "pres.png",
        imageUrlHover: "presHover.png",
      },
      {
        name: "پروفایل",
        imageUrl: "doctor.png",
        imageUrlHover: "doctorHover.png",
      },
    ],
    user: [
      {
        name: "نسخه ها",
        imageUrl: "addTask.png",
        imageUrlHover: "addTaskHover.png",
      },
      {
        name: "پروفایل",
        imageUrl: "user.png",
        imageUrlHover: "userHover.png",
      },
    ],
    pharmacy: [
      {
        name: "تاریخچه",
        icon: FaClipboardList,
      },
      {
        name: "لیست نسخه ها",
        icon: FaClinicMedical,
      },
      {
        name: "پروفایل",
        icon: FaUserFriends,
      },
    ],
  };

  const userRole = role === "admin" ? "user" : role;

  const [UserInfo, setUserInfo] = useState([]);

  const columns = {
    doctor: ["نام کاربری بیمار", "تاریخ مراجعه", "کد نسخه", "نوع بیمه"],
    user: [
      "دکتر",
      "نسخه",
      "تاریخ",
      "دلیل مراجعه",
      "داروخانه های تایید شده",
      "عملگر",
    ],
    pharmacy: ["نسخه", "تاریخ", "وضعیت"],
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
      var displayText;
      console.log(inputValues["Insurance"]);
      switch (inputValues["Insurance"]) {
        case "insurance1":
          displayText = "آزاد";
          break;
        case "insurance2":
          displayText = "تامین اجتماعی";
          break;
        case "insurance3":
          displayText = "سلامت";
          break;
      }
      console.log(displayText);
      await fetchData(
        "doctor/prescription",
        "POST",
        {
          meli_code: inputValues["meli_code"],
          prescription: inputValues["prescription"],
          Insurance: displayText,
        },
        userToken
      );
      getUserBehavior();
      setPredcriptionDone(true);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log("herer");
      console.log(e);
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

  async function buyIt(address, price, type, prescription, id) {
    optionClick("خرید");
    buyDetails["address"] = address;
    buyDetails["price"] = price;
    buyDetails["type"] = type;
    buyDetails["prescription"] = prescription;
    buyDetails["id"] = id;
  }

  async function fetchPharmacies(id) {
    setPharmaciesList([]);

    // fetch new one
    const thePharmacies = await fetchData(
      "patient/get_accepted_pharmacy_list/?prescription_id=" + id,
      "GET",
      null,
      localStorage.getItem("token")
    );

    // filter
    const filtered = thePharmacies.map((pharm) => {
      return {
        add: pharm.pharmacy_add,
        price: pharm.price,
        action:
          pharm.main_status == "pending" ? (
            <select
              onChange={(e) => {
                const selectedOption = e.target.value;
                setModalIsOpen(false);
                buyIt(
                  pharm.pharmacy_add,
                  pharm.price,
                  selectedOption,
                  pharm.prescription.prescription,
                  pharm.id
                );
              }}
              className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
            >
              <option value="" disabled selected>
                نحوه دریافت
              </option>
              <option value="local">حضوری</option>
              <option value="taxi">ارسال</option>
            </select>
          ) : pharm.status == "accepted" ? (
            "انتخاب شما"
          ) : (
            ""
          ),
      };
    });

    setPharmaciesList(filtered);
  }

  async function selectPharm(id, option) {
    optionClick("صفحه اصلی");
    try {
      await fetchData(
        "patient/buy",
        "POST",
        { accepted_prescription_id: id, type: option },
        localStorage.getItem("token"),
        true
      );
      toast.success("با موفقیت انجام شد");
    } catch (error) {
      toast.error("مشکلی پیش آمده");
    }
  }

  async function getUserBehavior() {
    const temperoryUserRole = localStorage.getItem("user_role");

    try {
      const userBehave = await fetchData(
        temperoryUserRole == "doctor"
          ? "doctor/history"
          : temperoryUserRole == "user"
          ? "patient/patient_prescriptions"
          : "pharmacy/history",
        "GET",
        null,
        localStorage.getItem("token")
      );

      if (temperoryUserRole == "doctor") {
        var filteredData = userBehave["hist_details"].map((behave) => {
          return {
            user: behave.user.name + behave.user.last_name,
            created_at: behave.created_at,
            prescription: behave.prescription,
            type: behave.Insurance,
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
                  fetchPharmacies(behave.id);
                  setPharmaciesList;
                }}
                disabled={!behave.accepted_count >= 1}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                داروخانه ها
              </button>
            ),
          };
        });
      }

      if (temperoryUserRole == "pharmacy") {
        var filteredData = userBehave["prescriptions"].map((behave) => {
          return {
            prescription: behave.prescription_string,
            created_at: behave.created_at,
            status:
              behave.status == "pending"
                ? "درانتظار"
                : behave.status == "accepted"
                ? "تایید کاربر"
                : "نامشخص",
          };
        });
      }

      setRows(filteredData);
    } catch (e) {}
  }

  async function getPres() {
    try {
      const pres = await fetchData(
        "pharmacy/get_prescriptions",
        "GET",
        null,
        localStorage.getItem("token")
      );
      const filtered = pres["prescriptions"].map((thePres) => {
        return {
          prescription: thePres["prescription"],
          action: (
            <button
              onClick={() => {
                pharmAccept(thePres["id"]);
              }}
              className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
            >
              تایید
            </button>
          ),
        };
      });
      setPharmacyPresList(filtered);
    } catch (error) {
      console.log(error);
    }
  }

  async function pharmAccept(id) {
    optionClick("صفحه اصلی");
    try {
      await fetchData(
        "pharmacy/accept_prescription",
        "POST",
        {
          prescription_id: id,
        },
        localStorage.getItem("token"),
        true
      );
      toast.success("عملیات با موفقیت انجام شد");
      getUserBehavior();
      getPres();
    } catch (error) {}
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
                  <h1 className="mb-10">لطفا شماره تماس بیمار را وارد کنید</h1>
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
              <div className="mt-5 flex justify-center">
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 border-b-2"></th>
                      <th className="px-6 py-4 border-b-2">بیمه</th>
                      <th className="px-6 py-4 border-b-2">کدملی</th>
                      <th className="px-6 py-4 border-b-2">نسخه</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="pt-12">
                      <td className="px-6 py-4 flex justify-center items-center">
                        <div className="w-[183.05px] h-[50px]">
                          <MainButton
                            onclick={() => {
                              IsUserAwailable();
                            }}
                            isLoading={isLoading}
                            text={"ثبت نسخه"}
                            preDesign={false}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          onChange={(e) => handleInputChange(e, "Insurance")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="insurance1">آزاد</option>
                          <option value="insurance2">تامین اجتماعی</option>
                          <option value="insurance3">سلامت</option>
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        <MainInput
                          theOnChange={(e) => handleInputChange(e, "meli_code")}
                          isLoading={isLoading}
                          type="text"
                          placeholder="کدملی"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <MainInput
                          theOnChange={(e) =>
                            handleInputChange(e, "prescription")
                          }
                          isLoading={isLoading}
                          type="text"
                          placeholder="نسخه"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageName == "خرید") {
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

            {buyDetails["address"] && (
              <Table
                rows={[
                  {
                    prescription: buyDetails.prescription,
                    address: buyDetails.address,
                    type: buyDetails.type == "local" ? "حضوری" : "پیک",
                    price: buyDetails.price,
                    buy: (
                      <button
                        onClick={() => {
                          selectPharm(buyDetails.id, buyDetails.type);
                        }}
                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 mb-10"
                      >
                        خرید
                      </button>
                    ),
                  },
                ]}
                columns={["نسخه", "آدرس", "نحوه دریافت", "قیمت", "خرید"]}
                paginated={false}
              />
            )}
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

  const presDetailsCol = ["آدرس", "قیمت", "عملگر"];

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
                <Table columns={presDetailsCol} rows={pharmaciesList} />
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

  if (pageName == "لیست نسخه ها") {
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
              <Table columns={["نسخه", "عملگر"]} rows={pharmacyPresList} />
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
          : "pharmacy/history",
        "GET",
        null,
        localStorage.getItem("token")
      );
      temperoryUserRole == "doctor"
        ? setTheCount(docy["doctor_history"])
        : temperoryUserRole == "user"
        ? setTheCount(docy["user_history"])
        : setTheCount(docy["pres_count"]);
    } catch (error) {}
  }

  if (pageName == "پروفایل") {
    return (
      <div className="w-full h-[10px] mb-[24rem] lg:mb-[2rem] relative">
        <div className="w-3/4 mx-auto mt-[-111px]">
          <button
            onClick={() => optionClick("صفحه اصلی")}
            className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
          >
            بازگشت
          </button>

          <div className="w-full flex flex-col-reverse lg:flex-row gap-10 justify-around">
            <div className="lg:w-[70%] w-[100%]">
              <div
                style={{
                  boxShadow: "rgba(17, 12, 46, 0.1) 0px 10px 50px 0px",
                }}
                className="bg-white rounded-2xl p-2 lg:p-16"
              >
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
                        icon={user.editable ? <FaPencilAlt /> : null}
                        type={user.type}
                        val={theUserDetail[user.enName] ?? ""}
                      />
                    </div>
                  );
                })}
                <div className="flex justify-around gap-5">
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
            <div className="lg:w-[30%] w-[100%] ">
              <div
                style={{
                  boxShadow: "rgba(17, 12, 46, 0.1) 0px 10px 50px 0px",
                }}
                className="bg-white h-[70vh] rounded-2xl relative"
              >
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
            : { boxShadow: "rgba(17, 12, 46, 0.15) 0px 10px 50px 0px" };
          const innerShadowStyleText = isHovered
            ? { boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.1)" }
            : { boxShadow: "rgba(17, 12, 46, 0.15) 0px 0px 50px 0px" };

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
                className={`w-[354.33px] h-[354.33px] bg-white rounded-[37px] cursor-pointer overflow-hidden ${
                  isHovered ? "shadow-none" : ""
                }`}
                style={innerShadowStyle}
              >
                <div className="h-[70%] pt-10 flex justify-center items-center">
                  {option.icon ? (
                    <option.icon
                      size={120}
                      style={{ color: isHovered ? "#EE8D20" : "" }}
                    />
                  ) : isHovered ? (
                    <div className="w-[70%] h-[70%] relative">
                      <Image
                        src={option.imageUrlHover}
                        alt={option.name}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  ) : (
                    <div className="w-[70%] h-[70%] relative">
                      <Image
                        src={option.imageUrl}
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
            </div>
          );
        })}
    </>
  );
}
