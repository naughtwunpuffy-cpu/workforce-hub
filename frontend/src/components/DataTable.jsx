export default function DataTable({ columns, data, totalRow }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>{columns.map(col => <th key={col.key} className={col.numeric ? 'num' : ''}>{col.label}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={totalRow && i === data.length - 1 ? 'total-row' : ''}>
              {columns.map(col => {
                const val = row[col.key];
                let className = col.numeric ? 'num' : '';
                if (col.variance && typeof val === 'number') {
                  className += val > 0 ? ' positive' : val < 0 ? ' negative' : '';
                }
                return <td key={col.key} className={className}>{col.render ? col.render(val, row) : val}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
