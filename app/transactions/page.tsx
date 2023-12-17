"use client";
import { ICategory, IGoal, ITransaction } from "@/types/types";
import React, { useEffect, useState } from "react";
const TransactionsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [transactions, setTransactions] = useState<{
    transactions: [ITransaction];
  }>();
  const [categories, setCategories] = useState<{ categories: [ICategory] }>();
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
        setCategories(data);
      });

    fetch("/api/goals")
      .then((res) => res.json())
      .then((data) => {
        setGoals(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex max-w-full gap-4">
        <input
          id="searchInput"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-h-12 text-black p-6 rounded-lg"
          placeholder="Search for transactions here..."
        />
        <select
          className="max-h-12 max-w-24 text-black p-6 rounded-lg"
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a category</option>

          {categories?.categories.map((category: ICategory) => (
            <option value={category.title} key={category.title}>
              {category.title}
            </option>
          ))}
        </select>
        <select
          className="max-h-12 max-w-24 text-black p-6 rounded-lg"
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
      <table className="min-w-full divide-y divide-gray-200 rounded overflow-hidden">
        <thead className="bg-secondary_700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Origin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Movement
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Place
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Goal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-secondary_900 divide-y divide-gray-200">
          {transactions?.transactions
            .filter((transaction: ITransaction) => {
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
                  (transaction.category_id.title &&
                    transaction.category_id.title
                      .toLowerCase()
                      .includes(search.toLowerCase())) ||
                  (transaction.goal_id.title &&
                    transaction.goal_id.title
                      .toLowerCase()
                      .includes(search.toLowerCase())) ||
                  transaction.created_at
                    .toLowerCase()
                    .includes(search.toLowerCase())) &&
                (selectedCategory === "" ||
                  (transaction.category_id.title &&
                    transaction.category_id.title === selectedCategory)) &&
                (selectedGoal === "" ||
                  (transaction.goal_id.title &&
                    transaction.goal_id.title === selectedGoal))
              );
            })
            .map((transaction: ITransaction, index: number) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {transaction.origin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {transaction.movement}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {transaction.place}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {transaction.category_id.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {transaction.goal_id.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
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
