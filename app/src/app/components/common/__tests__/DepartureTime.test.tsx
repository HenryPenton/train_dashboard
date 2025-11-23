import { render, screen } from '@testing-library/react';
import DepartureTime from '../DepartureTime';

describe('DepartureTime', () => {
  it('renders scheduled departure time with accessibility attributes', () => {
    render(
      <DepartureTime
        status="On time"
        scheduledTime="14:30"
        estimatedTime="14:30"
      />
    );
    
    const departureTime = screen.getByRole('time', { name: 'Departure time: 14:30' });
    expect(departureTime).toBeInTheDocument();
    expect(departureTime).toHaveTextContent('Departs: 14:30');
  });

  it('renders cancelled status correctly', () => {
    render(
      <DepartureTime
        status="Cancelled"
        scheduledTime="14:30"
      />
    );
    
    const departureTime = screen.getByRole('time', { name: 'Departure time: Cancelled' });
    expect(departureTime).toBeInTheDocument();
    expect(screen.getByText('CANCELLED')).toBeInTheDocument();
  });

  it('renders estimated time when different from scheduled', () => {
    render(
      <DepartureTime
        status="Late"
        scheduledTime="14:30"
        estimatedTime="14:35"
      />
    );
    
    const departureTime = screen.getByRole('time', { name: 'Departure time: 14:30' });
    expect(departureTime).toBeInTheDocument();
    expect(departureTime).toHaveTextContent('14:30');
    expect(departureTime).toHaveTextContent('(14:35)');
  });
});