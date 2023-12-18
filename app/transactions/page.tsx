"use client";
import { ICategory, IGoal, ITransactionWithFK } from "@/types/types";
import React, { useEffect, useState } from "react";

const TransactionsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [transactions, setTransactions] = useState<{
    transactions: [ITransactionWithFK];
  }>();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [goals, setGoals] = useState<{ goals: [IGoal] }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
      });

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
      });

    fetch("/api/goals")
      .then((res) => res.json())
      .then((data) => {
        setGoals(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div
      className={`flex max-h-full w-full flex-grow flex-col gap-4 rounded-lg bg-secondary-800 p-4 ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      <div className="flex max-w-full flex-wrap gap-4">
        <input
          id="searchInput"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-h-12 flex-1 rounded-lg bg-primary-600 p-6 text-background-950 max-lg:min-w-full"
          placeholder="Search for transactions here..."
        />
        <select
          className="max-w-24 max-h-12 flex-1 rounded-lg bg-primary-600 p-6 text-background-950"
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a category</option>

          {categories.map((category: ICategory) => (
            <option value={category.id} key={category.id}>
              {category.title}
            </option>
          ))}
        </select>
        <select
          className="max-w-24 max-h-12 flex-1 rounded-lg bg-primary-600 p-6 text-background-950"
          id="goalSelect"
          value={selectedGoal}
          onChange={(e) => setSelectedGoal(e.target.value)}
        >
          <option value="">Select a goal</option>
          {goals?.goals.map((goal) => (
            <option value={goal.title} key={goal.title}>
              {goal.title}
            </option>
          ))}
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded">
        <thead className="bg-secondary-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-background-950">
              Origin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-background-950">
              Movement
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-background-950 max-lg:hidden">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-background-950">
              Place
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-background-950 max-md:hidden">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-background-950 max-md:hidden">
              Goal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-background-950">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-secondary-200">
          {transactions?.transactions
            .filter((transaction: ITransactionWithFK) => {
              return (
                (transaction.movement.toString().includes(search) ||
                  (transaction.description &&
                    transaction.description
                      .toLowerCase()
                      .includes(search.toLowerCase())) ||
                  (transaction.place &&
                    transaction.place
                      .toLowerCase()
                      .includes(search.toLowerCase())) ||
                  (transaction.origin &&
                    transaction.origin
                      .toLowerCase()
                      .includes(search.toLowerCase())) ||
                  (transaction.category_id &&
                    transaction.category_id.title
                      .toLowerCase()
                      .includes(search.toLowerCase())) ||
                  (transaction.goal_id &&
                    transaction.goal_id.title
                      .toLowerCase()
                      .includes(search.toLowerCase())) ||
                  transaction.created_at
                    .toLowerCase()
                    .includes(search.toLowerCase())) &&
                (selectedCategory === "" ||
                  (transaction.category_id &&
                    transaction.category_id.title === selectedCategory)) &&
                (selectedGoal === "" ||
                  (transaction.goal_id &&
                    transaction.goal_id.title === selectedGoal))
              );
            })
            .map((transaction: ITransactionWithFK, index: number) => (
              <tr key={index}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-background-950">
                  {transaction.origin}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-background-950">
                  {transaction.movement}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-background-950">
                  {transaction.description}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-background-950">
                  {transaction.place}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-background-950">
                  {transaction.category_id !== null &&
                    transaction.category_id.title}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-background-950">
                  {transaction.goal_id !== null && transaction.goal_id.title}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-background-950">
                  {transaction.created_at.split("T")[0]}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsPage;
