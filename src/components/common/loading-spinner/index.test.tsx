import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './index';

describe('LoadingSpinner', () => {
  it('renders with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays custom message', () => {
    render(<LoadingSpinner message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders different sizes', () => {
    const { container: sm } = render(<LoadingSpinner size="sm" />);
    const { container: lg } = render(<LoadingSpinner size="lg" />);

    expect(sm.querySelector('.h-6')).toBeInTheDocument();
    expect(lg.querySelector('.h-10')).toBeInTheDocument();
  });

  it('renders in full screen mode', () => {
    const { container } = render(<LoadingSpinner fullScreen />);
    expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
  });
});
