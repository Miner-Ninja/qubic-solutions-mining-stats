import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import "bootswatch/dist/vapor/bootstrap.min.css";
import './App.css';

function App() {
  const [minerId, setMinerId] = useState('');
  const [jsonData1, setjsonData1] = useState(null);
  const [jsonData2, setJsonData2] = useState(null);
  const [sortedDeviceList, setSortedDeviceList] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'last_iterrate', direction: 'desc' });
  const [error, setError] = useState('');
  const [hideMinerAddress, setHideMinerAddress] = useState(false);
  const [hideWorkerName, setHideWorkerName] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [api1TimeStamp, setApi1TimeStamp] = useState('');
  const [api2TimeStamp, setApi2TimeStamp] = useState('');
  const [rememberAddress, setRememberAddress] = useState(false);

  useEffect(() => {
    const storedMinerId = sessionStorage.getItem('minerId');
    const storedRememberAddress = sessionStorage.getItem('rememberAddress');
    const storedHideMinerAddress = sessionStorage.getItem('hideMinerAddress');
    const storedHideWorkerName = sessionStorage.getItem('hideWorkerName');

    if (storedMinerId && storedRememberAddress === 'true') {
      setMinerId(storedMinerId);
      setRememberAddress(true);
    }

    if (storedHideMinerAddress) {
      setHideMinerAddress(true);
    }

    if (storedHideWorkerName) {
      setHideWorkerName(true);
    }

    const apiUrl1 = `/TsW8bAP2NE00ka9UuCNh/`;

    const fetchData = async () => {
      try {
        const response1 = await fetch(apiUrl1);
        if (!response1.ok) {
          throw new Error("Sorry, we can't load POOL DATA from the pool server. There are too many requests to the server. Please wait and try again!");
        }
        const data1 = await response1.json();
        setjsonData1(data1);
        setApi1TimeStamp(getTimeStamp());
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (rememberAddress) {
      sessionStorage.setItem('minerId', minerId);
      sessionStorage.setItem('rememberAddress', 'true');
    } else {
      sessionStorage.removeItem('minerId');
      sessionStorage.removeItem('rememberAddress');
    }
  }, [rememberAddress, minerId]);

  useEffect(() => {
    if (hideMinerAddress) {
      sessionStorage.setItem('hideMinerAddress', 'true');
    } else {
      sessionStorage.removeItem('hideMinerAddress');
    }
  }, [hideMinerAddress]);

  useEffect(() => {
    if (hideWorkerName) {
      sessionStorage.setItem('hideWorkerName', 'true');
    } else {
      sessionStorage.removeItem('hideWorkerName');
    }
  }, [hideWorkerName]);

  const handleMinerIdSubmit = async (event) => {
    event.preventDefault();

    if (!minerId) {
      setError("Empty wallet address. Please enter the correct wallet address and try again!");
      return;
    }

    if (!/^[a-zA-Z0-9]{60}$/.test(minerId)) {
      setError("Wrong wallet address. Please enter the correct wallet address and try again!");
      return;
    }

    const apiUrl2 = `/TsW8bAP2NE00ka9UuCNh/?miner=${minerId}&list=true`;

    setError('');
    setShowLoading(true);

    setTimeout(async () => {
      try {
        const response2 = await fetch(apiUrl2);
        if (!response2.ok) {
          throw new Error("Sorry, we can't load MINER DATA from the pool server. There are too many requests to the server. Please wait and try again!");
        }

        const data2 = await response2.json();
        setJsonData2(data2);
        sortDeviceList(sortConfig.key, sortConfig.direction, data2.device_list);
        setApi2TimeStamp(getTimeStamp());
      } catch (error) {
        setError(error.message);
        setJsonData2(null);
      } finally {
        setShowLoading(false);
      }
    }, 11000);
  };

  const sortDeviceList = (key, direction, deviceList = jsonData2?.device_list) => {
    if (!deviceList) return;
    const sortedList = [...deviceList].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedDeviceList(sortedList);
  };

  const toggleSort = (key) => {
    const direction = key === sortConfig.key ? (sortConfig.direction === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortConfig({ key, direction });
    sortDeviceList(key, direction);
  };

  const roundToTwoDigits = (num) => {
    return Number(num.toFixed(2));
  };

const getTimeStamp = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = now.getFullYear();

  return `${hours}:${minutes}:${seconds} / ${day}-${month}-${year}`;
};


  return (
    <div className="container mt-5 fade-in">
      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Qubic.Commando.sh - Mining Stats for Qubic.Solutions Pool</title>
        <meta name="description" content="Get real-time mining statistics for Qubic.Solutions pool. Check epoch, pool iteration, devices, and solutions." />
        <meta name="keywords" content="mining stats, Qubic Solutions, pool statistics, epoch, pool iteration, devices, solutions" />
        <meta name="author" content="MinerNinja" />
      </Helmet>

      <h6 className="alert alert-dismissible alert-info fade-in mb-1">We apologize, the project is in a highly developmental stage, so there may be some errors</h6>
      <h6 className="alert alert-dismissible alert-primary fade-in mb-4">Mining statistics can be updated once every 180 seconds</h6>
      <h1 className="text-light mb-2" id="title">Qubic.Commando.sh - Mining stats for Qubic.Solutions pool</h1>
      <h6 className="text-light mb-4"><span className="text-primary">Created with love for the Qubic.Solutions community ;)</span></h6>

      <div className="col-md-12 d-flex justify-content-between">
        <div className="form-check form-switch fade-in mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              id="toggleSwitchMinerAddress"
              checked={hideMinerAddress}
              onChange={() => setHideMinerAddress(!hideMinerAddress)}
            />
            <label className="form-check-label" htmlFor="toggleSwitchMinerAddress" style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>Hide Address</label>
        </div>
          <div className="form-check form-switch fade-in mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="toggleSwitchRememberAddress"
              checked={rememberAddress}
              onChange={() => setRememberAddress(!rememberAddress)}
            />
            <label className="form-check-label" htmlFor="toggleSwitchRememberAddress" style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>Remember Address</label>
        </div>
      </div>

      <form onSubmit={handleMinerIdSubmit} className="fade-in mb-4">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            value={minerId}
            onChange={(e) => setMinerId(e.target.value)}
            placeholder="Enter Your Qubic Wallet Address"
            style={{ filter: hideMinerAddress ? 'blur(4px)' : 'none' }}
          />
          <button className="btn btn-secondary" type="submit">Load Miner Stats</button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger fade-in" role="alert">
          {error}
        </div>
      )}

      {jsonData1 && (
        <>
          <h2 className="text-light fade-in">Pool Statistics</h2>
          <p className="fade-in" style={{ color: '#6c757d', fontSize: '0.8rem', fontWeight: 'normal' }}>Data loaded at: {api1TimeStamp}</p>
          
          <div className="card border-light mb-5 fade-in">
            <table className="table table-dark table-striped table-hover mb-0 w-full" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th className="w-1/4"><span className="text-secondary">Epoch</span></th>
                  <th className="w-1/4"><span className="text-secondary">Pool Iteration</span></th>
                  <th className="w-1/4"><span className="text-secondary">Pool Devices</span></th>
                  <th className="w-1/4"><span className="text-secondary">Pool Solutions</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="w-1/4">{jsonData1.epoch}</td>
                  <td className="w-1/4">{roundToTwoDigits((jsonData1.iterrate)/10000000)}<span className="text-light"> Mit/s</span></td>
                  <td className="w-1/4">{jsonData1.devices}</td>
                  <td className="w-1/4">{jsonData1.solutions}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {showLoading && (
        <div className="progress mb-4 fade-in">
          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{ width: '100%' }}>Loading Data ...</div>
        </div>
      )}


      {jsonData2 && (
        <>
          <h2 className="text-light fade-in">Miner Statistics</h2>
          <p className="fade-in" style={{ color: '#6c757d', fontSize: '0.8rem', fontWeight: 'normal' }}>Data loaded at: {api2TimeStamp}</p>
          <div className="card border-light mb-5 fade-in">
            <table className="table table-dark table-striped table-hover mb-0 w-full" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col className="w-1/3" />
                <col className="w-1/3" />
                <col className="w-1/3" />
              </colgroup>
              <thead>
                <tr>
                  <th className="w-1/3"><span className="text-secondary">Total Iteration</span></th>
                  <th className="w-1/3"><span className="text-secondary">Total Devices</span></th>
                  <th className="w-1/3"><span className="text-secondary">Total Solutions</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="w-1/3">{roundToTwoDigits(jsonData2.iterrate)}<span className="text-light"> it/s</span></td>
                  <td className="w-1/3">{jsonData2.devices}</td>
                  <td className="w-1/3">{jsonData2.solutions}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-light fade-in">Workers Statistics</h2>
          <p className="fade-in mb-0" style={{ color: '#6c757d', fontSize: '0.8rem', fontWeight: 'normal' }}>Data loaded at: {api2TimeStamp}</p>
          <div className="form-check form-switch mb-2 fade-in">
            <input
              className="form-check-input"
              type="checkbox"
              id="toggleSwitchWorkerName"
              checked={hideWorkerName}
              onChange={() => setHideWorkerName(!hideWorkerName)}
            />
            <label className="form-check-label fade-in" htmlFor="toggleSwitchWorkerName" style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>Hide Worker Name</label>
          </div>
          <div className="card border-light mb-3 fade-in">
            <table className="table table-dark table-striped table-hover mb-0" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th className="w-1/3" onClick={() => toggleSort('label')} title="Click here to sort">
                    <span className="text-secondary">Worker Name</span>
                  </th>
                  <th className="w-1/3" onClick={() => toggleSort('last_iterrate')} title="Click here to sort">
                    <span className="text-secondary">Last Iteration</span>
                  </th>
                  <th className="w-1/3" onClick={() => toggleSort('solutions')} title="Click here to sort">
                    <span className="text-secondary">Solutions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedDeviceList.map((device, index) => (
                  <tr key={index} style={{ backgroundColor: '#133e7c' }}>
                    <td style={{ filter: hideWorkerName ? 'blur(4px)' : 'none' }}>
                      {device.label}
                    </td>
                    <td>{roundToTwoDigits(device.last_iterrate)}<span className="text-light"> it/s</span></td>
                    <td>{device.solutions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h6 className="text-light mb-4 fade-in"><span className="text-primary">Coded by MinerNinja</span></h6>
    </div>
  );
}

export default App;

