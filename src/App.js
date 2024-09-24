import React, { useState, useEffect, useCallback, useMemo } from 'react';
import "bootswatch/dist/vapor/bootstrap.min.css";
import './App.css';
import PoolStatistics from './components/PoolStatistics';
import MinerStatistics from './components/MinerStatistics';
import WorkersStatistics from './components/WorkersStatistics';
import SubmitForm from './components/SubmitForm';
import ToggleSwitch from './components/ToggleSwitch';
import PageHeader from './components/PageHeader';

function App() {
  const [minerId, setMinerId] = useState(() => sessionStorage.getItem('minerId') || '');
  const [jsonData1, setjsonData1] = useState(null);
  const [jsonData2, setJsonData2] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'last_iterrate', direction: 'desc' });
  const [error, setError] = useState('');
  const [hideMinerAddress, setHideMinerAddress] = useState(() => sessionStorage.getItem('hideMinerAddress') === 'true');
  const [hideWorkerName, setHideWorkerName] = useState(() => sessionStorage.getItem('hideWorkerName') === 'true');
  const [loadingApi1, setLoadingApi1] = useState(false);
  const [loadingApi2, setLoadingApi2] = useState(false);
  const [api1TimeStamp, setApi1TimeStamp] = useState('');
  const [api2TimeStamp, setApi2TimeStamp] = useState('');
  const [rememberAddress, setRememberAddress] = useState(() => sessionStorage.getItem('rememberAddress') === 'true');

  const loadMinerData = useCallback(async (id) => {
    if (!id) {
      setError("Empty wallet address. Please enter the correct wallet address and try again!");
      return;
    }

    if (!/^[a-zA-Z0-9]{60}$/.test(id)) {
      setError("Wrong wallet address. Please enter the correct wallet address and try again!");
      return;
    }

    const apiUrl2 = `/TsW8bAP2NE00ka9UuCNh/?miner=${id}&list=true`;

    setError('');
    setLoadingApi2(true);

    setTimeout(async () => {
      try {
        const response2 = await fetch(apiUrl2);
        if (!response2.ok) {
          throw new Error("Sorry, we can't load MINER DATA from the pool server. There are too many requests to the server. Please wait and try again!");
        }

        const data2 = await response2.json();
        setJsonData2(data2);
        setApi2TimeStamp(getTimeStamp());
      } catch (error) {
        console.error('Error loading miner data:', error);
        setError(error.message);
        setJsonData2(null);
      } finally {
        setLoadingApi2(false);
      }
    }, 11000);
  }, []);

  const sortedDeviceList = useMemo(() => {
    if (!jsonData2 || !jsonData2.device_list) return [];
    return [...jsonData2.device_list].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [jsonData2, sortConfig]);

  useEffect(() => {
    try {
      const pathParts = window.location.pathname.split('/stats/');
      const urlMinerId = pathParts[pathParts.length - 1];

      if (urlMinerId && /^[a-zA-Z0-9]{60}$/.test(urlMinerId)) {
        setMinerId(urlMinerId);
        loadMinerData(urlMinerId);
      }

      const apiUrl1 = `/TsW8bAP2NE00ka9UuCNh/`;

      const fetchData = async () => {
        setLoadingApi1(true);
        try {
          const response1 = await fetch(apiUrl1);
          if (!response1.ok) {
            throw new Error("Sorry, we can't load POOL DATA from the pool server. There are too many requests to the server. Please wait and try again!");
          }
          const data1 = await response1.json();
          setjsonData1(data1);
          setApi1TimeStamp(getTimeStamp());
        } catch (error) {
          console.error('Error fetching pool data:', error);
          setError(error.message);
        } finally {
          setLoadingApi1(false);
        }
      };

      fetchData();
    } catch (error) {
      console.error('Error in useEffect:', error);
      setError('An unexpected error occurred. Please try refreshing the page.');
    }
  }, [loadMinerData]);

  useEffect(() => {
    sessionStorage.setItem('rememberAddress', rememberAddress.toString());
    if (rememberAddress) {
      sessionStorage.setItem('minerId', minerId);
    } else {
      sessionStorage.removeItem('minerId');
    }
  }, [rememberAddress, minerId]);

  useEffect(() => {
    sessionStorage.setItem('hideMinerAddress', hideMinerAddress.toString());
  }, [hideMinerAddress]);

  useEffect(() => {
    sessionStorage.setItem('hideWorkerName', hideWorkerName.toString());
  }, [hideWorkerName]);

  const handleMinerIdSubmit = (event) => {
    event.preventDefault();
    loadMinerData(minerId);
  };

  const handleMinerIdChange = (newMinerId) => {
    setMinerId(newMinerId);
  };

  const toggleSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const roundToTwoDigits = useCallback((num) => Number(num.toFixed(2)), []);

  const getTimeStamp = useCallback(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} / ${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
  }, []);

  return (
    <div className="container mt-5 fade-in">
      <PageHeader />

      <div className="col-md-12 d-flex justify-content-between">
        <ToggleSwitch
          id="toggleSwitchMinerAddress"
          checked={hideMinerAddress}
          onChange={() => setHideMinerAddress(prev => !prev)}
          label="Hide Address"
        />
        <ToggleSwitch
          id="toggleSwitchRememberAddress"
          checked={rememberAddress}
          onChange={() => setRememberAddress(prev => !prev)}
          label="Remember Address"
        />
      </div>

      <SubmitForm
        minerId={minerId}
        setMinerId={handleMinerIdChange}
        hideMinerAddress={hideMinerAddress}
        handleMinerIdSubmit={handleMinerIdSubmit}
      />

      {error && (
        <div className="alert alert-danger fade-in" role="alert">
          {error}
        </div>
      )}
      <h6 className="text-light mb-0 text-end">
        <span className="text-primary">Statistics can be updated once every 180 seconds</span>
      </h6>
      
      {jsonData1 && (
        <PoolStatistics 
          jsonData1={jsonData1} 
          api1TimeStamp={api1TimeStamp} 
          roundToTwoDigits={roundToTwoDigits} 
        />
      )}

      {(loadingApi1 || loadingApi2) && (
        <div className="progress mb-4 fade-in">
          <div className="progress-bar progress-bar-striped progress-bar-animated progress-bar-full-width" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Loading Data ...</div>
        </div>
      )}

      {jsonData2 && (
        <>
          <MinerStatistics 
            jsonData2={jsonData2} 
            api2TimeStamp={api2TimeStamp} 
            roundToTwoDigits={roundToTwoDigits} 
          />
          <ToggleSwitch
            id="toggleSwitchWorkerName"
            checked={hideWorkerName}
            onChange={() => setHideWorkerName(prev => !prev)}
            label="Hide Worker Name"
          />
          <WorkersStatistics 
            api2TimeStamp={api2TimeStamp}
            hideWorkerName={hideWorkerName}
            sortedDeviceList={sortedDeviceList}
            toggleSort={toggleSort}
            roundToTwoDigits={roundToTwoDigits}
          />
        </>
      )}

      <h6 className="text-light mb-4 fade-in">
          <span className="text-primary no-underline">
              <a href="https://discord.gg/Ben9Gny8b3" target="_blank" rel="noopener noreferrer">Code by MinerNinja</a>
          </span>
      </h6>
    </div>
  );
}

export default App;