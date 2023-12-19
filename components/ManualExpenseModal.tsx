import React, { useEffect, useState } from "react";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
  Box,
  IconButton,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { ICategory2, IExpenseForm, IGoals } from "@/types/types";
import CloseIcon from "@mui/icons-material/Close";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#fff",
  borderRadius: 4,
  padding: "20px",
  overflow: "hidden",
};

const ManualExpenseModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState<IExpenseForm>({
    goal: "",
    category: "category_cash",
    origin: "",
    place: "",
    movement: "",
    description: "",
  });
  const [isCashExpense, setIsCashExpense] = useState(true);

  const [categoryOptions, setCategoryOptions] = useState<ICategory2[]>([]);
  const [goalOptions, setGoalOptions] = useState<IGoals[]>([]);

  const openManualModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleAdd = async () => {
    const response = await fetch(`/api/transactions`, {
      method: "POST",
      body: JSON.stringify({
        type: isCashExpense ? "cash" : "bank",
        goal_id: goalOptions.find((g) => g.title === expenseForm.goal)?.id,
        category_id: categoryOptions.find(
          (c) => c.title === expenseForm.category,
        )?.id,
        origin: expenseForm.origin,
        place: expenseForm.place,
        movement: expenseForm.movement,
        description: expenseForm.description,
      }),
    }).then((res) => res.json());
    if (response.error) {
      window.alert(response.error);
      return;
    }
    setExpenseForm({
      goal: "",
      category: "category_cash",
      origin: "",
      place: "",
      movement: "",
      description: "",
    });
    handleClose();
  };

  const handleInputChange =
    (name: string) =>
    (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      setExpenseForm((prev) => ({ ...prev, [name]: e.target.value as string }));
    };

  const handleSelectChange =
    (name: string) => (e: SelectChangeEvent<string | unknown>) => {
      setExpenseForm((prev) => ({ ...prev, [name]: e.target.value as string }));
    };

  const handleToggleExpenseType = () => {
    setIsCashExpense((prev) => !prev);

    // Automatically select category based on expense type
    setExpenseForm((prev) => ({
      ...prev,
      category:
        prev.category === "category_cash" ? "category_bank" : "category_cash",
    }));
  };

  useEffect(() => {
    fetch(`/api/categories`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setCategoryOptions(res.categories);
      });

    fetch(`/api/goals`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setGoalOptions(res.goals);
      });
  }, [isModalOpen]);

  return (
    <>
      <div className="flex w-full justify-center" onClick={openManualModal}>
        <div
          className="mt-[1rem] flex h-[2rem] w-3/4 
          cursor-pointer items-center 
          rounded-md bg-secondary-300 
          font-bold 
          text-background-950 hover:bg-secondary-200"
        >
          <AttachMoneyIcon className="ml-3" />
          <div className="ml-[1rem] w-full text-base">Add expense</div>
        </div>
      </div>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box sx={style}>
          <h1 className="flex items-center justify-between bg-slate-500 pl-4 font-semibold text-gray-50">
            <div className="">Add new expense</div>
            <Tooltip arrow title={"Close"}>
              <IconButton onClick={handleClose} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </h1>

          <div className="flex flex-col items-center space-y-2 py-2">
            <IconButton
              onClick={handleToggleExpenseType}
              size="large"
              sx={{
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {isCashExpense ? (
                <LocalAtmIcon sx={{ color: "black", fontSize: "4rem" }} />
              ) : (
                <AccountBalanceIcon sx={{ color: "black", fontSize: "4rem" }} />
              )}
              <Typography
                variant="h6"
                style={{ color: "black", marginTop: "4px" }}
              >
                {isCashExpense ? "Cash Expense" : "Bank Transaction"}
              </Typography>
            </IconButton>
          </div>

          <div className="flex flex-col space-y-2 py-2">
            <div className="flex space-x-4">
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={expenseForm.category}
                  onChange={handleSelectChange("category")}
                >
                  {categoryOptions.map((category) => (
                    <MenuItem key={category.id} value={category.title}>
                      {category.title.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Goal</InputLabel>
                <Select
                  name="goal"
                  value={expenseForm.goal}
                  onChange={handleSelectChange("goal")}
                >
                  {goalOptions.map((goal) => (
                    <MenuItem key={goal.id} value={goal.title}>
                      {goal.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="flex space-x-4">
              <TextField
                name="movement"
                label="Movement"
                onChange={handleInputChange("movement")}
                value={expenseForm.movement}
                fullWidth
                InputProps={{
                  startAdornment: (<></>),
                  endAdornment: (
                    <InputAdornment position="end">HUF</InputAdornment>
                  ),
                }}
                required
              />

              <TextField
                name="origin"
                label="Origin"
                onChange={handleInputChange("origin")}
                value={expenseForm.origin}
                fullWidth
                required
              />

              <TextField
                name="place"
                label="Place"
                onChange={handleInputChange("place")}
                value={expenseForm.place}
                fullWidth
              />
            </div>

            <TextField
              name="description"
              label="Description"
              onChange={handleInputChange("description")}
              value={expenseForm.description}
              fullWidth
              multiline
              rows={4}
            />
          </div>
          <div className="mt-[0.5rem] flex w-full justify-end pb-3">
            <Button
              onClick={handleAdd}
              variant="contained"
              style={{ backgroundColor: "#64748B", color: "#fff" }}
            >
              Add Transaction
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ManualExpenseModal;
