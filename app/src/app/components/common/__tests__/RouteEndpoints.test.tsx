import React from 'react';
import { render, screen } from '@testing-library/react';
import RouteEndpoints from '../RouteEndpoints';
import { Place } from '../../../types/route';

describe('RouteEndpoints', () => {
  const mockFromPlace: Place = {
    placeName: 'London Victoria',
    naptanOrAtco: 'VIC'
  };

  const mockToPlace: Place = {
    placeName: 'Brighton',
    naptanOrAtco: 'BTN'
  };

  test('renders departure and destination information with accessibility features', () => {
    render(<RouteEndpoints from={mockFromPlace} to={mockToPlace} />);

    // Check for the region role and aria-label
    const routeRegion = screen.getByRole('region', { name: 'Journey route information' });
    expect(routeRegion).toBeInTheDocument();

    // Check for departure section
    expect(screen.getByText('Departure')).toBeInTheDocument();
    expect(screen.getByText('London Victoria')).toBeInTheDocument();

    // Check for destination section
    expect(screen.getByText('Destination')).toBeInTheDocument();
    expect(screen.getByText('Brighton')).toBeInTheDocument();

    // Check that place names are displayed with correct styling
    const departureName = screen.getByText('London Victoria');
    expect(departureName).toHaveClass('text-white', 'font-bold', 'text-lg');
    
    const destinationName = screen.getByText('Brighton');
    expect(destinationName).toHaveClass('text-white', 'font-bold', 'text-lg');
  });
});