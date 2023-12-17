import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  InputAdornment,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { ICategory2, IExpenseForm, IGoals } from "@/types/types";

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
  }, [expenseForm]);

  return (
    <div>
      <Tooltip arrow title={"Add manual expense"}>
        <IconButton onClick={openManualModal} sx={{ mr: "0.5rem" }}>
          <AttachMoneyIcon className="text-white" />
        </IconButton>
      </Tooltip>
      <Dialog open={isModalOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add new expense</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <label>Expense Type:</label>
              <Switch
                checked={isCashExpense}
                onChange={handleToggleExpenseType}
              />
              {isCashExpense ? (
                <span>Cash Expense</span>
              ) : (
                <span>Bank Transaction</span>
              )}
            </Grid>
            {Object.keys(expenseForm).map((fieldName) => (
              <Grid item xs={6} key={fieldName}>
                {fieldName === "category" || fieldName === "goal" ? (
                  <FormControl fullWidth>
                    <InputLabel>{fieldName.replace(/_/g, " ")}</InputLabel>
                    <Select
                      name={fieldName}
                      value={expenseForm[fieldName]}
                      onChange={handleSelectChange(fieldName)}
                    >
                      {fieldName === "category"
                        ? categoryOptions.map((category) => (
                            <MenuItem key={category.id} value={category.title}>
                              {category.title.replace(/_/g, " ")}
                            </MenuItem>
                          ))
                        : goalOptions.map((goal) => (
                            <MenuItem key={goal.id} value={goal.title}>
                              {goal.title}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                ) : fieldName === "movement" ? (
                  <TextField
                    name={fieldName}
                    label={fieldName.replace(/_/g, " ")}
                    onChange={handleInputChange(fieldName)}
                    value={expenseForm[fieldName as keyof IExpenseForm]}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {parseFloat(expenseForm[fieldName]) < 0 ? "-" : "+"}
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">USD</InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <TextField
                    name={fieldName}
                    label={fieldName.replace(/_/g, " ")}
                    onChange={handleInputChange(fieldName)}
                    value={expenseForm[fieldName as keyof IExpenseForm]}
                    fullWidth
                    multiline={fieldName === "description"}
                    rows={fieldName === "description" ? 4 : 1}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            style={{ backgroundColor: "#2196F3", color: "#fff" }}
          >
            Add Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManualExpenseModal;
