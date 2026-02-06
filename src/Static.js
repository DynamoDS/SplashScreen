import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { warningIcon, checkMarkIcon } from './encodedImages';

import './Static.css';

const importStatusEnum = {
  none: 1,
  error: 2,
  success: 3,
};

let checked = false;

class Static extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      importStatus: importStatusEnum.none,
      errorDescription: 'Something went wrong when importing your custom setting file. Please try again or proceed with default settings.',
      signInTitle: this.props.signInStatus ? this.props.labels.signOutTitle : this.props.labels.signInTitle,
      signInTooltip: this.props.signInStatus ? this.props.labels.signOutTooltip : this.props.labels.signInTooltip,
      signInStatus: this.props.signInStatus,
      loadingTime: 'Total loading time: ',
      importSettingsTitle: this.props.labels.importSettingsTitle,
      showRestartMessage: false
    };

    window.setImportStatus = this.setImportStatus.bind(this);
    window.setTotalLoadingTime = this.setTotalLoadingTime.bind(this);
    window.setEnableSignInButton = this.setEnableSignInButton.bind(this);
    window.handleSignInStateChange = this.handleSignInStateChange.bind(this);
    window.showRestartMessage = this.showRestartMessage.bind(this);
    window.hideRestartMessage = this.hideRestartMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  //Every time the checkbox is clicked, this method is called
  handleChange() {
    checked = !checked;
    this.props.onCheckedChange(checked);
  }

  render() {
    return (
      <Container className='pr-3'>
        <Row className='mt-3'>
          <button className='secondaryButton' onClick={this.launchDynamo} tabIndex={1}>
            {this.props.labels.launchTitle}
          </button>
        </Row>

        <Row className='mt-3'>
          <OverlayTrigger placement='right' overlay={
            <Tooltip>{this.state.signInTooltip}</Tooltip>
          }>
            <button id='btnSignIn' className='primaryButton' onClick={this.signIn} tabIndex={2} >
              {this.state.signInTitle}
            </button>
          </OverlayTrigger>
        </Row>

        <Row className={`mt-3 importSettingsRow${this.state.showRestartMessage ? ' importSettingsRowWithReset' : ''}`}>
          <OverlayTrigger
            placement={'right'}
            overlay={
              <Tooltip
                hidden={this.state.importStatus === importStatusEnum.success}
                id='button-tooltip'>
                {this.state.importStatus == importStatusEnum.error ? this.state.errorDescription : this.props.labels.importSettingsTooltipDescription}
              </Tooltip>
            }>
            <label id='lblImportSettings' className='primaryButton px-1' tabIndex={3}>
              <input
                id='inputImportSettings'
                type='file'
                className='primaryButton'
                accept='.xml'
                onChange={(e) => this.readFile(e)}
              />
              <div className='buttonLabel'>
                <img
                  src={warningIcon}
                  alt=''
                  hidden={this.state.importStatus !== importStatusEnum.error}></img>
                <img
                  src={checkMarkIcon}
                  alt=''
                  hidden={this.state.importStatus !== importStatusEnum.success}></img>
                <div className='importSettingsText'>
                  <span>{this.props.labels.importSettingsTitle}</span>
                </div>
              </div>
            </label>
          </OverlayTrigger>
          {this.state.showRestartMessage && (
            <button
              className='resetButtonNextToImport'
              title={this.props.labels.resetTooltip}
              onClick={this.resetSettings}
            >
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z'
                  fill='currentColor' />
              </svg>
            </button>
          )}
        </Row>

        {this.state.showRestartMessage && (
          <Row className='mt-2 g-0 restartMessageFullBleed'>
            <div className='restartMessage'>
              {this.props.labels.restartMessage}
            </div>
          </Row>
        )}

        <Row className='mt-3'>
          <label className='p-0 checkboxShowScreenAgain '>
            <input
              type='checkbox'
              onChange={this.handleChange}
              className='checkBoxStyle'
              tabIndex={4} />
            <span className='checkmark'>
              {' '}
              {this.props.labels.showScreenAgainLabel}{' '}
            </span>
          </label>
        </Row>

        <Row className='mt-3'>
          <div className='p-0 loadingTimeFooter' >
            {this.state.loadingTime}
          </div>
        </Row>
      </Container>
    );
  }

  //Opens a page to signin
  signIn = async () => {
    if (chrome.webview !== undefined) {
      if (this.state.signInStatus) {
        let status = await chrome.webview.hostObjects.scriptObject.SignOut();
        this.setState({
          signInStatus: !status,
          signInTitle: this.props.labels.signInTitle,
          signInTooltip: this.props.labels.signInTooltip
        });
      }
      else {
        let btn = document.getElementById('btnSignIn');
        btn.classList.add('disableButton');
        btn.disabled = true;

        this.setState({ signInTitle: this.props.labels.signingInTitle });
        let status = await chrome.webview.hostObjects.scriptObject.SignIn();
        this.setState({ signInStatus: status });

        btn.classList.remove('disableButton');
        btn.disabled = false;
        if (status) {
          this.setState({
            signInTitle: this.props.labels.signOutTitle,
            signInTooltip: this.props.labels.signOutTooltip
          });
        }
        else {
          this.setState({
            signInTitle: this.props.labels.signInTitle,
            signInTooltip: this.props.labels.signInTooltip
          });
        }
      }
    }
  };

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
      let fr = new FileReader();
      fr.onload = function () {
        if (chrome.webview !== undefined) {
          chrome.webview.hostObjects.scriptObject.ImportSettings(fr.result);
        }
      };

      fr.readAsText(file);

      // Clear the input so the same file can be selected again
      event.target.value = '';
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

  setTotalLoadingTime(loadingTime) {
    this.setState({
      loadingTime: loadingTime
    });
  }

  setEnableSignInButton(enableSignInButton) {
    let btn = document.getElementById('btnSignIn');

    if (enableSignInButton.enable === 'True') {
      btn.classList.remove('disableButton');
      btn.disabled = false;
    } else {
      btn.classList.add('disableButton');
      btn.disabled = true;
    }
  }

  //Handles changes to auth status on splash screen
  handleSignInStateChange(auth) {
    this.setState({
      signInStatus: auth.status === 'True'
    });

    if (auth.status === 'True') {
      this.setState({
        signInTitle: this.props.labels.signOutTitle,
        signInTooltip: this.props.labels.signOutTooltip
      });
    }
    else {
      this.setState({
        signInTitle: this.props.labels.signInTitle,
        signInTooltip: this.props.labels.signInTooltip
      });
    }
  }

  //Show restart message and reset button after settings import
  showRestartMessage() {
    this.setState({
      showRestartMessage: true
    });
  }

  //Hide restart message and reset button
  hideRestartMessage() {
    this.setState({
      showRestartMessage: false
    });
  }

  //Reset imported settings
  resetSettings = () => {
    if (chrome.webview !== undefined) {
      chrome.webview.hostObjects.scriptObject.ResetSettings();
    }
  };

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // We check explicitly the lblImportSettings control due to it's a label that wraps inputs, it's no necessary for the launch and signing buttons because they receive the focus ready to are hit with the Enter key
      if (document.activeElement.id === 'lblImportSettings') {
        document.getElementById('inputImportSettings').click();
      }
    }
  };
}

Static.defaultProps = {
  labels: {
    signInTitle: 'Sign In',
    signInTooltip: 'Sign in to access online services that integrate with your desktop software.',
    signingInTitle: 'Signing In',
    signOutTitle: 'Sign Out',
    signOutTooltip: 'Signing out of Dynamo will sign you out of all Autodesk desktop products.',
    launchTitle: 'Launch Dynamo',
    showScreenAgainLabel: 'Don\'t show this screen again',
    importSettingsTitle: 'Import Settings',
    importSettingsTooltipDescription: 'You can import custom settings here, which will overwrite your current settings. If you\'d like to preserve a copy of your current settings, export them before importing new settings. Settings not shown in the Preferences panel will be applied once Dynamo and any host program restarts.',
    restartMessage: 'Settings imported successfully. Please restart Dynamo for changes to take effect.',
    resetTooltip: 'Reset imported settings'
  }
};

Static.propTypes = {
  labels: PropTypes.object,
  signInStatus: PropTypes.bool,
  onCheckedChange: PropTypes.func
};

export default Static;
