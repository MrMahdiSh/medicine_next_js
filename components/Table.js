"use client";

import { useEffect, useRef, useState } from "react";
import { formatDate } from "../utils/formatDate";

const Table = ({ columns, rows, paginated = false, changePage }) => {
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.scrollLeft = container.scrollWidth;
    }
  }, []);
  ``;

  return (
    <div className="p-10 bg-white rounded-[80px]">
      <div
        ref={tableContainerRef}
        className="overflow-x-auto"
        style={{
          direction: "rtl",
          border: "none",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {rows && (
          <>
            <table
              className="min-w-full bg-white border border-gray-200 whitespace-nowrap"
              style={{ direction: "ltr", padding: "0 16px", border: "none" }}
            >
              <thead>
                <tr>
                  {[...columns].reverse().map((column, index) => (
                    <th
                      key={index}
                      className="py-4 px-6 border-b border-black text-center"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated === false
                  ? rows.length > 0 &&
                    [...rows].reverse().map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.entries(row)
                          .reverse()
                          .map(([key, cell], cellIndex) => (
                            <td
                              key={cellIndex}
                              className={`py-4 px-6 ${
                                rowIndex === rows.length - 1
                                  ? ""
                                  : "border-b border-black"
                              } text-center`}
                            >
                              {key === "created_at" || key === "updated_at"
                                ? formatDate(cell)
                                : cell}
                            </td>
                          ))}
                      </tr>
                    ))
                  : rows["data"] &&
                    rows["data"].length > 0 &&
                    [...rows["data"]].reverse().map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.entries(row)
                          .reverse()
                          .map(([key, cell], cellIndex) => (
                            <td
                              key={cellIndex}
                              className={`py-4 px-6 ${
                                rowIndex === rows["data"].length - 1
                                  ? ""
                                  : "border-b"
                              } text-center`}
                            >
                              {key === "created_at" || key === "updated_at"
                                ? formatDate(cell)
                                : cell}
                            </td>
                          ))}
                      </tr>
                    ))}
              </tbody>
            </table>
            {paginated && rows["data"] && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    changePage(1);
                  }}
                  disabled={rows["total"] === rows["current_page"]}
                  className={`px-4 py-2 mx-1 border rounded ${
                    rows["total"] !== rows["current_page"] ? "bg-blue-400" : ""
                  }`}
                >
                  بعدی
                </button>

                <span className="px-4 py-2 mx-1">
                  صفحه {rows["current_page"]} از {rows["total"]}
                </span>
                <button
                  onClick={() => {
                    changePage(-1);
                  }}
                  disabled={rows["current_page"] === 1}
                  className={`px-4 py-2 mx-1 border rounded ${
                    rows["current_page"] === 1 ? "" : "bg-blue-400"
                  }`}
                >
                  قبلی
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Table;
