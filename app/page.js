"use client";

import { useState } from "react";
import MainInput from "@/components/input";
import MainButton from "@/components/MainButton";

export default function app() {
  return (
    <div
      className="flex items-center justify-center w-screen h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/index/bg.jfif) " }}
    >
      <div className="w-full h-full bg-[#33629F4D] p-20 backdrop-blur-md">
        <div className="h-full w-1/2 bg-[#E0EBF9A6] rounded-lg p-10">
          <Content />
        </div>
      </div>
    </div>
  );
}

function Content() {
  const [verifCodePhase, setVerifCodePhase] = useState(false);

  const [title, setTitle] = useState("حساب کاربری");

  const [code, setCode] = useState(["", "", "", ""]);

  const [isLoading, setIsLoading] = useState(false);

  function handleCodeInputChange(value, index) {
    if (/^\d$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
    }
  }

  function handleInputPhone(value) {
    if (value.length === 12 && value.startsWith("09")) {
      
    }
  }

  return (
    <div>
      {/* title */}
      <h1
        style={{ fontWeight: "bold", fontSize: "20px" }}
        className="text-center mb-16"
      >
        {title}
      </h1>

      {title === "حساب کاربری" ? (
        <div className="w-full flex flex-col gap-10">
          <MainInput placeholder={"شماره تلفن"} type={"number"} />

          <MainButton
            isLoading={isLoading}
            onclick={() => {
              setVerifCodePhase(true);
              setTitle("کد تایید");
            }}
            text={"ادامه"}
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex space-x-2">
              {code.map((char, index) => (
                <input
                  key={index}
                  type="number"
                  maxLength="1"
                  value={char}
                  onChange={(e) => handleCodeInputChange(e.target.value, index)}
                  className="w-16 h-16 border border-gray-300 rounded-md text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
          </div>
          <MainButton
            isLoading={isLoading}
            onclick={() => {
              alert(code[0] + code[1] + code[2] + code[3]);
            }}
            text={"تایید"}
          />
        </div>
      )}
    </div>
  );
}
