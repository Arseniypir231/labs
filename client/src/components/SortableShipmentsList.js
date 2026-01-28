import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch } from 'react-redux';
import { updateShipment } from '../store/slices/shipmentsSlice';
import { toast } from 'react-toastify';
import api from '../services/api';

// Компонент сортируемого элемента
function SortableShipmentItem({ shipment, onViewDetails, onEdit, onDelete, canEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: shipment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#27ae60';
      case 'in_transit':
        return '#3498db';
      case 'pending':
        return '#f39c12';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const statusNames = {
    'pending': 'Ожидает',
    'in_transit': 'В пути',
    'delivered': 'Доставлено',
    'cancelled': 'Отменено'
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'dragging' : ''}
    >
      <td>
        <div
          {...attributes}
          {...listeners}
          data-sortable-handle
          style={{
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span style={{ fontSize: '18px', lineHeight: '1' }}>⋮⋮</span>
          <span style={{ fontSize: '11px', color: '#999' }}>Перетащите</span>
        </div>
      </td>
      <td>{shipment.id}</td>
      <td>
        {shipment.vehicle
          ? `${shipment.vehicle.brand} ${shipment.vehicle.model} (${shipment.vehicle.licensePlate})`
          : 'N/A'}
      </td>
      <td>
        {shipment.route
          ? `${shipment.route.origin} → ${shipment.route.destination}`
          : 'N/A'}
      </td>
      <td>{shipment.cargoDescription}</td>
      <td>{shipment.weight} т</td>
      <td>
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: getPriorityColor(shipment.priority || 'medium'),
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {shipment.priority === 'high' ? 'Высокий' : 
           shipment.priority === 'medium' ? 'Средний' : 'Низкий'}
        </span>
      </td>
      <td>
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: getStatusColor(shipment.status),
            color: 'white',
            fontSize: '12px',
          }}
        >
          {statusNames[shipment.status] || shipment.status}
        </span>
      </td>
      <td>
        {shipment.departureDate
          ? new Date(shipment.departureDate).toLocaleDateString('ru-RU')
          : 'N/A'}
      </td>
      <td>
        <button
          className="btn btn-success"
          onClick={() => onViewDetails(shipment.id)}
          style={{ marginRight: '5px', marginBottom: '5px' }}
        >
          Подробнее
        </button>
        {canEdit && (
          <>
            <button
              className="btn btn-secondary"
              onClick={() => onEdit(shipment)}
              style={{ marginRight: '5px', marginBottom: '5px' }}
            >
              Редактировать
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(shipment.id)}
            >
              Удалить
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

// Основной компонент списка с drag and drop
function SortableShipmentsList({ shipments, onViewDetails, onEdit, onDelete, canEdit, onOrderChange }) {
  const dispatch = useDispatch();
  const [items, setItems] = useState(shipments.map(s => s.id));
  const [isUpdating, setIsUpdating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    setItems(shipments.map(s => s.id));
  }, [shipments]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Обновление порядка на сервере
      setIsUpdating(true);
      try {
        // Обновляем только перемещенные элементы
        const movedShipment = shipments.find(s => s.id === active.id);
        if (movedShipment) {
          await api.put(`/shipments/${movedShipment.id}`, {
            ...movedShipment,
            displayOrder: newIndex + 1,
          });
          
          dispatch(updateShipment({
            id: movedShipment.id,
            displayOrder: newIndex + 1,
          }));
        }

        toast.success('Порядок грузоперевозки обновлен');
        if (onOrderChange) {
          onOrderChange(newItems.map(id => shipments.find(s => s.id === id)));
        }
      } catch (error) {
        console.error('Ошибка при обновлении порядка:', error);
        toast.error('Ошибка при обновлении порядка');
        // Откат изменений
        setItems(shipments.map(s => s.id));
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const sortedShipments = items
    .map(id => shipments.find(s => s.id === id))
    .filter(Boolean)
    .sort((a, b) => {
      // Сортировка по displayOrder, если доступно
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      return 0;
    });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '120px' }}>Перетаскивание</th>
            <th>ID</th>
            <th>Транспорт</th>
            <th>Маршрут</th>
            <th>Описание груза</th>
            <th>Вес</th>
            <th>Приоритет</th>
            <th>Статус</th>
            <th>Дата отправления</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {sortedShipments.map((shipment) => (
              <SortableShipmentItem
                key={shipment.id}
                shipment={shipment}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onDelete={onDelete}
                canEdit={canEdit}
              />
            ))}
          </SortableContext>
        </tbody>
      </table>
      {isUpdating && (
        <div style={{ textAlign: 'center', padding: '10px', color: '#666' }}>
          Обновление порядка...
        </div>
      )}
    </DndContext>
  );
}

export default SortableShipmentsList;
