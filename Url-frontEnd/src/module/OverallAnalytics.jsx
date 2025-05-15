import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale
} from "chart.js";
import { Pie, Bar, Line, Radar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale
);

export default function OverallAnalytics({ data = [] }) {
  const [activeView, setActiveView] = useState("summary");
  const [theme, setTheme] = useState("default");
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Detect screen size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isMobile = windowWidth < 768;

  // Themes for styling
  const themes = {
    default: {
      backgroundColor: ["#4285F4", "#34A853", "#FBBC05", "#EA4335"],
      borderColor: "#FFFFFF",
      titleColor: "#333333",
      textColor: "#555555",
      bgGradientStart: "#f8f9fa",
      bgGradientEnd: "#e9ecef",
      cardBg: "#ffffff",
      highlightColor: "#4285F4"
    },
    dark: {
      backgroundColor: ["#00C6AE", "#6A7BFF", "#FF7272", "#FFAA5C"],
      borderColor: "#2a2a2a",
      titleColor: "#FFFFFF",
      textColor: "#CCCCCC",
      bgGradientStart: "#343a40",
      bgGradientEnd: "#212529",
      cardBg: "#2c3034",
      highlightColor: "#6A7BFF"
    },
    pastel: {
      backgroundColor: ["#ABDEE6", "#CBAACB", "#FFFFB5", "#FFC09F"],
      borderColor: "#FFFFFF",
      titleColor: "#6c757d",
      textColor: "#6c757d",
      bgGradientStart: "#ffffff",
      bgGradientEnd: "#f8f9fa",
      cardBg: "#ffffff",
      highlightColor: "#CBAACB"
    }
  };

  // Filter out any empty data
  const validData = data.filter(item => item && item.shortUrl);

  // Extract data for summary stats
  const totalUrls = validData.length;
  const totalClicks = validData.reduce((sum, item) => sum + (item.clickCount || 0), 0);
  const averageClicksPerUrl = totalUrls > 0 ? (totalClicks / totalUrls).toFixed(1) : 0;
  const mostClickedUrl = validData.reduce((max, item) => 
    (item.clickCount || 0) > (max.clickCount || 0) ? item : max, 
    { originalUrl: "None", clickCount: 0 }
  );

  // Get today's date for "today's clicks" calculation
  const today = new Date().toISOString().split("T")[0];
  const todayClicks = validData.reduce((sum, item) => {
    const todayClickEvents = (item.clickEvents || []).filter(event => 
      event.clickedDate && event.clickedDate.startsWith(today)
    );
    return sum + todayClickEvents.length;
  }, 0);

  // Calculate URLs with no clicks
  const urlsWithNoClicks = validData.filter(item => !item.clickCount || item.clickCount === 0).length;

  // Function to truncate long URLs for display
  const truncateUrl = (url, maxLength = isMobile ? 20 : 40) => {
    if (!url) return "";
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  // Prepare data for charts
  const prepareDistributionData = () => {
    // Use original URLs for labels instead of short URLs
    const labels = validData.map(item => 
      truncateUrl(item.originalUrl, isMobile ? 15 : 25)
    );
    const clickCounts = validData.map(item => item.clickCount || 0);
    
    return {
      labels,
      datasets: [
        {
          label: "Click Distribution",
          data: clickCounts,
          backgroundColor: labels.map((_, i) => 
            themes[theme].backgroundColor[i % themes[theme].backgroundColor.length]
          ),
          borderColor: themes[theme].borderColor,
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareTimelineData = () => {
    // Collect all click events
    const allEvents = [];
    validData.forEach(item => {
      if (item.clickEvents && item.clickEvents.length > 0) {
        item.clickEvents.forEach(event => {
          if (event.clickedDate) {
            allEvents.push({
              originalUrl: item.originalUrl,
              clickedDate: event.clickedDate
            });
          }
        });
      }
    });

    // Sort events by date
    allEvents.sort((a, b) => new Date(a.clickedDate) - new Date(b.clickedDate));

    // Group by date
    const dateGroups = {};
    allEvents.forEach(event => {
      const date = event.clickedDate.split("T")[0];
      if (!dateGroups[date]) {
        dateGroups[date] = 0;
      }
      dateGroups[date]++;
    });

    // Format for chart
    const labels = Object.keys(dateGroups);
    const clickCounts = Object.values(dateGroups);

    return {
      labels,
      datasets: [
        {
          label: "Clicks by Date",
          data: clickCounts,
          borderColor: themes[theme].highlightColor,
          backgroundColor: `${themes[theme].highlightColor}50`,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: themes[theme].highlightColor,
          pointBorderColor: themes[theme].borderColor,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const prepareHourlyDistribution = () => {
    // Initialize hours array (0-23)
    const hours = Array(24).fill(0);
    
    // Count clicks by hour
    validData.forEach(item => {
      if (item.clickEvents && item.clickEvents.length > 0) {
        item.clickEvents.forEach(event => {
          if (event.clickedDate) {
            const hour = new Date(event.clickedDate).getHours();
            hours[hour]++;
          }
        });
      }
    });
    
    // Format for radar chart
    return {
      labels: Array(24).fill().map((_, i) => `${i}:00`),
      datasets: [
        {
          label: "Clicks by Hour",
          data: hours,
          backgroundColor: `${themes[theme].highlightColor}50`,
          borderColor: themes[theme].highlightColor,
          borderWidth: 2,
          pointBackgroundColor: themes[theme].highlightColor,
        },
      ],
    };
  };

  // Chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: isMobile ? "bottom" : "right",
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: isMobile ? 10 : 12
          },
          color: themes[theme].textColor,
          boxWidth: isMobile ? 10 : 12
        }
      },
      title: {
        display: true,
        text: "URL Click Distribution",
        font: {
          family: "'Poppins', sans-serif",
          size: isMobile ? 14 : 16,
          weight: 'bold'
        },
        color: themes[theme].titleColor,
        padding: isMobile ? 10 : 20
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
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.raw / total) * 100);
            return `${label}: ${value} clicks (${percentage}%)`;
          }
        }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top",
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: isMobile ? 10 : 12
          },
          color: themes[theme].textColor
        }
      },
      title: {
        display: true,
        text: "Click Timeline",
        font: {
          family: "'Poppins', sans-serif",
          size: isMobile ? 14 : 16,
          weight: 'bold'
        },
        color: themes[theme].titleColor,
        padding: isMobile ? 10 : 20
      }
    },
    scales: {
      x: {
        title: {
          display: !isMobile,
          text: "Date",
          color: themes[theme].textColor
        },
        ticks: {
          color: themes[theme].textColor,
          maxRotation: isMobile ? 90 : 0,
          minRotation: isMobile ? 45 : 0,
          font: {
            size: isMobile ? 8 : 12
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: !isMobile,
          text: "Number of Clicks",
          color: themes[theme].textColor
        },
        ticks: {
          stepSize: 1,
          color: themes[theme].textColor,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top",
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: isMobile ? 10 : 12
          },
          color: themes[theme].textColor
        }
      },
      title: {
        display: true,
        text: "Clicks by Hour of Day",
        font: {
          family: "'Poppins', sans-serif",
          size: isMobile ? 14 : 16,
          weight: 'bold'
        },
        color: themes[theme].titleColor,
        padding: isMobile ? 10 : 20
      }
    },
    scales: {
      r: {
        angleLines: {
          color: `${themes[theme].textColor}30`
        },
        grid: {
          color: `${themes[theme].textColor}20`
        },
        pointLabels: {
          color: themes[theme].textColor,
          font: {
            size: isMobile ? 7 : 10
          }
        },
        ticks: {
          color: themes[theme].textColor,
          backdropColor: 'transparent',
          font: {
            size: isMobile ? 8 : 10
          }
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { 
        display: false
      },
      title: {
        display: true,
        text: "Click Count by URL",
        font: {
          family: "'Poppins', sans-serif",
          size: isMobile ? 14 : 16,
          weight: 'bold'
        },
        color: themes[theme].titleColor,
        padding: isMobile ? 10 : 20
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: !isMobile,
          text: "Number of Clicks",
          color: themes[theme].textColor
        },
        ticks: {
          stepSize: 1,
          color: themes[theme].textColor,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      y: {
        title: {
          display: !isMobile,
          text: "URL",
          color: themes[theme].textColor
        },
        ticks: {
          color: themes[theme].textColor,
          font: {
            size: isMobile ? 8 : 12
          },
          callback: function(val) {
            // Get the label at the index
            const label = this.getLabelForValue(val);
            // Truncate the label based on screen size
            return truncateUrl(label, isMobile ? 15 : 30);
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  // Component styles
  const containerStyle = {
    backgroundImage: `linear-gradient(to bottom right, ${themes[theme].bgGradientStart}, ${themes[theme].bgGradientEnd})`,
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: isMobile ? '15px' : '20px',
    width: '100%',
    maxWidth: '1200px',
    margin: '20px auto',
    fontFamily: "'Poppins', sans-serif",
    color: themes[theme].textColor,
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  const headerStyle = {
    textAlign: 'center',
    color: themes[theme].titleColor,
    marginBottom: isMobile ? '15px' : '20px',
    fontWeight: 'bold',
    fontSize: isMobile ? '22px' : '28px'
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    margin: isMobile ? '15px 0' : '20px 0',
    gap: isMobile ? '8px' : '10px'
  };

  const cardContainerStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: isMobile ? '10px' : '15px',
    marginBottom: isMobile ? '20px' : '30px'
  };

  const cardStyle = {
    backgroundColor: themes[theme].cardBg,
    padding: isMobile ? '15px' : '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isMobile ? '120px' : '150px'
  };

  const chartContainerStyle = {
    height: isMobile ? '300px' : '400px',
    backgroundColor: themes[theme].cardBg,
    padding: isMobile ? '15px' : '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: isMobile ? '15px' : '20px'
  };

  // Calculate percentage of URLs with no clicks
  const noClicksPercentage = totalUrls > 0 ? ((urlsWithNoClicks / totalUrls) * 100).toFixed(0) : 0;

  // Component for stat cards
  const StatCard = ({ title, value, icon, subtitle }) => (
    <div style={cardStyle}>
      <div style={{ fontSize: isMobile ? '20px' : '24px', marginBottom: '8px' }}>{icon}</div>
      <h3 style={{ 
        margin: '0 0 5px 0', 
        color: themes[theme].titleColor,
        fontSize: isMobile ? '14px' : '16px' 
      }}>{title}</h3>
      <div style={{ 
        fontSize: isMobile ? '20px' : '28px', 
        fontWeight: 'bold', 
        margin: '5px 0',
        color: themes[theme].highlightColor 
      }}>
        {value}
      </div>
      {subtitle && <div style={{ 
        fontSize: isMobile ? '12px' : '14px', 
        textAlign: 'center' 
      }}>{subtitle}</div>}
    </div>
  );

  // No data state
  if (!validData || validData.length === 0) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>URL Analytics Dashboard</h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '30px' : '50px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: isMobile ? '36px' : '48px', marginBottom: '20px' }}>📊</div>
          <h3 style={{ color: themes[theme].titleColor }}>No Analytics Data Available</h3>
          <p>Create and share some short URLs to start seeing analytics here.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>URL Analytics Dashboard</h2>
      
      {/* Theme Switcher */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginBottom: '15px',
        flexWrap: 'wrap'  
      }}>
        <label htmlFor="theme-select" style={{ 
          marginRight: '10px',
          fontSize: isMobile ? '14px' : '16px'
        }}>Theme:</label>
        <select 
          id="theme-select" 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)}
          style={{
            padding: isMobile ? '3px 8px' : '5px 10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: theme === 'dark' ? '#454545' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#333333',
            fontSize: isMobile ? '14px' : '16px'
          }}
        >
          <option value="default">Default</option>
          <option value="dark">Dark</option>
          <option value="pastel">Pastel</option>
        </select>
      </div>
      
      {/* Summary Stats Cards */}
      <div style={cardContainerStyle}>
        <StatCard 
          title="Total Short URLs" 
          value={totalUrls} 
          icon="🔗"
          subtitle="Active URLs"
        />
        <StatCard 
          title="Total Clicks" 
          value={totalClicks} 
          icon="👆"
          subtitle="All time"
        />
        <StatCard 
          title="Today's Clicks" 
          value={todayClicks} 
          icon="📅"
          subtitle={`${new Date().toLocaleDateString()}`}
        />
        <StatCard 
          title="Avg. Clicks per URL" 
          value={averageClicksPerUrl} 
          icon="📊"
          subtitle={`${noClicksPercentage}% URLs have no clicks`}
        />
      </div>
      
      {/* Navigation Tabs */}
      <div style={navStyle}>
        {["summary", "timeline", "hourly", "distribution"].map(view => (
          <button 
            key={view}
            onClick={() => setActiveView(view)}
            style={{
              padding: isMobile ? '6px 12px' : '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeView === view 
                ? themes[theme].highlightColor 
                : `${themes[theme].highlightColor}30`,
              color: activeView === view 
                ? '#ffffff' 
                : themes[theme].textColor,
              cursor: 'pointer',
              fontWeight: activeView === view ? 'bold' : 'normal',
              transition: 'all 0.3s ease',
              fontSize: isMobile ? '12px' : '14px'
            }}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Charts based on active view */}
      {activeView === "summary" && (
        <>
          <div style={chartContainerStyle}>
            <Bar 
              data={prepareDistributionData()} 
              options={barOptions} 
            />
          </div>
          
          <div style={{
            backgroundColor: themes[theme].cardBg,
            padding: isMobile ? '15px' : '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflowX: 'auto'
          }}>
            <h3 style={{ 
              color: themes[theme].titleColor, 
              borderBottom: `1px solid ${themes[theme].textColor}30`,
              paddingBottom: '10px',
              fontSize: isMobile ? '16px' : '18px'
            }}>
              URL Performance
            </h3>
            
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '15px',
              color: themes[theme].textColor,
              minWidth: isMobile ? '500px' : 'auto'
            }}>
              <thead>
                <tr style={{
                  borderBottom: `1px solid ${themes[theme].textColor}30`
                }}>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: isMobile ? '8px' : '10px',
                    fontSize: isMobile ? '13px' : '14px' 
                  }}>Original URL</th>
                  {!isMobile && <th style={{ 
                    textAlign: 'left', 
                    padding: '10px',
                    fontSize: '14px' 
                  }}>Short URL</th>}
                  <th style={{ 
                    textAlign: 'right', 
                    padding: isMobile ? '8px' : '10px',
                    fontSize: isMobile ? '13px' : '14px' 
                  }}>Clicks</th>
                  <th style={{ 
                    textAlign: 'right', 
                    padding: isMobile ? '8px' : '10px',
                    fontSize: isMobile ? '13px' : '14px' 
                  }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {validData.map(item => (
                  <tr key={item.id} style={{
                    borderBottom: `1px solid ${themes[theme].textColor}10`
                  }}>
                    <td style={{ 
                      padding: isMobile ? '8px' : '10px',
                      maxWidth: isMobile ? '200px' : '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: isMobile ? '12px' : '14px'
                    }}>
                      {item.originalUrl}
                    </td>
                    {!isMobile && <td style={{ 
                      padding: '10px',
                      fontSize: '14px'
                    }}>{item.shortUrl}</td>}
                    <td style={{ 
                      textAlign: 'right', 
                      padding: isMobile ? '8px' : '10px',
                      fontWeight: 'bold',
                      color: item.clickCount > 0 ? themes[theme].highlightColor : themes[theme].textColor,
                      fontSize: isMobile ? '12px' : '14px'
                    }}>
                      {item.clickCount || 0}
                    </td>
                    <td style={{ 
                      textAlign: 'right', 
                      padding: isMobile ? '8px' : '10px',
                      fontSize: isMobile ? '12px' : '14px'
                    }}>
                      {new Date(item.createdDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {activeView === "distribution" && (
        <div style={chartContainerStyle}>
          <Pie 
            data={prepareDistributionData()} 
            options={pieOptions}
          />
        </div>
      )}
      
      {activeView === "timeline" && (
        <div style={chartContainerStyle}>
          <Line 
            data={prepareTimelineData()} 
            options={lineOptions}
          />
        </div>
      )}
      
      {activeView === "hourly" && (
        <div style={chartContainerStyle}>
          <Radar 
            data={prepareHourlyDistribution()} 
            options={radarOptions}
          />
        </div>
      )}
      
      {/* Top Performer Card */}
      {activeView !== "summary" && mostClickedUrl.originalUrl !== "None" && (
        <div style={{
          backgroundColor: themes[theme].cardBg,
          padding: isMobile ? '15px' : '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '10px' : 0
        }}>
          <div style={{ width: isMobile ? '100%' : 'auto' }}>
            <h3 style={{ 
              color: themes[theme].titleColor,
              margin: '0 0 5px 0',
              fontSize: isMobile ? '16px' : '18px' 
            }}>
              Top Performing URL
            </h3>
            <div style={{ 
              marginBottom: '5px',
              fontSize: isMobile ? '12px' : '14px'
            }}>
              <strong>Original:</strong> 
              <span style={{ 
                marginLeft: '5px',
                maxWidth: isMobile ? '100%' : '500px',
                display: 'inline-block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {mostClickedUrl.originalUrl}
              </span>
            </div>
          </div>
          <div style={{
            backgroundColor: themes[theme].highlightColor,
            color: '#ffffff',
            borderRadius: '50%',
            width: isMobile ? '50px' : '60px',
            height: isMobile ? '50px' : '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexShrink: 0,
            alignSelf: isMobile ? 'flex-end' : 'center'
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: isMobile ? '18px' : '20px' 
            }}>{mostClickedUrl.clickCount}</div>
            <div style={{ 
              fontSize: isMobile ? '10px' : '12px' 
            }}>clicks</div>
          </div>
        </div>
      )}
    </div>
  );
}