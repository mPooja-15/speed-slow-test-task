import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// In production, this should come from environment variables
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

// Add error handling for Stripe loading
stripePromise.catch((error) => {
  console.error('Failed to load Stripe:', error);
});

export default stripePromise; 