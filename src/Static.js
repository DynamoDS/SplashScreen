import React, { useState, useEffect, useRef } from 'react';
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

function Static({ signInStatus: initialSignInStatus, labels, onCheckedChange }) {
  const [importStatus, setImportStatus] = useState(importStatusEnum.none);
  const [errorDescription, setErrorDescription] = useState(
    'Something went wrong when importing your custom setting file. Please try again or proceed with default settings.'
  );
  const [signInTitle, setSignInTitle] = useState(
    initialSignInStatus ? labels.signOutTitle : labels.signInTitle
  );
  const [signInTooltip, setSignInTooltip] = useState(
    initialSignInStatus ? labels.signOutTooltip : labels.signInTooltip
  );
  const [signInStatus, setSignInStatus] = useState(initialSignInStatus);
  const [signInDisabled, setSignInDisabled] = useState(false);
  const [loadingTime, setLoadingTime] = useState('Total loading time: ');
  const [showRestartMessage, setShowRestartMessage] = useState(false);

  // checkedRef holds the checkbox value passed to LaunchDynamo — a ref avoids
  // stale closure issues in the launchDynamo handler.
  const checkedRef = useRef(false);
  // labelsRef gives window methods stable access to the latest labels prop
  // without needing to re-register those methods when labels changes.
  const labelsRef = useRef(labels);
  labelsRef.current = labels;

  const importSettingsLabelRef = useRef(null);
  const importSettingsInputRef = useRef(null);

  useEffect(() => {
    window.setImportStatus = (status) => {
      setImportStatus(status.status);
      if (status.status === importStatusEnum.error) {
        const defaultErrorDescription =
          'Something went wrong when importing your custom setting file. Please try again or proceed with default settings.';
        const hasCustomDescription =
          typeof status.errorDescription === 'string' && status.errorDescription.trim().length > 0;
        setErrorDescription(hasCustomDescription ? status.errorDescription : defaultErrorDescription);
      }
      if (status.status === importStatusEnum.success) {
        setShowRestartMessage(true);
        if (window.showToast) {
          const msg = labelsRef.current?.restartMessage ?? Static.defaultProps.labels.restartMessage;
          window.showToast(msg, 'success');
        }
      } else if (status.status === importStatusEnum.none) {
        setShowRestartMessage(false);
        window.hideToast?.();
      }
    };
    window.setTotalLoadingTime = (time) => setLoadingTime(time);
    window.setEnableSignInButton = ({ enable }) => setSignInDisabled(enable !== 'True');
    window.handleSignInStateChange = (auth) => {
      const isSignedIn = auth.status === 'True';
      setSignInStatus(isSignedIn);
      setSignInTitle(isSignedIn ? labelsRef.current.signOutTitle : labelsRef.current.signInTitle);
      setSignInTooltip(isSignedIn ? labelsRef.current.signOutTooltip : labelsRef.current.signInTooltip);
    };
    window.showRestartMessage = () => {
      setShowRestartMessage(true);
      if (window.showToast) {
        const msg = labelsRef.current?.restartMessage ?? Static.defaultProps.labels.restartMessage;
        window.showToast(msg, 'success');
      }
    };
    window.hideRestartMessage = () => {
      setShowRestartMessage(false);
      window.hideToast?.();
    };

    return () => {
      delete window.setImportStatus;
      delete window.setTotalLoadingTime;
      delete window.setEnableSignInButton;
      delete window.handleSignInStateChange;
      delete window.showRestartMessage;
      delete window.hideRestartMessage;
    };
  }, []);

  useEffect(() => {
    // The import settings control is a <label> wrapping an <input>. Labels do not
    // natively activate on Enter, so we handle it manually via keydown.
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && document.activeElement === importSettingsLabelRef.current) {
        importSettingsInputRef.current?.click();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = () => {
    checkedRef.current = !checkedRef.current;
    onCheckedChange(checkedRef.current);
  };

  const signIn = async () => {
    if (typeof chrome === 'undefined' || chrome.webview === undefined) return;
    try {
      if (signInStatus) {
        const status = await chrome.webview.hostObjects.scriptObject.SignOut();
        setSignInStatus(!status);
        setSignInTitle(labels.signInTitle);
        setSignInTooltip(labels.signInTooltip);
      } else {
        setSignInDisabled(true);
        setSignInTitle(labels.signingInTitle);
        const status = await chrome.webview.hostObjects.scriptObject.SignIn();
        setSignInStatus(status);
        setSignInDisabled(false);
        if (status) {
          setSignInTitle(labels.signOutTitle);
          setSignInTooltip(labels.signOutTooltip);
        } else {
          setSignInTitle(labels.signInTitle);
          setSignInTooltip(labels.signInTooltip);
        }
      }
    } catch {
      setSignInDisabled(false);
    }
  };

  const launchDynamo = () => {
    if (typeof chrome !== 'undefined' && chrome.webview !== undefined) {
      chrome.webview.hostObjects.scriptObject.LaunchDynamo(checkedRef.current);
    }
  };

  const readFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fr = new FileReader();
    fr.onload = () => {
      if (typeof chrome !== 'undefined' && chrome.webview !== undefined) {
        chrome.webview.hostObjects.scriptObject.ImportSettings(fr.result);
      }
    };
    fr.onerror = () => {
      setImportStatus(importStatusEnum.error);
      setErrorDescription('Failed to read the settings file. Please try again.');
    };
    fr.readAsText(file);

    // Clear so the same file can be re-selected
    event.target.value = '';
  };

  const resetSettings = () => {
    if (typeof chrome !== 'undefined' && chrome.webview !== undefined) {
      chrome.webview.hostObjects.scriptObject.ResetSettings();
    }
  };

  return (
    <Container className='pr-3'>
      <Row className='mt-3'>
        <button className='secondaryButton' onClick={launchDynamo} tabIndex={1}>
          {labels.launchTitle}
        </button>
      </Row>

      <Row className='mt-3'>
        <OverlayTrigger placement='right' overlay={
          <Tooltip>{signInTooltip}</Tooltip>
        }>
          <button
            id='btnSignIn'
            className={`primaryButton${signInDisabled ? ' disableButton' : ''}`}
            disabled={signInDisabled}
            onClick={signIn}
            tabIndex={2}
          >
            {signInTitle}
          </button>
        </OverlayTrigger>
      </Row>

      <Row className={`mt-3 importSettingsRow${showRestartMessage ? ' importSettingsRowWithReset' : ''}`}>
        <OverlayTrigger
          placement='right'
          overlay={
            <Tooltip
              hidden={importStatus === importStatusEnum.success}
              id='button-tooltip'>
              {importStatus === importStatusEnum.error ? errorDescription : labels.importSettingsTooltipDescription}
            </Tooltip>
          }>
          <label ref={importSettingsLabelRef} id='lblImportSettings' className='primaryButton px-1' tabIndex={3}>
            <input
              ref={importSettingsInputRef}
              id='inputImportSettings'
              type='file'
              className='primaryButton'
              accept='.xml'
              onChange={readFile}
            />
            <div className='buttonLabel'>
              <img
                src={warningIcon}
                alt=''
                hidden={importStatus !== importStatusEnum.error}
              />
              <img
                src={checkMarkIcon}
                alt=''
                hidden={importStatus !== importStatusEnum.success}
              />
              <div className='importSettingsText'>
                <span>{labels.importSettingsTitle}</span>
              </div>
            </div>
          </label>
        </OverlayTrigger>
        {showRestartMessage && (
          <button
            className='resetButtonNextToImport'
            title={labels.resetTooltip}
            onClick={resetSettings}
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z'
                fill='currentColor' />
            </svg>
          </button>
        )}
      </Row>

      <Row className='mt-3'>
        <label className='p-0 checkboxShowScreenAgain'>
          <input
            type='checkbox'
            onChange={handleChange}
            className='checkBoxStyle'
            tabIndex={4}
          />
          <span className='checkmark'>
            {' '}
            {labels.showScreenAgainLabel}{' '}
          </span>
        </label>
      </Row>

      <Row className='mt-3'>
        <div className='p-0 loadingTimeFooter'>
          {loadingTime}
        </div>
      </Row>
    </Container>
  );
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
    restartMessage: 'Settings imported. Please restart Dynamo.',
    resetTooltip: 'Reset imported settings'
  },
  onCheckedChange: () => {},
};

Static.propTypes = {
  labels: PropTypes.shape({
    signInTitle: PropTypes.string,
    signInTooltip: PropTypes.string,
    signingInTitle: PropTypes.string,
    signOutTitle: PropTypes.string,
    signOutTooltip: PropTypes.string,
    launchTitle: PropTypes.string,
    showScreenAgainLabel: PropTypes.string,
    importSettingsTitle: PropTypes.string,
    importSettingsTooltipDescription: PropTypes.string,
    restartMessage: PropTypes.string,
    resetTooltip: PropTypes.string,
  }),
  signInStatus: PropTypes.bool,
  onCheckedChange: PropTypes.func,
};

export default Static;
