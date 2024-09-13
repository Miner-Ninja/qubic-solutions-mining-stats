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
      <h6 className="text-light mb-1"><span className="fade-in text-primary">Feel free to donate for webpage development and support: <br/>Qubic wallet: AAIGFEWABOFCNDCFJUOMMAYMVNUCLQWMYQQIDYYFSFQMJTRAIXJEDTTEJHDI</span></h6>

      {/* <h6 className="alert alert-dismissible alert-primary fade-in mb-4">Mining statistics can be updated once every 180 seconds</h6> */}
      <h1 className="text-light mb-2" id="title">Qubic.Commando.sh - Mining stats for Qubic.Solutions pool</h1>
      <h6 className="text-light mb-4"><span className="text-primary">Happy mining, and may the hash-force be with you ;)</span></h6>

      <div className="col-md-12 d-flex justify-content-between">
        <div className="form-check form-switch fade-in mb-0">
          <input
            className="form-check-input"
            type="checkbox"
            id="toggleSwitchMinerAddress"
            checked={hideMinerAddress}
            onChange={() => setHideMinerAddress(!hideMinerAddress)}
          />
          <label className="form-check-label" htmlFor="toggleSwitchMinerAddress form-check-label-small">Hide Address</label>
        </div>
        <div className="form-check form-switch fade-in mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="toggleSwitchRememberAddress"
            checked={rememberAddress}
            onChange={() => setRememberAddress(!rememberAddress)}
          />
          <label className="form-check-label" htmlFor="toggleSwitchRememberAddress form-check-label-small">Remember Address</label>
        </div>
      </div>

      <form onSubmit={handleMinerIdSubmit} className="fade-in mb-1">
        <div className="input-group mb-3">
          <input
            type="text"
            className={`form-control form-control-lg ${hideMinerAddress ? 'filter-blur' : ''}`}
            value={minerId}
            onChange={(e) => setMinerId(e.target.value)}
            placeholder="Enter Your Qubic Wallet Address"
          />
        <button className="btn btn-secondary" type="submit">Load Miner Stats</button>
      </div>
      </form>

      {error && (
        <div className="alert alert-danger fade-in" role="alert">
          {error}
        </div>
      )}
<h6 className="text-light mb-0 text-end">
  <span className="text-primary">Statistics can be updated once every 180 seconds</span>
