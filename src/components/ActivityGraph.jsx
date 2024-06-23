import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, PointElement } from 'chart.js';
import 'chartjs-adapter-luxon';
import { DateTime } from 'luxon';
import Modal from 'react-modal';

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

function ActivityGraph({ graphData }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ location: '', time: '' });

  const openModal = (location, time) => {
    setModalContent({ location, time });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const data = {
    labels: graphData.labels, // Assuming labels contain ISO 8601 timestamps
    datasets: [
      {
        label: 'User Activity',
        data: graphData.data.map((point) => point.value),
        backgroundColor: graphData.data.map((point) => point.backgroundColor),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointStyle: graphData.data.map((point) => point.pointStyle),
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour', // Change this to fit your needs (e.g., 'day', 'minute', etc.)
          tooltipFormat: 'DD T', // Luxon format string for tooltips
          displayFormats: {
            hour: 'LLL dd, t', // Luxon format string for x-axis labels
          },
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        type: 'category',
        title: {
          display: true,
          text: 'Location',
        },
        ticks: {
          callback: function (value, index, values) {
            // Assuming locations are represented as numbers and you need to map them to location names
            // Modify this based on your actual location data
            return graphData.locations ? graphData.locations[value] : value;
          },
          autoSkip: false,
          maxRotation: 90,
          minRotation: 0,
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Activity',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            // Custom tooltip content
            const index = context.dataIndex;
            const location = graphData.locations[context.raw];
            return `Location: ${location}, Time: ${context.label}`;
          }
        }
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const location = graphData.locations[data.datasets[0].data[index]];
        const time = data.labels[index];
        openModal(location, time);
      }
    },
  };


  return (
    <div className="graph-div">
    <div className="graph">
      <Line data={data} options={options} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Activity Details"
      >
        <h2>Activity Details</h2>
        <div>Location: {modalContent.location}</div>
        <div>Time: {modalContent.time}</div>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
    </div>
  );
}

export default ActivityGraph;
