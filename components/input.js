export default function mainInput({
  placeholder,
  type,
  theOnChange,
  isLoading,
  editable = true,
}) {
  console.log(type + "||" + placeholder);
  return (
    <div>
      <input
        style={{
          direction: type === "text" ? "rtl" : "ltr",
        }}
        className={`w-full h-[60px] p-3 rounded-lg shadow-md`}
        type={type}
        placeholder={placeholder}
        onChange={theOnChange}
        disabled={isLoading}
        readOnly={!editable}
      ></input>
    </div>
  );
}
