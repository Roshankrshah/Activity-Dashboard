import React, { useState,useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, PointElement } from 'chart.js';
import 'chartjs-adapter-luxon';
import Modal from 'react-modal';
import { DateTime } from 'luxon';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, PointElement);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
};

Modal.setAppElement('#root');

const CustomLegend = ({ shapes }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      {shapes.map((shape, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: shape.color,
              marginRight: '5px',
              borderRadius: shape.shape === 'circle' ? '50%' : '0',
              transform: shape.shape === 'cross' ? 'rotate(45deg)' : 'none',
              border: shape.shape === 'cross' ? '2px solid red' : 'none',
            }}
          ></div>
          <span>{shape.label}</span>
        </div>
      ))}
    </div>
  );
};

function ActivityGraph({ graphData }) {
  const chartRef = useRef(null);
  // Step 1: Normalize locations, treating null or empty values as "Unknown"
  const normalizedData = graphData.map(entry => ({
    ...entry,
    Location: entry.Location || "Unknown",
  }));

  // Step 2: Map unique locations to numerical indices
  const uniqueLocations = [...new Set(normalizedData.map(entry => entry.Location))];
  const locationMap = {};
  uniqueLocations.forEach((location, index) => {
    locationMap[location] = index;
  });

  // Step 3: Transform data with different colors and shapes based on multipleConn and cancelStatus
  const labels = normalizedData.map(entry => entry.Time);
  const datasets = [{
    label: 'User Activity',
    data: normalizedData.map(entry => ({
      x: DateTime.fromISO(entry.Time).toMillis(),
      y: locationMap[entry.Location],
      orderNo: entry.orderno,
    })),
    backgroundColor: normalizedData.map(entry => {
      if (entry.CancelStatus === "Cancelled") return 'rgba(255, 0, 0, 0.6)';
      return entry.multipleConn === 'Y' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)';
    }),
    borderColor: normalizedData.map(entry => {
      if (entry.CancelStatus === "Cancelled") return 'rgba(255, 0, 0, 1)';
      return entry.multipleConn === 'Y' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
    }),
    fill: false,
    pointRadius: 5,
    pointHoverRadius: 7,
    pointStyle: normalizedData.map(entry => {
      if (entry.CancelStatus === 'Cancelled') return 'crossRot';
      return entry.multipleConn === 'Y' ? 'circle' : 'rect';
    }),
  }];

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          tooltipFormat: 'DD t',
          displayFormats: {
            hour: 't',
          },
          min: '08:00:00z', // Set your desired min time
          max: '20:00:00z',
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Location',
        },
        ticks: {
          callback: function (value) {
            return uniqueLocations[value];
          },
          autoSkip: false,
          maxRotation: 90,
          minRotation: 0,
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        onClick: () => {},
        labels: {
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            const shapes = [
              { text: 'Multiple Conn (Y)', backgroundColor: 'rgba(75, 192, 192, 0.6)', borderColor: 'rgba(75, 192, 192, 1)', pointStyle: 'circle' },
              { text: 'Multiple Conn (N)', backgroundColor: 'rgba(255, 99, 132, 0.6)', borderColor: 'rgba(255, 99, 132, 1)', pointStyle: 'rect' },
              { text: 'Cancelled', backgroundColor: 'rgba(255, 0, 0, 0.6)', borderColor: 'rgba(255, 0, 0, 1)', pointStyle: 'crossRot' },
            ];

            return shapes.map(shape => ({
              text: shape.text,
              fillStyle: shape.backgroundColor,
              strokeStyle: shape.borderColor,
              pointStyle: shape.pointStyle,
              hidden: false,
              lineDash: [],
              lineWidth: 1,
              datasetIndex: 0
            }));
          },
          usePointStyle: true // This line is crucial to make sure the point style is used in the legend
        }
      },
      title: {
        display: true,
        text: 'User Activity',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const location = uniqueLocations[context.raw.y];
            const orderNo = context.raw.orderNo;
            return `Location: ${location}, OrderNo: ${orderNo}`;
          }
        }
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
      const dataPoint = datasets[0].data[index];
      console.log(dataPoint)
      const location = uniqueLocations[dataPoint.y];
      const time = DateTime.fromMillis(dataPoint.x).toFormat('HH:mm');
      const orderNo = dataPoint.orderNo
      openModal(orderNo, location, time);

      }
    },
  };

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ location: '', time: '' });

  const openModal = (orderNo,location, time) => {
    setModalContent({ orderNo, location, time });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="graph-div">
      <div className="graph">
        <Line ref={chartRef} data={{ labels, datasets }} options={options} />
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Activity Details"
        >
          <h2>Activity Details</h2>
          <div>OrderNo: {modalContent.orderNo}</div>
        <div>Location: {modalContent.location}</div>
        <div>Time: {modalContent.time}</div>
          <button onClick={closeModal}>Close</button>
        </Modal>
      </div>
    </div>
  );
}

export default ActivityGraph;
