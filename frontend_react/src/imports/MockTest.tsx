import svgPaths from "./svg-ddf272u81r";
import imgEllipse2 from "figma:asset/9a288964fe3263113bbb7774d6f4ff60e22ab39b.png";
import imgImage36 from "figma:asset/c36899c7fd54a64dc64f87b5a3eb296b7a45603e.png";

function Group() {
  return (
    <div className="absolute contents inset-[28.95%_97.73%_23.68%_0.86%]" data-name="Group">
      <div className="absolute inset-[64.89%_97.73%_23.68%_1.93%]" data-name="Vector">
        <div className="absolute inset-[-23.04%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d="M5.34 5.34L1 1" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[28.95%_97.88%_28.95%_0.86%]" data-name="Vector">
        <div className="absolute inset-[-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <path d={svgPaths.pedb3a30} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute h-[38px] left-0 top-0 w-[1276px]">
        <div className="absolute inset-[-2.63%_-0.08%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1278 40">
            <path d={svgPaths.p23617280} fill="var(--fill-0, white)" id="Rectangle 8" stroke="var(--stroke-0, black)" strokeOpacity="0.3" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[34px] justify-center leading-[0] left-[115.5px] not-italic text-[13px] text-[rgba(0,0,0,0.47)] text-center top-[19px] translate-x-[-50%] translate-y-[-50%] w-[193px]">
        <p className="leading-[15px]">Search by name or topic</p>
      </div>
      <Group />
      <div className="absolute inset-[31.58%_0.94%_31.58%_97.96%]" data-name="Vector">
        <div className="absolute inset-[-5.36%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <path d={svgPaths.pf392b80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Searchbar() {
  return (
    <div className="basis-0 grow h-[38px] min-h-px min-w-px relative shrink-0" data-name="searchbar">
      <Group1 />
    </div>
  );
}

function SearchButton() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[10px] h-[38px] items-center justify-center left-[1285px] px-[8px] py-0 rounded-[12px] top-0 w-[86px]" data-name="Search Button">
      <div aria-hidden="true" className="absolute border-2 border-[#fcbf65] border-solid inset-[-1px] pointer-events-none rounded-[13px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[37px] justify-center leading-[0] not-italic relative shrink-0 text-[#fcbf65] text-[13px] text-center w-[70px]">
        <p className="leading-[15px]">Search</p>
      </div>
    </div>
  );
}

function SearchFeature() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-start left-[30px] top-[77px] w-[1276px]" data-name="Search feature">
      <Searchbar />
      <SearchButton />
    </div>
  );
}

function AllButton() {
  return (
    <div className="absolute h-[18px] left-[148px] top-[2px] w-[47px]" data-name="All button">
      <div className="absolute bg-[#fcbf65] h-[18px] left-[8px] rounded-[4px] top-0 w-[32px]">
        <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[12px] justify-center leading-[0] left-[23.5px] not-italic text-[11px] text-black text-center top-[9px] translate-x-[-50%] translate-y-[-50%] w-[47px]">
        <p className="leading-[15px]">All</p>
      </div>
    </div>
  );
}

function TaskLine() {
  return (
    <div className="absolute h-[26px] left-[9px] top-[16px] w-[123px]" data-name="task line">
      <AllButton />
      <div className="absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[21px] justify-center leading-[0] left-[65px] not-italic text-[13px] text-black text-center top-[9.5px] translate-x-[-50%] translate-y-[-50%] w-[82px]">
        <p className="leading-[15px]">Test Format</p>
      </div>
      <div className="absolute bg-white h-[18px] left-[228px] rounded-[4px] top-[2px] w-[133px]">
        <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
    </div>
  );
}

function AllButton1() {
  return <div className="absolute h-[18px] left-[189px] top-[3px] w-[47px]" data-name="All button" />;
}

function AllButton2() {
  return <div className="absolute h-[18px] left-[362px] top-[2px] w-[47px]" data-name="All button" />;
}

