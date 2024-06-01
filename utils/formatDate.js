import jalaali from "jalaali-js";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const jalaliDate = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  const year = jalaliDate.jy;
  const month = String(jalaliDate.jm).padStart(2, "0");
  const day = String(jalaliDate.jd).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
