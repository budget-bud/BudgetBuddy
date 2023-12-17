"use client";
import React, { useState, useEffect } from "react";
import { IGoal } from "@/types/types";
import { ICategory } from "@/types/types";
import EditGoal from "@/components/EditGoal";

// COMPONENTS
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
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

  const deleteGoal = async (id: string) => {
    setGoals((prevGoal) => prevGoal.filter((goal) => goal.id !== id));
    await fetch(`/api/goals`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
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
    <div className="w-full flex flex-col space-y-10">
      <div className="mt-4 flex flex-row bg-slate-100 items-center justify-between px-3 py-4 rounded-sm">
        <div className="flex flex-row space-x-10">
          <TextField
            name="title"
            label="Title"
            onChange={handleFormChange}
            value={inputForm.title}
          />
          <TextField
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            name="goal_amount"
            label="Goal amount"
            onChange={handleFormChange}
            value={inputForm.goal_amount}
          />
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className=" text-slate-300 h-[55px] w-[80px] 
            font-bold hover:text-slate-700  bg-slate-700 
            hover:bg-slate-400 rounded-sm"
        >
          Add
        </button>
      </div>
      <div className="w-full space-y-5 h-full overflow-auto ">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex flex-row rounded-sm bg-white text-black py-2 px-3 hover:bg-slate-300 justify-between items-center"
          >
            <div className=" w-1/4 flex flex-col">
              <div className="font-bold">{goal.title}</div>
              <button
                type="button"
                onClick={() => handleAddMondey(goal.id)}
                className=" text-slate-300 h-[55px] w-[150px] 
                  font-bold hover:text-slate-700  bg-slate-700 
                hover:bg-slate-400 rounded-sm mt-2"
              >
                Add money
              </button>
              <button
                type="button"
                onClick={() => handleDecreaseMondey(goal.id)}
                className=" text-slate-300 h-[55px] w-[150px] 
                  font-bold hover:text-slate-700  bg-slate-500 
                hover:bg-slate-400 rounded-sm mt-2"
              >
                Decrease money
              </button>
            </div>
            <div className="w-1/4 flex flex-col">
              <div className="w-1/2">
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
              <div className="font-bold">1000 Ft / {goal.goal_amount} Ft</div>
            </div>
            <div className="flex flex-row justify-end w-1/4">
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
