import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Edit
} from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";

interface UserProfileCardProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onOrderHistory: () => void;
  onLogout: () => void;
}

const UserProfileCard = ({
  isOpen,
  onClose,
  onEditProfile,
  onOrderHistory,
  onLogout
}: UserProfileCardProps) => {
  const { user }: any = useAppSelector(state => state.auth);

  if (!isOpen) return null;

  const getInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getJoinDate = () => {
    // For now, show a default date since we don't have createdAt in user data
    return "January 2024";
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="fixed top-20 right-4 w-80 animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="glass border-border/20 shadow-custom-xl">
          <CardHeader className="text-center space-y-4">
            <div className="relative mx-auto">
              <Avatar className="w-20 h-20 ring-4 ring-primary/20">
                <AvatarImage src={user?.avatar} alt={`${user?.firstName || 'User'} ${user?.lastName || ''}`} />
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <Badge
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground"
              >
                {user?.role === 'admin' ? 'Admin' : 'Member'}
              </Badge>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{user?.firstName || 'User'} {user?.lastName || ''}</h3>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Mail className="h-3 w-3" />
                {user?.email || 'No email'}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Separator />
            {/* User Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.role === 'admin' ? 'Administrator' : 'Customer'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since {getJoinDate()}</span>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-border/50 hover:bg-primary/5"
                onClick={onEditProfile}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-border/50 hover:bg-primary/5"
                onClick={onOrderHistory}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Order History
              </Button>

            </div>

            <Separator />

            {/* Logout */}
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileCard;