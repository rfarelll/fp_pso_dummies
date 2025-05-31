// hello.test.tsx
import { render, screen } from '@testing-library/react';
import Navbar from '../../components/Navbar';

describe('Navbar', () => {
  it('renders DooIT logo text', () => {
    render(<Navbar />);
    expect(screen.getByText(/DooIT/i)).toBeInTheDocument();
  });
});
