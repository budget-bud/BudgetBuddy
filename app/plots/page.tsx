"use client";

import React, { useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { ICategory2, ITransaction, IGoals, ICategory } from "@/types/types";
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


const FinancialDashboard = () => {
  
  const [goals, setGoals] = React.useState<IGoals[]>([]);
  const [transactions, setTransactions] = React.useState<ITransaction[]>([]);
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  
  useEffect(() => {
    fetch("/api/goals")
      .then((res) => res.json())
      .then((data) => setGoals(data.goals));
  
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data.transactions));
  
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories));
  }, []);
  
  console.log(goals);
  console.log(transactions);
  console.log(categories);
  

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
    categories: ICategory[],
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
    goals,
    transactions,
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

  const testGoals = createGoalAnnotations(goals);
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
        max: Math.max(...priceOfGoals(goals)) + 10000,
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
    labels: goals.map((g) => g.title),
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

  const recentTransactions = transactions.filter(
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
    categories,
  );

  const categorySpendingData = {
    labels: categories.map((c) => c.title),
    datasets: [
      {
        label: "Transactions per category",
        data: spendingPerCategory,
        backgroundColor: bgColors,
      },
    ],
  };

  return (
    <div className="flex max-h-full w-full flex-grow flex-col gap-4 rounded-lg bg-secondary-800 p-4">
      <h1 className="mb-4 text-2xl font-bold text-text-100">
        Financial dashboard
      </h1>
      <div className="scrollbar flex flex-col gap-4 overflow-y-scroll rounded-[18px]">
        <div className="flex flex-col rounded-[18px] bg-secondary-200">
          <h2 className="mt-2 text-center text-xl font-semibold text-background-950">
            Reaching the goals
          </h2>
          <div className="m-4 flex items-center justify-center rounded-[18px] bg-text-100 p-4 shadow">
            <Bar data={goalsData} options={options} />
          </div>
        </div>

        <div className="flex flex-col rounded-[18px] bg-secondary-200">
          <h2 className="mt-2 text-center text-xl font-semibold text-background-950">
            Transactions in the last two weeks
          </h2>
          <div className="m-4 flex items-center justify-center rounded-[18px] bg-text-100 p-4 shadow">
            <Line data={spendingData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="flex flex-col items-center rounded-[18px] bg-secondary-200">
          <h2 className="mt-2 text-center text-xl font-semibold text-background-950">
            Transactions per category in the last two weeks
          </h2>
          <div className="m-4 flex items-center justify-center rounded-[18px] bg-text-100 p-4 shadow">
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
