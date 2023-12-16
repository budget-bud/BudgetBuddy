"use client";
import React, { useState } from "react";
const TransactionsPage = () => {
  const origins = ["McDonalds", "Burger King", "KFC", "Subway", "Pizza Hut"];
  const descriptions = ["croissant", "burger", "chicken", "sub", "pizza"];
  const places = ["Budapest", "New York", "London", "Paris", "Berlin"];
  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Groceries",
    "Rent",
  ];
  const goals = ["Bicycle", "Car", "House", "Vacation", "Savings"];
  const dates = [
    "2023-11-10",
    "2023-10-10",
    "2023-09-10",
    "2023-08-10",
    "2023-07-10",
  ];

  function getRandomElement(array: string[]) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const transactions = Array.from({ length: 10 }, () => ({
    origin: getRandomElement(origins),
    movement: getRandomNumber(-5000, 5000),
    description: getRandomElement(descriptions),
    place: getRandomElement(places),
    category: getRandomElement(categories),
    goal: getRandomElement(goals),
    date: getRandomElement(dates),
  }));

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");

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

          {categories.map((category) => (
            <option value={category} key={category}>
              {category}
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
          {goals.map((goal) => (
            <option value={goal} key={goal}>
              {goal}
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
          {transactions
            .filter((transaction) => {
              return (
                (transaction.movement.toString().includes(search) ||
                  transaction.description
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  transaction.place
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  transaction.origin
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  transaction.category
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  transaction.goal
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  transaction.date
                    .toLowerCase()
                    .includes(search.toLowerCase())) &&
                (selectedCategory === "" ||
                  transaction.category === selectedCategory) &&
                (selectedGoal === "" || transaction.goal === selectedGoal)
              );
            })
            .map((transaction, index) => (
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
                  {transaction.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {transaction.goal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {transaction.date}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsPage;
