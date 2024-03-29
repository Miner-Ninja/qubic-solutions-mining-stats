import React, { useState, useEffect } from 'react'; // Import necessary modules from React library
import "bootswatch/dist/vapor/bootstrap.min.css"; // Import Bootstrap CSS
import './App.css'; // Import custom CSS styles (CyberpunkTheme.css can be imported instead of App.css)

function App() {
  // Define state variables using the useState hook
  const [minerId, setMinerId] = useState(''); // State for storing miner ID input value
  const [jsonData, setJsonData] = useState(null); // State for storing JSON data retrieved from the API
  const [sortedDeviceList, setSortedDeviceList] = useState([]); // State for storing sorted list of devices
  const [sortConfig, setSortConfig] = useState({ key: 'last_iterrate', direction: 'desc' }); // State for sorting configuration
  const [error, setError] = useState(''); // State for handling errors

  // useEffect hook to sort the device list whenever sortConfig or jsonData changes
  useEffect(() => {
    if (jsonData?.device_list) { // Check if jsonData and its device_list property are not null
      sortDeviceList(sortConfig.key, sortConfig.direction); // Sort the device list based on sortConfig
    }
  }, [sortConfig, jsonData]);

  // Function to handle form submission when entering miner ID
  const handleMinerIdSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!minerId) { // Check if miner ID input is empty
      setError("Please enter a miner ID."); // Set error message
      return; // Exit the function
    }

    const corsProxy = 'http://rp.commando.sh:8080/'; // Define CORS proxy URL
    const apiUrl = `https://pooltemp.qubic.solutions/info?miner=${minerId}&list=true`; // Define API URL with miner ID

    setError(''); // Clear any previous error messages
    try {
      const response = await fetch(`${corsProxy}${apiUrl}`); // Send GET request to the API using fetch
      if (!response.ok) { // Check if response status is not OK (HTTP status code 200-299)
        if (response.status === 429) { // Check if response status is 429 (Too Many Requests)
          setError("Hey dude, please wait a little bit. There are too many requests. Mouse clicks don't give you any hashrate boost :)"); // Set error message
        } else {
          setError(`HTTP error! Status: ${response.status}`); // Set generic HTTP error message
        }
        setJsonData(null); // Reset jsonData state to null
        return; // Exit the function
      }
      const data = await response.json(); // Parse response body as JSON
      setJsonData(data); // Update jsonData state with the fetched data
      sortDeviceList('last_iterrate', 'desc', data.device_list); // Sort the device list based on 'last_iterrate' key descendingly
    } catch (error) {
      console.error("Failed to fetch data:", error); // Log error to console
      setError("An error occurred while fetching data."); // Set error message
      setJsonData(null); // Reset jsonData state to null
    }
  };

  // Function to sort the device list based on the provided key and direction
  const sortDeviceList = (key, direction, deviceList = jsonData?.device_list) => {
    if (!deviceList) return; // Exit the function if deviceList is null or undefined
    const sortedList = [...deviceList].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1; // Compare values based on direction
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1; // Compare values based on direction
      return 0; // Return 0 if values are equal
    });
    setSortedDeviceList(sortedList); // Update sortedDeviceList state with the sorted list
  };

  // Function to toggle sorting direction for a given key
  const toggleSort = (key) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === 'asc'; // Check if current sortConfig is ascending
    setSortConfig({ // Update sortConfig state
      key,
      direction: isAsc ? 'desc' : 'asc', // Toggle sorting direction
    });
  };

  // Function to round a number to two digits after the decimal point
  const roundToTwoDigits = (num) => {
    return Number(num.toFixed(2)); // Convert number to string with fixed two digits after the decimal point and convert it back to number
  };

  // JSX code for rendering UI components
  return (
    <div className="container mt-5">
      <h1 className="text-light mb-2">Pooltemp.Qubic.Solutions - Mining statistics page</h1>
      <h6 className="text-light mb-5"><span className="text-primary">Created with love for the Qubic.Solutions community ;)</span></h6>
      <form onSubmit={handleMinerIdSubmit} className="mb-5">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={minerId}
            onChange={(e) => setMinerId(e.target.value)}
            placeholder="Enter Miner ID"
          />
          <button className="btn btn-primary" className="btn btn-secondary" type="submit">Load Miner Data</button>
        </div>
      </form>

      {error && (
        <div className="alert alert-dismissible alert-danger" role="alert">
          <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          <h4 className="alert-heading">Warning!</h4>
          <p className="mb-0">{error}</p>
        </div>
      )}

      {jsonData && (
        <>
          <h2 className="text-light ">Miner Statistics</h2>
        <div class="card border-light mb-5">
          <table className="table table-dark table-striped table-hover" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
            </colgroup>
            <thead>
              <tr>
                <th><span className="text-secondary">Epoch</span></th>
                <th><span className="text-secondary">Total Iteration</span></th>
                <th><span className="text-secondary">Total Devices</span></th>
                <th><span className="text-secondary">Total Solutions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{jsonData.epoch}</td>
                <td>{roundToTwoDigits(jsonData.iterrate)}<span className="text-light"> it/s</span></td>
                <td>{jsonData.devices}</td>
                <td>{jsonData.solutions}</td>
              </tr>
            </tbody>
          </table>
        </div>

          <h2 className="text-light" >Workers Statistics</h2>
        <div class="card border-light mb-3">
          <table className="table table-dark table-striped table-hover" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '33.33%' }} />
              <col style={{ width: '33.33%' }} />
              <col style={{ width: '33.33%' }} />
            </colgroup>
            <thead>
              <tr>
                <th onClick={() => toggleSort('label')} title="Click here to sort">
                <span className="text-secondary">Worker Name</span>
                </th>
                <th onClick={() => toggleSort('last_iterrate')} title="Click here to sort">
                <span className="text-secondary">Last Iteration</span>
                </th>
                <th onClick={() => toggleSort('solutions')} title="Click here to sort">
                <span className="text-secondary">Solutions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDeviceList.map((device, index) => (
                <tr key={index} style={{ backgroundColor: '#133e7c' }}>
                  <td>{device.label}</td>
                  <td>{roundToTwoDigits(device.last_iterrate)}<span className="text-light"> it/s</span></td>
                  <td>{device.solutions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
      <h6 className="text-light mb-4"><span className="text-primary">Coded by MinerNinja</span></h6>
    </div>
  );
}

export default App;
