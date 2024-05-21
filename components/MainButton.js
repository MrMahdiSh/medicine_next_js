export default function MainButton({ onclick, text }) {
  return (
    <button
      onClick={onclick}
      className="bg-[#EE8D20] mx-auto w-[300px] h-[50px] mt-10 rounded-lg text-white"
    >
      {text}
    </button>
  );
}
