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
    transform: 'translate(-50%, -50%)',
    width: '60%',
    padding: '20px'
  },
};

Modal.setAppElement('#root');

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
              { text: 'Single Connection', backgroundColor: 'rgba(75, 192, 192, 0.6)', borderColor: 'rgba(75, 192, 192, 1)', pointStyle: 'circle' },
              { text: 'Multiple Connection', backgroundColor: 'rgba(255, 99, 132, 0.6)', borderColor: 'rgba(255, 99, 132, 1)', pointStyle: 'rect' },
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
      openModal(orderNo, location);

      }
    },
  };

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ location: '', time: '' });

  const [apiResponse1, setApiResponse1] = useState(null);
  const [apiResponse2, setApiResponse2] = useState(null);

  const openModal = (orderNo, locality) => {
    setModalContent({ orderNo, locality });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setApiResponse1(null);
    setApiResponse2(null);
  };

  useEffect(() => {
    if (modalIsOpen && modalContent.orderNo) {
      // Replace with your actual API endpoints
      const fetchApi1 = async () => {
        try {
          const response = await fetch(`/api/details1?orderNo=${modalContent.orderNo}`);
          const data = await response.json();
          setApiResponse1(data);
        } catch (error) {
          console.error("Error fetching API 1:", error);
        }
      };

      const fetchApi2 = async () => {
        try {
          const response = await fetch(`/api/details2?locality=${modalContent.locality}`);
          const data = await response.json();
          setApiResponse2(data);
        } catch (error) {
          console.error("Error fetching API 2:", error);
        }
      };

      fetchApi1();
      fetchApi2();
    }
  }, [modalIsOpen, modalContent.orderNo, modalContent.locality]);

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
  <div style={{ textAlign: 'center', marginBottom: '20px', overflowY: 'auto', maxHeight: '80vh', padding: '10px' }}>
    <h2 style={{ marginBottom: '5px' }}>Completed Order Details</h2>
    <hr style={{ marginBottom: '20px' }} />
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '20px', textAlign: 'left' }}>
      <div style={{ flex: '0 1 48%', marginBottom: '10px' }}>
        <div style={{ marginBottom: '10px' }}><strong>Order No:</strong> 12345</div>
        <div style={{ marginBottom: '10px' }}><strong>Time:</strong> 2023-06-25T08:00:00Z</div>
        <div style={{ marginBottom: '10px' }}><strong>Locality:</strong> Location A</div>
        <div style={{ marginBottom: '10px' }}><strong>Status:</strong> Completed</div>
      </div>
      <div style={{ flex: '0 1 48%', marginBottom: '10px' }}>
        <div style={{ marginBottom: '10px' }}><strong>Name:</strong> John Doe</div>
        <div style={{ marginBottom: '10px' }}><strong>Address:</strong> 123 Main St, Anytown</div>
        <div style={{ marginBottom: '10px' }}><strong>Reschedule Flag:</strong> N</div>
        <div style={{ marginBottom: '10px' }}><strong>Reschedule Date:</strong> N/A</div>
      </div>
    </div>
    <h2 style={{ marginBottom: '5px' }}>Pending Orders</h2>
    <hr style={{ marginBottom: '20px' }} />
    <ul>
    <li style={{textAlign:'left'}}>
           <strong>Order No:</strong> 54321;
           <strong>Address:</strong> 456 Maple St, Othertown;
           <strong>Pendency Day:</strong> 2;
    </li>
    </ul>
    <button onClick={closeModal} style={{ padding: '10px 20px', backgroundColor: '#e85a62', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>
      Close
    </button>
  </div>
</Modal>


      </div>
    </div>
  );
}

export default ActivityGraph;

// {pendingOrders.length === 0 ? (
//   <div>No pendency</div>
// ) : (
//   <div style={{ textAlign: 'left' }}>
//     {pendingOrders.map((order, index) => (
//       <div key={index} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
//         <div style={{ flex: '0 1 48%', marginBottom: '10px' }}>
//           <strong>Order No:</strong> {order.orderno}<br />
//           <strong>Address:</strong> {order.address}<br />
//           <strong>Pendency Day:</strong> {order.pendencyDay}
//         </div>
//       </div>
//     ))}
//   </div>
// )}