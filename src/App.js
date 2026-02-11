import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Dynamic from './Dynamic';
import Static from './Static';
import Toast from './Toast';
import { base64DynamoLogo, base64DynamoBackground } from './encodedImages';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor() {
    super();
    this.setBackgroundImage();
    const noWebView = typeof chrome === 'undefined' || typeof chrome.webview === 'undefined';
    this.isDebugMode = noWebView && new URLSearchParams(window.location.search).has('debug');
    this.state = {
      isChecked: false,
      welcomeToDynamoTitle: 'Welcome to Dynamo!',
      loadingDone: false,
      signInStatus: false
    };

    //This is a reference to the DOM of the project that will be called in Dynamo to set the title of the splash screen (Defined by 'Welcome to Dynamo!' by default)
    window.setLabels = this.setLabels.bind(this);
    window.setLoadingDone = this.setLoadingDone.bind(this);
    window.setSignInStatus = this.setSignInStatus.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
  }

  handleCheckedChange = (checked) => {
    this.setState({isChecked: checked});
  };

  setBackgroundImage() {
    let backgroundImage = '#base64BackgroundImage';
    if (!backgroundImage.includes('#'))
      // eslint-disable-next-line no-import-assign
      base64DynamoBackground = backgroundImage;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);

    // Debug mode: auto-show Static when running outside Dynamo (no WebView2)
    if (this.isDebugMode) {
      console.log('[SplashScreen] Debug mode: no WebView2 detected, auto-loading Static');
      this.setLoadingDone();
    }
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col className='menuOptions px-4' >
            <Row className='bottomMenu bottomMenuHeader'>
              <Col>
                <Row>
                  <div>
                    <img className='dynamoLogo' alt='' src={base64DynamoLogo}></img>
                  </div>
                </Row>
                <Row className='welcomeRow'>
                  <div >
                    {this.state.welcomeToDynamoTitle}
                  </div>
                </Row>
                {this.isDebugMode && <Row><div style={{ fontSize: '10px', color: 'yellow', marginTop: '4px' }}>Debug Mode</div></Row>}
              </Col>
            </Row>
            <Row className='bottomMenu bottomMenuContent'>
              <Col>
                {
                  this.state.loadingDone ?
                    <Static
                      signInStatus={this.state.signInStatus}
                      labels={this.state.labels}
                      onCheckedChange={this.handleCheckedChange}
                    /> : <Dynamic />
                }
              </Col>
            </Row>
          </Col>
          <Col className='p-0' >
            {this.state.loadingDone && <span onClick={this.closeDynamo} className='close' />}
            <img className='screenBackground' alt='' src={base64DynamoBackground}></img>
          </Col>
        </Row>
        <Toast />
      </Container>
    );
  }

  //This method sets the labels of the splash screen as an option of localization
  setLabels(labels) {
    this.setState({
      welcomeToDynamoTitle: labels.welcomeToDynamoTitle,
      labels: labels
    });
  }

  //Set the login status from Dynamo
  setSignInStatus(val) {
    this.setState({
      signInStatus: val.signInStatus === 'True'
    });
  }

  //This method is called when the loading is done from Dynamo side
  setLoadingDone = async () => {
    this.setState({
      loadingDone: true
    });
  };
}

export default App;
