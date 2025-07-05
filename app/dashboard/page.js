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
  const [title, setTitle] = useState("Home Page");

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
        Please wait
      </div>
    );
  }

  return (
    <div className="h-dvh">
      <Header
        title={title}
        changePage={() => {
          setTitle("Home Page");
        }}
      />
      <div className="h-[440px] w-full relative">
        <h1 className="text-center text-2xl absolute w-full font-bold mt-16">
          {title == "Home Page" ? "" : title}
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
          Home Page
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
      name: "Name",
      type: "text",
      editable: true,
      enName: "name",
    },
    {
      name: "Last Name",
      type: "text",
      editable: true,
      enName: "last_name",
    },
    {
      name: "National Code",
      type: "number",
      editable: false,
      enName: "meli_code",
    },
    {
      name: "Phone Number",
      type: "number",
      editable: false,
      enName: "phone",
    },
  ],
  doctor: [
    {
      name: "Name",
      type: "text",
      editable: true,
      enName: "name",
    },
    {
      name: "Last Name",
      type: "text",
      editable: true,
      enName: "last_name",
    },
    {
      name: "National Code",
      type: "number",
      editable: false,
      enName: "meli_code",
    },
    {
      name: "Expertise",
      type: "text",
      editable: true,
      enName: "expertise",
    },
    {
      name: "Instagram Address",
      type: "text",
      editable: true,
      enName: "instagram",
    },
    {
      name: "Phone Number",
      type: "number",
      editable: false,
      enName: "phone",
    },
  ],
  pharmacy: [
    {
      name: "Name",
      type: "text",
      editable: true,
      enName: "name",
    },
    {
      name: "Last Name",
      type: "text",
      editable: true,
      enName: "last_name",
    },
    {
      name: "Doctor's National Code",
      type: "text",
      editable: false,
      enName: "meli_code",
    },
    {
      name: "Instagram Address",
      type: "text",
      editable: true,
      enName: "instagram",
    },
    {
      name: "Address",
      type: "text",
      editable: true,
      enName: "address",
    },
    {
      name: "Technical Assistant Code",
      type: "text",
      editable: true,
      enName: "technical_assistant_code",
    },
    {
      name: "Office License",
      type: "text",
      editable: true,
      enName: "Office_license",
    },
    {
      name: "Phone Number",
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

  const [notificationSound, setNotif] = useState(null);

  useEffect(() => {
    setNotif(new Audio("/sound/notif.mp3"));
  }, []);

  const [firstPresCount, setFirstPresCount] = useState(0);

  const [buyDetails, setBuyDetails] = useState({
    id: undefined,
    address: undefined,
    price: undefined,
    type: undefined,
    prescription: undefined,
  });

  const paginationInfo = {
    behaviour: 1,
    doctor: 1,
    pharmacy: 1,
    patient: 1,
  };

  // user behavior
  const prescirptionDetails = [
    {
      name: "National Code",
      type: "number",
      enName: "meli_code",
    },
    {
      name: "Prescription",
      type: "number",
      enName: "prescription",
    },
    {
      name: "Insurance",
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
      getPres(true);
  
      const presInterval = setInterval(() => getPres(true), 20000);
      const behaviorInterval = setInterval(() => getUserBehavior(), 20000);
  
      return () => {
        clearInterval(presInterval);
        clearInterval(behaviorInterval);
      };
    }
  }, []);
  

  const [hoveredOption, setHoveredOption] = useState(null);

  const options = {
    doctor: [
      {
        name: "History",
        imageUrl: "addTask.png",
        imageUrlHover: "addTaskHover.png",
      },
      {
        name: "Submit Prescription",
        imageUrl: "pres.png",
        imageUrlHover: "presHover.png",
      },
      {
        name: "Profile",
        imageUrl: "doctor.png",
        imageUrlHover: "doctorHover.png",
      },
    ],
    user: [
      {
        name: "History",
        imageUrl: "addTask.png",
        imageUrlHover: "addTaskHover.png",
      },
      {
        name: "Profile",
        imageUrl: "user.png",
        imageUrlHover: "userHover.png",
      },
    ],
    pharmacy: [
      {
        name: "History",
        imageUrl: "addTask.png",
        imageUrlHover: "addTaskHover.png",
      },
      {
        name: "Prescription List",
        imageUrl: "pharmacy.png",
        imageUrlHover: "pharmacyHover.png",
      },
      {
        name: "Profile",
        imageUrl: "user.png",
        imageUrlHover: "userHover.png",
      },
    ],
  };

  const userRole = role === "admin" ? "user" : role;

  const [UserInfo, setUserInfo] = useState([]);

  const columns = {
    doctor: [
      "Patient Username",
      "Visit Date",
      "Prescription Code",
      "Insurance Type",
    ],
    user: [
      "User Name",
      "Date",
      "Medicine Delivery Method",
      "Prescription Code",
      "Total Payment",
    ],
    pharmacy: [
      "User Name",
      "Date",
      "Medicine Delivery Method",
      "Prescription Code",
      "Total Payment",
    ],
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
      toast.error("An issue occurred");
    }
  }

  async function WritePrescription() {
    try {
      var displayText;
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
        default:
          displayText = "آزاد";
          break;
      }
      const data = await fetchData(
        "doctor/prescription",
        "POST",
        {
          meli_code: inputValues["meli_code"],
          prescription: inputValues["prescription"],
          Insurance: displayText,
        },
        userToken
      );
      toast.success(
        "http://drug.taminuranus.com/medicine/medicine/?prescription=" +
          data[1]["id"]
      );
      getUserBehavior();
      setPredcriptionDone(true);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log("herer");
      console.log(e);
      toast.error("An issue occurred");
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
    optionClick("Home Page");
    setIsLoading(false);
    setPrescriptionSubmited(false);
    setUserAwailablity(false);
    setNewUserPhone(undefined);
    setPredcriptionDone(false);
  }

  async function buyIt(address, price, type, prescription, id) {
    optionClick("Purchase");
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
    optionClick("Home Page");
    try {
      await fetchData(
        "patient/buy",
        "POST",
        { accepted_prescription_id: id, type: option },
        localStorage.getItem("token"),
        true
      );
      toast.success("Successfully completed");
    } catch (error) {
      toast.error("An issue occurred");
    }
  }

  async function getUserBehavior(page = 1) {
    const temperoryUserRole = localStorage.getItem("user_role");

    try {
      const userBehave = await fetchData(
        temperoryUserRole == "doctor"
          ? "doctor/history" + "?page=" + page
          : temperoryUserRole == "user"
          ? "patient/patientHistory" + "?page=" + page
          : "pharmacy/history" + "?page=" + page,
        "GET",
        null,
        localStorage.getItem("token")
      );

      if (temperoryUserRole == "doctor") {
        var filteredData = userBehave["hist_details"]["data"].map((behave) => {
          return {
            user: behave.user.name + " " + behave.user.last_name,
            created_at: behave.created_at,
            prescription: behave.prescription,
            type: behave.Insurance,
          };
        });
      }

      if (temperoryUserRole == "pharmacy" || temperoryUserRole == "user") {
        var filteredData = userBehave["hist_details"]["data"].map((behave) => {
          return {
            user_name: behave.user.name + " " + behave.user.last_name,
            created_at: behave.prescription.created_at,
            type: behave.type ? (
              <span className="flex flex-row-reverse justify-center gap-2">
                {behave.type === "حضوری" ? (
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
                {behave.type}
              </span>
            ) : (
              <p>هنوز انتخاب نشده</p>
            ),
            prescription: behave.prescription.prescription,
            totla_pay: behave.transaction ? (
              <div className="flex flex-row-reverse justify-center gap-1">
                <span style={{ color: "black" }}> تومان</span>
                <p style={{ color: "#EE8D20" }}>{behave.transaction.value}</p>
              </div>
            ) : (
              "پرداخت نشده"
            ),
          };
        });
      }

      setRows({
        data: filteredData,
        current_page: userBehave["hist_details"]["current_page"],
        total: userBehave["hist_details"]["last_page"],
      });
    } catch (e) {}
  }

  const [selectedPres, setSelectedPres] = useState([]);

  async function getPres(isFirst = false) {
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
          meli_code: thePres["user"]["meli_code"],
          action: (
            <div className="w-full h-full flex justify-center items-center">
              <div className="w-[183.05px] h-[40px]">
                <MainButton
                  onclick={() => {
                    optionClick("accept prescription");
                    setSelectedPres(thePres);
                  }}
                  text={"Submit prescription"}
                  preDesign={false}
                  isLoading={isLoading}
                />
              </div>
            </div>
          ),
        };
      });

      if (isFirst) {
        localStorage.setItem("presCount", pres["prescriptions"].length);
      }

      if (
        !isFirst &&
        pres["prescriptions"].length > 0 &&
        pres["prescriptions"].length > localStorage.getItem("presCount")
      ) {
        localStorage.setItem("presCount", pres["prescriptions"].length);
        toast.info("A new prescription is available");
        notificationSound.play();
      }

      setPharmacyPresList(filtered);
    } catch (error) {
      console.log(error);
    }
  }

  async function pharmAccept(id) {
    optionClick("Home Page");
    try {
      await fetchData(
        "pharmacy/accept_prescription",
        "POST",
        {
          prescription_id: id,
          price: pharmacyAcceptPresExtraInfo["price"],
          not_awailable_medicines:
            pharmacyAcceptPresExtraInfo["notAwailablePres"],
        },
        localStorage.getItem("token"),
        true
      );
      toast.success("Successfully completed");
      getUserBehavior();
      getPres();
    } catch (error) {}
  }

  const pharmacyAcceptPresExtraInfo = {
    price: "",
    notAwailablePres: "",
  };

  if (pageName == "accept prescription") {
    return (
      <div className="w-full h-[10px] mb-[26rem] relative">
        <div className="w-3/4 mx-auto ">
          <div className="container mx-auto py-4">
            <button
              onClick={() => optionClick("Home Page")}
              className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
            >
              Back
            </button>

            <Table
              rows={[
                {
                  prescription: selectedPres["prescription"],
                  meli_code: selectedPres["user"]["meli_code"],
                  price: (
                    <MainInput
                      theOnChange={(e) => {
                        pharmacyAcceptPresExtraInfo["price"] = e.target.value;
                      }}
                      type={"number"}
                      placeholder={"Price"}
                    />
                  ),
                  notAvailable: (
                    <MainInput
                      theOnChange={(e) => {
                        pharmacyAcceptPresExtraInfo["notAwailablePres"] =
                          e.target.value;
                      }}
                      placeholder={"not available drugs!"}
                    />
                  ),
                  action: (
                    <div className="w-full h-full flex justify-center items-center">
                      <div className="w-[183.05px] h-[40px]">
                        <MainButton
                          onclick={() => {
                            pharmAccept(selectedPres["id"]);
                          }}
                          text={"Submit prescription"}
                          preDesign={false}
                          isLoading={isLoading}
                        />
                      </div>
                    </div>
                  ),
                },
              ]}
              columns={[
                "prescription",
                "National code",
                "price",
                "Not available",
                "Submit",
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
  if (pageName == "Submit Prescription") {
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
                    Home Page
                  </button>

                  <h1>Successfully completed</h1>
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
                  <h1 className="mb-10">
                    Please enter the patients phone number
                  </h1>
                  <MainInput
                    type={"number"}
                    theOnChange={(e) => {
                      setNewUserPhone(e.target.value);
                    }}
                    placeholder={"Phone Number"}
                  />
                  <MainButton
                    onclick={() => {
                      NewUserPhone();
                    }}
                    isLoading={isLoading}
                    text={"Submit"}
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
              onClick={() => optionClick("Home Page")}
              className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
            >
              Back
            </button>

            <div className="w-full bg-white rounded-3xl shadow-2xl p-10">
              <div className="mt-5 flex justify-center">
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 border-b-2"></th>
                      <th className="px-6 py-4 border-b-2">Insurance</th>
                      <th className="px-6 py-4 border-b-2">National Code</th>
                      <th className="px-6 py-4 border-b-2">Prescription</th>
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
                            text={"Submit prescription"}
                            preDesign={false}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          onChange={(e) => handleInputChange(e, "Insurance")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="insurance1">Free</option>
                          <option value="insurance2">Social Security</option>
                          <option value="insurance3">Health</option>
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        <MainInput
                          theOnChange={(e) => handleInputChange(e, "meli_code")}
                          isLoading={isLoading}
                          type="text"
                          placeholder="National Code"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <MainInput
                          theOnChange={(e) =>
                            handleInputChange(e, "prescription")
                          }
                          isLoading={isLoading}
                          type="text"
                          placeholder="Prescription"
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

  if (pageName == "purchase") {
    return (
      <div className="w-full h-[10px] mb-[26rem] relative">
        <div className="w-3/4 mx-auto ">
          <div className="container mx-auto py-4">
            <button
              onClick={() => optionClick("Home Page")}
              className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
            >
              Back
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
                        Purchase
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

  if (pageName == "History") {
    return (
      <div className="w-full h-[10px] mb-[26rem] relative">
        <div className="w-3/4 mx-auto ">
          <div className="container mx-auto py-4">
            <button
              onClick={() => optionClick("Home Page")}
              className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
            >
              Back
            </button>

            {rows && userRole && (
              <Table
                paginated={true}
                changePage={(number) => {
                  getUserBehavior(paginationInfo["behaviour"] + number);
                }}
                columns={columns[userRole]}
                rows={rows}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (pageName == "Prescriptions") {
    return (
      <div className="w-full h-[10px] mb-[26rem] relative">
        <div className="w-3/4 mx-auto ">
          <div className="container mx-auto py-4">
            <button
              onClick={() => optionClick("Home Page")}
              className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
            >
              Back
            </button>

            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
              overlayClassName="fixed inset-0"
            >
              <div className="bg-white w-[85%] p-10 rounded-lg shadow-lg">
                <h1 className="text-right mb-5">Pharmacy List</h1>
                <Table columns={presDetailsCol} rows={pharmaciesList} />
                <button
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  onClick={() => setModalIsOpen(false)}
                >
                  Exit
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

  if (pageName == "Prescription List") {
    return (
      <div className="w-full h-[10px] mb-[26rem] relative">
        <div className="w-3/4 mx-auto ">
          <div className="container mx-auto py-4">
            <button
              onClick={() => optionClick("Home Page")}
              className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
            >
              Back
            </button>

            {rows && userRole && (
              <Table
                columns={["Prescription", "National code", ""]}
                rows={pharmacyPresList}
              />
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
      toast.success("Successfully completed");
      optionClick("Home Page");
    } catch (e) {
      toast.error("An issue occurred");
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

  if (pageName == "Profile") {
    return (
      <div className="w-full h-[10px] mb-[24rem] lg:mb-[2rem] relative">
        <div className="w-3/4 mx-auto mt-[-111px]">
          <button
            onClick={() => optionClick("Home Page")}
            className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 mb-10"
          >
            Back
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
                    text={"Submit"}
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
                    <h1>{"<"} Activity History</h1>
                    <h1 className="text-orange-400">{theCount}</h1>
                  </div>
                </div>
                {/* logout */}
                <div onClick={LogOut} className="absolute bottom-10 w-full">
                  <h1 className="cursor-pointer text-red-500 text-center">
                    Log Out
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
