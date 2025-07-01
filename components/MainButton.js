export default function MainButton({
  onclick,
  text,
  isLoading,
  color = "#EE8D20",
  preDesign = true,
}) {
  return (
    <button
      onClick={isLoading == false ? onclick : () => {}}
      className={`mx-auto ${
        preDesign ? "w-[300px] h-[50px] mt-10" : "w-full h-full"
      } rounded-lg text-white`}
      style={{ backgroundColor: `${color}` }}
    >
      {isLoading == false ? text : "Loading"}
    </button>
  );
}
