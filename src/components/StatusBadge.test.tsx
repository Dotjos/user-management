import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders Active status with emerald color styling', () => {
    render(<StatusBadge status="Active" />);
    const badge = screen.getByTestId('status-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Active');
    expect(badge).toHaveClass('text-emerald-700');
  });

  it('renders Inactive status with slate color styling', () => {
    render(<StatusBadge status="Inactive" />);
    const badge = screen.getByTestId('status-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Inactive');
    expect(badge).toHaveClass('text-slate-600');
  });
});
