"use client";

import { Menu } from "@mui/icons-material";
import { useSidemenuContext } from "./ContextProvider";

export default function Header() {
  const { isSidemenuOpen, setIsSidemenuOpen } = useSidemenuContext();
  return (
    <header className="flex h-[2.5rem] w-full flex-row justify-between bg-accent-800 md:hidden md:justify-end">
      <button
        onClick={() => setIsSidemenuOpen(!isSidemenuOpen)}
        className="ml-4 md:hidden"
      >
        <Menu />
      </button>
    </header>
  );
}
