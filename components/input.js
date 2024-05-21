export default function mainInput({ placeholder, type }) {
  return (
    <div>
      <input
        className="w-full h-[60px] p-3 rounded-lg"
        type={type}
        placeholder={placeholder}
      ></input>
    </div>
  );
}
