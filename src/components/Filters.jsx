import React from 'react';
import Select from 'react-select';

// const circleCustomStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     borderRadius: '4px',
//     minWidth: '200px',
//     // width: '100%',
//     boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' : null,
//     '&:hover': {
//       borderColor: '#80bdff',
//     },
//   }),
//   menu: (provided) => ({
//     ...provided,
//     zIndex: 9999,
//   }),
// };

const circleOptions = [
  { value: 'circle1', label: 'Circle 1' },
  { value: 'circle2', label: 'Circle 2' },
  { value: 'circle3', label: 'Circle 3' },
  // Add more options as needed
];

const divisionOptions = [
  { value: 'division1', label: 'Division 1' },
  { value: 'division2', label: 'Division 2' },
  { value: 'division3', label: 'Division 3' },
  // Add more options as needed
];

const Filters = ({ filters, onFiltersChange }) => {
  const handleChange = (selectedOption, name) => {
    onFiltersChange({ ...filters, [name]: selectedOption });
  };

  const handleDateChange = (e) => {
    onFiltersChange({ ...filters, date: e.target.value });
  };

  return (
    <div className="filter-options">
      <div className="filter-item circle">
        <label htmlFor="circle-select">Circle</label>
        <Select
          id="circle-select"
          placeholder="Select Circle"
          value={filters.circle}
          onChange={(selectedOption) => handleChange(selectedOption, 'circle')}
          options={circleOptions}
          isSearchable
        />
      </div>
      <div className="filter-item division">
        <label htmlFor="division-select">Division</label>
        <Select
          id="division-select"
          placeholder="Select Division"
          value={filters.division}
          onChange={(selectedOption) => handleChange(selectedOption, 'division')}
          options={divisionOptions}
          isSearchable
        />
      </div>
      <div className="filter-item username">
        <label htmlFor="username-select">Username</label>
        <Select
          id="username-select"
          placeholder="Select Username"
          value={filters.username}
          onChange={(selectedOption) => handleChange(selectedOption, 'username')}
          options={[] /* Add your username options here */}
          isSearchable
        />
      </div>
      <div className="filter-item date">
        <label htmlFor="date-input">Date</label>
        <div>
        <input
          id="date-input"
          type="date"
          name="date"
          value={filters.date}
          onChange={handleDateChange}
        />
        </div>
      </div>
    </div>
  );
};

export default Filters;
