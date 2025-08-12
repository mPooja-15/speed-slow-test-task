import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { logout, loadUserProfile, setAuthenticated } from '@/store/slices/authSlice';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

export const useAuthValidation = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, user, isLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Add a small delay to avoid race conditions with immediate login
    const timer = setTimeout(() => {
      const initializeAuth = async () => {
        const storedToken = localStorage.getItem('token');
        console.log('useAuthValidation - Current state:', { 
          storedToken: !!storedToken, 
          isAuthenticated, 
          user: !!user, 
          isLoading 
        });
        
        // Don't run validation if we're currently loading (to avoid race conditions)
        if (isLoading) {
          console.log('useAuthValidation - Skipping validation while loading');
          return;
        }
        
        // Don't interfere if we just logged in (give it some time)
        if (storedToken && isAuthenticated && user) {
          console.log('useAuthValidation - User is authenticated, setting up periodic validation');
          // We have both token and user, validate periodically
          const validateToken = async () => {
            try {
              const isValid = await authAPI.validateToken();
              if (!isValid) {
                console.log('Token validation failed, but keeping token for user to decide');
                // Don't automatically logout - just show a warning
                toast.error('Your session may have expired. Please refresh the page or log in again.');
              }
            } catch (error) {
              console.error('Token validation error:', error);
              // Don't automatically logout - just show a warning
              toast.error('Authentication error. Please refresh the page or log in again.');
            }
          };

          // Set up periodic validation (every 5 minutes)
          const interval = setInterval(validateToken, 5 * 60 * 1000);
          return () => clearInterval(interval);
        } else if (storedToken && !isAuthenticated && !user) {
          // We have a token but no user data, try to load the profile
          console.log('useAuthValidation - Loading user profile...');
          try {
            await dispatch(loadUserProfile()).unwrap();
          } catch (error) {
            console.log('Failed to load user profile:', error);
            // Token is invalid, clear it
            dispatch(logout());
          }
        } else if (!storedToken && isAuthenticated) {
          // No token but we think we're authenticated, fix the state
          console.log('useAuthValidation - No token but authenticated, logging out');
          dispatch(logout());
        }
      };

      initializeAuth();
    }, 500); // Increased delay to 500ms

    return () => clearTimeout(timer);
  }, [dispatch, isAuthenticated, token, user, isLoading]);
}; 