import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/components/App';

describe('App', () => {
  test('renders title', () => {
    render(<App />);
    expect(screen.getByText("Substrate Builder")).toBeInTheDocument();
  });
});