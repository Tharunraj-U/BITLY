import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UrlBarChart from "./UrlBarChart";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  IconButton,
  Collapse,
  Divider,
  Switch,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Tooltip,
  Chip,
  Card,
  CardContent,
  CardActions,
  Fade,
  CircularProgress,
  styled
} from "@mui/material";
import { motion } from "framer-motion";
import { 
  FiBarChart2, 
  FiCalendar, 
  FiExternalLink, 
  FiEye, 
  FiCopy, 
  FiSun, 
  FiMoon,
  FiLink,
  FiClock
} from "react-icons/fi";
import { 
  BiLinkAlt, 
  BiData, 
  BiHistory, 
  BiRocket, 
  BiAnalyse 
} from "react-icons/bi";
import { 
  HiOutlineClipboardCopy, 
  HiOutlineGlobe, 
  HiOutlineLightningBolt 
} from "react-icons/hi";
import { 
  IoStatsChartOutline, 
  IoTimeOutline, 
  IoCalendarOutline 
} from "react-icons/io5";
import OverallAnalytics from "./OverallAnalytics";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
  position: "relative",
  overflow: "visible",
  marginBottom: theme.spacing(4),
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
  transition: "all 0.3s",
  "&:hover": {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
    boxShadow: "0 4px 7px 2px rgba(33, 203, 243, .4)",
  },
}));

const AnimatedBox = styled(motion.div)({
  width: "100%",
});

const BadgeChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: -10,
  right: 20,
  fontWeight: "bold",
  zIndex: 1,
}));

