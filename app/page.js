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
      className="w-screen min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${ROOT}/index/bg.jfif)` }}
    >
      <div className="w-full h-screen min-h-[700px] bg-[#33629F4D] p-0 sm:p-20 backdrop-blur-md">
        <div className="w-full h-full lg:w-1/2 lg:mx-auto bg-[#E0EBF9A6] sm:rounded-lg p-10">
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
        const data = await fetchData("Auth/login", "POST", {
          meli_code: meliCode,
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

  function checkCodeMeli(code) {
    var L = code.length;

    if (L < 8 || parseInt(code, 10) == 0) return false;
    code = ("0000" + code).substr(L + 4 - 10);
    if (parseInt(code.substr(3, 6), 10) == 0) return false;
    var c = parseInt(code.substr(9, 1), 10);
    var s = 0;
    for (var i = 0; i < 9; i++) s += parseInt(code.substr(i, 1), 10) * (10 - i);
    s = s % 11;
    return (s < 2 && c == s) || (s >= 2 && c == 11 - s);
    return true;
  }
  async function submitDetails() {
    if (!name || !lastName || !meliCode) {
      toast.error("لطفا همه فیلد ها را وارد کنید");
      return;
    }

    if (!checkCodeMeli(meliCode)) {
      toast.error("کدملی وارد شده صحیح نمیباشد");
      return;
    }

    try {
      const code = await fetchData("Auth/register_send_code", "POST", {
        name,
        last_name: lastName,
        meli_code: meliCode,
        phone: phone,
      });
      toast.success(code["message"]);
      setIsRegister(true);
      setTitle("کد تایید");
    } catch (e) {
      setTitle("ورود");
      toast.error("با این کدملی یا شماره تماس قبلا عضو شدید لطفا وارد شوید");
    }
  }

  async function loginMeliCodeInputHandle() {
    setIsRegister(false);
    if (!checkCodeMeli(meliCode)) {
      toast.error("کدملی وارد شده صحیح نمیباشد");
      return;
    }
    setIsLoading(true);
    try {
      const code = await fetchData("Auth/lgin_send_code", "POST", {
        meli_code: meliCode,
      });
      toast.success(code["message"]);
      setTitle("کد تایید");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setTitle("عضویت");
      toast.error("کاربر با این کد ملی وجود ندارد");
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
        style={{ fontWeight: "bold", fontSize: "25px" }}
        className="text-center mb-16 mt-16"
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
              const phoneNumberRegex = /^09\d{9}$/;
              if (!phoneNumberRegex.test(phone)) {
                toast.error("شماره وارد شده صحیح نمیباشد");
                return;
              }
              if (phone) setTitle("اطلاعات");
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
        <div className="w-full flex flex-col gap-10">
          <MainInput
            theOnChange={(e) => {
              setMeliCode(e.target.value);
            }}
            placeholder={"کد ملی"}
          />

          <MainButton
            onclick={loginMeliCodeInputHandle}
            isLoading={isLoading}
            text={"تایید"}
          />

          <RoundedButton
            isLoading={isLoading}
            onclick={() => {
              setCode(["", "", "", ""]);
              setTitle("عضویت");
              setMeliCode("");
            }}
            text={"بازگشت به صفحه قبل"}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
