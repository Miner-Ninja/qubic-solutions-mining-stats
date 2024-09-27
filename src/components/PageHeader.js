import React from 'react';
import { Helmet } from 'react-helmet';

const PageHeader = () => {
  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Qubic.Commando.sh - Mining Stats for Qubic.Solutions Pool</title>
        <meta name="description" content="Get real-time mining statistics for Qubic.Solutions pool. Check epoch, pool iteration, devices, and solutions." />
        <meta name="keywords" content="mining stats, Qubic Solutions, pool statistics, epoch, pool iteration, devices, solutions" />
        <meta name="author" content="MinerNinja" />
      </Helmet>
        <div className="alert alert-primary mt-5 fade-in">
          <h6 className="fade-in mb-1">
            <span className="fade-in">We need Your donnation to make this project possible.<br/>Feel free to donate for webpage development and support: <br/>Qubic wallet: PONNUCBRSDOVYFIKITWQMMRQTFNBGNDFAEEDHQCSTEAEXTXEALVLLYQADMJA</span>
         </h6>
        </div>
      <h1 className="text-light mb-2 " id="title"><span className="cyberpunk-glow-2">Qubic.Commando.sh</span> - Mining stats for Qubic.Solutions pool</h1>
      <h6 className="text-light mb-4"><span>Happy mining, and may the hash-force be with you ;)</span></h6>
      
      {/* <button type="button" class="btn btn-outline-secondary mb-3 m-1">Mining stats</button>
      <button type="button" class="btn btn-outline-secondary mb-3 m-1">Payouts stats</button>
      <button type="button" class="btn btn-outline-secondary mb-3 m-1">Top Donators</button> */}

    </>
  );
};

export default PageHeader;