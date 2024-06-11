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

  console.log(rows);

  return (
    <div
      ref={tableContainerRef}
      className="overflow-x-auto"
      style={{ direction: "rtl" }}
    >
      {rows && (
        <>
          <table
            className="min-w-full bg-white border border-gray-200 whitespace-nowrap"
            style={{ direction: "ltr" }}
          >
            <thead>
              <tr>
                {[...columns].reverse().map((column, index) => (
                  <th key={index} className="py-4 px-6 border-b text-right">
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
                            className="py-4 px-6 border-b text-right"
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
                            className="py-4 px-6 border-b text-right"
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
                  changePage(-1);
                }}
                disabled={rows["current_page"] === 1}
                className="px-4 py-2 mx-1 border rounded"
              >
                Previous
              </button>
              <span className="px-4 py-2 mx-1">
                Page {rows["current_page"]} of {rows["total"]}
              </span>
              <button
                onClick={() => {
                  changePage(1);
                }}
                disabled={rows["total"] === rows["current_page"]}
                className="px-4 py-2 mx-1 border rounded"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Table;
