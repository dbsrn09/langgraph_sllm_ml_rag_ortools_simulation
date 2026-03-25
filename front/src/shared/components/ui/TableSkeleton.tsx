
export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="animate-pulse">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {cols > 0 && Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} >
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="px-4 py-3">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

