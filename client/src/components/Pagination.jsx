import './Pagination.css';

function Pagination({ pagination, onPageChange }) {
  const { page, pages } = pagination;

  if (pages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    if (
      i === 1 ||
      i === pages ||
      (i >= page - 2 && i <= page + 2)
    ) {
      pageNumbers.push(i);
    } else if (
      i === page - 3 ||
      i === page + 3
    ) {
      pageNumbers.push('...');
    }
  }

  return (
    <div className="pagination">
      <button
        className="btn btn-sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Назад
      </button>
      {pageNumbers.map((num, index) => (
        <button
          key={index}
          className={`btn btn-sm ${num === page ? 'active' : ''}`}
          disabled={num === '...'}
          onClick={() => typeof num === 'number' && onPageChange(num)}
        >
          {num}
        </button>
      ))}
      <button
        className="btn btn-sm"
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
      >
        Вперед
      </button>
    </div>
  );
}

export default Pagination;
