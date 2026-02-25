import { User, Settings, LogOut, UserCircle } from 'lucide-react';
import imgEllipse2 from "figma:asset/9a288964fe3263113bbb7774d6f4ff60e22ab39b.png";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

interface ProfileDropdownProps {
  onClose: () => void;
  onLogout: () => void;
}

export function ProfileDropdown({ onClose, onLogout }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleMyProfile = () => {
    navigate('/my-profile');
    onClose();
  };

  const getInitials = () => {
    if (user?.firstname) return user.firstname[0].toUpperCase();
    else if (user?.name) {
      return user.name[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute right-0 top-[60px] bg-white rounded-[8px] border border-[rgba(0,0,0,0.1)] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] p-[12px] w-[280px] z-50">
        {/* Profile Info */}
        <div className="flex gap-[16px] items-center mb-[10px] pb-[10px] border-b border-gray-200">
          <div className="relative shrink-0 w-[50px] h-[50px] rounded-full overflow-hidden bg-[#c8511b] flex items-center justify-center">
            {user?.avatarUrl ? (
              <ImageWithFallback 
                src={user.avatarUrl}
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-['Inter'] text-[20px] font-semibold text-white">
                {getInitials()}
              </span>
            )}
          </div>
          <div>
            <p className="font-['Poppins'] text-[12px] text-gray-800 leading-[18px]">
              {user?.name || 'User'}
            </p>
            <p className="font-['Roboto'] text-[12px] text-gray-500 leading-[16px]">
              {user?.email || ''}
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-[2px]">
          <button 
            onClick={handleMyProfile}
            className="w-full flex items-center gap-[10px] p-[10px] rounded-[6px] hover:bg-gray-100 transition-colors"
          >
            <UserCircle className="w-[24px] h-[24px] text-black" />
            <span className="font-['DM_Sans'] text-[14px] text-black">My Profile</span>
          </button>

          <button className="w-full flex items-center gap-[10px] p-[10px] rounded-[6px] hover:bg-gray-100 transition-colors">
            <User className="w-[24px] h-[24px] text-black" />
            <span className="font-['DM_Sans'] text-[14px] text-black">Study Plan</span>
          </button>
          
          <button className="w-full flex items-center gap-[10px] p-[10px] rounded-[6px] hover:bg-gray-100 transition-colors">
            <Settings className="w-[24px] h-[24px] text-black" />
            <span className="font-['DM_Sans'] text-[14px] text-black">Settings</span>
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-[10px] p-[10px] rounded-[6px] hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-[24px] h-[24px] text-black" />
            <span className="font-['DM_Sans'] text-[14px] text-black">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}