function Questiontypeline() {
  return (
    <div className="absolute h-[23px] left-[26px] top-[66px] w-[89px]" data-name="questiontypeline">
      <AllButton1 />
      <AllButton2 />
      <div className="absolute bg-[#7dfda8] h-[16px] left-[353px] rounded-[4px] top-[-4px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[357px] not-italic text-[#05610b] text-[12px] text-nowrap top-[-3px] whitespace-pre">Completed</p>
    </div>
  );
}

function FilterFeature() {
  return (
    <div className="absolute h-[51px] left-[24px] top-[136px] w-[1377px]" data-name="Filter feature">
      <div className="absolute bg-[rgba(119,203,242,0.12)] h-[51px] left-[9px] rounded-[10px] top-0 w-[1368px]" data-name="Horizontal Filter bar">
        <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.11)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      </div>
      <TaskLine />
      <Questiontypeline />
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] left-[303px] not-italic text-[11px] text-black text-center top-[26px] translate-x-[-50%] translate-y-[-50%] w-[128px]">
        <p className="leading-[15px]">General Training Test</p>
      </div>
      <div className="absolute bg-white h-[18px] left-[404px] rounded-[4px] top-[18px] w-[133px]">
        <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] left-[470px] not-italic text-[11px] text-black text-center top-[26px] translate-x-[-50%] translate-y-[-50%] w-[128px]">
        <p className="leading-[15px]">Academic Test</p>
      </div>
    </div>
  );
}

