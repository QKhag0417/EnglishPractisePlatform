import { useNavigate } from "react-router";
import svgPaths from "../imports/svg-ddf272u81r";

function Group2() {
  return (
    <div className="h-[29.003px] relative shrink-0 w-[37px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 37 29"
      >
        <g id="Group">
          <g id="Group_2">
            <path
              d={svgPaths.p337f3b00}
              fill="var(--fill-0, white)"
              id="Vector"
            />
            <path
              d={svgPaths.pcd08600}
              fill="var(--fill-0, white)"
              id="Vector_2"
            />
          </g>
          <path
            d={svgPaths.pfe46f80}
            fill="var(--fill-0, white)"
            id="Vector_3"
          />
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

interface IELTSMastermindLogoProps {
  clickable?: boolean;
  className?: string;
}

export function IELTSMastermindLogo({
  clickable = true,
  className = "",
}: IELTSMastermindLogoProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable) {
      navigate("/");
    }
  };

  return (
    <div
      className={`content-stretch flex gap-[10px] items-center relative shrink-0 ${
        clickable ? "cursor-pointer" : ""
      } ${className}`}
      onClick={handleClick}
    >
      <LogoIcon />
      <div className="font-['Inter'] font-bold leading-[normal] not-italic text-white">
        <p className="mb-0 text-[28px]">IELTS</p>
        <p className="text-[16px]">Mastermind</p>
      </div>
    </div>
  );
}
