import React, { useState, useEffect } from 'react';
import { checkMarkIcon, warningIcon } from './encodedImages';
import './Toast.css';

const toastIcons = {
  success: checkMarkIcon,
  error: warningIcon
};

function Toast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');

  useEffect(() => {
    window.showToast = (msg, toastType = 'success') => {
      setMessage(msg);
      setType(toastType);
      setVisible(true);
    };
    window.hideToast = () => setVisible(false);

    return () => {
      delete window.showToast;
      delete window.hideToast;
    };
  }, []);

  if (!visible) return null;
  const icon = toastIcons[type];
  return (
    <div className={`toast-notification toast-${type}`} role='status'>
      {icon && <img src={icon} alt='' className='toast-icon' />}
      <span className='toast-message'>{message}</span>
      <button className='toast-close' onClick={() => setVisible(false)} aria-label='Close'>
        &times;
      </button>
    </div>
  );
}

export default Toast;
