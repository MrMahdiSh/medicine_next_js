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
  const [title, setTitle] = useState("Sign Up");

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
      // send verification code
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
        setTitle("Verification Code");
        toast.success("Code sent successfully");
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        toast.error("An error occurred, please try again later");
      }
    } else {
      // send a toastify error
      toast.error("Invalid phone number");
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
          setTitle("Details");
        }
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_details", JSON.stringify(data.user_details));
        localStorage.setItem("user_role", data.role[0]);
      } catch (e) {
        setIsLoading(false);
        toast.error("Invalid code entered");
      }
    } else {
      toast.error("Invalid code entered");
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
          setTitle("Details");
        }
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_details", JSON.stringify(data.user_details));
        localStorage.setItem("user_role", data.role[0]);
      } catch (e) {
        setIsLoading(false);
        toast.error("Invalid code entered");
      }
    } else {
      toast.error("Invalid code entered");
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
      toast.error("Please fill in all fields");
      return;
    }

    if (!checkCodeMeli(meliCode)) {
      toast.error("Invalid national code entered");
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
      setTitle("Verification Code");
    } catch (e) {
      setTitle("Login");
      toast.error(
        "You have already registered with this national code or phone number, please log in"
      );
    }
  }

  async function loginMeliCodeInputHandle() {
    setIsRegister(false);

    if (!checkCodeMeli(meliCode)) {
      toast.error("Invalid national code entered");
      return;
    }

    setIsLoading(true);
    try {
      const code = await fetchData("Auth/lgin_send_code", "POST", {
        meli_code: meliCode,
      });
      toast.success(code["message"]);
      setTitle("Verification Code");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setTitle("Sign Up");
      toast.error("User with this national code does not exist");
    }
  }

  //new users details
  const [name, setName] = useState("");

  const [lastName, setLastName] = useState("");

  const [meliCode, setMeliCode] = useState("");

  function goToSignIn() {
    setTitle("Login");
  }

  const inputsRef = useRef([]);

  async function loginAs(role = "patient") {
    try {
      const data = await fetchData("Auth/loginAs", "POST", {
        role,
      });
      setIsLoading(false);
      if (data["user_details"]["meli_code"]) {
        if (data.role[0] != "admin") {
          HandleLoginSuccess();
        } else {
          adminLogingSuccess();
        }
      } else {
        setTitle("Details");
      }
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_details", JSON.stringify(data.user_details));
      localStorage.setItem("user_role", data.role[0]);
    } catch (e) {}
  }

  return (
    <div>
      {/* title */}
      <h1
        style={{ fontWeight: "bold", fontSize: "25px" }}
        className="text-center mb-16 mt-16"
      >
        {title}
      </h1>

      {title === "Sign Up" ? (
        <div className="w-full flex flex-col gap-10">
          <PhoneInput
            isLoading={isLoading}
            theOnChange={getPhone}
            placeholder={"Phone Number"}
            type={"number"}
          />

          <MainButton
            isLoading={isLoading}
            onclick={() => {
              const phoneNumberRegex = /^09\d{9}$/;
              if (!phoneNumberRegex.test(phone)) {
                toast.error("Invalid phone number entered");
                return;
              }
              if (phone) setTitle("Details");
            }}
            text={"Continue"}
          />

          <h1
            onClick={goToSignIn}
            className="mx-auto flex items-center gap-3 cursor-pointer"
          >
            <span>&lt;</span>
            <span className="mr-2">I have already registered</span>
          </h1>
        </div>
      ) : title === "Verification Code" ? (
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
            text={"Confirm"}
          />
          <RoundedButton
            isLoading={isLoading}
            onclick={() => {
              setCode(["", "", "", ""]);
              setTitle("Sign Up");
            }}
            text={"Back to previous page"}
          />
        </div>
      ) : title === "Details" ? (
        <div className="flex flex-col gap-10">
          <MainInput
            isLoading={isLoading}
            theOnChange={(e) => {
              setName(e.target.value);
            }}
            placeholder={"First Name"}
            type={"string"}
          />
          <MainInput
            isLoading={isLoading}
            theOnChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder={"Last Name"}
            type={"string"}
          />
          <MainInput
            isLoading={isLoading}
            theOnChange={(e) => {
              setMeliCode(e.target.value);
            }}
            placeholder={"National Code"}
            type={"number"}
          />

          <div className="w-full flex flex-col">
            <MainButton
              text={"Submit"}
              isLoading={isLoading}
              onclick={submitDetails}
            />
            <RoundedButton
              isLoading={isLoading}
              onclick={() => {
                setCode(["", "", "", ""]);
                setTitle("Sign Up");
              }}
              text={"Back to previous page"}
            />
          </div>
        </div>
      ) : title === "Login" ? (
        <div className="w-full flex flex-col gap-10">
          <MainInput
            theOnChange={(e) => {
              setMeliCode(e.target.value);
            }}
            placeholder={"National Code"}
          />

          <MainButton
            onclick={loginMeliCodeInputHandle}
            isLoading={isLoading}
            text={"Confirm"}
          />

          <RoundedButton
            isLoading={isLoading}
            onclick={() => {
              setCode(["", "", "", ""]);
              setTitle("Sign Up");
              setMeliCode("");
            }}
            text={"Back to previous page"}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="mx-auto w-full flex gap-3">
        <MainButton
          onclick={() => {
            loginAs("Patient");
          }}
          isLoading={isLoading}
          text={"Login As patient"}
        ></MainButton>
        <MainButton
          onclick={() => {
            loginAs("Doctor");
          }}
          isLoading={isLoading}
          text={"Login As DR"}
        ></MainButton>
        <MainButton
          onclick={() => {
            loginAs("Pharmacy");
          }}
          isLoading={isLoading}
          text={"Login As Pharmacy"}
        ></MainButton>
      </div>
    </div>
  );
}
