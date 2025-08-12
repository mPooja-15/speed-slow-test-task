import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import stripePromise from '@/lib/stripe';

const PaymentTestForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleTestPayment = async () => {
    if (!stripe || !elements) {
      toast.error('Stripe not loaded');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Card element not found');
      return;
    }

    try {
      // Test with a simple payment intent
      const response = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          orderId: 'test-order-id',
          amount: 1000, // $10.00
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Test User',
            email: 'test@example.com',
          },
        },
      });

      if (error) {
        toast.error(`Payment failed: ${error.message}`);
      } else {
        toast.success('Payment successful!');
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-md p-3">
            <CardElement />
          </div>
          <Button onClick={handleTestPayment} className="w-full">
            Test Payment ($10.00)
          </Button>
          <p className="text-sm text-muted-foreground">
            Use test card: 4242 4242 4242 4242
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const PaymentTest: React.FC = () => {
  return (
    <div className="max-w-md mx-auto p-4">
      <Elements stripe={stripePromise}>
        <PaymentTestForm />
      </Elements>
    </div>
  );
};

export default PaymentTest; 