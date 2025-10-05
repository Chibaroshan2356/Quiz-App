import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useForm } from '../useForm';

// Test component that uses the form hook
const TestComponent = () => {
  const { values, errors, handleChange, handleSubmit, reset, setValue } = useForm({
    initialValues: { name: '', email: '' },
    validation: {
      name: (value) => value.length < 3 ? 'Name must be at least 3 characters' : null,
      email: (value) => !value.includes('@') ? 'Email must contain @' : null
    }
  });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        data-testid="name-input"
        name="name"
        value={values.name}
        onChange={handleChange}
        placeholder="Name"
      />
      {errors.name && <div data-testid="name-error">{errors.name}</div>}
      
      <input
        data-testid="email-input"
        name="email"
        value={values.email}
        onChange={handleChange}
        placeholder="Email"
      />
      {errors.email && <div data-testid="email-error">{errors.email}</div>}
      
      <button type="submit">Submit</button>
      <button type="button" onClick={reset}>Reset</button>
      <button type="button" onClick={() => setValue('name', 'Test Name')}>Set Name</button>
    </form>
  );
};

describe('useForm', () => {
  it('provides form state and functions', () => {
    render(<TestComponent />);
    
    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
  });

  it('updates values when inputs change', () => {
    render(<TestComponent />);
    
    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    
    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    expect(nameInput).toHaveValue('John');
    expect(emailInput).toHaveValue('john@example.com');
  });

  it('validates form fields', () => {
    render(<TestComponent />);
    
    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    
    // Enter invalid values
    fireEvent.change(nameInput, { target: { value: 'Jo' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Submit form
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    // Check for validation errors
    expect(screen.getByTestId('name-error')).toHaveTextContent('Name must be at least 3 characters');
    expect(screen.getByTestId('email-error')).toHaveTextContent('Email must contain @');
  });

  it('resets form when reset is called', () => {
    render(<TestComponent />);
    
    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    
    // Enter values
    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    expect(nameInput).toHaveValue('John');
    expect(emailInput).toHaveValue('john@example.com');
    
    // Reset form
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
  });

  it('sets specific value when setValue is called', () => {
    render(<TestComponent />);
    
    const nameInput = screen.getByTestId('name-input');
    const setValueButton = screen.getByText('Set Name');
    
    // Set value
    fireEvent.click(setValueButton);
    
    expect(nameInput).toHaveValue('Test Name');
  });
});
