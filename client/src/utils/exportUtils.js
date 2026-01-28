// Утилиты для экспорта данных

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Экспорт отчета по грузоперевозкам
export const exportShipmentsReport = async (format, startDate, endDate, token) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const url = `${API_BASE_URL}/export/shipments/${format}?${params.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Ошибка при экспорте отчета');
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  
  const extension = format === 'excel' ? 'xlsx' : 'pdf';
  const filename = `shipments_report_${new Date().toISOString().split('T')[0]}.${extension}`;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

// Экспорт сводки по транспортным средствам
export const exportVehiclesReport = async (format, token) => {
  const url = `${API_BASE_URL}/export/vehicles/${format}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Ошибка при экспорте отчета');
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  
  const extension = format === 'excel' ? 'xlsx' : 'pdf';
  const filename = `vehicles_report_${new Date().toISOString().split('T')[0]}.${extension}`;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};
