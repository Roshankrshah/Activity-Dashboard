import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Filters from './components/Filters';
import Details from './components/Details';
import ActivityGraph from './components/ActivityGraph';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FaExclamationCircle } from 'react-icons/fa';
import data from './data';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';

function App() {
  const initialFilters = {
    circle: '',
    division: '',
    username: '',
    date: ''
  };

  const [filters, setFilters] = useState(initialFilters);

  const [details, setDetails] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [apiResponse, setApiResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleFiltersChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  // const handleSubmit = () => {
  //   // Fetch details and graph data based on filters
  //   // Dummy implementation for now
  //   setDetails({
  //     info: 'Fetched details based on filters.'
  //   });

  //   setGraphData();

  //   setApiResponse(true)
  // };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setApiResponse(null);
    try {
      // const response = await axios.post('/api/your-endpoint', filters);
      // if (response.status === 200) {
      //   setApiResponse(response.data);
      // } else {
      //   setErrorMessage(`Errorrrrrrrrrr: ${response.status}`);
      // }
      setApiResponse(data);
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setErrorMessage(`Error page: ${error.response.status}`);
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage('Error: No response from server');
      } else {
        // Something happened in setting up the request
        setErrorMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={setIsAuthenticated} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <>
                <Header />
                <div className="filters">
                  <Filters filters={filters} onFiltersChange={handleFiltersChange} />
                  <div className="button-group">
                    <button onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? 'Loading...' : 'Submit'}
                    </button>
                    <button onClick={handleReset} disabled={isLoading}>
                      Reset
                    </button>
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
                      <Details completedCases={apiResponse} pendingCases={apiResponse} />
                    </div>
                    <div className="graph-container">
                      <ActivityGraph graphData={apiResponse} />
                    </div>
                  </>
                )}
              </>
            ) : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
