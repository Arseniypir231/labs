import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { analyticsAPI } from '../services/analyticsAPI';
import { ToastContainer, toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const { token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [shipmentsByMonth, setShipmentsByMonth] = useState([]);
  const [shipmentsByStatus, setShipmentsByStatus] = useState([]);
  const [topRoutes, setTopRoutes] = useState([]);
  const [vehiclesByType, setVehiclesByType] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, [dateFilter]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateFilter.startDate) params.startDate = dateFilter.startDate;
      if (dateFilter.endDate) params.endDate = dateFilter.endDate;

      const [statsData, monthData, statusData, routesData, vehiclesData] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        analyticsAPI.getShipmentsByMonth(params),
        analyticsAPI.getShipmentsByStatus(),
        analyticsAPI.getTopRoutes(10),
        analyticsAPI.getVehiclesByType()
      ]);

      setStats(statsData.data);
      setShipmentsByMonth(monthData.data);
      setShipmentsByStatus(statusData.data);
      setTopRoutes(routesData.data);
      setVehiclesByType(vehiclesData.data);
    } catch (error) {
      toast.error('Ошибка при загрузке данных аналитики');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Данные для линейного графика динамики грузоперевозок
  const lineChartData = {
    labels: shipmentsByMonth.map(item => item.month),
    datasets: [
      {
        label: 'Количество грузоперевозок',
        data: shipmentsByMonth.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Общий вес (тонн)',
        data: shipmentsByMonth.map(item => item.totalWeight),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1'
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Динамика грузоперевозок по месяцам',
        font: {
          size: 16
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Количество грузоперевозок'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Вес (тонн)'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  // Данные для круговой диаграммы распределения по статусам
  const doughnutChartData = {
    labels: shipmentsByStatus.map(item => item.status),
    datasets: [
      {
        label: 'Количество грузоперевозок',
        data: shipmentsByStatus.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 2
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Распределение грузоперевозок по статусам',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Данные для столбчатой диаграммы топ маршрутов
  const barChartData = {
    labels: topRoutes.map(item => item.name || item.route),
    datasets: [
      {
        label: 'Количество перевозок',
        data: topRoutes.map(item => item.shipmentCount),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Топ-10 маршрутов по количеству перевозок',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const route = topRoutes[context.dataIndex];
            return `Общий вес: ${route.totalWeight.toFixed(2)} т`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Количество перевозок'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Маршруты'
        }
      }
    }
  };

  // Данные для столбчатой диаграммы распределения транспорта по типам
  const vehiclesBarChartData = {
    labels: vehiclesByType.map(item => item.type),
    datasets: [
      {
        label: 'Количество транспортных средств',
        data: vehiclesByType.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1
      }
    ]
  };

  const vehiclesBarChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Распределение транспортных средств по типам',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const vehicle = vehiclesByType[context.dataIndex];
            return `Общая грузоподъемность: ${vehicle.totalCapacity.toFixed(2)} т`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Количество'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Типы транспортных средств'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div>Загрузка данных аналитики...</div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <div className="card">
        <div className="card-header">
          <h2>Дашборд аналитики</h2>
          <div className="filters" style={{ marginTop: '20px', marginBottom: '0' }}>
            <label style={{ marginRight: '10px' }}>Период:</label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
              placeholder="Дата начала"
            />
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
              placeholder="Дата окончания"
            />
            <button 
              className="btn btn-secondary" 
              onClick={() => setDateFilter({ startDate: '', endDate: '' })}
            >
              Сбросить фильтр
            </button>
          </div>
        </div>

        {/* Общая статистика */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div className="detail-field" style={{ textAlign: 'center' }}>
              <label>Всего транспортных средств</label>
              <span style={{ fontSize: '24px', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>
                {stats.vehicles.total}
              </span>
              <span style={{ fontSize: '14px', color: '#666' }}>
                Активных: {stats.vehicles.active}
              </span>
            </div>
            <div className="detail-field" style={{ textAlign: 'center' }}>
              <label>Всего маршрутов</label>
              <span style={{ fontSize: '24px', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>
                {stats.routes.total}
              </span>
              <span style={{ fontSize: '14px', color: '#666' }}>
                Активных: {stats.routes.active}
              </span>
            </div>
            <div className="detail-field" style={{ textAlign: 'center' }}>
              <label>Всего грузоперевозок</label>
              <span style={{ fontSize: '24px', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>
                {stats.shipments.total}
              </span>
              <span style={{ fontSize: '14px', color: '#666' }}>
                Доставлено: {stats.shipments.delivered}
              </span>
            </div>
            <div className="detail-field" style={{ textAlign: 'center' }}>
              <label>Общий вес перевезено</label>
              <span style={{ fontSize: '24px', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>
                {stats.shipments.totalWeight.toFixed(2)} т
              </span>
            </div>
          </div>
        )}

        {/* Графики */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px', marginTop: '30px' }}>
          {/* Линейный график */}
          <div className="card" style={{ padding: '20px' }}>
            {shipmentsByMonth.length > 0 ? (
              <Line data={lineChartData} options={lineChartOptions} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Нет данных за выбранный период
              </div>
            )}
          </div>

          {/* Круговая диаграмма */}
          <div className="card" style={{ padding: '20px' }}>
            {shipmentsByStatus.length > 0 ? (
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Нет данных
              </div>
            )}
          </div>

          {/* Столбчатая диаграмма топ маршрутов */}
          <div className="card" style={{ padding: '20px' }}>
            {topRoutes.length > 0 ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Нет данных
              </div>
            )}
          </div>

          {/* Столбчатая диаграмма распределения транспорта */}
          <div className="card" style={{ padding: '20px' }}>
            {vehiclesByType.length > 0 ? (
              <Bar data={vehiclesBarChartData} options={vehiclesBarChartOptions} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Нет данных
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
