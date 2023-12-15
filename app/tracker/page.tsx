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

const TrackerPage = () => {
  const [goals, setGoals] = useState<IGoal[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [inputForm, setInputForm] = useState({
    title: "",
    goal_amount: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState("");

  // In the useEffect get these data and fill the array with them
  // Furthermore get the distinct categories, and populate the dropdown selector with them
  // also set the userId, or read it from the cookies I dont know
  const userId: string = "111";
  useEffect(() => {
    const gls = [
      {
        id: "1",
        user_id: "111",
        created_at: "Mon Sep 12 2020",
        title: "Testgoal1",
        goal_amount: 1500,
        category_id: "1",
      },
      {
        id: "2",
        user_id: "111",
        created_at: "Tue Sep 13 2020",
        title: "Testgoal2",
        goal_amount: 7000,
        category_id: "1",
      },
      {
        id: "3",
        user_id: "111",
        created_at: "Wed Sep 14 2020",
        title: "Testgoal3",
        goal_amount: 300,
        category_id: "2",
      },
      {
        id: "4",
        user_id: "222",
        created_at: "Thu Sep 15 2020",
        title: "Testgoal4",
        goal_amount: 4400,
        category_id: "2",
      },
      {
        id: "5",
        user_id: "111",
        created_at: "Thu Sep 27 2020",
        title: "Testgoal5",
        goal_amount: 1900,
        category_id: "2",
      },
    ];
    setGoals(gls);

    const cats = [
      {
        id: "1",
        created_at: "Mon Aug 31 2020",
        title: "TestCat1",
        limit: 15000,
      },
      {
        id: "2",
        created_at: "Tue Sep 01 2020",
        title: "TestCat2",
        limit: 8500,
      },
      {
        id: "3",
        created_at: "Wed Sep 01 2020",
        title: "TestCat3",
        limit: 3000,
      },
    ];
    setCategories(cats);
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = () => {
    if (String(inputForm.goal_amount)[0] != "-") {
      if (inputForm.title !== "" && inputForm.goal_amount !== 0) {
        const newGoal = {
          id: String(Date.now()), // You may want to generate a unique id here
          user_id: "111",
          created_at: new Date().toDateString(),
          title: inputForm.title,
          goal_amount: inputForm.goal_amount,
          category_id: "23",
        };

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
                    {" "}
                    {c.title}{" "}
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
        {goals.map((goal) =>
          goal.user_id == userId ? (
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
              {/* Read the value from the database, where goal.id = the desired id of the goal*/}
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
          ) : (
            ""
          ),
        )}
      </div>
    </div>
  );
};

export default TrackerPage;
