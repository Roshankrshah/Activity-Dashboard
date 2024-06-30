import React from 'react';
import { FaCheckCircle, FaClock, FaHourglassHalf } from 'react-icons/fa';

function Details({ completedCases, pendingCases }) {
  return (
    <>
      <div className="detail-box">
        <div className="detail-icon" style={{color: '#5eff00'}}>
          <FaClock />
        </div>
        <div className="detail-content">
          <h3>Start Time</h3>
          <p>8:55 AM</p>
        </div>
        <div className="detail-strip" style={{backgroundColor: '#5eff00'}}></div>
      </div>
      <div className="detail-box">
        <div className="detail-icon" style={{color: '#53acf2'}}>
          <FaCheckCircle />
        </div>
        <div className="detail-content">
          <h3>Completed Cases</h3>
          <p>{completedCases.length}</p>
        </div>
        <div className="detail-strip" style={{backgroundColor: '#53acf2'}}></div>
      </div>
      <div className="detail-box">
        <div className="detail-icon" style={{color: '#f0585f'}}>
          <FaHourglassHalf />
        </div>
        <div className="detail-content">
          <h3>Pending Cases</h3>
          <p>{pendingCases.length}</p>
        </div>
        <div className="detail-strip" style={{backgroundColor: '#f0585f'}}></div>
      </div>
    </>
  );
}

export default Details;
