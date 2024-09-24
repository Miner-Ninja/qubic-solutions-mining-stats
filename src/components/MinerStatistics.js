import React from 'react';

const MinerStatistics = ({ jsonData2, api2TimeStamp, roundToTwoDigits }) => {
  return (
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
    </>
  );
};

export default MinerStatistics;