"use client";
import { createContext, useContext, useState } from "react";

interface ISidemenuOpenContext {
  isSidemenuOpen: boolean;
  setIsSidemenuOpen: (value: boolean) => void;
}

interface IRefreshSidemenuContext {
  refreshSidemenu: () => void;
  refreshSidemenuValue: number;
}

const SidemenuOpenContext = createContext<ISidemenuOpenContext | null>(null);
const RefreshSidemenuContext = createContext<IRefreshSidemenuContext | null>(
  null,
);

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [isSidemenuOpen, setIsSidemenuOpen] = useState<boolean>(false);
  const [refreshSidemenuValue, setRefreshSidemenuValue] = useState<number>(0);

  const refreshSidemenu = (): void => {
    setRefreshSidemenuValue((prev: number) => prev + 1);
  };

  return (
    <SidemenuOpenContext.Provider value={{ isSidemenuOpen, setIsSidemenuOpen }}>
      <RefreshSidemenuContext.Provider
        value={{ refreshSidemenuValue, refreshSidemenu }}
      >
        {children}
      </RefreshSidemenuContext.Provider>
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

export const useRefreshSidemenuContext = (): IRefreshSidemenuContext => {
  const context = useContext(RefreshSidemenuContext);
  if (!context) {
    throw new Error(
      "useRefreshSidemenuContext must be used within a ContextProvider",
    );
  }
  return context;
};