function Indicator() {
  return (
    <div className="absolute inset-[96%_2.15%_1.07%_91.88%]" data-name="Indicator">
      <div className="absolute bottom-[-0.67%] left-0 right-0 top-[-0.67%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 86 31">
          <g id="Indicator">
            <rect fill="var(--fill-0, #FAFBFD)" height="29.4" id="Bg" rx="7.7" stroke="var(--stroke-0, #D5D5D5)" strokeWidth="0.6" width="85.4" x="0.3" y="0.5" />
            <g id="ic-keyboard-arrow-left-24px" opacity="0.6">
              <g id="Path"></g>
              <path d={svgPaths.p59fda80} fill="var(--fill-0, #202224)" id="Path_2" />
            </g>
            <g id="ic-keyboard-arrow-left-24px_2" opacity="0.9">
              <g id="Path_3"></g>
              <path d={svgPaths.p3c29f700} fill="var(--fill-0, #202224)" id="Path_4" />
            </g>
            <path d="M43.5 30.2V0.2" id="Line" opacity="0.700544" stroke="var(--stroke-0, #979797)" strokeLinecap="square" strokeWidth="0.4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Status() {
  return (
    <div className="absolute h-[113px] leading-[0] left-[-43px] not-italic text-center top-[12px] w-[193px]" data-name="Status">
      <div className="absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[21px] justify-center left-[84px] text-[13px] text-black top-[10.5px] translate-x-[-50%] translate-y-[-50%] w-[82px]">
        <p className="leading-[15px]">Status</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[34px] justify-center left-[96.5px] text-[12px] text-[rgba(0,0,0,0.47)] top-[35px] translate-x-[-50%] translate-y-[-50%] w-[193px]">
        <p className="leading-[15px]">Not started</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[34px] justify-center left-[96.5px] text-[12px] text-[rgba(0,0,0,0.47)] top-[65px] translate-x-[-50%] translate-y-[-50%] w-[193px]">
        <p className="leading-[15px]">In progress</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[34px] justify-center left-[96.5px] text-[12px] text-[rgba(0,0,0,0.47)] top-[96px] translate-x-[-50%] translate-y-[-50%] w-[193px]">
        <p className="leading-[15px]">Completed</p>
      </div>
    </div>
  );
}

function Status1() {
  return (
    <div className="absolute h-[113px] left-[-43px] top-[12px] w-[193px]" data-name="Status">
      <div className="absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[21px] justify-center leading-[0] left-[84px] not-italic text-[13px] text-black text-center top-[10.5px] translate-x-[-50%] translate-y-[-50%] w-[82px]">
        <p className="leading-[15px]">Status</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[34px] justify-center leading-[0] left-[96.5px] not-italic text-[12px] text-[rgba(0,0,0,0.47)] text-center top-[35px] translate-x-[-50%] translate-y-[-50%] w-[193px]">
        <p className="leading-[15px]">Not started</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[34px] justify-center leading-[0] left-[96.5px] not-italic text-[12px] text-[rgba(0,0,0,0.47)] text-center top-[65px] translate-x-[-50%] translate-y-[-50%] w-[193px]">
        <p className="leading-[15px]">In progress</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[34px] justify-center leading-[0] left-[96.5px] not-italic text-[12px] text-[rgba(0,0,0,0.47)] text-center top-[96px] translate-x-[-50%] translate-y-[-50%] w-[193px]">
        <p className="leading-[15px]">Completed</p>
      </div>
      <div className="absolute inset-[23.89%_10.36%_61.95%_81.35%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[50.44%_10.36%_35.4%_81.35%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[78.76%_10.36%_7.08%_81.35%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
    </div>
  );
}

function SortBy() {
  return (
    <div className="absolute h-[113px] left-[-43px] top-[147px] w-[193px]" data-name="SortBy">
      <div className="absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[21px] justify-center leading-[0] left-[84px] not-italic text-[13px] text-black text-center top-[10.5px] translate-x-[-50%] translate-y-[-50%] w-[82px]">
        <p className="leading-[15px]">Sort By</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[34px] justify-center leading-[0] left-[84.5px] not-italic text-[12px] text-[rgba(0,0,0,0.47)] text-center top-[35px] translate-x-[-50%] translate-y-[-50%] w-[193px]">
        <p className="leading-[15px]">Newest</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[34px] justify-center leading-[0] left-[81.5px] not-italic text-[12px] text-[rgba(0,0,0,0.47)] text-center top-[65px] translate-x-[-50%] translate-y-[-50%] w-[193px]">
        <p className="leading-[15px]">Oldest</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[34px] justify-center leading-[0] left-[104.5px] not-italic text-[12px] text-[rgba(0,0,0,0.47)] text-center top-[95px] translate-x-[-50%] translate-y-[-50%] w-[193px]">
        <p className="leading-[15px]">Most attempts</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[34px] justify-center leading-[0] left-[79.5px] not-italic text-[12px] text-[rgba(0,0,0,0.47)] text-center top-[125px] translate-x-[-50%] translate-y-[-50%] w-[193px]">
        <p className="leading-[15px]">A → Z</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[34px] justify-center leading-[0] left-[78.5px] not-italic text-[12px] text-[rgba(0,0,0,0.47)] text-center top-[156px] translate-x-[-50%] translate-y-[-50%] w-[193px]">
        <p className="leading-[15px]">Z → A</p>
      </div>
      <div className="absolute inset-[23.01%_10.36%_62.83%_81.35%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[50.44%_10.36%_35.4%_81.35%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[76.99%_10.36%_8.85%_81.35%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
    </div>
  );
}

function VerticalFilterBar() {
  return (
    <div className="absolute h-[627px] left-[34px] top-[208px] w-[170px]" data-name="Vertical filter bar">
      <div className="absolute bg-[rgba(119,203,242,0.12)] h-[607px] left-0 rounded-[10px] top-0 w-[158px]" data-name="Vertical Filer Bar">
        <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.11)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      </div>
      <Status />
      <Status1 />
      <SortBy />
      <div className="absolute inset-[42.15%_53.74%_55.29%_40.57%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[46.96%_53.74%_50.48%_40.57%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute h-0 left-[12px] top-[135px] w-[130px]">
        <div className="absolute inset-[-1px_-3.08%_-8px_-3.08%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 138 9">
            <g filter="url(#filter0_d_1_10)" id="Line 5">
              <line stroke="var(--stroke-0, black)" x1="4" x2="134" y1="0.5" y2="0.5" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="9" id="filter0_d_1_10" width="138" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_10" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_10" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="h-[29.003px] relative shrink-0 w-[37px]" data-name="Group">
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
    <div className="content-stretch flex gap-[10px] items-start overflow-clip relative shrink-0 w-[37px]" data-name="Logo Icon">
      <Group2 />
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Logo">
      <LogoIcon />
      <div className="font-['Inter:Bold',sans-serif] font-bold h-[50px] leading-[normal] not-italic relative shrink-0 text-[0px] text-white w-[95px]">
        <p className="mb-0 text-[28px]">IELTS</p>
        <p className="text-[16px]">Mastermind</p>
      </div>
    </div>
  );
}

