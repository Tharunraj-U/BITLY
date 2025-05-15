import React, { use, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const[data, setData] = useState( []);

  const getSortedUrls = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));

      const res = await axios.post(
        'http://localhost:8080/api/url/shortUrl',
        { originalUrl: originalUrl }, // request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log(res.data);
      setShortenedUrl(res.data.shortUrl || 'No shortened URL found');
    } catch (err) {
      console.log(err.response?.data);
      alert('Error: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  useEffect(  () => {
    const fetchData = async () => {
      try{
        const token = JSON.parse(localStorage.getItem('token'));
        if(token) {
          const res = await axios.get('http://localhost:8080/api/url/getAll', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }); 
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchData();
  } , []);

  return (
    <div>
      <h1>Home</h1>
      <label>Original URL</label>
      <input
        type="text"
        placeholder="Enter your original URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
      />
      <button onClick={getSortedUrls}>Submit</button>


      {shortenedUrl && (
        <div>
          <h3>Shortened URL:</h3>
          <a href={`http://localhost:8080/${shortenedUrl}`} target="_blank" rel="noreferrer">
            {`http://localhost:8080/${shortenedUrl}` }
          </a>
        </div>
      )}
      {data && data.map((item) => (
        <div key={item.id}>
          <h3>Original URL: {item.originalUrl}</h3>
          <h3>Shortened URL: <Link to={`http://localhost:8080/${item.shortUrl}`}> {`http://localhost:8080/${item.shortUrl}`} </Link></h3>
          <h3>Click Count: {item.clickCount}</h3>
          <h3>Created Date: {item.createdDate}</h3>
          <h3>Click Events:</h3>
          {item.clickEvents.map((event) => (
            <div key={event.id}>
              <p>Clicked Date: {event.clickedDate}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Home;
