import React from 'react';
import { render, screen } from '../../../utils/testUtils';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders footer with copyright information', () => {
    render(<Footer />);
    
    expect(screen.getByText(/© \d{4} Quiz App/)).toBeInTheDocument();
    expect(screen.getByText('All rights reserved.')).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });
});