function Products() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Products">
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[23px] relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Home
      </p>
    </div>
  );
}

function DownArrow() {
  return (
    <div className="h-[24px] relative shrink-0 w-[29px]" data-name="Down Arrow">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 24">
        <g id="Down Arrow">
          <path d="M10 10L14.5 14L19 10" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Solutios() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Solutios">
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[23px] relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Listening
      </p>
      <DownArrow />
    </div>
  );
}

function DownArrow1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[29px]" data-name="Down Arrow">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 24">
        <g id="Down Arrow">
          <path d="M10 10L14.5 14L19 10" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Resources() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Resources">
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[23px] relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Reading
      </p>
      <DownArrow1 />
    </div>
  );
}

function DownArrow2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[29px]" data-name="Down Arrow">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 24">
        <g id="Down Arrow">
          <path d="M10 10L14.5 14L19 10" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Pricing() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Pricing">
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[23px] relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Writing
      </p>
      <DownArrow2 />
    </div>
  );
}

function DownArrow3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[29px]" data-name="Down Arrow">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 24">
        <g id="Down Arrow">
          <path d="M10 10L14.5 14L19 10" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Pricing1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Pricing">
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[23px] relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Speaking
      </p>
      <DownArrow3 />
    </div>
  );
}

function DownArrow4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[29px]" data-name="Down Arrow">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 24">
        <g id="Down Arrow">
          <path d="M10 10L14.5 14L19 10" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Pricing2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Pricing">
      <p className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[23px] relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'opsz' 14" }}>
        Test
      </p>
      <DownArrow4 />
    </div>
  );
}

function NavMenu() {
  return (
    <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0" data-name="Nav-menu">
      <Products />
      <Solutios />
      <Resources />
      <Pricing />
      <Pricing1 />
      <Pricing2 />
    </div>
  );
}

function Avt() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="avt">
      <div className="relative shrink-0 size-[49px]">
        <img alt="" className="block max-w-none size-full" height="49" src={imgEllipse2} width="49" />
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="Profile">
      <Avt />
    </div>
  );
}

function NavBarLearner() {
  return (
    <div className="absolute bg-[#1977f3] box-border content-stretch flex h-[66px] items-center justify-between left-0 px-[12px] py-[8px] top-0 w-[1440px]" data-name="NavBar Learner">
      <Logo />
      <NavMenu />
      <Profile />
    </div>
  );
}

