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
  const [title, setTitle] = useState("دریافت دارو");

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
          router.push("/dashboard");
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

  useEffect(() => {
    async function fetchDataFromServer() {
      try {
        const fetchedData = await fetchData(
          `patient/get_accepted_pharmacy_list?prescription_id=${prescription}`,
          "GET",
          null,
          localStorage.getItem("token")
        );
        setPharmaciesList(fetchedData);
      } catch (e) {
        if (e.message.includes("405")) {
          toast.error("شما قبلا داروخانه را انتخاب کردید");
        }
        if (e.message.includes("403")) {
          toast.error("شما اجازه دسترسی به این نسخه رو ندارید");
        }
        if (e.message.includes("404")) {
          toast.error("متاسفانه نسخه پیدا نشد");
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
      activeButton.id === accepted_pres_id && activeButton.type === "حضوری";
    const isActiveUber =
      activeButton.id === accepted_pres_id && activeButton.type === "پیک";

    return {
      list: acceptedPharmacy.pharmacy.name,
      price: acceptedPharmacy.price,
      transportationPrice:
        activeButton.type == "حضوری" ? 0 : acceptedPharmacy.transportation_cost,
      type: (
        <div className="flex flex-row gap-3 justify-center">
          <button
            key={`حضوری-${accepted_pres_id}`}
            className={`w-28 h-10 bg-white shadow-lg rounded-md gap-2 flex items-center justify-center
              ${isActiveHozori ? "bg-gray-200 shadow-xl" : ""}
            `}
            onClick={() => handleTypeChange(accepted_pres_id, "حضوری", index)}
          >
            <Image
              width={25}
              height={25}
              alt="icon"
              src={"../dashboard/uber.png"}
              className="mr-1"
            />
            <span className={`text-black ${isActiveHozori ? "font-bold" : ""}`}>
              حضوری
            </span>
          </button>
          <button
            key={`پیک-${accepted_pres_id}`}
            className={`w-28 h-10 bg-white shadow-lg rounded-md gap-2 flex items-center justify-center
              ${isActiveUber ? "bg-gray-200 shadow-xl" : ""}
            `}
            onClick={() => handleTypeChange(accepted_pres_id, "پیک", index)}
          >
            <Image
              width={25}
              height={25}
              alt="icon"
              src={"../dashboard/card.png"}
              className="ml-1"
            />
            <span className={`text-black ${isActiveUber ? "font-bold" : ""}`}>
              پیک
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

      toast.success("با موفقیت انجام شد");
      setIsLoading(false);
      setIsSucces(true);
    } catch (e) {
      setIsLoading(false);
      toast.error("مشکلی پیش آمده لطفا بعدا تلاش کنید");
    }
  }

  return (
    <div className="w-full h-[10px] mb-[26rem] relative">
      <div className="w-3/4 mx-auto ">
        <div className="container mx-auto py-4">
          <div className="mt-20">
            {isSucces != true && (
              <Table
                rows={filteredPharmacies}
                columns={[
                  "لیست داروخانه های موردنظر",
                  "هزینه دارو",
                  "هزینه پیک",
                  "نحوه دریافت",
                ]}
                paginated={false}
              />
            )}

            {isSucces != true && activeButton.id != null && (
              <>
                <div className="text-center mt-20">
                  {activeButton.type == "پیک" && (
                    <>
                      <h1 className="text-xl font-bold mb-6">
                        آدرس دقیق خود را وارد کنید
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
                          placeholder="آدرس خود را وارد کنید"
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
                        <span>تومان</span>
                      </div>
                      <p className="text-right">:هزینه دارو</p>
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
                        <span>تومان</span>
                      </div>
                      <p className="text-right">:هزینه پیک</p>
                    </div>
                    <hr className="border-gray-400 mb-2" />
                    <div className="flex py-4 justify-between">
                      <div className="flex flex-row-reverse gap-1">
                        <p className="text-left font-bold">
                          {activeButton.type == "حضوری"
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
                        <span>تومان</span>
                      </div>
                      <p className="text-right">:هزینه کل</p>
                    </div>
                  </div>
                  <div className="mt-6 mx-auto text-center">
                    <MainButton
                      isLoading={isLoading}
                      text={
                        activeButton.type == "حضوری" ? "ثبت" : "ثبت و پرداخت"
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
                      درخواست شما با موفقیت انجام شد
                    </h1>
                    <div className="flex mx-auto flex-row-reverse gap-5 justify-center items-center mt-10">
                      <p>:آدرس داروخانه مورد نظر</p>
                      <p>
                        {
                          pharmaciesList[activeButton.row]["pharmacy"][
                            "address"
                          ]
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
