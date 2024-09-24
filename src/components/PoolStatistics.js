import React from 'react';

const PoolStatistics = ({ jsonData1, api1TimeStamp, roundToTwoDigits }) => {
  return (
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
  );
};

export default PoolStatistics;