export default function MockTest() {
  return (
    <div className="bg-white relative size-full" data-name="Mock Test">
      <SearchFeature />
      <FilterFeature />
      <Indicator />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[15.56%] opacity-60 right-[75.56%] text-[#202224] text-[14px] text-nowrap top-[calc(50%+476px)] whitespace-pre" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        Showing 1-09 of 78
      </p>
      <VerticalFilterBar />
      <div className="absolute h-[126px] left-[229px] top-[214px] w-[247px]" data-name="image 36">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[229px] not-italic text-[0px] text-black text-nowrap top-[355px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[1140px] top-[214px] w-[247px]" data-name="image 39">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[1140px] not-italic text-[0px] text-black text-nowrap top-[355px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[833px] top-[214px] w-[247px]" data-name="image 38">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[833px] not-italic text-[0px] text-black text-nowrap top-[355px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[531px] top-[214px] w-[247px]" data-name="image 37">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[531px] not-italic text-[0px] text-black text-nowrap top-[355px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[230px] top-[610px] w-[247px]" data-name="image 44">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[230px] not-italic text-[0px] text-black text-nowrap top-[751px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[1141px] top-[610px] w-[247px]" data-name="image 45">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[1141px] not-italic text-[0px] text-black text-nowrap top-[751px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[834px] top-[610px] w-[247px]" data-name="image 46">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[834px] not-italic text-[0px] text-black text-nowrap top-[751px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[532px] top-[610px] w-[247px]" data-name="image 47">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[532px] not-italic text-[0px] text-black text-nowrap top-[751px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[230px] top-[802px] w-[247px]" data-name="image 48">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[230px] not-italic text-[0px] text-black text-nowrap top-[943px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[1141px] top-[802px] w-[247px]" data-name="image 49">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[1141px] not-italic text-[0px] text-black text-nowrap top-[943px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[834px] top-[802px] w-[247px]" data-name="image 50">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[834px] not-italic text-[0px] text-black text-nowrap top-[943px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[532px] top-[802px] w-[247px]" data-name="image 51">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[532px] not-italic text-[0px] text-black text-nowrap top-[943px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[229px] top-[412px] w-[247px]" data-name="image 40">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[229px] not-italic text-[0px] text-black text-nowrap top-[553px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[1140px] top-[412px] w-[247px]" data-name="image 41">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[1140px] not-italic text-[0px] text-black text-nowrap top-[553px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute h-[126px] left-[833px] top-[412px] w-[247px]" data-name="image 42">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[833px] not-italic text-[0px] text-black text-nowrap top-[553px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[1006px] rounded-[4px] top-[594px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[1010px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[595px] whitespace-pre">Not Started</p>
      <div className="absolute h-[126px] left-[531px] top-[412px] w-[247px]" data-name="image 43">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
      <div className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[531px] not-italic text-[0px] text-black text-nowrap top-[553px] whitespace-pre">
        <p className="mb-0 text-[13px]">Academic Cambridge 16 Test 1</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.37)]">8k attempts</p>
      </div>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[704px] rounded-[4px] top-[198px] w-[74px]" data-name="Rectangle" />
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[704px] rounded-[4px] top-[198px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[708px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[199px] whitespace-pre">Not Started</p>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[1007px] rounded-[4px] top-[786px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[1011px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[787px] whitespace-pre">Not Started</p>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[1313px] rounded-[4px] top-[786px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[1317px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[787px] whitespace-pre">Not Started</p>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[704px] rounded-[4px] top-[786px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[708px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[787px] whitespace-pre">Not Started</p>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[403px] rounded-[4px] top-[786px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[407px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[787px] whitespace-pre">Not Started</p>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[1313px] rounded-[4px] top-[594px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[1317px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[595px] whitespace-pre">Not Started</p>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[704px] rounded-[4px] top-[594px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[708px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[595px] whitespace-pre">Not Started</p>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[403px] rounded-[4px] top-[594px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[407px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[595px] whitespace-pre">Not Started</p>
      <div className="absolute bg-[#ffd392] h-[16px] left-[403px] rounded-[4px] top-[396px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[408px] not-italic text-[#874d0a] text-[12px] text-nowrap top-[397px] whitespace-pre">In Progress</p>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[704px] rounded-[4px] top-[395px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[708px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[396px] whitespace-pre">Not Started</p>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[1007px] rounded-[4px] top-[395px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[1011px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[396px] whitespace-pre">Not Started</p>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[1313px] rounded-[4px] top-[395px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[1317px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[397px] whitespace-pre">Not Started</p>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[1313px] rounded-[4px] top-[198px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[1317px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[199px] whitespace-pre">Not Started</p>
      <div className="absolute bg-[#d9d9d9] h-[16px] left-[1007px] rounded-[4px] top-[197px] w-[74px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[1012px] not-italic text-[#6b6b6b] text-[12px] text-nowrap top-[199px] whitespace-pre">Not Started</p>
      <NavBarLearner />
    </div>
  );
}