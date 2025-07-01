"use client";
import { useState } from "react";

export default function MainInput({
  placeholder,
  type,
  theOnChange,
  isLoading,
  editable = true,
  val = "",
}) {
  const [value, setValue] = useState(val);

  function handleChange(e) {
    setValue(e.target.value);
    if (theOnChange) {
      theOnChange(e);
    }
  }
  return (
    <div className="relative w-full h-full">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        +971 |
      </span>
      <input
        style={{
          direction: "rtl",
        }}
        className={`w-full h-[70px] p-3 rounded-lg shadow-md`}
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        disabled={isLoading}
        readOnly={!editable}
        value={value}
      ></input>
    </div>
  );
}
