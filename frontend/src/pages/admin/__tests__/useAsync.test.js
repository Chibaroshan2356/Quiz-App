import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useAsync } from '../useAsync';

// Test component that uses the async hook
const TestComponent = () => {
  const { data, loading, error, execute } = useAsync();

  const fetchData = () => {
    execute(async () => {
      const response = await fetch('/api/test');
      return response.json();
    });
  };

  return (
    <div>
      <div data-testid="data">{data ? JSON.stringify(data) : 'No data'}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
};

describe('useAsync', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('provides async state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('data')).toHaveTextContent('No data');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
  });

  it('handles successful async operation', async () => {
    const mockData = { id: 1, name: 'Test' };
    global.fetch.mockResolvedValueOnce({
      json: async () => mockData
    });

    render(<TestComponent />);
    
    const fetchButton = screen.getByText('Fetch Data');
    fireEvent.click(fetchButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('data')).toHaveTextContent(JSON.stringify(mockData));
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  it('handles failed async operation', async () => {
    const mockError = new Error('Fetch failed');
    global.fetch.mockRejectedValueOnce(mockError);

    render(<TestComponent />);
    
    const fetchButton = screen.getByText('Fetch Data');
    fireEvent.click(fetchButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Fetch failed');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });
});
