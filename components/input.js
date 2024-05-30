export default function mainInput({
  placeholder,
  type,
  theOnChange,
  isLoading,
  editable = true,
}) {
  return (
    <div>
      <input
        className="w-full h-[60px] p-3 rounded-lg"
        type={type}
        placeholder={placeholder}
        onChange={theOnChange}
        disabled={isLoading}
        readOnly={!editable}
      ></input>
    </div>
  );
}
