// ICONS
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CategoryIcon from "@mui/icons-material/Category";
import BarChartIcon from "@mui/icons-material/BarChart";
// COMPONENTS
import Link from "next/link";

type SidemenuButtonProps = {
  button_type: "spendings" | "goals" | "categories" | "plots" | "kpi";
  balance?: number;
};

const SidemenuButton: React.FC<SidemenuButtonProps> = ({
  button_type,
  balance,
}: SidemenuButtonProps) => {
  return (
    <div className="w-full flex justify-center">
      <Link
        className="flex w-3/4 h-[2rem] mt-[1rem] 
                cursor-pointer items-center 
                bg-secondary_700 hover:bg-secondary_500 
                text-black 
                rounded-md font-bold"
        href={
          button_type === "spendings"
            ? "/transactions"
            : button_type === "goals"
              ? "/goals"
              : button_type === "categories"
                ? "/categories"
                : button_type === "plots"
                  ? "/plots"
                  : "/kpi"
        }
      >
        {button_type === "spendings" && (
          <>
            <AccountBalanceWalletIcon className="ml-3" />
            <div className="w-full ml-[1rem] text-xs sm:text-base">
              {`${balance} Ft`}
            </div>
          </>
        )}
        {button_type === "goals" && (
          <>
            <AnalyticsIcon className="ml-3" />
            <div className="w-full ml-[1rem] text-xs sm:text-base">Goals</div>
          </>
        )}
        {button_type === "categories" && (
          <>
            <CategoryIcon className="ml-3" />
            <div className="w-full ml-[1rem] text-xs sm:text-base">
              Categories
            </div>
          </>
        )}
        {button_type === "plots" && (
          <>
            <BarChartIcon className="ml-3" />
            <div className="w-full ml-[1rem] text-xs sm:text-base">Plots</div>
          </>
        )}
        {button_type === "kpi" && (
          <>
            <BarChartIcon className="ml-3" />
            <div className="w-full ml-[1rem] text-xs sm:text-base">KPI</div>
          </>
        )}
      </Link>
    </div>
  );
};

export default SidemenuButton;
