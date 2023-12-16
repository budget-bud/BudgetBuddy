"use client";

import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { ICategory2, ITransaction, IGoals } from "@/types/types";
import { subWeeks, formatISO } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  RadarController,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { AnnotationOptions } from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  RadarController,
  annotationPlugin,
);

const data = {
  // Randomly generated data
  user_info: {
    user_id: 1,
    balance: 50000,
    created_at: "2023-10-10",
  },
  goals: [
    {
      id: 1,
      user_id: 1,
      title: "Bicycle",
      description: "New mountain bike",
      goal_amount: 300000,
      category_id: 1,
      created_at: "2023-10-10",
    },
    {
      id: 2,
      user_id: 1,
      title: "Snowboard",
      description: "New snowboard",
      goal_amount: 500000,
      category_id: 1,
      created_at: "2023-11-10",
    },
  ],
  categories: [
    {
      id: 1,
      title: "Freestyle",
      description: "Freestyle event",
      type: "sport",
      created_at: "2023-10-10",
    },
    {
      id: 2,
      title: "Work",
      description: "Workstuff",
      type: "laptop",
      created_at: "2023-11-10",
    },
  ],
  transactions: [
    {
      id: 1,
      user_id: 1,
      goal_id: 1,
      category_id: 1,
      origin: "food",
      place: "Budapest",
      movement: -1000,
      description: "croissant",
      created_at: "2023-11-10",
    },
    {
      id: 2,
      user_id: 1,
      goal_id: 1,
      category_id: 1,
      origin: "food",
      place: "Budapest",
      movement: -3000,
      description: "BigMac",
      created_at: "2023-12-10",
    },
    {
      id: 3,
      user_id: 1,
      goal_id: 1,
      category_id: 1,
      origin: "train ticket",
      place: "Budapest",
      movement: 10000,
      description: "Payday",
      created_at: "2023-12-11",
    },
    {
      id: 4,
      user_id: 1,
      goal_id: 1,
      category_id: 1,
      origin: "hyginie",
      place: "Budapest",
      movement: -6000,
      description: "hygiene",
      created_at: "2023-12-12",
    },
    {
      id: 5,
      user_id: 1,
      goal_id: 2,
      category_id: 2,
      origin: "hyginie",
      place: "Budapest",
      movement: -1000,
      description: "hygiene",
      created_at: "2023-12-12",
    },
  ],
};

const FinancialDashboard = () => {
  const priceOfGoals = (goals: IGoals[]) => {
    const priceOfGoalElements: number[] = [];
    goals.forEach((goal) => {
      priceOfGoalElements.push(goal.goal_amount);
    });

    return priceOfGoalElements;
  };

  const calculateProgressForGoal = (
    goals: IGoals[],
    transactions: ITransaction[],
  ) => {
    const values: number[] = [];
    const valuesInPercent: number[] = [];

    const spending = goals.reduce<{ [key: number]: number }>((acc, goal) => {
      acc[goal.id] = 0;
      return acc;
    }, {});

    transactions.forEach((transaction) => {
      spending[transaction.goal_id] += transaction.movement;
    });

    goals.forEach((goal) => {
      values.push(spending[goal.id]);
      valuesInPercent.push((spending[goal.id] / goal.goal_amount) * 100);
    });

    return [values, valuesInPercent];
  };

  const calculateSpendingPerCategory = (
    transactions: ITransaction[],
    categories: ICategory2[],
  ) => {
    const values: number[] = [];
    const spending = categories.reduce<{ [key: number]: number }>(
      (acc, category) => {
        acc[category.id] = 0;
        return acc;
      },
      {},
    );

    transactions.forEach((transaction) => {
      if (transaction.movement < 0) {
        spending[transaction.category_id] -= transaction.movement;
      }
    });

    categories.forEach((category) => {
      values.push(spending[category.id]);
    });

    return values;
  };

  const progressForGoal = calculateProgressForGoal(
    data.goals,
    data.transactions,
  );
  const currentBalance = progressForGoal[0];

  const createGoalAnnotations = (
    goals: IGoals[],
  ): { [key: string]: AnnotationOptions } => {
    return goals.reduce<{ [key: string]: AnnotationOptions }>(
      (annotations, goal) => {
        const annotationId = `goalLine${goal.id}`;
        annotations[annotationId] = {
          type: "line",
          yMin: goal.goal_amount,
          yMax: goal.goal_amount,
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 1,
          borderDash: [6, 6],
          label: {
            content: goal.title,
            position: "end",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            yAdjust: -6,
          },
        };
        return annotations;
      },
      {},
    );
  };

  const testGoals = createGoalAnnotations(data.goals);
  let delayed: boolean = false;
  const options = {
    responsive: true,
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context: {
        type: string;
        mode: string;
        dataIndex: number;
        datasetIndex: number;
      }) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
    scales: {
      y: {
        max: Math.max(...priceOfGoals(data.goals)) + 10000,
        min: Math.min(...currentBalance),
        ticks: {
          stepSize: 20000,
        },
      },
    },
    plugins: {
      annotation: {
        annotations: testGoals,
      },
    },
  };

  const goalsData = {
    labels: data.goals.map((g) => g.title),
    datasets: [
      {
        label: "Goal Thresholds",
        data: currentBalance,
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const bgColors = [
    "rgba(167, 87, 193, 0.2)",
    "rgba(88, 7, 19, 0.2)",
    "rgba(101, 201, 174, 0.2)",
    "rgba(237, 219, 85, 0.2)",
    "rgba(190, 101, 151, 0.2)",
    "rgba(170, 70, 148, 0.2)",
    "rgba(31, 201, 244, 0.2)",
    "rgba(112, 64, 93, 0.2)",
    "rgba(161, 202, 68, 0.2)",
    "rgba(139, 182, 245, 0.2)",
    "rgba(73, 89, 157, 0.2)",
    "rgba(72, 42, 161, 0.2)",
  ];

  const twoWeeksAgo = subWeeks(new Date(), 2);

  const formattedTwoWeeksAgo = formatISO(twoWeeksAgo, {
    representation: "date",
  });

  const recentTransactions = data.transactions.filter(
    (t) => t.created_at >= formattedTwoWeeksAgo,
  );

  const spendingData = {
    labels: recentTransactions.map((t) => t.created_at),
    datasets: [
      {
        label: "Transactions in the last 2 weeks",
        data: recentTransactions.map((t) => t.movement),
        fill: false,
        borderColor: bgColors,
        tension: 0.1,
      },
    ],
  };

  const spendingPerCategory = calculateSpendingPerCategory(
    recentTransactions,
    data.categories,
  );

  const categorySpendingData = {
    labels: data.categories.map((c) => c.title),
    datasets: [
      {
        label: "Transactions per category",
        data: spendingPerCategory,
        backgroundColor: bgColors,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Financial dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Reaching the goals
          </h2>
          <div className="flex-grow p-4 border rounded-lg shadow flex justify-center items-center">
            <Bar data={goalsData} options={options} />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Transactions in the last two weeks
          </h2>
          <div className="flex-grow p-4 border rounded-lg shadow flex justify-center items-center">
            <Line data={spendingData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-1 gap-4 mt-4 justify-items-center">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Transactions per category in the last two weeks
          </h2>
          <div className="p-4 border rounded-lg shadow">
            <Doughnut
              data={categorySpendingData}
              options={{ responsive: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
