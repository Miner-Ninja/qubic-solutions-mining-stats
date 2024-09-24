import React from 'react';

const WorkersStatistics = ({ api2TimeStamp, hideWorkerName, sortedDeviceList, toggleSort, roundToTwoDigits }) => {
  return (
    <>
      <h2 className="text-light fade-in">Workers Statistics</h2>
      <p className="fade-in data-timestamp mb-0">Data loaded at: {api2TimeStamp}</p>
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
                <td>{device.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WorkersStatistics;