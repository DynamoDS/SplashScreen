import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Toast from '../src/Toast';

describe('Toast', () => {
  it('shows a toast via window.showToast and renders message with icon', () => {
    render(<Toast />);

    // Not visible initially
    expect(screen.queryByRole('status')).toBeNull();

    // Trigger via global API
    act(() => { window.showToast('Import successful', 'success'); });

    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText('Import successful')).toBeTruthy();
  });

  it('hides the toast when close button is clicked', () => {
    render(<Toast />);

    act(() => { window.showToast('Please restart', 'success'); });
    expect(screen.getByRole('status')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByRole('status')).toBeNull();
  });
});
