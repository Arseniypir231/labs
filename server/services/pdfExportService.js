const pdfMake = require('pdfmake');
const { Sequelize } = require('sequelize');
const { Shipment, Vehicle, Route } = require('../models');
const path = require('path');
const fs = require('fs');

// Настройка шрифтов для русского языка
// Загружаем шрифты Roboto из файловой системы для поддержки кириллицы
try {
  // Путь к шрифтам Roboto в node_modules/pdfmake
  const fontsPath = path.join(__dirname, '../node_modules/pdfmake/fonts/Roboto');
  
  // Проверяем наличие файлов шрифтов
  const robotoRegular = path.join(fontsPath, 'Roboto-Regular.ttf');
  const robotoBold = path.join(fontsPath, 'Roboto-Medium.ttf'); // Используем Medium как Bold
  const robotoItalic = path.join(fontsPath, 'Roboto-Italic.ttf');
  const robotoBoldItalic = path.join(fontsPath, 'Roboto-MediumItalic.ttf');
  
  if (fs.existsSync(robotoRegular)) {
    // Загружаем шрифты из файловой системы как Buffer
    // pdfmake требует Buffer для шрифтов TTF
    const fonts = {
      Roboto: {
        normal: fs.readFileSync(robotoRegular),
        bold: fs.existsSync(robotoBold) ? fs.readFileSync(robotoBold) : fs.readFileSync(robotoRegular),
        italics: fs.existsSync(robotoItalic) ? fs.readFileSync(robotoItalic) : fs.readFileSync(robotoRegular),
        bolditalics: fs.existsSync(robotoBoldItalic) ? fs.readFileSync(robotoBoldItalic) : fs.readFileSync(robotoRegular)
      }
    };
    // Устанавливаем шрифты в pdfmake
    pdfMake.setFonts(fonts);
    console.log('Шрифты Roboto успешно загружены для поддержки кириллицы');
  } else {
    throw new Error('Шрифты Roboto не найдены по пути: ' + fontsPath);
  }
} catch (error) {
  // Если не удалось загрузить шрифты, используем стандартные
  // ВНИМАНИЕ: стандартные шрифты могут не поддерживать кириллицу полностью
  console.warn('Не удалось загрузить шрифты Roboto:', error.message);
  console.warn('Используем стандартные шрифты PDF (могут не поддерживать кириллицу)');
  const fonts = {
    Roboto: {
      normal: 'Courier',
      bold: 'Courier-Bold',
      italics: 'Courier-Oblique',
      bolditalics: 'Courier-BoldOblique'
    }
  };
  pdfMake.setFonts(fonts);
}

// Экспорт отчета по грузоперевозкам за период в PDF
exports.exportShipmentsReportPDF = async (startDate, endDate) => {
  const where = {};
  if (startDate) {
    where.departureDate = { [Sequelize.Op.gte]: startDate };
  }
  if (endDate) {
    where.departureDate = {
      ...where.departureDate,
      [Sequelize.Op.lte]: endDate
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

  // Подсчет статистики
  let totalWeight = 0;
  const statusCounts = {};
  shipments.forEach(shipment => {
    totalWeight += parseFloat(shipment.weight) || 0;
    statusCounts[shipment.status] = (statusCounts[shipment.status] || 0) + 1;
  });

  const statusNames = {
    'pending': 'Ожидает',
    'in_transit': 'В пути',
    'delivered': 'Доставлено',
    'cancelled': 'Отменено'
  };

  // Формирование документа
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10
    },
    header: {
      text: 'ОТЧЕТ ПО ГРУЗОПЕРЕВОЗКАМ',
      style: 'header',
      alignment: 'center',
      margin: [0, 0, 0, 20]
    },
    content: [
      {
        text: `Период: ${startDate ? new Date(startDate).toLocaleDateString('ru-RU') : 'с начала'} - ${endDate ? new Date(endDate).toLocaleDateString('ru-RU') : 'по настоящее время'}`,
        style: 'subheader',
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      {
        text: `Дата формирования: ${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU')}`,
        style: 'subheader',
        alignment: 'center',
        margin: [0, 0, 0, 30]
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', '*', 'auto', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'ID', style: 'tableHeader', alignment: 'center' },
              { text: 'Транспорт', style: 'tableHeader', alignment: 'center' },
              { text: 'Маршрут', style: 'tableHeader', alignment: 'center' },
              { text: 'Описание груза', style: 'tableHeader', alignment: 'center' },
              { text: 'Вес (т)', style: 'tableHeader', alignment: 'center' },
              { text: 'Статус', style: 'tableHeader', alignment: 'center' },
              { text: 'Отправление', style: 'tableHeader', alignment: 'center' },
              { text: 'Доставка', style: 'tableHeader', alignment: 'center' }
            ],
            ...shipments.map(shipment => [
              { text: shipment.id.toString(), alignment: 'center' },
              { text: shipment.vehicle ? `${shipment.vehicle.brand} ${shipment.vehicle.model}\n(${shipment.vehicle.licensePlate})` : 'N/A', fontSize: 9 },
              { text: shipment.route ? `${shipment.route.origin} → ${shipment.route.destination}` : 'N/A', fontSize: 9 },
              { text: shipment.cargoDescription, fontSize: 9 },
              { text: parseFloat(shipment.weight).toFixed(2), alignment: 'right' },
              { text: statusNames[shipment.status] || shipment.status, alignment: 'center' },
              { text: shipment.departureDate ? new Date(shipment.departureDate).toLocaleDateString('ru-RU') : 'N/A', alignment: 'center', fontSize: 9 },
              { text: shipment.deliveryDate ? new Date(shipment.deliveryDate).toLocaleDateString('ru-RU') : 'N/A', alignment: 'center', fontSize: 9 }
            ])
          ]
        },
        layout: {
          fillColor: (rowIndex) => {
            if (rowIndex === 0) return '#4472C4';
            return rowIndex % 2 === 0 ? '#F2F2F2' : null;
          }
        }
      },
      { text: '', margin: [0, 20, 0, 0] },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: 'ИТОГО:', style: 'summaryLabel', bold: true },
              { text: `Общий вес: ${totalWeight.toFixed(2)} т`, style: 'summaryValue', alignment: 'right', bold: true }
            ],
            [
              { text: 'Всего грузоперевозок:', style: 'summaryLabel' },
              { text: shipments.length.toString(), style: 'summaryValue', alignment: 'right' }
            ]
          ]
        },
        layout: 'noBorders'
      },
      { text: '', margin: [0, 20, 0, 0] },
      {
        text: 'СТАТИСТИКА ПО СТАТУСАМ:',
        style: 'sectionHeader',
        margin: [0, 0, 0, 10]
      },
      {
        ul: Object.keys(statusCounts).map(status => ({
          text: `${statusNames[status] || status}: ${statusCounts[status]}`
        }))
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 12,
        margin: [0, 0, 0, 10]
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: 'white'
      },
      summaryLabel: {
        fontSize: 11
      },
      summaryValue: {
        fontSize: 11
      },
      sectionHeader: {
        fontSize: 12,
        bold: true
      }
    }
  };

  const pdfDoc = await pdfMake.createPdf(docDefinition);
  const stream = await pdfDoc.getStream();
  return stream;
};

