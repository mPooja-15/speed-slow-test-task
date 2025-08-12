import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearCart } from '@/store/slices/cartSlice';
import CheckoutPage from './CheckoutPage';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CheckoutPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector(state => state.cart);
  const { isLoading } = useAppSelector(state => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);



  useEffect(() => {
    if (!isInitializing && !isLoading && cartItems.length === 0) {
      console.log('Cart is empty, redirecting to home');
      navigate('/');
    }
  }, [isInitializing, isLoading, cartItems.length, navigate]);

  const transformedCartItems = cartItems.map(item => ({
    id: item.product.id.toString(),
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    image: item.product.image,
  }));

  const handleCheckoutComplete = (orderId: string) => {
    console.log('Checkout completed for order:', orderId);
    toast.success(`Order ${orderId} completed successfully!`);
    dispatch(clearCart());
    navigate('/');
  };
  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading checkout...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return null;
  }

  console.log('Rendering CheckoutPage with items:', transformedCartItems);

  return (
    <>
      <CheckoutPage
        cartItems={transformedCartItems}
        onCheckoutComplete={handleCheckoutComplete}
      />
      
      
    </>
  );
};

export default CheckoutPageWrapper; 