"use client";
import React, { useState, useEffect } from "react";
import EditCategory from "@/components/EditCategory";
import { ICategory } from "@/types/types";

// COMPONENTS
import TextField from "@mui/material/TextField";
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

  // In the useEffect get these data and fill the array with them
  useEffect(() => {
    const cats = [
      {
        id: "1",
        created_at: "Mon Aug 31 2020",
        title: "TestCat1",
        limit: 15000,
        //description: "",
        //type: "",
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

  const calculateProgress = (limit: number) => {
    // Change 1000 to the value read from the db.
    if (limit < 1000) {
      return 100;
    } else {
      return (1000 / limit) * 100;
    }
  };

  return (
    <div className="w-full flex flex-col space-y-10">
      <div className="mt-4 flex flex-row bg-slate-100 items-center justify-between px-3 py-4 rounded-sm">
        <div className=" space-x-10">
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
      <div className="w-full space-y-5 h-full overflow-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-row rounded-sm bg-white text-black py-2 px-3 hover:bg-slate-300 justify-between items-center"
          >
            <div className="font-bold w-1/4">{category.title}</div>
            {/* Read the value from the database, where category.id = the desired id of the category*/}
            <div className="w-1/4"> 1000 Ft / {category.limit} Ft</div>{" "}
            <div className="w-1/4 flex justify-center">
              <Box sx={{ width: "100%" }}>
                <LinearProgress
                  variant="determinate"
                  //Pass to the function the value, read from the database
                  value={calculateProgress(category.limit)}
                />
              </Box>
            </div>
            <div className="flex flex-row justify-end w-1/4">
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
