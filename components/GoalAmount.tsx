import { IGoal } from "@/types/types";
import { useState } from "react";
import { useRefreshSidemenuContext } from "./ContextProvider";

interface IGoalAmountProps {
  goalId: number;
  goals: IGoal[];
  setGoals: React.Dispatch<React.SetStateAction<IGoal[]>>;
}

const GoalAmount = ({ goalId, goals, setGoals }: IGoalAmountProps) => {
  const { refreshSidemenu } = useRefreshSidemenuContext();
  const [amount, setAmount] = useState(0);

  const handleAddMoney = async (goalId: number) => {
    const goal = goals.find((goal) => goal.id === goalId);
    if (goal) {
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId
            ? {
                ...goal,
                totalAmount: goal.totalAmount + amount,
              }
            : goal,
        ),
      );

      const response = await fetch(`/api/transactions`, {
        method: "POST",
        body: JSON.stringify({
          type: "bank",
          goal_id: goalId,
          category_id: goal.category_id,
          origin: goal.title,
          movement: -amount,
          description: "Money added to goal",
        }),
      }).then((res) => res.json());
      if (response.error) {
        window.alert(response.error);
        return;
      }
      refreshSidemenu();
    }
  };

  const handleDecreaseMoney = async (goalId: number) => {
    const goal = goals.find((goal) => goal.id === goalId);
    if (goal) {
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId
            ? {
                ...goal,
                totalAmount: goal.totalAmount - amount,
              }
            : goal,
        ),
      );

      const response = await fetch(`/api/transactions`, {
        method: "POST",
        body: JSON.stringify({
          type: "cash",
          goal_id: goalId,
          category_id: goal.category_id,
          origin: goal.title,
          movement: amount,
          desription: "Money decreased from goal",
        }),
      }).then((res) => res.json());
      if (response.error) {
        window.alert(response.error);
        return;
      }
      refreshSidemenu();
    }
  };

  return (
    <>
      <input
        type="number"
        name="goal_value_input"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="h-full w-full rounded-[18px] bg-secondary-700 p-4 text-lg text-text-100 focus:outline-none"
      />
      <div className="flex">
        <button
          type="button"
          onClick={() => handleAddMoney(goalId)}
          className="min-h-[55px] min-w-[150px] max-w-[250px] cursor-pointer rounded-[18px] border-none bg-secondary-700 text-text-100"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => handleDecreaseMoney(goalId)}
          className="min-h-[55px] min-w-[150px] max-w-[250px] cursor-pointer rounded-[18px] border-none bg-secondary-700 text-text-100"
        >
          -
        </button>
      </div>
    </>
  );
};

export default GoalAmount;
