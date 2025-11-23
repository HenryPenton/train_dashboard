import { render, screen } from '@testing-library/react';
import DelayInfo from '../DelayInfo';

describe('DelayInfo', () => {
  it('renders delay information with correct accessibility attributes', () => {
    render(<DelayInfo delay={5} />);
    
    const delayInfo = screen.getByRole('status', { name: 'Train delay information: 5 minutes delayed' });
    expect(delayInfo).toBeInTheDocument();
    expect(delayInfo).toHaveTextContent('Delay: 5 min');
  });

  it('renders on-time status correctly', () => {
    render(<DelayInfo delay={0} />);
    
    const delayInfo = screen.getByRole('status', { name: 'Train delay information: On time' });
    expect(delayInfo).toBeInTheDocument();
    expect(delayInfo).toHaveTextContent('Delay: On time');
  });
});