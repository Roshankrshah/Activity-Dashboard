import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Filters from './components/Filters';
import Details from './components/Details';
import ActivityGraph from './components/ActivityGraph';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FaExclamationCircle } from 'react-icons/fa';

function App() {
  const [filters, setFilters] = useState({
    circle: '',
    division: '',
    username: '',
    date: ''
  });

  const [details, setDetails] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [apiResponse, setApiResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleFiltersChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  const handleSubmit = () => {
    // Fetch details and graph data based on filters
    // Dummy implementation for now
    setDetails({
      info: 'Fetched details based on filters.'
    });

    setGraphData({
      labels: ['2023-06-21T08:00:00', '2023-06-21T09:00:00', '2023-06-21T10:00:00'], // ISO 8601 timestamps
  data: [
    { value: 0, backgroundColor: 'rgba(75, 192, 192, 0.6)', pointStyle: 'circle' },
    { value: 1, backgroundColor: 'rgba(255, 99, 132, 0.6)', pointStyle: 'rect' },
    { value: 2, backgroundColor: 'rgba(54, 162, 235, 0.6)', pointStyle: 'cross' }
  ],
  locations: ['Location A', 'Location B', 'Location C'] // Location names
    });

    setApiResponse(true)
  };

  // const handleSubmit = async () => {
  //   setIsLoading(true);
  //   setErrorMessage('');
  //   setApiResponse(null);
  //   try {
  //     const response = await axios.post('/api/your-endpoint', filters);
  //     if (response.status === 200) {
  //       setApiResponse(response.data);
  //     } else {
  //       //throw new Error();
  //       setErrorMessage(`Errorrrrrrrrrr: ${response.status}`);
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       // Server responded with a status other than 200 range
  //       setErrorMessage(`Error page: ${error.response.status}`);
  //     } else if (error.request) {
  //       // Request was made but no response received
  //       setErrorMessage('Error: No response from server');
  //     } else {
  //       // Something happened in setting up the request
  //       setErrorMessage(`Error: ${error.message}`);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <>
      <Header />
      <div className="filters">
        <Filters filters={filters} onFiltersChange={handleFiltersChange} />
        <div className="submit-button">
          <button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="loader-container">
          <Oval
            height={80}
            width={80}
            color="#007bff"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#007bff"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}

      {errorMessage && (
        <div className="error-container">
          <FaExclamationCircle size={32} color="red" />
          <span>{errorMessage}</span>
        </div>
      )}

      {apiResponse && (
        <>
          <div className="details-container">
            <Details details={details} />
          </div>
          <div className="graph-container">
            <ActivityGraph graphData={graphData} />
          </div>
        </>
      )}
    </>
    
  );
}

export default App;
