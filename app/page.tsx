"use client";

export default function Index() {
  return (
    <div className="flex max-h-full w-full flex-grow flex-col gap-4 rounded-lg bg-secondary-800 p-4">
      <h1 className="text-center text-2xl font-bold text-text-100">
        Welcome to Budget Buddy!
      </h1>
      <h2 className="text-left text-xl font-bold text-text-300">
        To start budgeting choose an option!
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex min-w-[350px] max-w-[600px] flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-[150px] w-full items-center justify-center rounded-[18px] bg-secondary-300 p-4 text-lg text-background-950">
            <a
              className="flex h-full w-full flex-col items-center justify-center gap-2"
              href="/chat"
            >
              <h1 className="text-center text-2xl font-bold">New chat</h1>
              <p className="text-center">Start a new chat with our AI!</p>
            </a>
          </div>
        </div>
        <div className="flex min-w-[350px] max-w-[600px] flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-[150px] w-full items-center justify-center rounded-[18px] bg-secondary-300 p-4 text-lg text-background-950">
            <a
              className="flex h-full w-full flex-col items-center justify-center gap-2"
              href="/transactions"
            >
              <h1 className="text-center text-2xl font-bold">Transactions</h1>
              <p className="text-center">
                View and manage your transactions here!
              </p>
            </a>
          </div>
        </div>
        <div className="flex min-w-[350px] max-w-[600px] flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-[150px] w-full items-center justify-center rounded-[18px] bg-secondary-300 p-4 text-lg text-background-950">
            <a
              className="flex h-full w-full flex-col items-center justify-center gap-2"
              href="/goals"
            >
              <h1 className="text-center text-2xl font-bold">Goals</h1>
              <p className="text-center">Set and manage goals for yourself!</p>
            </a>
          </div>
        </div>
        <div className="flex min-w-[350px] max-w-[600px] flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-[150px] w-full items-center justify-center rounded-[18px] bg-secondary-300 p-4 text-lg text-background-950">
            <a
              className="flex h-full w-full flex-col items-center justify-center gap-2"
              href="/categories"
            >
              <h1 className="text-center text-2xl font-bold">Categories</h1>
              <p className="text-center">
                Create categories for your spendings!
              </p>
            </a>
          </div>
        </div>
        <div className="flex min-w-[350px] max-w-[600px] flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-[150px] w-full items-center justify-center rounded-[18px] bg-secondary-300 p-4 text-lg text-background-950">
            <a
              className="flex h-full w-full flex-col items-center justify-center gap-2"
              href="/categories"
            >
              <h1 className="text-center text-2xl font-bold">Plots</h1>
              <p className="text-center">View your data visualized!</p>
            </a>
          </div>
        </div>
        <div className="flex min-w-[350px] max-w-[600px] flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-[150px] w-full items-center justify-center rounded-[18px] bg-secondary-300 p-4 text-lg text-background-950">
            <a className="flex h-full w-full flex-col items-center justify-center gap-2">
              <h1 className="text-center text-2xl font-bold">Add expense</h1>
              <p className="text-center">
                Add an expense by clicking on the button in the sidemenu!
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
