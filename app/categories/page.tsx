"use client";
import React, { useState, useEffect } from "react";
import EditCategory from "@/components/EditCategory";
import { ICategory } from "@/types/types";

// COMPONENTS
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

// MUI ICONS
import DeleteIcon from "@mui/icons-material/Delete";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [inputForm, setInputForm] = useState({
    title: "",
    limit: 0,
  });

  const handleAdd = async () => {
    if (String(inputForm.limit)[0] != "-") {
      if (inputForm.title !== "" && inputForm.limit !== 0) {
        const newCategory = {
          created_at: new Date().toDateString(),
          title: inputForm.title,
          limit: inputForm.limit,
          type: "cash",
        };
        const response = await fetch(`/api/categories`, {
          method: "POST",
          body: JSON.stringify(newCategory),
        }).then((res) => res.json());
        if (response.error) {
          window.alert(response.error);
          return;
        }
        setCategories((prevCat) => [
          ...prevCat,
          response.categories[response.categories.length - 1],
        ]);

        setInputForm({
          title: "",
          limit: 0,
        });
      } else {
        window.alert("Something is missing!");
      }
    } else {
      window.alert("Negative values are NOT ACCEPTED!");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const deleteCategory = async (id: number) => {
    setCategories((prevCat) =>
      prevCat.filter((category) => category.id !== id),
    );
    await fetch(`/api/categories`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  };

  const calculateProgress = (limit: number) => {
    // Change 1000 to the value read from the db.
    if (limit < 1000) {
      return 100;
    } else {
      return (1000 / limit) * 100;
    }
  };

  useEffect(() => {
    fetch(`/api/categories`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setCategories(res.categories);
      });
  }, []);

  console.log(categories);

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
            <label className="text-text-100">Limit</label>
            <input
              className="h-full w-full rounded-[18px] bg-primary-700 p-4 text-lg text-text-100 focus:outline-none"
              type="number"
              min={0}
              name="limit"
              placeholder="Limit"
              onChange={handleFormChange}
              value={inputForm.limit}
            />
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
      <div className="h-full w-full space-y-5 overflow-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-row flex-wrap items-center justify-between rounded-[18px] bg-secondary-300 px-3 py-2 text-background-950"
          >
            <div className="w-1/4 font-bold max-lg:w-full max-lg:text-xl">
              {category.title}
            </div>
            {/* Read the value from the database, where category.id = the desired id of the category*/}
            <div className="w-1/4 max-lg:w-1/3">
              {category.totalAmount} / {category.limit} Ft
            </div>
            <div className="flex w-1/4 justify-center max-lg:w-1/3">
              <Box sx={{ width: "100%" }}>
                <LinearProgress
                  variant="determinate"
                  //Pass to the function the value, read from the database
                  value={calculateProgress(category.limit)}
                />
              </Box>
            </div>
            <div className="flex w-1/4 flex-row justify-end max-lg:w-1/3">
              <EditCategory
                categoryId={category.id}
                categories={categories}
                setCategories={setCategories}
              />
              <Tooltip arrow title={"Delete category"}>
                <IconButton onClick={() => deleteCategory(category.id)}>
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

export default CategoriesPage;
