import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import Settings from '../Settings';

describe('Settings', () => {
  it('renders settings page with tabs', () => {
    render(<Settings />);
    
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
    expect(screen.getByText('Integrations')).toBeInTheDocument();
  });

  it('switches between tabs when clicked', () => {
    render(<Settings />);
    
    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);
    
    expect(screen.getByText('Password Policy')).toBeInTheDocument();
    expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
  });

  it('renders form fields in general tab', () => {
    render(<Settings />);
    
    expect(screen.getByLabelText('Site Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Site Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Admin Email')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<Settings />);
    
    const siteNameInput = screen.getByLabelText('Site Name');
    fireEvent.change(siteNameInput, { target: { value: 'Test Site' } });
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument();
    });
  });
});
