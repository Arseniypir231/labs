import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchVehicles, deleteVehicle } from '../store/slices/vehiclesSlice';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import VehicleForm from '../components/VehicleForm';
import './VehiclesPage.css';

function VehiclesPage() {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.vehicles);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, vehicle: null });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
    search: '',
    status: '',
    vehicleType: '',
  });

  useEffect(() => {
    dispatch(fetchVehicles(filters));
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

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = (vehicle) => {
    setDeleteModal({ isOpen: true, vehicle });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteVehicle(deleteModal.vehicle._id)).unwrap();
      toast.success('Транспорт успешно удален');
      setDeleteModal({ isOpen: false, vehicle: null });
      dispatch(fetchVehicles(filters));
    } catch (error) {
      toast.error(error.message || 'Не удалось удалить транспорт');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingVehicle(null);
    dispatch(fetchVehicles(filters));
  };

  const columns = [
    { key: 'licensePlate', label: 'Номер' },
    { key: 'brand', label: 'Марка' },
    { key: 'model', label: 'Модель' },
    { key: 'year', label: 'Год' },
    {
      key: 'vehicleType',
      label: 'Тип',
      render: (value) => {
        const types = {
          truck: 'Грузовик',
          van: 'Фургон',
          car: 'Автомобиль',
          trailer: 'Прицеп',
        };
        return types[value] || value;
      },
    },
    {
      key: 'status',
      label: 'Статус',
      render: (value) => {
        const statuses = {
          available: 'Доступен',
          in_use: 'В использовании',
          maintenance: 'На обслуживании',
          out_of_service: 'Не в эксплуатации',
        };
        return statuses[value] || value;
      },
    },
    {
      key: 'capacity',
      label: 'Грузоподъемность',
      render: (value, row) => `${value} ${row.capacityUnit}`,
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2>Транспортные средства</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Добавить транспорт
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Поиск по номеру, марке, модели..."
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
          <option value="in_use">В использовании</option>
          <option value="maintenance">На обслуживании</option>
          <option value="out_of_service">Не в эксплуатации</option>
        </select>
        <select
          value={filters.vehicleType}
          onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
        >
          <option value="">Все типы</option>
          <option value="truck">Грузовик</option>
          <option value="van">Фургон</option>
          <option value="car">Автомобиль</option>
          <option value="trailer">Прицеп</option>
        </select>
        <select
          value={`${filters.sort}-${filters.order}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split('-');
            setFilters({ ...filters, sort, order });
          }}
        >
          <option value="createdAt-desc">Сначала новые</option>
          <option value="createdAt-asc">Сначала старые</option>
          <option value="year-desc">По году (убывание)</option>
          <option value="year-asc">По году (возрастание)</option>
          <option value="brand-asc">По марке (А-Я)</option>
        </select>
      </div>

      <DataTable
        data={items}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        detailPath="/vehicles"
        loading={loading}
      />

      <Pagination pagination={pagination} onPageChange={handlePageChange} />

      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onClose={handleFormClose}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, vehicle: null })}
        onConfirm={confirmDelete}
        title="Удаление транспорта"
        message={`Вы уверены, что хотите удалить транспорт ${deleteModal.vehicle?.licensePlate}?`}
      />
    </div>
  );
}

export default VehiclesPage;
