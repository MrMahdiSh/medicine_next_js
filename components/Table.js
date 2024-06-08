import { useEffect, useRef } from "react";
import { formatDate } from "../utils/formatDate";

const Table = ({ columns, rows }) => {
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.scrollLeft = container.scrollWidth;
    }
  }, []);

  return (
    <div ref={tableContainerRef} className="overflow-x-auto" style={{ direction: "rtl" }}>
      <table className="min-w-full bg-white border border-gray-200 whitespace-nowrap" style={{ direction: "ltr" }}>
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
          {[...rows].reverse().map((row, rowIndex) => (
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
    </div>
  );
};

export default Table;
