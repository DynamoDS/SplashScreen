import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { warningIcon, checkMarkIcon } from './encodedImages';

import './Static.css';

/*global chrome*/

const importStatusEnum = {
  none: 1,
  error: 2,
  success: 3,
};

let checked = false;

class Static extends React.Component {
  constructor() {
    super();

    this.state = {
      importStatus: importStatusEnum.none,
      importSettingsTitle: 'Import settings',
      errorDescription:
        'Something went wrong when importing your custom setting file. Please try again or proceed with default settings.',
    };

    window.setImportStatus = this.setImportStatus.bind(this);
  }

  render() {
    return (
      <Container className='pr-3'>
        <Row className='mt-3'>
          <button className='primaryButton' onClick={this.signIn}>
            {this.props.signInTitle}
          </button>
        </Row>
        <Row className='mt-3'>
          <button className='secondaryButton' onClick={this.launchDynamo}>
            {this.props.launchTitle}
          </button>
        </Row>
        <Row className='mt-3'>
          <OverlayTrigger
            placement={'right'}
            overlay={
              <Tooltip
                hidden={this.state.importStatus !== importStatusEnum.error}
                id='button-tooltip'
              >
                {this.state.errorDescription}
              </Tooltip>
            }
          >
            <label className='primaryButton px-1'>
              <input
                type='file'
                className='primaryButton'
                onChange={(e) => this.readFile(e)}
              />
              <div className='buttonLabel'>
                <img
                  src={warningIcon}
                  alt=''
                  hidden={this.state.importStatus !== importStatusEnum.error}
                ></img>
                <img
                  src={checkMarkIcon}
                  alt=''
                  hidden={this.state.importStatus !== importStatusEnum.success}
                ></img>
                <div className='importSettingsText'>
                  <span>{this.state.importSettingsTitle}</span>
                </div>
              </div>
            </label>
          </OverlayTrigger>
        </Row>
        <Row className='mt-3'>
          <label className='p-0 checkboxShowScreenAgain '>
            <input
              type='checkbox'
              onChange={this.handleChange}
              className='checkBoxStyle'
            />
            <span className='checkmark'>
              {' '}
              {this.props.showScreenAgainLabel}{' '}
            </span>
          </label>
        </Row>
      </Container>
    );
  }

  //Opens a page to signin
  signIn() {
    window.open('https://accounts.autodesk.com/', '_blank');
  }

  //This method calls another method from Dynamo to actually launch it
  launchDynamo() {
    if (chrome.webview !== undefined) {
      //The 'checked' is a boolean that represents if the user don't want to show the Static screen again
      chrome.webview.hostObjects.scriptObject.LaunchDynamo(checked);
    }
  }

  //Reads the file and send the string to a method inside Dynamo called 'ImportSettings'
  readFile(event) {
    let file = event.target.files[0];
    if (file) {
      if (chrome.webview !== undefined) {
        chrome.webview.hostObjects.scriptObject.ImportSettings(file);
      }
    }
  }

  //Set the result of the file that was imported by Dynamo
  setImportStatus(importStatus) {
    this.setState({
      importStatus: importStatus.status,
      importSettingsTitle: importStatus.importSettingsTitle,
      errorDescription: importStatus.errorDescription,
    });
  }

  //Every time the checkbox is clicked, this method is called
  handleChange() {
    checked = !checked;
  }
}

Static.defaultProps = {
  signInTitle: 'Sign in',
  launchTitle: 'Launch Dynamo',
  showScreenAgainLabel: 'Don’t show this screen again',
};

Static.propTypes = {
  signInTitle: PropTypes.string,
  launchTitle: PropTypes.string,
  showScreenAgainLabel: PropTypes.string,
};

export default Static;
