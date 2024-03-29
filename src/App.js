import React, { useState, useEffect } from 'react';
import "bootswatch/dist/vapor/bootstrap.min.css";
import './App.css'; // Import CyberpunkTheme.css instead of App.css

function App() {
  const [minerId, setMinerId] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [sortedDeviceList, setSortedDeviceList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'last_iterrate', direction: 'desc' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (jsonData?.device_list) {
      sortDeviceList(sortConfig.key, sortConfig.direction);
    }
  }, [sortConfig, jsonData]);

  const handleMinerIdSubmit = async (e) => {
    e.preventDefault();
    if (!minerId) {
      setError("Please enter a miner ID.");
      return;
    }

    const corsProxy = 'http://rp.commando.sh:8080/';
    const apiUrl = `https://pooltemp.qubic.solutions/info?miner=${minerId}&list=true`;

    setError('');
    try {
      const response = await fetch(`${corsProxy}${apiUrl}`);
      if (!response.ok) {
        if (response.status === 429) {
          setError("Hey dude, please wait a little bit. There are too many requests. Mouse clicks don't give you any hashrate boost :)");
        } else {
          setError(`HTTP error! Status: ${response.status}`);
        }
        setJsonData(null);
        return;
      }
      const data = await response.json();
      setJsonData(data);
      sortDeviceList('last_iterrate', 'desc', data.device_list);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("An error occurred while fetching data.");
      setJsonData(null);
    }
  };

  const sortDeviceList = (key, direction, deviceList = jsonData?.device_list) => {
    if (!deviceList) return;
    const sortedList = [...deviceList].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedDeviceList(sortedList);
  };

  const toggleSort = (key) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === 'asc';
    setSortConfig({
      key,
      direction: isAsc ? 'desc' : 'asc',
    });
  };

  // Function to round up a number to two digits after the comma
  const roundToTwoDigits = (num) => {
    return Number(num.toFixed(2));
  };

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
