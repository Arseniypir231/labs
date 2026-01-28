import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useDispatch, useSelector } from 'react-redux';
import { deleteVehicle, updateVehicle } from '../store/slices/vehiclesSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper();

function AdvancedVehiclesTable({ vehicles, onEdit, canEdit }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);

  // Обработка массового удаления
  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection).filter(key => rowSelection[key]);
    if (selectedIds.length === 0) {
      toast.warning('Выберите хотя бы одно транспортное средство');
      return;
    }

    if (!window.confirm(`Вы уверены, что хотите удалить ${selectedIds.length} транспортных средств?`)) {
      return;
    }

    try {
      for (const id of selectedIds) {
        await dispatch(deleteVehicle(parseInt(id))).unwrap();
      }
      toast.success(`Удалено ${selectedIds.length} транспортных средств`);
      setRowSelection({});
    } catch (error) {
      toast.error('Ошибка при удалении транспортных средств');
    }
  };

  // Обработка массового изменения статуса
  const handleBulkStatusChange = async (newStatus) => {
    const selectedIds = Object.keys(rowSelection).filter(key => rowSelection[key]);
    if (selectedIds.length === 0) {
      toast.warning('Выберите хотя бы одно транспортное средство');
      return;
    }

    try {
      for (const id of selectedIds) {
        const vehicle = vehicles.find(v => v.id === parseInt(id));
        if (vehicle) {
          await dispatch(updateVehicle({
            id: parseInt(id),
            ...vehicle,
            status: newStatus
          })).unwrap();
        }
      }
      toast.success(`Статус обновлен для ${selectedIds.length} транспортных средств`);
      setRowSelection({});
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            style={{ cursor: 'pointer' }}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            style={{ cursor: 'pointer' }}
          />
        ),
        size: 50,
      }),
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
        enableSorting: true,
        size: 80,
      }),
      columnHelper.accessor('licensePlate', {
        header: 'Номерной знак',
        cell: (info) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'includesString',
        size: 150,
      }),
      columnHelper.accessor('brand', {
        header: 'Марка',
        cell: (info) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'includesString',
        size: 150,
      }),
      columnHelper.accessor('model', {
        header: 'Модель',
        cell: (info) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'includesString',
        size: 150,
      }),
      columnHelper.accessor('vehicleType', {
        header: 'Тип',
        cell: (info) => {
          const types = {
            'truck': 'Грузовик',
            'van': 'Фургон',
            'car': 'Автомобиль',
            'motorcycle': 'Мотоцикл'
          };
          return types[info.getValue()] || info.getValue();
        },
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'equalsString',
        size: 120,
      }),
      columnHelper.accessor('capacity', {
        header: 'Грузоподъемность (т)',
        cell: (info) => `${parseFloat(info.getValue()).toFixed(2)} т`,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          const value = parseFloat(row.getValue(columnId));
          const filter = parseFloat(filterValue);
          return value >= filter;
        },
        size: 150,
      }),
      columnHelper.accessor('year', {
        header: 'Год выпуска',
        cell: (info) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          const value = parseInt(row.getValue(columnId));
          const filter = parseInt(filterValue);
          return value >= filter;
        },
        size: 120,
      }),
      columnHelper.accessor('status', {
        header: 'Статус',
        cell: (info) => {
          const status = info.getValue();
          const statusNames = {
            'available': 'Доступно',
            'in_use': 'В использовании',
            'maintenance': 'На обслуживании',
            'retired': 'Списано'
          };
          const statusColors = {
            'available': '#27ae60',
            'in_use': '#3498db',
            'maintenance': '#f39c12',
            'retired': '#e74c3c'
          };
          return (
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: statusColors[status] || '#95a5a6',
                color: 'white',
                fontSize: '12px',
              }}
            >
              {statusNames[status] || status}
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'equalsString',
        size: 150,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Действия',
        cell: ({ row }) => (
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-success"
              onClick={() => navigate(`/vehicles/${row.original.id}`)}
              style={{ fontSize: '12px', padding: '4px 8px' }}
            >
              Подробнее
            </button>
            {canEdit && (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(row.original)}
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  Редактировать
                </button>
              </>
            )}
          </div>
        ),
        size: 200,
      }),
    ],
    [canEdit, navigate, onEdit]
  );

  const data = useMemo(() => vehicles, [vehicles]);

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      globalFilter,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const selectedCount = Object.keys(rowSelection).filter(key => rowSelection[key]).length;

  return (
    <div className="advanced-table-container">
      {/* Панель инструментов */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <input
            type="text"
            placeholder="Глобальный поиск..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="global-filter-input"
          />
          {selectedCount > 0 && (
            <div className="selected-info">
              Выбрано: {selectedCount}
            </div>
          )}
        </div>
        {selectedCount > 0 && canEdit && (
          <div className="toolbar-right">
            <button
              className="btn btn-secondary"
              onClick={() => handleBulkStatusChange('available')}
              style={{ fontSize: '12px' }}
            >
              Установить "Доступно"
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleBulkStatusChange('maintenance')}
              style={{ fontSize: '12px' }}
            >
              Установить "На обслуживании"
            </button>
            <button
              className="btn btn-danger"
              onClick={handleBulkDelete}
              style={{ fontSize: '12px' }}
            >
              Удалить выбранные ({selectedCount})
            </button>
          </div>
        )}
      </div>

      {/* Таблица */}
      <div className="table-wrapper">
        <table className="advanced-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span>
                          {{
                            asc: ' ↑',
                            desc: ' ↓',
                          }[header.column.getIsSorted()] ?? ' ⇅'}
                        </span>
                      )}
                    </div>
                    {header.column.getCanFilter() && (
                      <div style={{ marginTop: '5px' }}>
                        <input
                          type="text"
                          value={header.column.getFilterValue() ?? ''}
                          onChange={(e) => header.column.setFilterValue(e.target.value)}
                          placeholder={`Фильтр ${header.column.columnDef.header}`}
                          style={{
                            width: '100%',
                            padding: '4px',
                            fontSize: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                  Нет данных для отображения
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: row.getIsSelected() ? '#e3f2fd' : 'transparent',
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={{ width: cell.column.getSize() }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <div className="table-pagination">
        <div className="pagination-info">
          Показано {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} -{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          из {table.getFilteredRowModel().rows.length}
        </div>
        <div className="pagination-controls">
          <button
            className="btn btn-secondary"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <span style={{ margin: '0 10px' }}>
            Страница{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
            </strong>
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            style={{ marginLeft: '10px', padding: '4px 8px' }}
          >
            {[10, 20, 30, 50, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Показать {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default AdvancedVehiclesTable;
