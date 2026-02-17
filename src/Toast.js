import React from 'react';
import { checkMarkIcon, warningIcon } from './encodedImages';
import './Toast.css';

const toastIcons = {
  success: checkMarkIcon,
  error: warningIcon
};

class Toast extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, message: '', type: 'success' };

    window.showToast = this.show.bind(this);
    window.hideToast = this.hide.bind(this);
  }

  show(message, type = 'success') {
    this.setState({ visible: true, message, type });
  }

  hide() {
    this.setState({ visible: false });
  }

  render() {
    if (!this.state.visible) return null;
    const icon = toastIcons[this.state.type];
    return (
      <div className={`toast-notification toast-${this.state.type}`} role='status'>
        {icon && <img src={icon} alt='' className='toast-icon' />}
        <span className='toast-message'>{this.state.message}</span>
        <button className='toast-close' onClick={() => this.hide()} aria-label='Close'>
          &times;
        </button>
      </div>
    );
  }
}

export default Toast;
