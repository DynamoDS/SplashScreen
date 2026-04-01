import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Dynamic from './Dynamic';
import Static from './Static';
import Toast from './Toast';
import { base64DynamoLogo, base64DynamoBackground as importedBackground } from './encodedImages';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// '#base64BackgroundImage' is a build-time placeholder replaced by Dynamo's build system.
// If the placeholder was replaced (no longer contains '#'), use that value; otherwise
// fall back to the image imported from encodedImages.
const buildTimePlaceholder = '#base64BackgroundImage';
const backgroundImage = buildTimePlaceholder.includes('#') ? importedBackground : buildTimePlaceholder;

const isDebugMode = (() => {
  const noWebView = typeof chrome === 'undefined' || typeof chrome.webview === 'undefined';
  return noWebView && new URLSearchParams(window.location.search).has('debug');
})();

function App() {
  const [welcomeToDynamoTitle, setWelcomeToDynamoTitle] = useState('Welcome to Dynamo!');
  const [loadingDone, setLoadingDone] = useState(false);
  const [signInStatus, setSignInStatus] = useState(false);
  const [labels, setLabels] = useState(undefined);

  useEffect(() => {
    window.setLabels = (newLabels) => {
      setWelcomeToDynamoTitle(newLabels.welcomeToDynamoTitle);
      setLabels(newLabels);
    };
    window.setLoadingDone = () => setLoadingDone(true);
    window.setSignInStatus = (val) => setSignInStatus(val.signInStatus === 'True');

    if (isDebugMode) {
      setLoadingDone(true);
    }

    return () => {
      delete window.setLabels;
      delete window.setLoadingDone;
      delete window.setSignInStatus;
    };
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col className='menuOptions px-4'>
          <Row className='bottomMenu bottomMenuHeader'>
            <Col>
              <Row>
                <div>
                  <img className='dynamoLogo' alt='' src={base64DynamoLogo} />
                </div>
              </Row>
              <Row className='welcomeRow'>
                <div>
                  {welcomeToDynamoTitle}
                </div>
              </Row>
            </Col>
          </Row>
          <Row className='bottomMenu bottomMenuContent'>
            <Col>
              {loadingDone
                ? <Static
                  signInStatus={signInStatus}
                  labels={labels}
                  onCheckedChange={() => {}}
                />
                : <Dynamic />
              }
            </Col>
          </Row>
        </Col>
        <Col className='p-0'>
          {loadingDone && <span className='close' />}
          <img className='screenBackground' alt='' src={backgroundImage} />
        </Col>
      </Row>
      <Toast />
    </Container>
  );
}

export default App;
