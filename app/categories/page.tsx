"use client";
import React, { useState } from "react";
import EditCategory from "@/components/EditCategory";
import { Category } from "@/types/types";

// COMPONENTS
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";

// MUI ICONS
import DeleteIcon from "@mui/icons-material/Delete";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      created_at: "Mon Aug 31 2020",
      title: "Test1",
      limit: 15000,
      //description: "",
      //type: "",
    },
    {
      id: "2",
      created_at: "Tue Sep 01 2020",
      title: "Test2",
      limit: 8500,
    },
    {
      id: "3",
      created_at: "Wed Sep 01 2020",
      title: "Test3",
      limit: 3000,
    },
  ]);

  const [inputForm, setInputForm] = useState({
    title: "",
    limit: 0,
  });

  const handleAdd = () => {
    if (String(inputForm.limit)[0] != "-") {
      if (inputForm.title !== "" && inputForm.limit !== 0) {
        const newCategory = {
          id: String(Date.now()), // You may want to generate a unique id here
          created_at: new Date().toDateString(),
          title: inputForm.title,
          limit: inputForm.limit,
        };

        setCategories((prevCat) => [...prevCat, newCategory]);

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

  const deleteCategory = (id: string) => {
    setCategories((prevCat) =>
      prevCat.filter((category) => category.id !== id),
    );
  };
  return (
    <div className="w-full flex flex-col space-y-10">
      <div className="mt-4 flex flex-row bg-slate-100 items-center justify-center px-2 py-4 rounded-sm space-x-3">
        <TextField
          name="title"
          label="Title"
          onChange={handleFormChange}
          value={inputForm.title}
        />
        <TextField
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          name="limit"
          label="Limit"
          onChange={handleFormChange}
          value={inputForm.limit}
        />
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
      <div className="w-full space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-row rounded-sm bg-white text-black py-2 px-3 hover:bg-slate-300 justify-between items-center"
          >
            <div className="font-bold w-1/4">{category.title}</div>
            <div className="w-1/4"> 1000 Ft / {category.limit} Ft</div>
            <div className="w-1/4 flex justify-center">csík</div>
            <div className="flex flex-row justify-end w-1/4">
              <EditCategory categoryId={category.id} categories={categories} />
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