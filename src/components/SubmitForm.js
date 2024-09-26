import React from 'react';

const SubmitForm = ({ minerId, setMinerId, hideMinerAddress, handleMinerIdSubmit }) => {
  return (
    <form onSubmit={handleMinerIdSubmit} className="fade-in mb-1">
      <div className="input-group mb-3">
        <input
          type="text"
          className={`form-control form-control-lg ${hideMinerAddress ? 'filter-blur' : ''}`}
          value={minerId}
          onChange={(e) => setMinerId(e.target.value)}
          placeholder="Enter Your Qubic Wallet Address"
        />
        <button className="btn btn-secondary" type="submit">Load Stats</button>
      </div>
    </form>
  );
};

export default SubmitForm;