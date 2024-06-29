import React from 'react';
import { FaCheckCircle, FaClock, FaHourglassHalf } from 'react-icons/fa';

function Details({ completedCases, pendingCases }) {
  return (
    <>
      <div className="detail-box">
        <div className="detail-icon" style={{color: 'red'}}>
          <FaClock />
        </div>
        <div className="detail-content">
          <h3>Start Time</h3>
          <p>8:55 AM</p>
        </div>
        <div className="detail-strip" style={{backgroundColor: 'red'}}></div>
      </div>
      <div className="detail-box">
        <div className="detail-icon" style={{color: 'green'}}>
          <FaCheckCircle />
        </div>
        <div className="detail-content">
          <h3>Completed Cases</h3>
          <p>{completedCases.length}</p>
        </div>
        <div className="detail-strip" style={{backgroundColor: 'green'}}></div>
      </div>
      <div className="detail-box">
        <div className="detail-icon" style={{color: 'blue'}}>
          <FaHourglassHalf />
        </div>
        <div className="detail-content">
          <h3>Pending Cases</h3>
          <p>{pendingCases.length}</p>
        </div>
        <div className="detail-strip" style={{backgroundColor: 'blue'}}></div>
      </div>
    </>
  );
}

export default Details;
