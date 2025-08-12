import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  setCartOpen 
} from "@/store/slices/cartSlice";
import { 
  setProducts, 
  setSelectedCategory 
} from "@/store/slices/productSlice";
import { logout, testSetAuth } from "@/store/slices/authSlice";
import { Product } from "@/components/ProductCard";
import { productAPI } from "@/services/api";

// Components
import Navigation from "@/components/Navigation";
import ProductGrid from "@/components/ProductGrid";
import CartSidebar from "@/components/CartSidebar";
import AuthModal from "@/components/AuthModal";
import UserProfileCard from "@/components/UserProfileCard";
import EditProfileModal from "@/components/EditProfileModal";
import OrderHistoryModal from "@/components/OrderHistoryModal";

const Index = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redux state
  const { items: cartItems, isOpen: isCartOpen } = useAppSelector(state => state.cart);
  const { isAuthenticated: isLoggedIn, user } = useAppSelector(state => state.auth);
  const { filteredProducts, selectedCategory } = useAppSelector(state => state.product);
  
  // Local state for modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  const categories = ["All", "Electronics", "Fashion", "Home", "Lifestyle"];
  
  // Initialize products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts();
        if (response.success && response.data) {
          // Transform backend products to match frontend Product interface
          const transformedProducts: Product[] = response.data.map((product: any) => ({
            id: product._id, // Use MongoDB _id as the frontend id
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            rating: product.rating,
            reviews: product.reviews,
            category: product.category,
            isOnSale: product.isOnSale,
          }));
          dispatch(setProducts(transformedProducts));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to empty array if API fails
        dispatch(setProducts([]));
      }
    };

    fetchProducts();
  }, [dispatch]);

  // Monitor auth state changes
  useEffect(() => {
    console.log('Auth state changed - isLoggedIn:', isLoggedIn, 'user:', user, 'token:', !!localStorage.getItem('token'));
    
    // Force a re-render test
    if (isLoggedIn && user) {
      console.log('✅ User is logged in and authenticated!');
    } else if (!isLoggedIn && !user) {
      console.log('❌ User is not logged in');
    } else {
      console.log('⚠️ Inconsistent state detected');
    }
  }, [isLoggedIn, user]);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(productId);
      return;
    }
    
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };

  const handleProductClick = (product: Product) => {
    toast({
      title: product.name,
      description: "Product details would open here",
    });
  };

  const handleLoginClick = () => {
    console.log('Login click triggered, isLoggedIn:', isLoggedIn, 'user:', user, 'token:', localStorage.getItem('token'));
    if (isLoggedIn) {
      setIsProfileOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Debug function to test auth state
  const debugAuthState = () => {
    console.log('=== DEBUG AUTH STATE ===');
    console.log('isLoggedIn:', isLoggedIn);
    console.log('user:', user);
    console.log('token in localStorage:', localStorage.getItem('token'));
    console.log('token in Redux:', useAppSelector(state => state.auth.token));
    console.log('isAuthenticated in Redux:', useAppSelector(state => state.auth.isAuthenticated));
    console.log('=======================');
  };

  // Test function to manually set auth state
  const testAuthState = () => {
    console.log('Testing manual auth state setting...');
    dispatch(testSetAuth({
      user: {
        id: 'test-id',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'user'
      },
      token: 'test-token-123'
    }));
  };

  const handleAuthSuccess = () => {
    console.log('Auth success triggered, user:', user, 'isLoggedIn:', isLoggedIn);
    setIsProfileOpen(true);
  };

  const handleProfileClick = () => {
    console.log('Profile click triggered, isLoggedIn:', isLoggedIn);
    setIsProfileOpen(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
  };

  const handleEditProfile = () => {
    setIsProfileOpen(false);
    setIsEditProfileOpen(true);
  };

  const handleOrderHistory = () => {
    setIsProfileOpen(false);
    setIsOrderHistoryOpen(true);
  };

  const handleProfileUpdated = () => {
    // Refresh user data if needed
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout",
      });
      return;
    }
    
    dispatch(setCartOpen(false));
    navigate('/checkout');
  };

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        cartItemsCount={cartItemsCount}
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
        onProfileClick={handleProfileClick}
        onCartClick={() => dispatch(setCartOpen(true))}
      />

      <section id="products" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our curated collection of high-quality products designed to enhance your lifestyle.
            </p>
            
          </div>

          <ProductGrid
            products={filteredProducts}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
          />
        </div>
      </section>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => dispatch(setCartOpen(false))}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        defaultTab="login"
      />

      <UserProfileCard
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onEditProfile={handleEditProfile}
        onOrderHistory={handleOrderHistory}
        onLogout={handleLogout}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
      />
    </div>
  );
};

export default Index;
