'use client'

import AddCashExpenseModal from "./AddCashExpenseModal";

export default function Header() {
  return (
    <header className="w-full flex flex-row gap-16 bg-slate-300">
      <h1 className="text-4xl font-bold ml-[0.5rem] text-slate-500 ">Header</h1>
      <div className="ml-auto"></div>
      <AddCashExpenseModal/>
    </header>
  );
}
