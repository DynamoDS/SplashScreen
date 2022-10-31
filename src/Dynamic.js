import React from 'react';

import './Dynamic.css';

class Dynamic extends React.Component {
  constructor() {
    super();
    this.state = {
      barSize: '0%',
      dynamoVersion: '',
      loadDescription: '',
      loadingTime: 'Loading time: ',
    };

    //This is a reference to the DOM of the project that will be called in Dynamo to fill the loading properties
    window.setBarProperties = this.setBarProperties.bind(this);
  }

  render() {
    return (
      <div className='dynamicOptions'>
        <div >
          Dynamo Core {this.state.dynamoVersion}
        </div>
        <div>
          <div className='progress-bar-container'>
            <div className='progress-bar-indicator' style={{ width: this.state.barSize }} ></div>
          </div>
        </div>
        <div >
          {this.state.loadDescription}
        </div>
        <br />
        <br />
        <div className='loadingTimeFooter' >
          {this.state.loadingTime}
        </div>
      </div>
    );
  }

  setBarProperties(dynamoVersion, loadDescription, barSize, loadingTime) {
    this.setState({
      barSize: barSize,
      dynamoVersion: dynamoVersion,
      loadDescription: loadDescription,
      loadingTime: loadingTime
    });
    document.getElementsByClassName('progress-bar-indicator')[0].style.display = 'flex';
  }
}

export default Dynamic;
