import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Dynamic from '../src/Dynamic';

describe('Dynamic', () => {
  it('renders initial loading state', () => {
    render(<Dynamic />);
    expect(screen.getByText(/Dynamo Core/)).toBeTruthy();
    expect(document.querySelector('.progress-bar-container')).toBeTruthy();
  });

  it('updates version, description, and progress via window.setBarProperties', () => {
    render(<Dynamic />);
    act(() => {
      window.setBarProperties('2.19.0', 'Loading packages...', '60%', '');
    });
    expect(screen.getByText(/2\.19\.0/)).toBeTruthy();
    expect(screen.getByText('Loading packages...')).toBeTruthy();
    expect(document.querySelector('.progress-bar-indicator').style.width).toBe('60%');
  });

  it('displays loading time when provided', () => {
    render(<Dynamic />);
    act(() => {
      window.setBarProperties('2.19.0', 'Done', '100%', 'Total: 3.2s');
    });
    expect(screen.getByText('Total: 3.2s')).toBeTruthy();
  });

  it('registers window.setBarProperties on mount and removes it on unmount', () => {
    const { unmount } = render(<Dynamic />);
    expect(typeof window.setBarProperties).toBe('function');
    unmount();
    expect(window.setBarProperties).toBeUndefined();
  });
});
