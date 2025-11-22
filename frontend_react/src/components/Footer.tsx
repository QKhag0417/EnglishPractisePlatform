import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import svgPaths from "../imports/svg-ddf272u81r";

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

export function Footer() {
  return (
    <footer className="bg-[#1e293b] text-white">
      <div className="max-w-[1440px] mx-auto px-[60px] py-[60px]">
        <div className="grid grid-cols-2 gap-[60px] mb-[40px]">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="flex gap-[10px] items-center mb-[20px]">
              <Group2 />
              <div className="font-['Inter'] font-bold leading-[normal] text-[0px] text-white">
                <p className="mb-0 text-[28px]">IELTS</p>
                <p className="text-[16px]">Mastermind</p>
              </div>
            </div>
            <p className="text-[14px] leading-[22px] text-gray-300 font-['DM_Sans']">
              Master your IELTS exam with AI-powered practice tests, instant feedback, and comprehensive skill training.
            </p>
            <div className="flex gap-[12px] mt-[20px]">
              <a href="#" className="w-[36px] h-[36px] bg-[#fcbf65] rounded-full flex items-center justify-center hover:bg-[#e5ab52] transition-colors">
                <Facebook className="w-[18px] h-[18px] text-white" />
              </a>
              <a href="#" className="w-[36px] h-[36px] bg-[#fcbf65] rounded-full flex items-center justify-center hover:bg-[#e5ab52] transition-colors">
                <Twitter className="w-[18px] h-[18px] text-white" />
              </a>
              <a href="#" className="w-[36px] h-[36px] bg-[#fcbf65] rounded-full flex items-center justify-center hover:bg-[#e5ab52] transition-colors">
                <Instagram className="w-[18px] h-[18px] text-white" />
              </a>
              <a href="#" className="w-[36px] h-[36px] bg-[#fcbf65] rounded-full flex items-center justify-center hover:bg-[#e5ab52] transition-colors">
                <Youtube className="w-[18px] h-[18px] text-white" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-['Inter'] font-semibold text-[18px] mb-[20px]">Contact Us</h3>
            <ul className="space-y-[16px]">
              <li className="flex items-start gap-[12px]">
                <Mail className="w-[20px] h-[20px] text-[#fcbf65] mt-[2px] shrink-0" />
                <span className="text-[14px] text-gray-300 font-['DM_Sans']">support@ieltsmastermind.com</span>
              </li>
              <li className="flex items-start gap-[12px]">
                <Phone className="w-[20px] h-[20px] text-[#fcbf65] mt-[2px] shrink-0" />
                <span className="text-[14px] text-gray-300 font-['DM_Sans']">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-[12px]">
                <MapPin className="w-[20px] h-[20px] text-[#fcbf65] mt-[2px] shrink-0" />
                <span className="text-[14px] text-gray-300 font-['DM_Sans']">123 Learning Street, Education City, EC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-[30px] flex justify-between items-center">
          <p className="text-[14px] text-gray-400 font-['DM_Sans']">
            © 2025 IELTS Mastermind. All rights reserved.
          </p>
          <div className="flex gap-[30px]">
            <a href="#" className="text-[14px] text-gray-400 hover:text-[#fcbf65] transition-colors font-['DM_Sans']">Privacy Policy</a>
            <a href="#" className="text-[14px] text-gray-400 hover:text-[#fcbf65] transition-colors font-['DM_Sans']">Terms of Service</a>
            <a href="#" className="text-[14px] text-gray-400 hover:text-[#fcbf65] transition-colors font-['DM_Sans']">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}