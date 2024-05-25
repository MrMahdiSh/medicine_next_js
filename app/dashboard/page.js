"use client";

import { useState } from "react";
import Image from "next/image";
import { FaUserFriends, FaClipboardList } from 'react-icons/fa';

export default function dashboard() {
  return (
    <div className="h-dvh">
      <Header title={"صفحه اصلی"} />
      <Content />
    </div>
  );
}

function Header({ title }) {
  return (
    <div className="h-[200px] bg-white p-10 flex justify-end items-center">
      <div className="flex items-center gap-2">
        <h1>{title}</h1>
        <div style={{ width: "30px", height: "30px" }}>
          <Image src="/dashboard/home.png" alt="Home" width={30} height={30} />
        </div>
      </div>
    </div>
  );
}

function Content() {
  const options = [
    { name: "تاریخچه گزارشات", icon: FaClipboardList },
    { name: "اطلاعات شخصی", icon: FaUserFriends },
  ];

  const Option = ({ name, Icon }) => {
    return (
      <div className="w-[354.33px] h-[354.33px] bg-white shadow-2xl rounded-3xl">
        <div className="h-[70%] flex justify-center items-center">
          <Icon size={100} />
        </div>
        <div className="h-[30%] flex justify-center items-center">
          <h1>{name}</h1>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[440px] w-full relative">
      <div className="w-full h-full absolute flex flex-row justify-around items-center">
        {options.map((option, index) => (
          <Option key={index} name={option.name} Icon={option.icon} />
        ))}
      </div>
      <div className="w-full h-1/2 bg-[#A1BEE54F]"></div>
    </div>
  );
}

