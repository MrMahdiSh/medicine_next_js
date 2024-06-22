"use client";

import { useRef, useState } from "react";
import MainInput from "@/components/input";
import PhoneInput from "@/components/phoneInput";
import MainButton from "@/components/MainButton";
import RoundedButton from "@/components/RoundedButton";
import { toast } from "react-toastify";
import { fetchData } from "@/utils/api";
import { useRouter } from "next/navigation";
import ROOT from "@/utils/ROOT";

export default function App() {
  return (
    <div
      className="flex items-center justify-center w-screen h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${ROOT}/index/bg.jfif)` }}
    >
      <div className="w-full h-full bg-[#33629F4D] p-0 sm:p-20 backdrop-blur-md">
        <div className="h-full w-full lg:w-1/2 bg-[#E0EBF9A6] sm:rounded-lg p-10">
          <Content />
        </div>
      </div>
    </div>
  );
}

function Content() {
  const [title, setTitle] = useState("عضویت");

  const [phone, setPhone] = useState("");

  const [code, setCode] = useState(["", "", "", ""]);

  const [isLoading, setIsLoading] = useState(false);

  const [isRegister, setIsRegister] = useState(true);

  function handleCodeInputChange(value, index) {
    if (/^\d$/.test(value) || value === "") {
      if (value.length === 1 && index < code.length - 1) {
        inputsRef.current[index + 1].focus();
      }
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
    }
  }

  async function handleInputPhone() {
    if (phone.length === 11 && phone.startsWith("09")) {
      setIsLoading(true);
      // send verif code
      try {
        const sendVerifCode = await fetchData(
          "Auth/sendVerificationCode",
          "POST",
          {
            phone,
          }
        );
        toast.success(sendVerifCode["message"]);
        console.log(sendVerifCode);
        setTitle("کد تایید");
        toast.success("کد با موفقیت ارسال شد");
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        toast.error("مشکلی پیش آمده لطفا بعدا تلاش کنید");
      }
    } else {
      // sent a toastify error
      toast.error("شماره تماس معتبر نیست");
    }
  }

  function getPhone(e) {
    setPhone(e.target.value);
  }

  const router = useRouter();

  function HandleLoginSuccess() {
    router.push("/dashboard");
  }

  function adminLogingSuccess() {
    router.push("/admin");
  }

  async function handleValidCodeRegister(code) {
    if (code.length === 4) {
      setIsLoading(true);
      try {
        const data = await fetchData("Auth/register", "POST", {
          phone,
          verification_code: code,
        });
        setIsLoading(false);
        if (data["user_details"]["meli_code"]) {
          if (data.role[0] != "admin") {
            HandleLoginSuccess();
          } else {
            adminLogingSuccess();
          }
        } else {
          setTitle("اطلاعات");
        }
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_details", JSON.stringify(data.user_details));
        localStorage.setItem("user_role", data.role[0]);
      } catch (e) {
        setIsLoading(false);
        toast.error("کد وارد شده صحیح نیست");
      }
    } else {
      toast.error("کد وارد شده صحیح نیست");
    }
  }

  async function handleValidCodeLogin(code) {
    if (code.length === 4) {
      setIsLoading(true);
      try {
        const data = await fetchData("Auth/verifyAccount", "POST", {
          phone,
          verification_code: code,
        });
        setIsLoading(false);
        if (data["user_details"]["meli_code"]) {
          if (data.role[0] != "admin") {
            HandleLoginSuccess();
          } else {
            adminLogingSuccess();
          }
        } else {
          setTitle("اطلاعات");
        }
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_details", JSON.stringify(data.user_details));
        localStorage.setItem("user_role", data.role[0]);
      } catch (e) {
        setIsLoading(false);
        toast.error("کد وارد شده صحیح نیست");
      }
    } else {
      toast.error("کد وارد شده صحیح نیست");
    }
  }

  async function submitDetails() {
    try {
      await fetchData("Auth/register_send_code", "POST", {
        name,
        last_name: lastName,
        meli_code: meliCode,
        phone: phone,
      });
      setIsRegister(true);
      setTitle("کد تایید");
    } catch (e) {
      toast.error("مشکلی پیش آمده لطفا بعدا تلاش کنید");
    }
  }

  //new users details
  const [name, setName] = useState("");

  const [lastName, setLastName] = useState("");

  const [meliCode, setMeliCode] = useState("");

  function goToSignIn() {
    setTitle("ورود");
  }

  const inputsRef = useRef([]);

  return (
    <div>
      {/* title */}
      <h1
        style={{ fontWeight: "bold", fontSize: "20px" }}
        className="text-center mb-16"
      >
        {title}
      </h1>

      {title === "عضویت" ? (
        <div className="w-full flex flex-col gap-10">
          <PhoneInput
            isLoading={isLoading}
            theOnChange={getPhone}
            placeholder={"شماره تلفن"}
            type={"number"}
          />

          <MainButton
            isLoading={isLoading}
            onclick={() => {
              setTitle("اطلاعات");
            }}
            text={"ادامه"}
          />

          <h1
            onClick={goToSignIn}
            className="mx-auto flex items-center gap-3 cursor-pointer"
          >
            <span>&lt;</span>
            <span className="mr-2">قبلا ثبت نام کرده ام</span>
          </h1>
        </div>
      ) : title === "کد تایید" ? (
        <div className="flex flex-col">
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex space-x-2">
              {code.map((char, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="number"
                  maxLength="1"
                  value={char}
                  onChange={(e) => handleCodeInputChange(e.target.value, index)}
                  className="w-16 h-16 border border-gray-300 rounded-md text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>
          <MainButton
            isLoading={isLoading}
            onclick={() => {
              isRegister
                ? handleValidCodeRegister(code[0] + code[1] + code[2] + code[3])
                : handleValidCodeLogin(code[0] + code[1] + code[2] + code[3]);
            }}
            text={"تایید"}
          />
          <RoundedButton
            isLoading={isLoading}
            onclick={() => {
              setCode(["", "", "", ""]);
              setTitle("عضویت");
            }}
            text={"بازگشت به صفحه قبل"}
          />
        </div>
      ) : title === "اطلاعات" ? (
        <div className="flex flex-col gap-10">
          <MainInput
            isLoading={isLoading}
            theOnChange={(e) => {
              setName(e.target.value);
            }}
            placeholder={"نام"}
            type={"string"}
          />
          <MainInput
            isLoading={isLoading}
            theOnChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder={"نام خانوادگی"}
            type={"string"}
          />
          <MainInput
            isLoading={isLoading}
            theOnChange={(e) => {
              setMeliCode(e.target.value);
            }}
            placeholder={"کدملی"}
            type={"number"}
          />

          <div className="w-full flex flex-col">
            <MainButton
              text={"ثبت"}
              isLoading={isLoading}
              onclick={submitDetails}
            />
            <RoundedButton
              isLoading={isLoading}
              onclick={() => {
                setCode(["", "", "", ""]);
                setTitle("عضویت");
              }}
              text={"بازگشت به صفحه قبل"}
            />
          </div>
        </div>
      ) : title === "ورود" ? (
        <></>
      ) : (
        <></>
      )}
    </div>
  );
}
