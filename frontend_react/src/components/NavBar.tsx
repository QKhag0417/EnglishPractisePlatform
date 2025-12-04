import { useState } from 'react';
import svgPaths from "../imports/svg-ddf272u81r";
import imgEllipse2 from "figma:asset/9a288964fe3263113bbb7774d6f4ff60e22ab39b.png";
import { Page } from '../App';
import { ProfileDropdown } from './ProfileDropdown';
import { IELTSMastermindLogo } from './Logo';

function Group2() {
  return (
    <div className="h-[29.003px] relative shrink-0 w-[37px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 29">
        <g id="Group">
          <g id="Group_2">
            <path d={svgPaths.p337f3b00} fill="var(--fill-0, white)" id="Vector" />
            <path d={svgPaths.pcd08600} fill="var(--fill-0, white)" id="Vector_2" />
          </g>
          <path d={svgPaths.pfe46f80} fill="var(--fill-0, white)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function LogoIcon() {
  return (
    <div className="content-stretch flex gap-[10px] items-start overflow-clip relative shrink-0 w-[37px]">
      <Group2 />
    </div>
  );
}

interface LogoProps {
  setCurrentPage: (page: Page) => void;
  isGuest?: boolean;
}

function Logo({ setCurrentPage, isGuest = false }: LogoProps) {
  return (
    <div 
      className="content-stretch flex gap-[10px] items-center relative shrink-0 cursor-pointer"
      onClick={() => setCurrentPage('home')}
    >
      <LogoIcon />
      <div className="font-['Inter'] font-bold h-[50px] leading-[normal] not-italic relative shrink-0 text-[0px] text-white w-[95px]">
        <p className="mb-0 text-[28px]">IELTS</p>
        <p className="text-[16px]">Mastermind</p>
      </div>
    </div>
  );
}

function DownArrow() {
  return (
    <div className="h-[24px] relative shrink-0 w-[29px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 24">
        <g id="Down Arrow">
          <path d="M10 10L14.5 14L19 10" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

interface NavItemProps {
  label: string;
  hasDropdown?: boolean;
  onClick?: () => void;
  dropdownItems?: { label: string; onClick: () => void }[];
}

function NavItem({ label, hasDropdown = false, onClick, dropdownItems }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => hasDropdown && setIsOpen(true)}
      onMouseLeave={() => hasDropdown && setIsOpen(false)}
    >
      <div 
        className="content-stretch flex gap-[10px] items-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity pb-2"
        onClick={onClick}
      >
        <p className="font-['DM_Sans'] font-medium leading-[23px] relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre">
          {label}
        </p>
        {hasDropdown && <DownArrow />}
      </div>

      {/* Dropdown Menu */}
      {hasDropdown && isOpen && dropdownItems && (
        <div className="absolute top-full left-0 bg-white rounded-[8px] shadow-lg py-2 min-w-[180px] z-50">
          {dropdownItems.map((item, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors font-['DM_Sans'] text-[16px] text-gray-800"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface NavMenuProps {
  setCurrentPage: (page: Page) => void;
}

function NavMenu({ setCurrentPage }: NavMenuProps) {
  return (
    <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0">
      <NavItem label="Home" onClick={() => setCurrentPage('home')} />
      <NavItem 
        label="Listening" 
        hasDropdown 
        dropdownItems={[
          { label: 'Overview', onClick: () => setCurrentPage('listening-overview') },
          { label: 'Exercise', onClick: () => setCurrentPage('listening') },
        ]}
      />
      <NavItem 
        label="Reading" 
        hasDropdown 
        dropdownItems={[
          { label: 'Overview', onClick: () => setCurrentPage('reading-overview') },
          { label: 'Exercise', onClick: () => setCurrentPage('reading') },
        ]}
      />
      <NavItem 
        label="Writing" 
        hasDropdown 
        dropdownItems={[
          { label: 'Overview', onClick: () => setCurrentPage('writing-overview') },
          { label: 'Exercise', onClick: () => setCurrentPage('writing') },
        ]}
      />
      <NavItem 
        label="Speaking" 
        hasDropdown 
        dropdownItems={[
          { label: 'Overview', onClick: () => setCurrentPage('speaking-overview') },
          { label: 'Exercise', onClick: () => setCurrentPage('speaking') },
        ]}
      />
      <NavItem 
        label="Test" 
        hasDropdown 
        dropdownItems={[
          { label: 'Mock Test', onClick: () => setCurrentPage('mocktest') },
          { label: 'Evaluation Test', onClick: () => setCurrentPage('evaluation-test') },
        ]}
      />
    </div>
  );
}

interface ProfileProps {
  onLogout: () => void;
}

function Profile({ onLogout }: ProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div 
        className="content-stretch flex gap-[10px] items-start relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative shrink-0 size-[49px] rounded-full overflow-hidden">
          <img alt="User profile" className="block max-w-none size-full object-cover" height="49" src={imgEllipse2} width="49" />
        </div>
      </div>

      {isOpen && (
        <ProfileDropdown 
          onClose={() => setIsOpen(false)} 
          onLogout={() => {
            setIsOpen(false);
            onLogout();
          }}
        />
      )}
    </div>
  );
}

interface NavBarLearnerProps {
  setCurrentPage: (page: Page) => void;
  onLogout?: () => void;
}

export function NavBarLearner({ setCurrentPage, onLogout }: NavBarLearnerProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1977f3] box-border content-stretch flex h-[66px] items-center justify-between px-[12px] py-[8px] z-50">
      <IELTSMastermindLogo setCurrentPage={setCurrentPage} />
      <NavMenu setCurrentPage={setCurrentPage} />
      <Profile onLogout={handleLogout} />
    </div>
  );
}

interface NavBarGuestProps {
  setCurrentPage: (page: Page) => void;
}

export function NavBarGuest({ setCurrentPage }: NavBarGuestProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1977f3] box-border content-stretch flex h-[66px] items-center justify-between px-[12px] py-[8px] z-50">
      <Logo setCurrentPage={setCurrentPage} isGuest={true} />
      <NavMenu setCurrentPage={setCurrentPage} />
      <div className="flex gap-[12px] items-center">
        <button
          onClick={() => setCurrentPage('login')}
          className="px-[24px] py-[8px] bg-white text-[#1977f3] rounded-[8px] font-['DM_Sans'] font-medium text-[16px] hover:bg-gray-100 transition-colors"
        >
          Login
        </button>
        <button
          onClick={() => setCurrentPage('register')}
          className="px-[24px] py-[8px] bg-[#fcbf65] text-black rounded-[8px] font-['DM_Sans'] font-medium text-[16px] hover:bg-[#e5ab52] transition-colors"
        >
          Register
        </button>
      </div>
    </div>
  );
}