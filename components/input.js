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
    <div>
      <input
        style={{
          direction: type === "text" ? "rtl" : "ltr",
        }}
        className={`w-full h-[60px] p-3 rounded-lg shadow-md`}
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
