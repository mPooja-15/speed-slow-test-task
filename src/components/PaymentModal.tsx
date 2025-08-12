import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '@/lib/stripe';
import PaymentForm from './PaymentForm';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId: string;
  onSuccess: (paymentResult: any) => void;
  onError: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  orderId,
  onSuccess,
  onError,
}) => {
  const handleSuccess = (paymentResult: any) => {
    onSuccess(paymentResult);
    onClose();
  };

  const handleError = (error: string) => {
    onError(error);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Enter your payment details to complete your purchase securely.
          </DialogDescription>
        </DialogHeader>
        <Elements stripe={stripePromise}>
          <PaymentForm
            amount={amount}
            orderId={orderId}
            onSuccess={handleSuccess}
            onError={handleError}
            onCancel={handleCancel}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal; 