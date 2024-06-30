"use client";

import { useEffect, useRef, useState } from "react";
import { formatDate } from "../utils/formatDate";
import Image from "next/image";

const Table = ({ columns, rows, paginated = false, changePage }) => {
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.scrollLeft = container.scrollWidth;
    }
  }, []);

  return (
    <div className="p-10 bg-white rounded-[80px]">
      <div
        ref={tableContainerRef}
        className="overflow-x-auto"
        style={{ maxWidth: "100%", direction: "rtl" }}
      >
        <table className="min-w-full bg-white whitespace-nowrap">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-4 px-6 border-b border-[#525252] text-center"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated === false ? (
              rows.length > 0 ? (
                rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.entries(row).map(([key, cell], cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`py-4 px-6 ${
                          rowIndex === rows.length - 1
                            ? ""
                            : "border-b border-[#525252]"
                        } text-center`}
                      >
                        {key === "created_at" || key === "updated_at"
                          ? formatDate(cell)
                          : cell}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-20 px-6 text-center"
                  >
                    متاسفانه چیزی برای نمایش وجود ندارد
                  </td>
                </tr>
              )
            ) : rows["data"] && rows["data"].length > 0 ? (
              rows["data"].map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.entries(row).map(([key, cell], cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`py-4 px-6 border-b border-[#525252] text-center`}
                    >
                      {key === "created_at" || key === "updated_at"
                        ? formatDate(cell)
                        : cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-20 px-6 text-center mt-10"
                >
                  متاسفانه چیزی برای نمایش وجود ندارد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {paginated && rows["data"] && (
        <div className="flex justify-end mt-10">
          {rows["current_page"] > 1 && (
            <>
              <button
                onClick={() => {
                  changePage(-1);
                }}
                disabled={rows["current_page"] === 1}
                className={`w-[30px] h-[30px] my-auto mx-1 border rounded-lg bg-[#175FBD]`}
              >
                <Image
                  src="../dashboard/reversArrow.png"
                  className="mx-auto my-auto"
                  alt="Previous"
                  width={7}
                  height={7}
                />
              </button>
              <span className="mx-2 flex justify-center items-center">
                صفحه قبلی
              </span>
            </>
          )}

          {rows["current_page"] < rows["total"] && (
            <>
              <div className="mx-5"></div>{" "}
              {/* Extra space between previous and next */}
              <span className="mx-2 flex justify-center items-center">
                صفحه بعدی
              </span>
              <button
                onClick={() => {
                  changePage(1);
                }}
                disabled={rows["total"] === rows["current_page"]}
                className={`w-[30px] h-[30px] my-auto mx-1 border rounded-lg bg-[#175FBD]`}
              >
                <Image
                  src="../dashboard/arrow.png"
                  className="mx-auto my-auto"
                  alt="Next"
                  width={7}
                  height={7}
                />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Table;