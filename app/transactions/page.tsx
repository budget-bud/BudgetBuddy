"use client";
import { ICategory, IGoal, ITransactionWithFK } from "@/types/types";
import React, { useEffect, useState } from "react";

// COMPONENTS
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Tooltip, Modal, Box } from "@mui/material";
import { IEditCategoryProps } from "@/types/types";

// MUI ICONS
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 280,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  overflow: "hidden",
};

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

  const [selectedTransaction,setSelectedTransaction] = useState<ITransactionWithFK>();
  const [isEditOpen,setIsEditOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    origin: "",
    movement: 0,
    description:"",
    place:""
  });

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

  const deleteTransaction = async (id : number) => {
    if(window.confirm("Are you sure you want to delete this transaction?")){
      const response = await fetch(`/api/transactions/`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      }).then((res) => res.json());
      if (response.error) {
        window.alert(response.error);
        return;
      }
      else{
        setTransactions((prevTran) => ({
          transactions: (prevTran?.transactions ?? []).filter(
            (transaction) => transaction.id !== id
          ),
        }) as { transactions: [ITransactionWithFK] } | undefined);
      }
    }
  }

  
  const openEditTransaction = (t : ITransactionWithFK) => {
    setSelectedTransaction(t);
    setIsEditOpen(true);
    if (t) {
      setEditedData({
        origin: t.origin,
        movement: t.movement,
        description: t.description,
        place: t.place
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,key: string,) => {
    const value = key === "movement" ? Number(e.target.value) : e.target.value;
    setEditedData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleClose = () => {
    setIsEditOpen(false);
  };

  // itt nem jó
  const handleEdit = async () => {
    setTransactions((prevTransactions) =>
    prevTransactions?.transactions[0].map((t : ITransactionWithFK) =>
        t.id === selectedTransaction?.id
          ? { ...t, origin: editedData.origin, movement: editedData.movement, description:editedData.description, place:editedData.place }
          : t,
      ),
    );
   /* await fetch(`/api/transactions`, {
      method: "PUT",
      body: JSON.stringify({
        id: categoryId,
        title: editedData.title,
        limit: editedData.limit,
      }),
    });*/
    setIsEditOpen(false);
  };

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
            ?.filter((transaction: ITransactionWithFK) => {
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
              <tr
                className="relative h-[55px] transition-all hover:h-[100px]"
                key={index}
              >
                <td className="whitespace-nowrap px-6 py-4 align-top text-sm text-background-950">
                  {transaction.origin}
                </td>
                <td className="whitespace-nowrap px-6 py-4 align-top text-sm text-background-950">
                  {transaction.movement}
                </td>
                <td className="whitespace-nowrap px-6 py-4 align-top text-sm text-background-950  max-lg:hidden">
                  {transaction.description}
                </td>
                <td className="whitespace-nowrap px-6 py-4 align-top text-sm text-background-950">
                  {transaction.place}
                </td>
                <td className="whitespace-nowrap px-6 py-4 align-top text-sm text-background-950  max-md:hidden">
                  {transaction.category_id !== null && transaction.category_id.title}
                </td>
                <td className="whitespace-nowrap px-6 py-4 align-top text-sm text-background-950  max-md:hidden">
                  {transaction.goal_id !== null && transaction.goal_id.title}
                </td>
                <td className="whitespace-nowrap px-6 py-4 align-top text-sm text-background-950">
                  {transaction.created_at.split("T")[0]}
                </td>
                <div className="absolute bottom-1 right-1 flex h-full w-full items-end justify-end gap-2 opacity-0 hover:opacity-100">
                <button className={`h-10 w-20 cursor-pointer rounded-[18px] border-none bg-primary-600 text-text-100`}
                  onClick={() => openEditTransaction(transaction)}
                >
                    Edit
                  </button>
                  <button className="h-10 w-20 cursor-pointer rounded-[18px] border-none bg-primary-600 text-text-100"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    Delete
                  </button>
                </div>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal open={isEditOpen} onClose={handleClose}>
        <Box sx={style}>
          <h1 className="flex flex-row items-center justify-between bg-slate-500 pl-4 font-semibold text-gray-50">
            <div className="">Edit category</div>
            <Tooltip arrow title={"Close"}>
              <IconButton onClick={handleClose} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </h1>
          <div className="flex flex-col items-center space-y-4 py-4">
            <TextField
              required
              name="origin"
              label="Origin"
              onChange={(e) => handleInputChange(e, "origin")}
              value={editedData.origin}
            />
            <TextField
              required
              type="number"
              name="movement"
              label="Movement"
              onChange={(e) => handleInputChange(e, "movement")}
              value={editedData.movement}
            />
            <TextField
              name="description"
              label="Description"
              onChange={(e) => handleInputChange(e, "description")}
              value={editedData.description}
            />
            <TextField
              name="place"
              label="Place"
              onChange={(e) => handleInputChange(e, "place")}
              value={editedData.place}
            />
          </div>
          <div className="mt-[0.5rem] flex w-full justify-end pb-3">
            <button
              className="mr-4 h-[35px] w-[80px] rounded-sm bg-slate-500  px-4 font-bold text-slate-300 hover:bg-slate-400 hover:text-slate-600"
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default TransactionsPage;
