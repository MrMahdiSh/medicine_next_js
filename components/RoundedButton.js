export default function MainButton({
  onclick,
  text,
  isLoading,
  color = "#EE8D20",
}) {
  return (
    <button
      onClick={isLoading == false ? onclick : () => {}}
      className={`mx-auto w-[300px] h-[50px] mt-10 rounded-lg border-2 border-black`}
    >
      {isLoading == false ? text : "درحال بارگیری"}
    </button>
  );
}
