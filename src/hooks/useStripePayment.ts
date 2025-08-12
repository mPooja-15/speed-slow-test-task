import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface PaymentIntent {
  clientSecret: string;
  orderId: string;
  amount: number;
}

interface UseStripePaymentReturn {
  isLoading: boolean;
  error: string | null;
  createPaymentIntent: (orderId: string) => Promise<PaymentIntent | null>;
  confirmPayment: (clientSecret: string, paymentMethod: any) => Promise<any>;
  clearError: () => void;
}

export const useStripePayment = (): UseStripePaymentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(async (orderId: string): Promise<PaymentIntent | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create payment intent';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmPayment = useCallback(async (clientSecret: string, paymentMethod: any): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          clientSecret,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment confirmation failed');
      }

      const data = await response.json();
      toast.success('Payment confirmed successfully!');
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Payment confirmation failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    createPaymentIntent,
    confirmPayment,
    clearError,
  };
}; 