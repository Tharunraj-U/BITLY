import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ClickBarChart({ urlKey = "3XawOtqf" }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("dark");

  // Color themes for the chart
  const themes = {
    default: {
      backgroundColor: ["#34A853", "#4285F4", "#FBBC05", "#EA4335", "#8F44AD", "#16A085", "#F39C12"],
      borderColor: "#FFFFFF",
      titleColor: "#333333",
      textColor: "#555555",
      bgGradientStart: "#f8f9fa",
      bgGradientEnd: "#e9ecef",
    },
    dark: {
      backgroundColor: ["#00C6AE", "#6A7BFF", "#FF7272", "#FFAA5C", "#C490D1", "#5DA9E9", "#FF9D97"],
      borderColor: "#2a2a2a",
      titleColor: "#FFFFFF",
      textColor: "#CCCCCC",
      bgGradientStart: "#343a40",
      bgGradientEnd: "#212529",
    },
    pastel: {
      backgroundColor: ["#ABDEE6", "#CBAACB", "#FFFFB5", "#FFCCB6", "#F3B0C3", "#C6DBDA", "#FEE1E8"],
      borderColor: "#FFFFFF",
      titleColor: "#6c757d",
      textColor: "#6c757d",
      bgGradientStart: "#ffffff",
      bgGradientEnd: "#f8f9fa",
    }
  };

  useEffect(() => {
    const fetchClickData = async () => {
      setLoading(true);
      setError(null);

      const baseUrl = "http://localhost:8080/api/url/UrlSpecific";

      // Calculate date range: last 7 days, ending today at 23:59:59.999
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0); // start of day 7 days ago

      // Format date to ISO string without trailing 'Z'
      const formatDate = (date) => date.toISOString().replace("Z", "");

      const fullUrl = `${baseUrl}/${urlKey}?startDate=${formatDate(
        startDate
      )}&endDate=${formatDate(endDate)}`;

      console.log("Fetching data from:", fullUrl);

      try {
        const token = JSON.parse(localStorage.getItem("token"));
        console.log("Using token:", token);

        const response = await axios.get(fullUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API response data:", response.data);

        const apiData = response.data || [];

        if (apiData.length === 0) {
          setError("No click data found for the selected URL and date range.");
          setLoading(false);
          return;
        }

        // Format dates nicely
        const formattedData = apiData.map(item => {
          // Convert date string to Date object
          const date = new Date(item.clickedDate);
          // Format date as MM/DD
          const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
          return {
            ...item,
            formattedDate
          };
        });

        // Prepare chart data with formatted dates
        const labels = formattedData.map((item) => item.formattedDate);
        const counts = formattedData.map((item) => Math.round(item.count));

        // Assign colors from the current theme
        const currentTheme = themes[theme];
        const backgroundColors = counts.map((_, index) => 
          currentTheme.backgroundColor[index % currentTheme.backgroundColor.length]
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Click Count",
              data: counts,
              backgroundColor: backgroundColors,
              borderColor: currentTheme.borderColor,
              borderWidth: 1,
              borderRadius: 5,
              barThickness: 30,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClickData();
  }, [urlKey, theme]);

  // Enhanced chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top",
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: "URL Click Analytics - Last 7 Days",
        font: {
          family: "'Poppins', sans-serif",
          size: 18,
          weight: 'bold'
        },
        color: themes[theme].titleColor,
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: {
          family: "'Poppins', sans-serif",
          size: 13
        },
        bodyFont: {
          family: "'Poppins', sans-serif",
          size: 12
        },
        padding: 10,
        caretSize: 8,
        cornerRadius: 6,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { 
          display: true, 
          text: "Click Count",
          font: {
            family: "'Poppins', sans-serif",
            size: 14
          },
          color: themes[theme].textColor
        },
        ticks: {
          callback: (value) => (Number.isInteger(value) ? value : null),
          stepSize: 1,
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          },
          color: themes[theme].textColor
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.15)'
        }
      },
      x: {
        title: { 
          display: true, 
          text: "Date", 
          font: {
            family: "'Poppins', sans-serif",
            size: 14
          },
          color: themes[theme].textColor
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          },
          color: themes[theme].textColor
        },
        grid: {
          display: false
        }
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    }
  };

  // Theme switcher component
  const ThemeSwitcher = () => (
    <div className="theme-switcher">
      <label htmlFor="theme-select">Chart Theme:</label>
      <select 
        id="theme-select" 
        value={theme} 
        onChange={(e) => setTheme(e.target.value)}
        className="theme-select"
      >
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="pastel">Pastel</option>
      </select>
    </div>
  );

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Loading analytics data...</p>
    </div>
  );

  // Error display component
  const ErrorMessage = ({ message }) => (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p>{message}</p>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-icon">📊</div>
      <p>No chart data to display</p>
    </div>
  );

  // Gradient background style based on theme
  const containerStyle = {
    backgroundImage: `linear-gradient(to bottom right, ${themes[theme].bgGradientStart}, ${themes[theme].bgGradientEnd})`,
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '20px',
    width: '90%',
    maxWidth: '900px',
    margin: '20px auto',
    minHeight: '400px',
    fontFamily: "'Poppins', sans-serif",
  };

  const headerStyle = {
    textAlign: 'center',
    color: themes[theme].titleColor,
    marginBottom: '20px',
    fontWeight: 'bold',
    fontSize: '24px'
  };

  const chartContainerStyle = {
    height: '350px',
    position: 'relative'
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>URL Analytics Dashboard</h2>
      <ThemeSwitcher />
      
      <div style={chartContainerStyle}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : !chartData ? (
          <EmptyState />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
      
      <style jsx>{`
        .theme-switcher {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-bottom: 15px;
          color: ${themes[theme].textColor};
        }
        
        .theme-select {
          margin-left: 10px;
          padding: 5px 10px;
          border-radius: 4px;
          border: 1px solid #ddd;
          background-color: ${theme === 'dark' ? '#454545' : '#ffffff'};
          color: ${theme === 'dark' ? '#ffffff' : '#333333'};
        }
        
        .spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: ${themes[theme].textColor};
        }
        
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: ${themes[theme].backgroundColor[0]};
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: ${themes[theme].textColor};
          text-align: center;
        }
        
        .error-icon, .empty-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}