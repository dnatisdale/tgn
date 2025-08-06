import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TGNApp from './TGNApp';

describe('TGNApp theme-switcher', () => {
  beforeEach(() => {
    // start with no theme attr
    document.documentElement.removeAttribute('data-theme');
  });

  test('renders the "Test Primary" and "Test Secondary" buttons', () => {
    render(<TGNApp />);
    const primaryButton = screen.getByRole('button', { name: /Test Primary/i });
    const secondaryButton = screen.getByRole('button', { name: /Test Secondary/i });
    expect(primaryButton).toBeDefined();
    expect(secondaryButton).toBeDefined();
  });

  test('selecting a new theme updates the data-theme attribute', () => {
    render(<TGNApp />);
    const selector = screen.getByRole('combobox');
    fireEvent.change(selector, { target: { value: 'green-earth' } });
    expect(document.documentElement.getAttribute('data-theme')).toBe('green-earth');
  });
});
