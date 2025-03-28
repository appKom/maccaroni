"use client";

import type React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T;
  renderCell?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  renderRowActions?: (item: T) => React.ReactNode;
  className?: string;
}

const Table = <T,>({
  columns,
  data,
  renderRowActions,
  className = "",
}: TableProps<T>) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-600 border border-gray-600 text-white">
        <thead className="bg-gray-900">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.accessor)}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {renderRowActions && (
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"></th>
            )}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-600">
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td
                  key={String(column.accessor)}
                  className="px-6 py-4 text-sm font-medium break-words"
                >
                  <div className="max-h-24 max-w-96  overflow-y-auto">
                    {column.renderCell
                      ? column.renderCell(item)
                      : String(item[column.accessor])}
                  </div>
                </td>
              ))}
              {renderRowActions && (
                <td className="px-6 py-4 text-right">
                  <div className="max-h-24 min-w-12 overflow-y-auto">
                    {renderRowActions(item)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
