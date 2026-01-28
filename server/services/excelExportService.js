const ExcelJS = require('exceljs');
const { Shipment, Vehicle, Route } = require('../models');

// Экспорт отчета по грузоперевозкам за период
exports.exportShipmentsReport = async (startDate, endDate) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Грузоперевозки');

  // Заголовок отчета
  worksheet.mergeCells('A1:F1');
  worksheet.getCell('A1').value = 'ОТЧЕТ ПО ГРУЗОПЕРЕВОЗКАМ';
  worksheet.getCell('A1').font = { size: 16, bold: true };
  worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.mergeCells('A2:F2');
  const periodText = `Период: ${startDate ? new Date(startDate).toLocaleDateString('ru-RU') : 'с начала'} - ${endDate ? new Date(endDate).toLocaleDateString('ru-RU') : 'по настоящее время'}`;
  worksheet.getCell('A2').value = periodText;
  worksheet.getCell('A2').font = { size: 12 };
  worksheet.getCell('A2').alignment = { horizontal: 'center' };

  worksheet.getRow(3).height = 5; // Пустая строка

  // Заголовки таблицы
  const headers = [
    'ID',
    'Транспортное средство',
    'Маршрут',
    'Описание груза',
    'Вес (т)',
    'Статус',
    'Дата отправления',
    'Дата доставки'
  ];

  const headerRow = worksheet.addRow(headers);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  // Получение данных
  const where = {};
  if (startDate) {
    where.departureDate = { [require('sequelize').Op.gte]: startDate };
  }
  if (endDate) {
    where.departureDate = {
      ...where.departureDate,
      [require('sequelize').Op.lte]: endDate
    };
  }

  const shipments = await Shipment.findAll({
    where,
    include: [
      { model: Vehicle, as: 'vehicle' },
      { model: Route, as: 'route' }
    ],
    order: [['departureDate', 'DESC']]
  });

  // Добавление данных
  let totalWeight = 0;
  const statusCounts = {};

  shipments.forEach(shipment => {
    const row = worksheet.addRow([
      shipment.id,
      shipment.vehicle ? `${shipment.vehicle.brand} ${shipment.vehicle.model} (${shipment.vehicle.licensePlate})` : 'N/A',
      shipment.route ? `${shipment.route.origin} → ${shipment.route.destination}` : 'N/A',
      shipment.cargoDescription,
      parseFloat(shipment.weight),
      shipment.status,
      shipment.departureDate ? new Date(shipment.departureDate).toLocaleDateString('ru-RU') : 'N/A',
      shipment.deliveryDate ? new Date(shipment.deliveryDate).toLocaleDateString('ru-RU') : 'N/A'
    ]);

    totalWeight += parseFloat(shipment.weight) || 0;
    statusCounts[shipment.status] = (statusCounts[shipment.status] || 0) + 1;
  });

  // Итоговая строка
  worksheet.addRow([]);
  const summaryRow = worksheet.addRow(['ИТОГО:', '', '', '', totalWeight.toFixed(2), '', '', '']);
  summaryRow.font = { bold: true };
  summaryRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFC000' }
  };

  // Статистика по статусам
  worksheet.addRow([]);
  worksheet.mergeCells(`A${worksheet.rowCount + 1}:F${worksheet.rowCount + 1}`);
  worksheet.getCell(`A${worksheet.rowCount}`).value = 'СТАТИСТИКА ПО СТАТУСАМ:';
  worksheet.getCell(`A${worksheet.rowCount}`).font = { bold: true };

  Object.keys(statusCounts).forEach(status => {
    const statusNames = {
      'pending': 'Ожидает',
      'in_transit': 'В пути',
      'delivered': 'Доставлено',
      'cancelled': 'Отменено'
    };
    worksheet.addRow(['', '', '', '', '', `${statusNames[status] || status}: ${statusCounts[status]}`, '', '']);
  });

  // Настройка ширины колонок
  worksheet.columns.forEach((column, index) => {
    if (index === 3) { // Описание груза
      column.width = 40;
    } else if (index === 1 || index === 2) { // Транспорт и маршрут
      column.width = 30;
    } else {
      column.width = 15;
    }
  });

  // Форматирование
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 4 && rowNumber <= 4 + shipments.length) {
      row.getCell(5).numFmt = '#,##0.00'; // Формат для веса
    }
  });

  return workbook;
};

