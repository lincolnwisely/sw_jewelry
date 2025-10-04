import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Cart from '../../components/Cart';
import { CartProvider } from '../../context/CartContext';

// Mock useCart hook
vi.mock('../../context/CartContext', async () => {
  const actual = await vi.importActual('../../context/CartContext');
  return {
    ...actual,
    useCart: vi.fn(),
  };
});

describe('Cart Component', () => {
  it('renders cart panel', () => {
    const { useCart } = require('../../context/CartContext');

    useCart.mockReturnValue({
      isCartOpen: true,
      items: [],
      toggleCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      getCartTotal: () => 0,
      getTotalItems: () => 0,
      clearCart: vi.fn(),
    });

    render(<Cart />);

    // Cart should be rendered (even if empty)
    expect(document.querySelector('.cart-panel')).toBeTruthy();
  });

  it('displays cart items', () => {
    const { useCart } = require('../../context/CartContext');

    const mockItems = [
      {
        _id: '1',
        name: 'Test Ring',
        price: 100,
        quantity: 2,
        image: 'test.jpg'
      }
    ];

    useCart.mockReturnValue({
      isCartOpen: true,
      items: mockItems,
      toggleCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      getCartTotal: () => 200,
      getTotalItems: () => 2,
      clearCart: vi.fn(),
    });

    render(<Cart />);

    expect(screen.getByText('Test Ring')).toBeInTheDocument();
    expect(screen.getByText('$200.00')).toBeInTheDocument();
  });
});
