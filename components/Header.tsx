"use client";

import { Menu } from "@mui/icons-material";
// import ManualExpenseModal from "./ManualExpenseModal";
import { useSidemenuContext } from "./ContextProvider";

export default function Header() {
  const { isSidemenuOpen, setIsSidemenuOpen } = useSidemenuContext();
  return (
    <header className="w-full flex flex-row justify-between md:justify-end bg-slate-500">
      <button
        onClick={() => setIsSidemenuOpen(!isSidemenuOpen)}
        className="ml-4 md:hidden"
      >
        <Menu />
      </button>
      {/* <ManualExpenseModal /> */}
    </header>
  );
}