// Экспорт сводки по транспортным средствам
exports.exportVehiclesReport = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Транспортные средства');

  // Заголовок
  worksheet.mergeCells('A1:H1');
  worksheet.getCell('A1').value = 'СВОДКА ПО ТРАНСПОРТНЫМ СРЕДСТВАМ';
  worksheet.getCell('A1').font = { size: 16, bold: true };
  worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.mergeCells('A2:H2');
  worksheet.getCell('A2').value = `Дата формирования: ${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU')}`;
  worksheet.getCell('A2').font = { size: 12 };
  worksheet.getCell('A2').alignment = { horizontal: 'center' };

  worksheet.getRow(3).height = 5;

  // Заголовки
  const headers = [
    'ID',
    'Номерной знак',
    'Марка',
    'Модель',
    'Тип',
    'Грузоподъемность (т)',
    'Год выпуска',
    'Статус'
  ];

  const headerRow = worksheet.addRow(headers);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  // Получение данных
  const vehicles = await Vehicle.findAll({
    order: [['vehicleType', 'ASC'], ['year', 'DESC']]
  });

  // Группировка по типам
  const vehiclesByType = {};
  let totalCapacity = 0;
  const statusCounts = {};

  vehicles.forEach(vehicle => {
    if (!vehiclesByType[vehicle.vehicleType]) {
      vehiclesByType[vehicle.vehicleType] = [];
    }
    vehiclesByType[vehicle.vehicleType].push(vehicle);
    totalCapacity += parseFloat(vehicle.capacity) || 0;
    statusCounts[vehicle.status] = (statusCounts[vehicle.status] || 0) + 1;
  });

  const typeNames = {
    'truck': 'Грузовики',
    'van': 'Фургоны',
    'car': 'Автомобили',
    'motorcycle': 'Мотоциклы'
  };

  // Добавление данных с группировкой
  Object.keys(vehiclesByType).forEach(type => {
    // Заголовок группы
    worksheet.addRow([]);
    const groupRow = worksheet.addRow([`${typeNames[type] || type}:`, '', '', '', '', '', '', '']);
    groupRow.font = { bold: true, size: 12 };
    groupRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE7E6E6' }
    };
    worksheet.mergeCells(`A${groupRow.number}:H${groupRow.number}`);

    // Данные группы
    vehiclesByType[type].forEach(vehicle => {
      worksheet.addRow([
        vehicle.id,
        vehicle.licensePlate,
        vehicle.brand,
        vehicle.model,
        vehicle.vehicleType,
        parseFloat(vehicle.capacity),
        vehicle.year,
        vehicle.status
      ]);
    });
  });

  // Итоговая статистика
  worksheet.addRow([]);
  worksheet.mergeCells(`A${worksheet.rowCount + 1}:H${worksheet.rowCount + 1}`);
  worksheet.getCell(`A${worksheet.rowCount}`).value = 'ИТОГОВАЯ СТАТИСТИКА:';
  worksheet.getCell(`A${worksheet.rowCount}`).font = { bold: true };

  worksheet.addRow(['Всего транспортных средств:', vehicles.length, '', '', '', `Общая грузоподъемность: ${totalCapacity.toFixed(2)} т`, '', '']);
  
  worksheet.addRow([]);
  worksheet.addRow(['Статистика по статусам:', '', '', '', '', '', '', '']);
  Object.keys(statusCounts).forEach(status => {
    const statusNames = {
      'available': 'Доступно',
      'in_use': 'В использовании',
      'maintenance': 'На обслуживании',
      'retired': 'Списано'
    };
    worksheet.addRow(['', `${statusNames[status] || status}:`, statusCounts[status], '', '', '', '', '']);
  });

  // Настройка ширины колонок
  worksheet.columns.forEach((column, index) => {
    if (index === 1 || index === 2 || index === 3) {
      column.width = 20;
    } else {
      column.width = 15;
    }
  });

  // Форматирование
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 4) {
      const capacityCell = row.getCell(6);
      if (capacityCell.value && typeof capacityCell.value === 'number') {
        capacityCell.numFmt = '#,##0.00';
      }
    }
  });

  return workbook;
};
