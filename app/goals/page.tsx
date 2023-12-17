"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { IGoal } from "@/types/types";
import { ICategory } from "@/types/types";
import EditGoal from "@/components/EditGoal";

// COMPONENTS
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);

// MUI ICONS
import DeleteIcon from "@mui/icons-material/Delete";

const GoalsPage = () => {
  const [goals, setGoals] = useState<IGoal[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [inputForm, setInputForm] = useState({
    title: "",
    goal_amount: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = async () => {
    if (String(inputForm.goal_amount)[0] != "-") {
      if (inputForm.title !== "" && inputForm.goal_amount !== 0) {
        const newGoal = {
          id: String(Date.now()), // You may want to generate a unique id here
          created_at: new Date().toDateString(),
          title: inputForm.title,
          goal_amount: inputForm.goal_amount,
          category_id:
            categories.find((c) => c.id == selectedCategory)?.id ?? "",
        };

        const response = await fetch(`/api/goals`, {
          method: "POST",
          body: JSON.stringify(newGoal),
        }).then((res) => res.json());

        if (response.error) {
          window.alert(response.error);
          return;
        }

        setGoals((prevCat) => [...prevCat, newGoal]);

        setInputForm({
          title: "",
          goal_amount: 0,
        });
        setSelectedCategory("");
      } else {
        window.alert("Something is missing!");
      }
    } else {
      window.alert("Negative values are NOT ACCEPTED!");
    }
  };

  const deleteGoal = (id: string) => {
    setGoals((prevGoal) => prevGoal.filter((goal) => goal.id !== id));
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value as string);
  };

  const handleAddMondey = (goalId: string) => {
    console.log(
      goalId +
        " no functionality yet, update the amount in the database by + as many Forints as you wish based on the id of selected goal",
    );
  };

  const handleDecreaseMondey = (goalId: string) => {
    console.log(
      goalId +
        " no functionality yet, update the amount in the database by - as many Forints as you wish based on the id of selected goal",
    );
  };

  const calculateProgress = (current: number, total: number) => {
    if (current > total) {
      return [current, 0];
    }
    return [current, total - current];
  };

  useEffect(() => {
    fetch(`/api/categories`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setCategories(res.categories);
      });

    fetch(`/api/goals`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setGoals(res.goals);
      });
  }, []);

  return (
    <div className="flex max-h-full w-full flex-grow flex-col gap-4 rounded-lg bg-secondary-800 p-4">
      <div className="mt-4 flex flex-row items-center justify-between gap-2 rounded-[18px] bg-primary-600 px-3 py-4">
        <div className="flex flex-1 flex-row flex-wrap gap-2">
          <div className="flex min-w-[200px] flex-1 flex-col">
            <label className="text-text-100">Title</label>
            <input
              className="h-full w-full rounded-[18px] bg-primary-700 p-4 text-lg text-text-100 focus:outline-none"
              name="title"
              placeholder="Title"
              onChange={handleFormChange}
              value={inputForm.title}
            />
          </div>
          <div className="flex min-w-[200px] flex-1 flex-col">
            <label className="text-text-100">Goal amount</label>
            <input
              className="h-full w-full rounded-[18px] bg-primary-700 p-4 text-lg text-text-100 focus:outline-none"
              type="number"
              min={0}
              name="goal_amount"
              placeholder="Goal amount"
              onChange={handleFormChange}
              value={inputForm.goal_amount}
            />
          </div>
          <div className="flex min-w-[200px] flex-1 flex-col">
            <label className="text-text-100">Category</label>
            <select
              className="h-full w-full rounded-[18px] bg-primary-700 p-4 text-lg text-text-100 focus:outline-none"
              id="demo-simple-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="h-full max-h-24 w-24 cursor-pointer rounded-[18px] border-none bg-secondary-700 text-text-100"
        >
          Add
        </button>
      </div>
      <div className="h-full w-full space-y-5 overflow-auto ">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex flex-row items-center justify-between rounded-[18px] bg-secondary-300 px-3 py-2 text-background-950"
          >
            <div className="flex flex-col gap-2">
              <div className="text-center text-xl font-bold">{goal.title}</div>
              <button
                type="button"
                onClick={() => handleAddMondey(goal.id)}
                className="min-h-[55px] min-w-[150px] max-w-[250px] cursor-pointer rounded-[18px] border-none bg-secondary-700 text-text-100"
              >
                Add money
              </button>
              <button
                type="button"
                onClick={() => handleDecreaseMondey(goal.id)}
                className="min-h-[55px] min-w-[150px] max-w-[250px] cursor-pointer rounded-[18px] border-none bg-secondary-700 text-text-100"
              >
                Decrease money
              </button>
            </div>
            <div className="flex flex-col">
              <div className="w-[130px] min-w-[130px]">
                <Doughnut
                  data={{
                    labels: ["Progress", "Remaining"],
                    datasets: [
                      {
                        // here also % should be calculated based on the amount that is currently replaced by 1000
                        // current, total
                        data: calculateProgress(1000, goal.goal_amount),
                        backgroundColor: ["#003366", "#d1d1d1"],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
              <div className="text-center font-bold">
                1000 Ft / {goal.goal_amount} Ft
              </div>
            </div>
            <div className="flex flex-row justify-end">
              <EditGoal goalId={goal.id} goals={goals} setGoals={setGoals} />
              <Tooltip arrow title={"Delete goal"}>
                <IconButton onClick={() => deleteGoal(goal.id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsPage;
