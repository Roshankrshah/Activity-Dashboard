
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Filters.css';

// const circleOptions = [
//   { value: 'circle1', label: 'Circle 1' },
//   { value: 'circle2', label: 'Circle 2' },
//   { value: 'circle3', label: 'Circle 3' },
//   // Add more options as needed
// ];

const divisionOptions = [
  { value: 'division1', label: 'Division 1' },
  { value: 'division2', label: 'Division 2' },
  { value: 'division3', label: 'Division 3' },
  // Add more options as needed
];

const Filters = ({ filters, onFiltersChange }) => {
  const [circleOptions, setCircleOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [usernameOptions, setUsernameOptions] = useState([]);

  useEffect(() => {
    // Fetch Circle data
    // axios.get('/api/circles')
    //   .then(response => {
    //     setCircleOptions(circleOptions);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching circle options:', error);
    //   });
    setCircleOptions([
      { value: 'circle1', label: 'Circle 1' },
      { value: 'circle2', label: 'Circle 2' },
      { value: 'circle3', label: 'Circle 3' },
      { value: 'circle4', label: 'Circle 4' },
      // Add more options as needed
    ]);
  }, []);

  useEffect(() => {
    if (filters.circle) {
      // Fetch Division data based on selected Circle
      // axios.get(`/api/divisions?circle=${filters.circle.value}`)
      //   .then(response => {
      //     setDivisionOptions(divisionOptions);
      //   })
      //   .catch(error => {
      //     console.error('Error fetching division options:', error);
      //   });
      setDivisionOptions([
        { value: 'division1', label: 'Division 1' },
        { value: 'division2', label: 'Division 2' },
        { value: 'division3', label: 'Division 3' },
        { value: 'division3', label: 'Division 3' },
        { value: 'division3', label: 'Division 3' },
        { value: 'division3', label: 'Division 3' },
        { value: 'division3', label: 'Division 3' },{ value: 'division3', label: 'Division 3' },
        { value: 'division3', label: 'Division 3' },
        { value: 'division3', label: 'Division 3' },
        // Add more options as needed
      ]);
    }
  }, [filters.circle]);

  useEffect(() => {
    if (filters.division) {
      // Fetch Username data based on selected Division
      axios.get(`/api/usernames?division=${filters.division.value}`)
        .then(response => {
          setUsernameOptions(response.data);
        })
        .catch(error => {
          console.error('Error fetching username options:', error);
        });
    }
  }, [filters.division]);

  const handleChange = (selectedOption, name) => {
    onFiltersChange({ ...filters, [name]: selectedOption });
  };

  const handleDateChange = (e) => {
    onFiltersChange({ ...filters, date: e.target.value });
  };

  const renderButtons = (options, selectedOption, name) => {
    return options.map(option => (
      <button
        key={option.value}
        type="button"
        className={`filter-button ${selectedOption && selectedOption.value === option.value ? 'selected' : ''}`}
        onClick={() => handleChange(option, name)}
      >
        {option.label}
      </button>
    ));
  };

  return (
    <>
    <div className="filter-options">
      <div className="filter-row">
        <div className="filter-item">
          <label htmlFor="circle-select">Circle</label>
          <div>
            {renderButtons(circleOptions, filters.circle, 'circle')}
          </div>
        </div>
      </div>
      <div className="filter-row">
        <div className="filter-item">
          <label htmlFor="division-select">Division</label>
          <div>
            {filters.circle ? (
              renderButtons(divisionOptions, filters.division, 'division')
            ) : (
              <p>Select a Circle first</p>
            )}
          </div>
        </div>
      </div>
      
    </div>
    <div className="filter-row">
    <div className="filter-item">
      <label htmlFor="date-input">Date</label>
      <input
        id="date-input"
        type="date"
        name="date"
        value={filters.date}
        onChange={handleDateChange}
      />
    </div>
  </div>
  </>
  );
};

export default Filters;