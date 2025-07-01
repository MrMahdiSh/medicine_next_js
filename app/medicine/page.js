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
import { useRouter, useSearchParams } from "next/navigation";
import CheckUserLog from "@/utils/auth";
import Modal from "react-modal";

export default function App() {
  const [title, setTitle] = useState("Receive Medicine");

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
          router.push("/dashboard");
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

function Content({ optionClick, pageName }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [Address, setAddress] = useState("");

  const searchParams = useSearchParams();
  const prescription = searchParams.get("prescription");

  const [isSucces, setIsSucces] = useState(false);

  const [pharmaciesList, setPharmaciesList] = useState([]);
  const [activeButton, setActiveButton] = useState({
    id: null,
    type: null,
    row: null,
  });

  const [noPharmacy, setNoPharmacy] = useState(false);

  useEffect(() => {
    async function fetchDataFromServer() {
      try {
        const fetchedData = await fetchData(
          `patient/get_accepted_pharmacy_list?prescription_id=${prescription}`,
          "GET",
          null,
          localStorage.getItem("token")
        );
        if (fetchedData.length <= 0) {
          setNoPharmacy(true);
        }
        setPharmaciesList(fetchedData);
      } catch (e) {
        if (e.message.includes("405")) {
          toast.error("You have already selected a pharmacy");
        }
        if (e.message.includes("403")) {
          toast.error("You do not have access to this prescription");
        }
        if (e.message.includes("404")) {
          toast.error("Unfortunately, the prescription was not found");
        }
        router.push("/dashboard");
      }
    }

    fetchDataFromServer();
  }, []);

  const handleTypeChange = (id, newType, row) => {
    setActiveButton({ id, type: newType, row });
  };

  const filteredPharmacies = pharmaciesList.map((acceptedPharmacy, index) => {
    const accepted_pres_id = acceptedPharmacy.id;
    const isActiveHozori =
      activeButton.id === accepted_pres_id && activeButton.type === "In Person";
    const isActiveUber =
      activeButton.id === accepted_pres_id && activeButton.type === "Delivery";

    return {
      list: acceptedPharmacy.pharmacy.name,
      price: acceptedPharmacy.price,
      transportationPrice:
        activeButton.type == "In Person" ? 0 : acceptedPharmacy.transportation_cost,
      type: (
        <div className="flex flex-row gap-3 justify-center">
          <button
            key={`In Person-${accepted_pres_id}`}
            className={`w-28 h-10 bg-white shadow-lg rounded-md gap-2 flex items-center justify-center
              ${isActiveHozori ? "bg-gray-200 shadow-xl" : ""}
            `}
            onClick={() => handleTypeChange(accepted_pres_id, "In Person", index)}
          >
            <Image
              width={25}
              height={25}
              alt="icon"
              src={"../dashboard/uber.png"}
              className="mr-1"
            />
            <span className={`text-black ${isActiveHozori ? "font-bold" : ""}`}>
              In Person
            </span>
          </button>
          <button
            key={`Delivery-${accepted_pres_id}`}
            className={`w-28 h-10 bg-white shadow-lg rounded-md gap-2 flex items-center justify-center
              ${isActiveUber ? "bg-gray-200 shadow-xl" : ""}
            `}
            onClick={() => handleTypeChange(accepted_pres_id, "Delivery", index)}
          >
            <Image
              width={25}
              height={25}
              alt="icon"
              src={"../dashboard/card.png"}
              className="ml-1"
            />
            <span className={`text-black ${isActiveUber ? "font-bold" : ""}`}>
              Delivery
            </span>
          </button>
        </div>
      ),
    };
  });

  async function accept() {
    setIsLoading(true);
    try {
      const data = await fetchData(
        "patient/buy",
        "POST",
        {
          accepted_prescription_id: activeButton.id,
          type: activeButton.type,
          address: Address,
        },
        localStorage.getItem("token"),
        true
      );

      toast.success("Successfully completed");
      setIsLoading(false);
      setIsSucces(true);
    } catch (e) {
      setIsLoading(false);
      toast.error("An issue occurred, please try again later");
    }
  }

  return (
    <div className="w-full h-[10px] mb-[26rem] relative">
      <div className="w-3/4 mx-auto ">
        <div className="container mx-auto py-4">
          <div className="mt-20">
            {isSucces != true && (
              <Table
                isEmpty={noPharmacy}
                rows={filteredPharmacies}
                columns={[
                  "List of Desired Pharmacies",
                  "Medicine Cost",
                  "Delivery Cost",
                  "Receiving Method",
                ]}
                paginated={false}
              />
            )}

            {isSucces != true && activeButton.id != null && (
              <>
                <div className="text-center mt-20">
                  {activeButton.type == "Delivery" && (
                    <>
                      <h1 className="text-xl font-bold mb-6">
                        Enter your exact address
                      </h1>

                      <div className="w-full mx-auto rounded-lg p-4">
                        <textarea
                          onChange={(e) => {
                            setAddress(e.target.value);
                          }}
                          className="w-full h-32 px-3 py-2 text-sm placeholder-gray-400 border border-gray-400 rounded-2xl focus:outline-none focus:border-blue-500"
                          style={{
                            direction: "rtl",
                            fontSize: "15px",
                            padding: "20px",
                          }}
                          placeholder="Enter your address"
                        ></textarea>
                      </div>
                    </>
                  )}

                  <div className="mt-6 text-center w-1/2 mx-auto">
                    <div className="flex py-4 justify-between">
                      <div className="flex flex-row-reverse gap-1">
                        <p className="text-left font-bold">
                          {filteredPharmacies[activeButton.row]["price"]}
                        </p>
                        <span>Currency</span>
                      </div>
                      <p className="text-right">:Medicine Cost</p>
                    </div>
                    <hr className="border-gray-400 mb-2" />
                    <div className="flex py-4 justify-between">
                      <div className="flex flex-row-reverse gap-1">
                        <p className="text-left font-bold">
                          {
                            filteredPharmacies[activeButton.row][
                              "transportationPrice"
                            ]
                          }
                        </p>
                        <span>Currency</span>
                      </div>
                      <p className="text-right">:Delivery Cost</p>
                    </div>
                    <hr className="border-gray-400 mb-2" />
                    <div className="flex py-4 justify-between">
                      <div className="flex flex-row-reverse gap-1">
                        <p className="text-left font-bold">
                          {activeButton.type == "In Person"
                            ? filteredPharmacies[activeButton.row]["price"]
                            : parseFloat(
                                filteredPharmacies[activeButton.row]["price"]
                              ) +
                              parseFloat(
                                filteredPharmacies[activeButton.row][
                                  "transportationPrice"
                                ]
                              )}
                        </p>
                        <span>Currency</span>
                      </div>
                      <p className="text-right">:Total Cost</p>
                    </div>
                  </div>
                  <div className="mt-6 mx-auto text-center">
                    <MainButton
                      isLoading={isLoading}
                      text={
                        activeButton.type == "In Person" ? "Submit" : "Submit and Pay"
                      }
                      onclick={() => {
                        accept();
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {isSucces == true && (
              <>
                <div className="w-full p-10 bg-white rounded-2xl">
                  <div className="w-[70%] mx-auto">
                    <Image
                      className="mx-auto"
                      width={67}
                      height={67}
                      alt="success"
                      src={"../dashboard/success.png"}
                    ></Image>

                    <h1 className="mt-8 mx-auto text-center text-xl font-bold">
                      Your request was successfully completed
                    </h1>
                    <div className="flex mx-auto flex-row-reverse gap-5 justify-center items-center mt-10">
                      <p>:Pharmacy Address</p>
                      <p>
                        {
                          pharmaciesList[activeButton.row]["pharmacy"]["address"]
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
