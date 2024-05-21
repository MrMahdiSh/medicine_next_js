export default function app() {
  return (
    <div
      className="flex items-center justify-center w-screen h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/index/bg.jfif) " }}
    >
      <div className="w-full h-full bg-[#33629F4D] p-20 backdrop-blur-md">
        <div className="h-full w-1/2 bg-[#E0EBF9A6] rounded-lg p-10">
          <div className="w-full mt-16 flex flex-col gap-10">
            <h1
              style={{ fontWeight: "bold", fontSize: "20px" }}
              className="text-center"
            >
              عضویت
            </h1>

            <input className="w-full h-[60px] p-3 rounded-lg" type="number" placeholder="شماره موبایل"></input>

            <button className="bg-[#EE8D20] mx-auto w-[300px] h-[50px] mt-10 rounded-lg text-white">ادامه</button>

            <button>قبلا ثبت نام کردم</button>
          </div>
        </div>
      </div>
    </div>
  );
}
