import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchDrivers, deleteDriver } from '../store/slices/driversSlice';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import DriverForm from '../components/DriverForm';
import './DriversPage.css';

function DriversPage() {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.drivers);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, driver: null });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
    search: '',
    status: '',
  });

  useEffect(() => {
    dispatch(fetchDrivers(filters));
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleDelete = (driver) => {
    setDeleteModal({ isOpen: true, driver });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteDriver(deleteModal.driver._id)).unwrap();
      toast.success('Водитель успешно удален');
      setDeleteModal({ isOpen: false, driver: null });
      dispatch(fetchDrivers(filters));
    } catch (error) {
      toast.error(error.message || 'Не удалось удалить водителя');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDriver(null);
    dispatch(fetchDrivers(filters));
  };

  const columns = [
    {
      key: 'fullName',
      label: 'ФИО',
      render: (_, row) => `${row.firstName} ${row.lastName}`,
    },
    { key: 'phone', label: 'Телефон' },
    { key: 'email', label: 'Email' },
    { key: 'licenseNumber', label: 'Номер прав' },
    {
      key: 'licenseCategory',
      label: 'Категории',
      render: (value) => (Array.isArray(value) ? value.join(', ') : value),
    },
    {
      key: 'experience',
      label: 'Опыт (лет)',
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value) => {
        const statuses = {
          available: 'Доступен',
          on_delivery: 'В рейсе',
          sick_leave: 'На больничном',
          vacation: 'В отпуске',
        };
        return statuses[value] || value;
      },
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2>Водители</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Добавить водителя
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Поиск по имени, фамилии, email, телефону..."
          value={filters.search}
          onChange={handleSearch}
          className="search-input"
        />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="available">Доступен</option>
          <option value="on_delivery">В рейсе</option>
          <option value="sick_leave">На больничном</option>
          <option value="vacation">В отпуске</option>
        </select>
        <select
          value={`${filters.sort}-${filters.order}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split('-');
            setFilters({ ...filters, sort, order });
          }}
        >
          <option value="createdAt-desc">Сначала новые</option>
          <option value="lastName-asc">По фамилии (А-Я)</option>
          <option value="experience-desc">По опыту (убывание)</option>
        </select>
      </div>

      <DataTable
        data={items}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        detailPath="/drivers"
        loading={loading}
      />

      <Pagination pagination={pagination} onPageChange={handlePageChange} />

      {showForm && (
        <DriverForm driver={editingDriver} onClose={handleFormClose} />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, driver: null })}
        onConfirm={confirmDelete}
        title="Удаление водителя"
        message={`Вы уверены, что хотите удалить водителя ${deleteModal.driver?.firstName} ${deleteModal.driver?.lastName}?`}
      />
    </div>
  );
}

export default DriversPage;
