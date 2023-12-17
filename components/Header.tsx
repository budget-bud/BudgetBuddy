"use client";

import { Menu } from "@mui/icons-material";
// import ManualExpenseModal from "./ManualExpenseModal";
import { useSidemenuContext } from "./ContextProvider";

export default function Header() {
  const { isSidemenuOpen, setIsSidemenuOpen } = useSidemenuContext();
  return (
    <header className="flex w-full h-[2.5rem] flex-row justify-between bg-accent-800 md:justify-end md:hidden">
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
