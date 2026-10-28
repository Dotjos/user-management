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

  it('renders Suspended status with rose color styling', () => {
    render(<StatusBadge status="Suspended" />);
    const badge = screen.getByTestId('status-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Suspended');
    expect(badge).toHaveClass('text-rose-700');
  });

  it('renders Pending status with amber color styling', () => {
    render(<StatusBadge status="Pending" />);
    const badge = screen.getByTestId('status-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Pending');
    expect(badge).toHaveClass('text-amber-700');
  });

  it('renders Inactive status with slate color styling', () => {
    render(<StatusBadge status="Inactive" />);
    const badge = screen.getByTestId('status-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Inactive');
    expect(badge).toHaveClass('text-slate-600');
  });
});
