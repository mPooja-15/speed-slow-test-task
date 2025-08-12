import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// In production, this should come from environment variables
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RuthI5EVJDoiNhvGD8LedxYQfbgmbVtgtRAYVaVlyiieHP6G89F6HlDLwuqFwdwf363ifi6H7PMMdUz7sitBAfH00b8qw6kjf'
);

// Add error handling for Stripe loading
stripePromise.catch((error) => {
  console.error('Failed to load Stripe:', error);
});

export default stripePromise; 