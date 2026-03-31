import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Static from '../src/Static';

const mockOnCheckedChange = jest.fn();
const defaultProps = { signInStatus: false, onCheckedChange: mockOnCheckedChange };

describe('Static', () => {
  beforeEach(() => {
    mockOnCheckedChange.mockClear();
  });

  it('renders with default labels', () => {
    render(<Static {...defaultProps} />);
    expect(screen.getByText('Launch Dynamo')).toBeTruthy();
    expect(screen.getByText('Sign In')).toBeTruthy();
    expect(screen.getByText('Import Settings')).toBeTruthy();
  });

  it('calls onCheckedChange with toggled value when checkbox is clicked', () => {
    render(<Static {...defaultProps} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnCheckedChange).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnCheckedChange).toHaveBeenCalledWith(false);
  });

  it('updates the loading time via window.setTotalLoadingTime', () => {
    render(<Static {...defaultProps} />);
    act(() => { window.setTotalLoadingTime('Total loading time: 3.5s'); });
    expect(screen.getByText('Total loading time: 3.5s')).toBeTruthy();
  });

  it('shows the reset button row on successful import via window.setImportStatus', () => {
    render(<Static {...defaultProps} />);
    act(() => {
      window.setImportStatus({ status: 3, importSettingsTitle: 'Import Settings', errorDescription: '' });
    });
    expect(document.querySelector('.importSettingsRowWithReset')).toBeTruthy();
  });

  it('hides the reset button after window.setImportStatus with none status', () => {
    render(<Static {...defaultProps} />);
    act(() => { window.setImportStatus({ status: 3, errorDescription: '' }); });
    act(() => { window.setImportStatus({ status: 1, errorDescription: '' }); });
    expect(document.querySelector('.importSettingsRowWithReset')).toBeNull();
  });

  it('disables the sign-in button via window.setEnableSignInButton', () => {
    render(<Static {...defaultProps} />);
    act(() => { window.setEnableSignInButton({ enable: 'False' }); });
    expect(screen.getByRole('button', { name: /sign in/i }).disabled).toBe(true);
    act(() => { window.setEnableSignInButton({ enable: 'True' }); });
    expect(screen.getByRole('button', { name: /sign in/i }).disabled).toBe(false);
  });

  it('removes all window methods on unmount', () => {
    const { unmount } = render(<Static {...defaultProps} />);
    unmount();
    expect(window.setImportStatus).toBeUndefined();
    expect(window.setTotalLoadingTime).toBeUndefined();
    expect(window.setEnableSignInButton).toBeUndefined();
    expect(window.handleSignInStateChange).toBeUndefined();
    expect(window.showRestartMessage).toBeUndefined();
    expect(window.hideRestartMessage).toBeUndefined();
  });
});