const Home = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [data, setData] = useState([]);
  const [analyticsOpen, setAnalyticsOpen] = useState({});
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Create theme based on dark mode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#00bcd4" : "#1976d2",
        light: darkMode ? "#33c9dc" : "#42a5f5",
        dark: darkMode ? "#008394" : "#1565c0",
      },
      secondary: {
        main: darkMode ? "#f48fb1" : "#9c27b0",
      },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
      h3: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: "all 0.3s ease",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  const getSortedUrls = async () => {
    if (!originalUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.post(
        "http://localhost:8080/api/url/shortUrl",
        { originalUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (res.data.shortUrl) {
        setShortenedUrl(res.data.shortUrl);
        toast.success("URL successfully shortened!");
        fetchData(); // Refresh data after creating new short URL
      } else {
        toast.warning("No shortened URL generated");
      }
    } catch (err) {
      toast.error("Error: " + (err.response?.data?.message || "Failed to shorten URL"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (token) {
        const res = await axios.get("http://localhost:8080/api/url/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load your URLs");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Check system preference for dark mode
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDarkMode);
  }, []);

  const handleAnalyticsToggle = (shortUrl) => {
    setAnalyticsOpen((prev) => ({
      ...prev,
      [shortUrl]: !prev[shortUrl],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard!");
  };

  const chartData = data.map((url) => ({
    shortUrl: url.shortUrl,
    clickCount: url.clickCount,
    originalUrl: url.originalUrl,
    createdDate: url.createdDate,
    clickEvents: url.clickEvents,
  }));

  const formatUrl = (url) => {
    if (url.length > 50) {
      return url.substring(0, 47) + "...";
    }
    return url;
  };

  // Format relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    return past.toLocaleDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
      
      <Container maxWidth="lg">
        <Box sx={{ p: { xs: 2, md: 4 }, pt: { xs: 4, md: 6 } }}>
          {/* Header Area with Dark Mode Toggle */}
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              mb: 4 
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <HiOutlineGlobe size={40} color={theme.palette.primary.main} />
              <Typography 
                variant="h3" 
                sx={{ 
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 800
                }}
              >
                URL Shortener
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FiSun size={18} />
              <Switch 
                checked={darkMode} 
                onChange={() => setDarkMode(!darkMode)} 
                color="primary" 
              />
              <FiMoon size={18} />
            </Box>
          </Box>

          {/* URL Input Section */}
          <Paper 
            elevation={darkMode ? 2 : 3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              background: darkMode 
                ? "linear-gradient(145deg, #20212b 0%, #1a1a1f 100%)" 
                : "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <BiLinkAlt size={24} color={theme.palette.primary.main} />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Create Short URL
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" }, 
              gap: 2, 
              mb: 2 
            }}>
              <TextField
                fullWidth
                label="Enter URL to shorten"
                variant="outlined"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                InputProps={{
                  startAdornment: <FiLink style={{ marginRight: 8, color: theme.palette.text.secondary }} />,
                }}
                sx={{ flex: 1 }}
              />
              <GradientButton 
                variant="contained" 
                onClick={getSortedUrls}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <HiOutlineLightningBolt />}
                sx={{ 
                  height: { sm: 56 }, 
                  px: 3,
                  minWidth: { xs: "100%", sm: "150px" } 
                }}
              >
                {loading ? "Processing" : "Shorten"}
              </GradientButton>
            </Box>
          </Paper>

          {/* Display New Shortened URL */}
          {shortenedUrl && (
            <Fade in={!!shortenedUrl}>
              <Paper 
                elevation={4} 
                sx={{ 
                  p: 3, 
                  mb: 4, 
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  borderRadius: 2,
                  background: darkMode 
                    ? "linear-gradient(145deg, #262631 0%, #1e1e24 100%)" 
                    : "linear-gradient(145deg, #e6f7ff 0%, #e3f2fd 100%)"
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BiRocket size={22} color={theme.palette.primary.main} />
                    Your shortened URL is ready!
                  </Typography>
                  <Chip 
                    label="NEW" 
                    color="secondary" 
                    size="small" 
                    sx={{ fontWeight: "bold" }} 
                  />
                </Box>
                
                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    mt: 2, 
                    justifyContent: "space-between",
                    backgroundColor: darkMode ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.03)",
                    p: 2,
                    borderRadius: 1
                  }}
                >
                  <Link
                    to={`http://localhost:8080/${shortenedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 8, 
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                      fontSize: "1.1rem"
                    }}
                  >
                    <FiExternalLink size={20} />
                    {`http://localhost:8080/${shortenedUrl}`}
                  </Link>
                  
                  <Tooltip title="Copy to clipboard">
                    <IconButton 
                      onClick={() => copyToClipboard(`http://localhost:8080/${shortenedUrl}`)}
                      color="primary"
                    >
                      <HiOutlineClipboardCopy size={20} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Fade>
          )}

          {/* Overall Analytics Dashboard */}
          {chartData.length > 0 && (
            <AnimatedBox 
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Paper 
                  elevation={darkMode ? 3 : 4} 
                  sx={{ 
                    p: { xs: 2, md: 3 }, 
                    mb: 4, 
                    borderRadius: 2,
                    background: darkMode 
                      ? "linear-gradient(145deg, #1c1c24 0%, #262631 100%)" 
                      : "linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)"
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1.5 }}>
                    <IoStatsChartOutline size={24} color={theme.palette.primary.main} />
                    <Typography variant="h6">
                      Overall Analytics Dashboard
                    </Typography>
                    
                    {refreshing ? (
                      <CircularProgress size={20} sx={{ ml: "auto" }} />
                    ) : (
                      <Tooltip title="Refresh data">
                        <IconButton 
                          onClick={fetchData} 
                          sx={{ ml: "auto" }}
                          size="small"
                        >
                          <BiData size={20} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  
                  <Divider sx={{ mb: 3 }} />
                  <OverallAnalytics data={chartData} />
                </Paper>
              </motion.div>
            </AnimatedBox>
          )}

          {/* URL Cards List */}
          {chartData.length > 0 && (
            <Box sx={{ my: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
                <BiAnalyse size={24} color={theme.palette.primary.main} />
                Your Shortened URLs
                <Chip 
                  label={`${data.length} URLs`} 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 2, fontWeight: "bold" }} 
                />
              </Typography>
              
              <AnimatedBox
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {data.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <StyledCard elevation={darkMode ? 3 : 2}>
                      {item.clickCount > 0 && (
                        <BadgeChip 
                          label={`${item.clickCount} Click${item.clickCount !== 1 ? 's' : ''}`} 
                          color="primary" 
                          size="small"
                        />
                      )}
                      
                      <CardContent>
                        <Box sx={{ mb: 2 }}>
                          <Typography 
                            variant="subtitle2" 
                            color="text.secondary"
                            sx={{ 
                              display: "flex", 
                              alignItems: "center", 
                              gap: 1, 
                              mb: 0.5 
                            }}
                          >
                            <HiOutlineGlobe size={16} />
                            Original URL
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              wordBreak: "break-word", 
                              fontWeight: 500,
                              fontSize: "0.95rem" 
                            }}
                          >
                            {formatUrl(item.originalUrl)}
                          </Typography>
                        </Box>

                        <Box 
                          sx={{ 
                            mb: 2, 
                            p: 1.5, 
                            borderRadius: 1,
                            backgroundColor: darkMode ? "rgba(0,188,212,0.1)" : "rgba(25,118,210,0.05)",
                            borderLeft: `3px solid ${theme.palette.primary.main}`
                          }}
                        >
                          <Typography 
                            variant="subtitle2" 
                            color="text.secondary"
                            sx={{ 
                              display: "flex", 
                              alignItems: "center", 
                              gap: 1, 
                              mb: 0.5 
                            }}
                          >
                            <FiLink size={16} />
                            Shortened URL
                          </Typography>
                          
                          <Box 
                            sx={{ 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "space-between" 
                            }}
                          >
                            <Link
                              to={`http://localhost:8080/${item.shortUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: 6, 
                                color: theme.palette.primary.main, 
                                fontWeight: 600,
                                textDecoration: "none" 
                              }}
                            >
                              <FiExternalLink size={16} />
                              {`http://localhost:8080/${item.shortUrl}`}
                            </Link>
                            
                            <Tooltip title="Copy to clipboard">
                              <IconButton 
                                onClick={() => copyToClipboard(`http://localhost:8080/${item.shortUrl}`)}
                                size="small"
                                color="primary"
                              >
                                <FiCopy size={16} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        <Box 
                          sx={{ 
                            display: "flex", 
                            gap: { xs: 1, sm: 3 }, 
                            flexWrap: "wrap",
                            mb: 1
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              display: "flex", 
                              alignItems: "center", 
                              gap: 1 
                            }}
                          >
                            <FiEye size={16} color={theme.palette.primary.main} />
                            {item.clickCount || 0} clicks
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              display: "flex", 
                              alignItems: "center", 
                              gap: 1 
                            }}
                          >
                            <IoCalendarOutline size={16} color={theme.palette.secondary.main} />
                            Created: {new Date(item.createdDate).toLocaleDateString()}
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              display: "flex", 
                              alignItems: "center", 
                              gap: 1,
                              ml: { xs: 0, sm: "auto" }
                            }}
                          >
                            <IoTimeOutline size={16} />
                            {getRelativeTime(item.createdDate)}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                        <Button
                          variant={analyticsOpen[item.shortUrl] ? "contained" : "outlined"}
                          size="small"
                          startIcon={<FiBarChart2 />}
                          onClick={() => handleAnalyticsToggle(item.shortUrl)}
                          sx={{ borderRadius: 4 }}
                        >
                          {analyticsOpen[item.shortUrl] ? "Hide Analytics" : "Show Analytics"}
                        </Button>
                        
                        {item.clickEvents?.length > 0 && (
                          <Chip 
                            icon={<BiHistory />}
                            label={`${item.clickEvents.length} Events`}
                            variant="outlined"
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        )}
                      </CardActions>

                      <Collapse in={analyticsOpen[item.shortUrl]} timeout="auto" unmountOnExit>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ px: 2, pb: 2 }}>
                          <UrlBarChart urlKey={item.shortUrl} />
                          
                          {item.clickEvents?.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  mb: 2, 
                                  display: "flex", 
                                  alignItems: "center", 
                                  gap: 1 
                                }}
                              >
                                <FiClock size={18} color={theme.palette.primary.main} />
                                Click History
                              </Typography>
                              
                              <Box 
                                sx={{ 
                                  maxHeight: "200px", 
                                  overflowY: "auto", 
                                  pr: 1,
                                  mt: 1
                                }}
                              >
                                {item.clickEvents.map((event) => (
                                  <Paper
                                    key={event.id}
                                    variant="outlined"
                                    sx={{ 
                                      p: 1.5, 
                                      mb: 1, 
                                      backgroundColor: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                                      borderRadius: 1,
                                      display: "flex",
                                      alignItems: "center"
                                    }}
                                  >
                                    <Typography 
                                      variant="body2"
                                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                    >
                                      <IoTimeOutline size={16} />
                                      {new Date(event.clickedDate).toLocaleString()}
                                    </Typography>
                                    
                                    <Chip 
                                      label={getRelativeTime(event.clickedDate)}
                                      size="small"
                                      variant="outlined"
                                      sx={{ ml: "auto", fontSize: "0.7rem" }}
                                    />
                                  </Paper>
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </StyledCard>
                  </motion.div>
                ))}
              </AnimatedBox>
            </Box>
          )}
          
          {/* Empty State */}
          {data.length === 0 && !loading && (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                textAlign: "center", 
                borderRadius: 2,
                backgroundColor: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)"
              }}
            >
              <Box sx={{ fontSize: 60, mb: 2 }}>🔗</Box>
              <Typography variant="h6">No URLs yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Start creating shortened URLs to see them here
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Home;