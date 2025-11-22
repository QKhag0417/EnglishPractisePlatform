import { User, Settings, LogOut } from 'lucide-react';
import imgEllipse2 from "figma:asset/9a288964fe3263113bbb7774d6f4ff60e22ab39b.png";

interface ProfileDropdownProps {
  onClose: () => void;
  onLogout: () => void;
}

export function ProfileDropdown({ onClose, onLogout }: ProfileDropdownProps) {
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
          <div className="relative shrink-0 w-[70px] h-[70px] rounded-full overflow-hidden">
            <img 
              src={imgEllipse2} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-['Poppins'] text-[12px] text-gray-800 leading-[18px]">
              Your name
            </p>
            <p className="font-['Roboto'] text-[12px] text-gray-500 leading-[16px]">
              yourname@gmail.com
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-[2px]">
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