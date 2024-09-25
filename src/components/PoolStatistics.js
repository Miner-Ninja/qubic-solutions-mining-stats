import React from 'react';

const PoolStatistics = ({ jsonData1, api1TimeStamp, roundToTwoDigits }) => {
  return (
    <>
      <div className="two-side-page fade-in">
        <div className="left-column">
          <h2 className="text-light">Pool Statistics</h2>
          <p className="data-timestamp">Data loaded at: {api1TimeStamp}</p>
        </div>
        <div className="right-column text-right">
          <h2 className="text-light" align="right">EP-{jsonData1.epoch}</h2>
          <h6 className="text-light" align="right">Minimal miner version: <b>{jsonData1.min_miner_version}</b></h6>
        </div>
      </div>

      <div className="card border-light mb-5 fade-in">
        <table className="table table-dark table-striped table-hover mb-0 w-full table-fixed">
          <thead>
            <tr>
              <th className="w-1/4"><span className="text-secondary">Pool Devices</span></th>
              <th className="w-1/4"><span className="text-secondary">Pool Iteration</span></th>
              <th className="w-1/4"><span className="text-secondary">Pool Shares</span></th>
              <th className="w-1/4"><span className="text-secondary">PPLNS / SOLO Solutions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="w-1/4">{jsonData1.devices}</td>
              <td className="w-1/4">{roundToTwoDigits((jsonData1.iterrate) / 1000)}<span className="text-light"> Kit/s</span></td>
              <td className="w-1/4">{jsonData1.pplns.shares}</td>
              <td className="w-1/4">{jsonData1.pplns.solutions} / {jsonData1.solo.solutions}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PoolStatistics;