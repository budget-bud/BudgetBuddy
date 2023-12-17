"use client";
import { createContext, useContext, useState } from "react";

interface ISidemenuOpenContext {
  isSidemenuOpen: boolean;
  setIsSidemenuOpen: (value: boolean) => void;
}

const SidemenuOpenContext = createContext<ISidemenuOpenContext | null>(null);

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [isSidemenuOpen, setIsSidemenuOpen] = useState<boolean>(false);

  return (
    <SidemenuOpenContext.Provider value={{ isSidemenuOpen, setIsSidemenuOpen }}>
      {children}
    </SidemenuOpenContext.Provider>
  );
}

export const useSidemenuContext = (): ISidemenuOpenContext => {
  const context = useContext(SidemenuOpenContext);
  if (!context) {
    throw new Error("useSidemenuContext must be used within a ContextProvider");
  }
  return context;
};
