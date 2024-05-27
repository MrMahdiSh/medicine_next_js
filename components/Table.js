import { formatDate } from '../utils/formatDate';

const Table = ({ columns, rows }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {[...columns].reverse().map((column, index) => (
              <th key={index} className="py-2 px-4 border-b text-right">
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
                  <td key={cellIndex} className="py-2 px-4 border-b text-right">
                    {key === 'created_at' || key === 'updated_at' ? formatDate(cell) : cell}
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
