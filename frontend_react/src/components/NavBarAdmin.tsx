import { Page } from '../App';

interface NavBarAdminProps {
  setCurrentPage: (page: Page) => void;
  onLogout?: () => void;
  currentPage: Page;
}

export function NavBarAdmin({ setCurrentPage, onLogout, currentPage }: NavBarAdminProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1977f3] box-border content-stretch flex h-[66px] items-center justify-between px-[12px] py-[8px] z-50">
      <div 
        className="content-stretch flex gap-[10px] items-center relative shrink-0 cursor-pointer"
        onClick={() => setCurrentPage('home')}
      >
        <div className="font-['Inter'] font-bold leading-[normal] not-italic text-white">
          <p className="mb-0 text-[28px]">IELTS</p>
          <p className="text-[16px]">Mastermind Admin</p>
        </div>
      </div>

      <div className="flex gap-[32px] items-center">
        <button
          onClick={() => setCurrentPage('content-management')}
          className={`font-['DM_Sans'] font-medium text-[18px] ${
            currentPage === 'content-management' ? 'text-[#fcbf65]' : 'text-white hover:opacity-80'
          } transition-opacity`}
        >
          Practice Content
        </button>
        <button
          onClick={() => setCurrentPage('user-management')}
          className={`font-['DM_Sans'] font-medium text-[18px] ${
            currentPage === 'user-management' ? 'text-[#fcbf65]' : 'text-white hover:opacity-80'
          } transition-opacity`}
        >
          User Management
        </button>
      </div>

      <button
        onClick={onLogout}
        className="px-[24px] py-[8px] bg-white text-[#1977f3] rounded-[8px] font-['DM_Sans'] font-medium text-[16px] hover:bg-gray-100 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
