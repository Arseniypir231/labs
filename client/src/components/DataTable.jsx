import { Link } from 'react-router-dom';
import './DataTable.css';

function DataTable({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  detailPath,
  loading = false 
}) {
  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="empty-state">Нет данных для отображения</div>;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              <td className="actions">
                {detailPath && (
                  <Link 
                    to={`${detailPath}/${row._id}`} 
                    className="btn btn-sm btn-info"
                  >
                    Подробнее
                  </Link>
                )}
                {onEdit && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onEdit(row)}
                  >
                    Редактировать
                  </button>
                )}
                {onDelete && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(row)}
                  >
                    Удалить
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