</h6>
      {jsonData1 && (
        <>
          <h2 className="text-light fade-in">Pool Statistics</h2>
          <p className="fade-in data-timestamp">Data loaded at: {api1TimeStamp}</p>

          <div className="card border-light mb-5 fade-in">
            <table className="table table-dark table-striped table-hover mb-0 w-full table-fixed">
              <thead>
                <tr>
                  <th className="w-1/6"><span className="text-secondary">Epoch</span></th>
                  <th className="w-1/6"><span className="text-secondary">Pool Iteration</span></th>
                  <th className="w-1/6"><span className="text-secondary">Pool Devices</span></th>
                  <th className="w-1/6"><span className="text-secondary">Pool Shares</span></th>
                  <th className="w-1/6"><span className="text-secondary">Pool Solutions</span></th>
                  <th className="w-1/6"><span className="text-secondary">Min. Miner ver.</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="w-1/6">{jsonData1.epoch}</td>
                  <td className="w-1/6">{roundToTwoDigits((jsonData1.iterrate) / 1000)}<span className="text-light"> Kit/s</span></td>
                  <td className="w-1/6">{jsonData1.devices}</td>
                  <td className="w-1/6">{jsonData1.shares}</td>
                  <td className="w-1/6">{jsonData1.solutions}</td>
                  <td className="w-1/6">{jsonData1.min_miner_version}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {showLoading && (
        <div className="progress mb-4 fade-in">
          <div className="progress-bar progress-bar-striped progress-bar-animated progress-bar-full-width" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Loading Data ...</div>
        </div>
      )}


      {jsonData2 && (
        <>
          <h2 className="text-light fade-in">Miner Statistics</h2>
          <p className="fade-in data-timestamp">Data loaded at: {api2TimeStamp}</p>
          <div className="card border-light mb-5 fade-in">
            <table className="table table-dark table-striped table-hover mb-0 w-full table-fixed">

              <thead>
                <tr>
                  <th className={jsonData2 && jsonData2.solutions > 0 ? 'header-wide' : 'header-narrow'}>
                    <span className="text-secondary">Total Iteration</span>
                  </th>
                  <th className={jsonData2 && jsonData2.solutions > 0 ? 'header-wide' : 'header-narrow'}>
                    <span className="text-secondary">Total Devices</span>
                  </th>
                  <th className={jsonData2 && jsonData2.solutions > 0 ? 'header-wide' : 'header-narrow'}>
                    <span className="text-secondary">Total Shares</span>
                  </th>
                  {jsonData2 && jsonData2.solutions > 0 && (
                    <th className="header-wide">
                      <span className="text-secondary">Total Solutions</span>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className={jsonData2 && jsonData2.solutions > 0 ? "w-1/4" : "w-1/3"}>
                    {roundToTwoDigits(jsonData2.iterrate)}<span className="text-light"> it/s</span>
                  </td>
                  <td className={jsonData2 && jsonData2.solutions > 0 ? "w-1/4" : "w-1/3"}>
                    {jsonData2.devices}
                  </td>
                  <td className={jsonData2 && jsonData2.solutions > 0 ? "w-1/4" : "w-1/3"}>
                    {jsonData2.shares}
                  </td>
                  {jsonData2 && jsonData2.solutions > 0 && (
                    <td className="w-1/4">{jsonData2.solutions}</td>
                  )}
                </tr>
              </tbody>

            </table>
          </div>

          <h2 className="text-light fade-in">Workers Statistics</h2>
          <p className="fade-in data-timestamp mb-0">Data loaded at: {api2TimeStamp}</p>
          <div className="form-check form-switch mb-2 fade-in">
            <input
              className="form-check-input"
              type="checkbox"
              id="toggleSwitchWorkerName"
              checked={hideWorkerName}
              onChange={() => setHideWorkerName(!hideWorkerName)}
            />
            <label className="form-check-label fade-in form-check-label-small" htmlFor="toggleSwitchWorkerName">Hide Worker Name</label>
          </div>
          <div className="card border-light mb-3 fade-in">
            <table className="table table-dark table-striped table-hover table-fixed mb-0">
              <thead>
                <tr>
                  <th className="w-1/4" onClick={() => toggleSort('label')} title="Click here to sort">
                    <span className="text-secondary">Worker Name</span>
                  </th>
                  <th className="w-1/4" onClick={() => toggleSort('last_iterrate')} title="Click here to sort">
                    <span className="text-secondary">Last Iteration</span>
                  </th>
                  <th className="w-1/4" onClick={() => toggleSort('shares')} title="Click here to sort">
                    <span className="text-secondary">Shares</span>
                  </th>
                  {/* <th className="w-1/5" onClick={() => toggleSort('solutions')} title="Click here to sort">
                    <span className="text-secondary">Solutions</span>
                  </th> */}
                  <th className="w-1/4" onClick={() => toggleSort('version')} title="Click here to sort">
                    <span className="text-secondary">Miner version</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedDeviceList.map((device, index) => (
                  <tr key={index} className="table-row-background">
                    <td className={hideWorkerName ? "filter-blur" : ""}>{device.label}</td>
                    <td>{roundToTwoDigits(device.last_iterrate)}<span className="text-light"> it/s</span></td>
                    <td>{device.shares}</td>
                    {/* <td>{device.solutions}</td> */}
                    <td>{device.version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h6 class="text-light mb-4 fade-in">
          <span class="text-primary no-underline">
              <a href="https://discord.gg/Ben9Gny8b3" target="_blank" rel="noopener noreferrer">Code by MinerNinja</a>
          </span>
      </h6>
    </div>
  );
}

export default App;