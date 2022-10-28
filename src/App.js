import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Dynamic from './Dynamic';
import Static from './Static';
import { base64DynamoLogo, base64DynamoBackground } from './encodedImages';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor() {
    super();
    this.setBackgroundImage();
    this.state = {
      welcomeToDynamoTitle: 'Welcome to Dynamo!',
      loadingDone: false,
      signInStatus:false
    };

    //This is a reference to the DOM of the project that will be called in Dynamo to set the title of the splash screen (Defined by 'Welcome to Dynamo!' by default)
    window.setLabels = this.setLabels.bind(this);

    window.setLoadingDone = this.setLoadingDone.bind(this);
    window.setSignInStatus = this.setSignInStatus.bind(this);
  }

  setBackgroundImage() {
    let backgroundImage = '#base64BackgroundImage';
    if (!backgroundImage.includes('#'))
      // eslint-disable-next-line no-import-assign
      base64DynamoBackground = backgroundImage;
  }

  render() {
    return (
      <Container className='fill'>
        <Row>
          <Col className='menuOptions px-4' >
            <Row className='bottomMenu'>
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
              </Col>
            </Row>
            <Row className='bottomMenu'>
              <Col>
                {
                   this.state.loadingDone ?
                   <Static
                     signInStatus={this.state.signInStatus}
                     signInTitle={this.state.signInTitle}
                     welcomeToDynamoTitle={this.state.welcomeToDynamoTitle}
                     launchTitle={this.state.launchTitle}
                     showScreenAgainLabel={this.state.showScreenAgainLabel}
                   /> : <Dynamic />
                }
              </Col>
            </Row>
          </Col>
          <Col className='p-0' >
            <img className='screenBackground' alt='' src={base64DynamoBackground}></img>
          </Col>
        </Row>
      </Container>
    );
  }

  //This method sets the labels of the splash screen as an option of localization
  setLabels(labels) {
    this.setState({
      welcomeToDynamoTitle: labels.welcomeToDynamoTitle,
      signInTitle: labels.signInTitle,
      launchTitle: labels.launchTitle,
      showScreenAgainLabel: labels.showScreenAgainLabel
    });
  }

  //Set the login status from Dynamo
  setSignInStatus(isLoggedIn) {
    this.setState({
      signInStatus: isLoggedIn,
    });
  }

  //This method is called when the loading is done from Dynamo side
  setLoadingDone = async () => {
    var ret = await chrome.webview.hostObjects.scriptObject.SignIn(false);
    this.setState({
      signInStatus: ret,
      signInTitle: ret ? 'Sign Out' : 'Sign In',
      loadingDone: true
    });
  }
}

export default App;
