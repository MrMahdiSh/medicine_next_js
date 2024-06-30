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
  const searchParams = useSearchParams();

  const prescription = searchParams.get("prescription");

  console.log(prescription);

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

function Content({ optionClick, pageName }) {
  return (
    <div className="w-full h-[10px] mb-[26rem] relative">
      <div className="w-3/4 mx-auto ">
        <div className="container mx-auto py-4">
          <div className="mt-20">
            <Table
              rows={[
                { type: "نحوه دریافت دارو", transportation_cost: "هزینه پیک" },
              ]}
              columns={[
                "لیست داروخانه های موردنظر",
                "هزینه دارو",
                "هزینه پیک",
                "نحوه دریافت",
              ]}
              paginated={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
