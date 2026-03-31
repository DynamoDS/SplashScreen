import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders the welcome title', () => {
    render(<App />);
    expect(screen.getByText('Welcome to Dynamo!')).toBeTruthy();
  });

  it('shows the Dynamic component initially', () => {
    render(<App />);
    expect(document.querySelector('.dynamicOptions')).toBeTruthy();
    expect(screen.queryByText('Launch Dynamo')).toBeNull();
  });

  it('switches to Static after window.setLoadingDone is called', () => {
    render(<App />);
    act(() => { window.setLoadingDone(); });
    expect(screen.getByText('Launch Dynamo')).toBeTruthy();
    expect(document.querySelector('.dynamicOptions')).toBeNull();
  });

  it('updates the welcome title via window.setLabels', () => {
    render(<App />);
    act(() => {
      window.setLabels({ welcomeToDynamoTitle: 'Hello from Dynamo!' });
    });
    expect(screen.getByText('Hello from Dynamo!')).toBeTruthy();
  });

  it('registers window methods on mount and removes them on unmount', () => {
    const { unmount } = render(<App />);
    expect(typeof window.setLabels).toBe('function');
    expect(typeof window.setLoadingDone).toBe('function');
    expect(typeof window.setSignInStatus).toBe('function');
    unmount();
    expect(window.setLabels).toBeUndefined();
    expect(window.setLoadingDone).toBeUndefined();
    expect(window.setSignInStatus).toBeUndefined();
  });
});
