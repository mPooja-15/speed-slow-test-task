# Redux Integration Guide

## Current Status
✅ Redux Toolkit and React Redux are installed  
✅ All Redux slices are created  
✅ Store configuration is complete  
✅ Typed hooks are ready  
🔄 Need to resolve TypeScript import issues  

## Steps to Complete Redux Integration

### 1. Fix TypeScript Issues
The current issue is with module resolution. Try these steps:

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
# Restart TypeScript server in your IDE
```

### 2. Re-enable Redux Provider
Update `src/App.tsx` to include the Redux Provider:

```tsx
import { Provider } from 'react-redux';
import { store } from '@/store';

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      {/* ... rest of the app */}
    </QueryClientProvider>
  </Provider>
);
```

### 3. Migrate Index.tsx to Redux
Replace local state with Redux state:

```tsx
// Replace local state
const [cartItems, setCartItems] = useState<CartItem[]>([]);

// With Redux state
const { items: cartItems } = useAppSelector(state => state.cart);
const dispatch = useAppDispatch();

// Replace state setters with dispatch
dispatch(addToCart(product));
dispatch(removeFromCart(productId));
```

### 4. Test Redux Integration
- Add items to cart
- Remove items from cart
- Update quantities
- Filter products
- Check that state persists across component re-renders

## Redux Store Structure

```typescript
{
  cart: {
    items: CartItem[],
    isOpen: boolean
  },
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null
  },
  product: {
    products: Product[],
    filteredProducts: Product[],
    selectedCategory: string,
    isLoading: boolean,
    error: string | null
  },
  order: {
    orders: Order[],
    currentOrder: Order | null,
    isLoading: boolean,
    error: string | null
  }
}
```

## Available Actions

### Cart Actions
- `addToCart(product)` - Add product to cart
- `removeFromCart(productId)` - Remove product from cart
- `updateQuantity({ productId, quantity })` - Update product quantity
- `clearCart()` - Clear all cart items
- `setCartOpen(boolean)` - Open/close cart sidebar

### Auth Actions
- `loginStart()` - Start login process
- `loginSuccess({ user, token })` - Login successful
- `loginFailure(error)` - Login failed
- `logout()` - Logout user
- `updateUser(userData)` - Update user profile
- `clearError()` - Clear auth errors

### Product Actions
- `setProducts(products)` - Set product list
- `setSelectedCategory(category)` - Filter by category
- `searchProducts(searchTerm)` - Search products
- `setLoading(boolean)` - Set loading state
- `setError(error)` - Set error state

### Order Actions
- `setOrders(orders)` - Set order list
- `addOrder(order)` - Add new order
- `setCurrentOrder(order)` - Set current order
- `updateOrderStatus({ orderId, status })` - Update order status

## Benefits of Redux Integration

1. **Centralized State**: All app state in one place
2. **Predictable Updates**: State changes follow Redux patterns
3. **Developer Tools**: Redux DevTools for debugging
4. **Performance**: Optimized re-renders
5. **Scalability**: Easy to add new features
6. **Testing**: Easy to test state changes

## Troubleshooting

### Common Issues:
1. **Import Errors**: Restart TypeScript server
2. **Type Errors**: Check slice exports
3. **State Not Updating**: Verify action dispatching
4. **Performance Issues**: Use React.memo for components

### Debug Tools:
- Redux DevTools browser extension
- Console logging in reducers
- React DevTools for component state 