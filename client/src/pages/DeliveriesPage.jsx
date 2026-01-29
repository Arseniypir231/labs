import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchDeliveries, deleteDelivery } from '../store/slices/deliveriesSlice';
import { fetchDrivers } from '../store/slices/driversSlice';
import { fetchVehicles } from '../store/slices/vehiclesSlice';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import DeliveryForm from '../components/DeliveryForm';
import './DeliveriesPage.css';

function DeliveriesPage() {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.deliveries);
  const { items: drivers } = useSelector((state) => state.drivers);
  const { items: vehicles } = useSelector((state) => state.vehicles);
  const [showForm, setShowForm] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, delivery: null });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: 'scheduledDate',
    order: 'desc',
    search: '',
    status: '',
  });

  useEffect(() => {
    dispatch(fetchDeliveries(filters));
    dispatch(fetchDrivers({ limit: 1000 }));
    dispatch(fetchVehicles({ limit: 1000 }));
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

  const handleEdit = (delivery) => {
    setEditingDelivery(delivery);
    setShowForm(true);
  };

  const handleDelete = (delivery) => {
    setDeleteModal({ isOpen: true, delivery });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteDelivery(deleteModal.delivery._id)).unwrap();
      toast.success('Доставка успешно удалена');
      setDeleteModal({ isOpen: false, delivery: null });
      dispatch(fetchDeliveries(filters));
    } catch (error) {
      toast.error(error.message || 'Не удалось удалить доставку');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDelivery(null);
    dispatch(fetchDeliveries(filters));
  };

  const columns = [
    { key: 'deliveryNumber', label: 'Номер доставки' },
    {
      key: 'driver',
      label: 'Водитель',
      render: (value) =>
        value && typeof value === 'object'
          ? `${value.firstName} ${value.lastName}`
          : '-',
    },
    {
      key: 'vehicle',
      label: 'Транспорт',
      render: (value) =>
        value && typeof value === 'object'
          ? `${value.brand} ${value.model} (${value.licensePlate})`
          : '-',
    },
    {
      key: 'origin',
      label: 'Откуда',
      render: (value) => (value ? `${value.city}, ${value.address}` : '-'),
    },
    {
      key: 'destination',
      label: 'Куда',
      render: (value) => (value ? `${value.city}, ${value.address}` : '-'),
    },
    {
      key: 'scheduledDate',
      label: 'Дата',
      render: (value) =>
        value ? new Date(value).toLocaleDateString('ru-RU') : '-',
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value) => {
        const statuses = {
          scheduled: 'Запланирована',
          in_transit: 'В пути',
          delivered: 'Доставлена',
          cancelled: 'Отменена',
          delayed: 'Задержана',
        };
        return statuses[value] || value;
      },
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2>Доставки</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Добавить доставку
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Поиск по номеру, адресам, городам..."
          value={filters.search}
          onChange={handleSearch}
          className="search-input"
        />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="scheduled">Запланирована</option>
          <option value="in_transit">В пути</option>
          <option value="delivered">Доставлена</option>
          <option value="cancelled">Отменена</option>
          <option value="delayed">Задержана</option>
        </select>
        <select
          value={`${filters.sort}-${filters.order}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split('-');
            setFilters({ ...filters, sort, order });
          }}
        >
          <option value="scheduledDate-desc">Сначала новые</option>
          <option value="scheduledDate-asc">Сначала старые</option>
          <option value="cost-desc">По стоимости (убывание)</option>
        </select>
      </div>

      <DataTable
        data={items}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        detailPath="/deliveries"
        loading={loading}
      />

      <Pagination pagination={pagination} onPageChange={handlePageChange} />

      {showForm && (
        <DeliveryForm
          delivery={editingDelivery}
          drivers={drivers}
          vehicles={vehicles}
          onClose={handleFormClose}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, delivery: null })}
        onConfirm={confirmDelete}
        title="Удаление доставки"
        message={`Вы уверены, что хотите удалить доставку ${deleteModal.delivery?.deliveryNumber}?`}
      />
    </div>
  );
}

export default DeliveriesPage;
