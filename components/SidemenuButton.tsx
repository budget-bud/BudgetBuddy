// ICONS
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AnalyticsIcon from '@mui/icons-material/Analytics';

// COMPONENTS
import Link from "next/link";

type SidemenuButtonProps = {
    button_type: string;
};

const SidemenuButton: React.FC<SidemenuButtonProps> = ({ button_type }) => {
  return (
    <div className='w-full flex justify-center'>
        <Link 
            className="flex w-3/4 h-[2rem] mt-[1rem] 
                cursor-pointer items-center 
                bg-secondary_700 hover:bg-secondary_500 
                text-black 
                rounded-md font-bold"
            href={button_type == "tracker" ? "/tracker" : "/" }
        >
            {button_type == "spendings" ?
                <AccountBalanceWalletIcon className="ml-3" />
                :
                <AnalyticsIcon className="ml-3" />
            }
            <div className="w-full ml-[1rem] text-xs sm:text-base">{button_type == "spendings" ? "420 000 Ft" : "Tracker" }</div>
        </Link>
    </div>
  )
}

export default SidemenuButton