"use client";
import React, { useState } from "react";
import { IGoal } from "@/types/types";

// COMPONENTS
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

// MUI ICONS
import DeleteIcon from "@mui/icons-material/Delete";

const TrackerPage = () => {
  const [goals, setGoals] = useState<IGoal[]>([
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
      id: "3",
      user_id: "222",
      created_at: "Thu Sep 15 2020",
      title: "Testgoal4",
      goal_amount: 4400,
      category_id: "2",
    },
  ]);
  return <div>TrackerPage</div>;
};

export default TrackerPage;