// Экспорт сводки по транспортным средствам в PDF
exports.exportVehiclesReportPDF = async () => {
  const vehicles = await Vehicle.findAll({
    order: [['vehicleType', 'ASC'], ['year', 'DESC']]
  });

  // Группировка и статистика
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

  const statusNames = {
    'available': 'Доступно',
    'in_use': 'В использовании',
    'maintenance': 'На обслуживании',
    'retired': 'Списано'
  };

  // Формирование таблиц для каждой группы
  const typeTables = Object.keys(vehiclesByType).map(type => {
    const typeVehicles = vehiclesByType[type];
    return [
      {
        text: typeNames[type] || type,
        style: 'sectionHeader',
        margin: [0, 20, 0, 10]
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', '*', 'auto', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'ID', style: 'tableHeader', alignment: 'center' },
              { text: 'Номер', style: 'tableHeader', alignment: 'center' },
              { text: 'Марка', style: 'tableHeader', alignment: 'center' },
              { text: 'Модель', style: 'tableHeader', alignment: 'center' },
              { text: 'Тип', style: 'tableHeader', alignment: 'center' },
              { text: 'Грузоподъемность (т)', style: 'tableHeader', alignment: 'center' },
              { text: 'Год', style: 'tableHeader', alignment: 'center' },
              { text: 'Статус', style: 'tableHeader', alignment: 'center' }
            ],
            ...typeVehicles.map(vehicle => [
              { text: vehicle.id.toString(), alignment: 'center' },
              { text: vehicle.licensePlate, fontSize: 9 },
              { text: vehicle.brand, fontSize: 9 },
              { text: vehicle.model, fontSize: 9 },
              { text: vehicle.vehicleType, alignment: 'center', fontSize: 9 },
              { text: parseFloat(vehicle.capacity).toFixed(2), alignment: 'right' },
              { text: vehicle.year.toString(), alignment: 'center' },
              { text: statusNames[vehicle.status] || vehicle.status, alignment: 'center', fontSize: 9 }
            ])
          ]
        },
        layout: {
          fillColor: (rowIndex) => {
            if (rowIndex === 0) return '#4472C4';
            return rowIndex % 2 === 0 ? '#F2F2F2' : null;
          }
        }
      }
    ];
  }).flat();

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10
    },
    header: {
      text: 'СВОДКА ПО ТРАНСПОРТНЫМ СРЕДСТВАМ',
      style: 'header',
      alignment: 'center',
      margin: [0, 0, 0, 20]
    },
    content: [
      {
        text: `Дата формирования: ${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU')}`,
        style: 'subheader',
        alignment: 'center',
        margin: [0, 0, 0, 30]
      },
      ...typeTables,
      { text: '', margin: [0, 20, 0, 0] },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: 'ИТОГО:', style: 'summaryLabel', bold: true },
              { text: `Всего: ${vehicles.length} единиц`, style: 'summaryValue', alignment: 'right', bold: true }
            ],
            [
              { text: 'Общая грузоподъемность:', style: 'summaryLabel' },
              { text: `${totalCapacity.toFixed(2)} т`, style: 'summaryValue', alignment: 'right', bold: true }
            ]
          ]
        },
        layout: 'noBorders'
      },
      { text: '', margin: [0, 20, 0, 0] },
      {
        text: 'СТАТИСТИКА ПО СТАТУСАМ:',
        style: 'sectionHeader',
        margin: [0, 0, 0, 10]
      },
      {
        ul: Object.keys(statusCounts).map(status => ({
          text: `${statusNames[status] || status}: ${statusCounts[status]}`
        }))
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 12,
        margin: [0, 0, 0, 10]
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: 'white'
      },
      summaryLabel: {
        fontSize: 11
      },
      summaryValue: {
        fontSize: 11
      },
      sectionHeader: {
        fontSize: 12,
        bold: true
      }
    }
  };

  const pdfDoc = await pdfMake.createPdf(docDefinition);
  const stream = await pdfDoc.getStream();
  return stream;
};
