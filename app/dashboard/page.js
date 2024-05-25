"use client";

import { useState } from "react";
import Image from "next/image";
import { FaUserFriends, FaClipboardList } from "react-icons/fa";

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
  const [hoveredOption, setHoveredOption] = useState(null);

  const options = [
    { name: "تاریخچه گزارشات", icon: FaClipboardList },
    { name: "اطلاعات شخصی", icon: FaUserFriends },
  ];

  return (
    <div className="h-[440px] w-full relative">
      <div className="w-full h-full absolute flex flex-row justify-around items-center">
        {options.map((option, index) => {
          const isHovered = hoveredOption === option.name;
          const innerShadowStyle = isHovered
            ? { boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.2)" }
            : {};

          return (
            <div
              className="option-container"
              key={index}
              onMouseEnter={() => setHoveredOption(option.name)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <div
                className={`w-[354.33px] h-[354.33px] bg-white rounded-3xl cursor-pointer overflow-hidden shadow-2xl ${
                  isHovered ? "shadow-none" : ""
                }`}
                style={innerShadowStyle}
              >
                <div className="h-[70%] flex justify-center items-center">
                  <option.icon
                    size={100}
                    style={{ color: isHovered ? "#EE8D20" : "" }}
                  />
                </div>
                <div className="h-[30%] flex justify-center items-center">
                  <h1 style={{ color: isHovered ? "#EE8D20" : "" }}>
                    {option.name}
                  </h1>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full h-1/2 bg-[#A1BEE54F]"></div>
    </div>
  );
}
