import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { BackendDirection } from "../types";

export const getDirectionIcon = (direction: BackendDirection) => {
  switch (direction) {
    case "INCREASE":
      return <TrendingUp className="w-[16px] h-[16px] text-green-600" />;
    case "REDUCE":
      return <TrendingDown className="w-[16px] h-[16px] text-orange-600" />;
    case "MAINTAIN":
      return <Minus className="w-[16px] h-[16px] text-blue-600" />;
  }
};
