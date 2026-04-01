import React, { useState, useEffect } from 'react';

import './Dynamic.css';

function Dynamic() {
  const [barSize, setBarSize] = useState('0%');
  const [dynamoVersion, setDynamoVersion] = useState('');
  const [loadDescription, setLoadDescription] = useState('');
  const [loadingTime, setLoadingTime] = useState('');

  useEffect(() => {
    window.setBarProperties = (version, description, size, time) => {
      setDynamoVersion(version);
      setLoadDescription(description);
      setBarSize(size);
      setLoadingTime(time);
    };
    return () => { delete window.setBarProperties; };
  }, []);

  return (
    <div className='dynamicOptions'>
      <div>
        Dynamo Core {dynamoVersion}
      </div>
      <div>
        <div className='progress-bar-container'>
          <div className='progress-bar-indicator' style={{ width: barSize }} />
        </div>
      </div>
      <div className='loadingDescription'>
        {loadDescription}
      </div>
      <br />
      <br />
      <div className='loadingTimeFooter'>
        {loadingTime}
      </div>
    </div>
  );
}

export default Dynamic;
