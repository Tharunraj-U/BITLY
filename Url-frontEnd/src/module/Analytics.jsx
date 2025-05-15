import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = () => {
  const [urlSpecificData, setUrlSpecificData] = useState([]);
  const [totalClickData, setTotalClickData] = useState({});
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem('token')); // Get bearer token from local storage

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get('http://localhost:8080/api/url/UrlSpecific/vdmTloc8', {
            params: {
              startDate: '2025-05-10T00:00:00',
              endDate: '2025-05-23T00:00:00',
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('http://localhost:8080/api/url/totalClickAnalytics', {
            params: {
              startDate: '2025-05-01',
              endDate: '2025-05-16',
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setUrlSpecificData(res1.data);
        setTotalClickData(res2.data);
      } catch (err) {
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading chart...</p>;

  // Merge and sort all unique dates
  const labels = Array.from(
    new Set([
      ...urlSpecificData.map((item) => item.clickedDate),
      ...Object.keys(totalClickData),
    ])
  ).sort();

  // Map the counts for the labels
  const urlSpecificCounts = labels.map(
    (date) => urlSpecificData.find((item) => item.clickedDate === date)?.count || 0
  );

  const totalClickCounts = labels.map((date) => totalClickData[date] || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'URL Specific Clicks',
        data: urlSpecificCounts,
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
      {
        label: 'Total Clicks',
        data: totalClickCounts,
        backgroundColor: 'rgba(153,102,255,0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Click Analytics</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Analytics;
