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

  const [title, setTitle] = useState("ورود");

  return (
    <div className="w-full mt-16 flex flex-col gap-10">
      {/* title */}
      <h1
        style={{ fontWeight: "bold", fontSize: "20px" }}
        className="text-center"
      >
        {title}
      </h1>

      <MainInput placeholder={'شماره تلفن'} type={'number'} />

      <MainButton
        onclick={() => {
          setVerifCodePhase(true);
          setTitle("کد تایید");
        }}

        text={'ادامه'}
      />
    </div>
  );
}
