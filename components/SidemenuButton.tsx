// ICONS
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CategoryIcon from "@mui/icons-material/Category";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChatIcon from "@mui/icons-material/Chat";
// COMPONENTS
import Link from "next/link";

type SidemenuButtonProps = {
  button_type:
    | "spendings"
    | "goals"
    | "categories"
    | "plots"
    | "kpi"
    | "new_chat";
  balance?: number;
};

const SidemenuButton: React.FC<SidemenuButtonProps> = ({
  button_type,
  balance,
}: SidemenuButtonProps) => {
  return (
    <div className="flex w-full justify-center">
      <Link
        className="mt-[1rem] flex h-[2rem] w-3/4 
                cursor-pointer items-center 
                rounded-md bg-secondary-300 
                font-bold 
                text-background-950 hover:bg-secondary-200"
        href={
          button_type === "spendings"
            ? "/transactions"
            : button_type === "goals"
              ? "/goals"
              : button_type === "categories"
                ? "/categories"
                : button_type === "plots"
                  ? "/plots"
                  : button_type === "new_chat"
                    ? "/chat"
                    : "/kpi"
        }
      >
        {button_type === "spendings" && (
          <>
            <AccountBalanceWalletIcon className="ml-3" />
            <div className="ml-[1rem] w-full text-base">{`${balance} Ft`}</div>
          </>
        )}
        {button_type === "goals" && (
          <>
            <AnalyticsIcon className="ml-3" />
            <div className="ml-[1rem] w-full text-base">Goals</div>
          </>
        )}
        {button_type === "categories" && (
          <>
            <CategoryIcon className="ml-3" />
            <div className="ml-[1rem] w-full text-base">Categories</div>
          </>
        )}
        {button_type === "plots" && (
          <>
            <BarChartIcon className="ml-3" />
            <div className="ml-[1rem] w-full text-base">Plots</div>
          </>
        )}
        {button_type === "kpi" && (
          <>
            <BarChartIcon className="ml-3" />
            <div className="ml-[1rem] w-full text-base">KPI</div>
          </>
        )}
        {button_type === "new_chat" && (
          <>
            <ChatIcon className="ml-3" />
            <div className="ml-[1rem] w-full text-base">New Chat</div>
          </>
        )}
      </Link>
    </div>
  );
};

export default SidemenuButton;
