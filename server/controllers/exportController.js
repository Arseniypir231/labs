const excelExportService = require('../services/excelExportService');
const pdfExportService = require('../services/pdfExportService');

// Экспорт отчета по грузоперевозкам в Excel
exports.exportShipmentsExcel = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const workbook = await excelExportService.exportShipmentsReport(startDate, endDate);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=shipments_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Ошибка при экспорте в Excel:', error);
    res.status(500).json({ error: 'Ошибка при экспорте отчета в Excel' });
  }
};

// Экспорт отчета по грузоперевозкам в PDF
exports.exportShipmentsPDF = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const pdfDoc = await pdfExportService.exportShipmentsReportPDF(startDate, endDate);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=shipments_report_${new Date().toISOString().split('T')[0]}.pdf`);
    
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error('Ошибка при экспорте в PDF:', error);
    res.status(500).json({ error: 'Ошибка при экспорте отчета в PDF' });
  }
};

// Экспорт сводки по транспортным средствам в Excel
exports.exportVehiclesExcel = async (req, res) => {
  try {
    const workbook = await excelExportService.exportVehiclesReport();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=vehicles_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Ошибка при экспорте в Excel:', error);
    res.status(500).json({ error: 'Ошибка при экспорте отчета в Excel' });
  }
};

// Экспорт сводки по транспортным средствам в PDF
exports.exportVehiclesPDF = async (req, res) => {
  try {
    const pdfDoc = await pdfExportService.exportVehiclesReportPDF();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=vehicles_report_${new Date().toISOString().split('T')[0]}.pdf`);
    
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error('Ошибка при экспорте в PDF:', error);
    res.status(500).json({ error: 'Ошибка при экспорте отчета в PDF' });
  }
};
