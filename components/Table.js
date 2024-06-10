import { useEffect, useRef, useState } from "react";
import { formatDate } from "../utils/formatDate";

const Table = ({ columns, rows, paginated = false, changePage }) => {
  const tableContainerRef = useRef(null);

  const [mainRow, setMainRow] = useState(rows);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    console.log(rows);
    const container = tableContainerRef.current;
    if (container) {
      container.scrollLeft = container.scrollWidth;
    }
    if (paginated) {
      setMainRow(rows["data"]);
      setCurrentPage(rows["current_page"]);
      setTotalPages(rows["total"]);
    }
  }, []);

  return (
    <div
      ref={tableContainerRef}
      className="overflow-x-auto"
      style={{ direction: "rtl" }}
    >
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
          {[...mainRow].reverse().map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.entries(row)
                .reverse()
                .map(([key, cell], cellIndex) => (
                  <td key={cellIndex} className="py-4 px-6 border-b text-right">
                    {key === "created_at" || key === "updated_at"
                      ? formatDate(cell)
                      : cell}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      {paginated && (
        <div className="flex justify-center mt-4">
          <button
            onClick={changePage}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 border rounded"
          >
            Previous
          </button>
          <span className="px-4 py-2 mx-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={changePage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 border rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
