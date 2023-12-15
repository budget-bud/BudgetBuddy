import React, { useState } from "react";
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

interface ExpenseForm {
  goal: string;
  category: string;
  origin: string;
  place: string;
  movement: string;
  description: string;
}

const ManualExpenseModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>({
    goal: "",
    category: "category_cash",
    origin: "",
    place: "",
    movement: "",
    description: "",
  });
  const [isCashExpense, setIsCashExpense] = useState(true);

  const categoryOptions = ["category_cash", "category_bank", "Category1", "Category2", "Category3"];
  const goalOptions = ["Goal1", "Goal2", "Goal3"]; // Dummy data

  const openManualModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    // Your add logic here based on isCashExpense value
    handleClose();
  };

  const handleInputChange = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setExpenseForm((prev) => ({ ...prev, [name]: e.target.value as string }));
  };

  const handleSelectChange = (name: string) => (
    e: SelectChangeEvent<string | unknown>
  ) => {
    setExpenseForm((prev) => ({ ...prev, [name]: e.target.value as string }));
  };

  const handleToggleExpenseType = () => {
    setIsCashExpense((prev) => !prev);

    // Automatically select category based on expense type
    setExpenseForm((prev) => ({
      ...prev,
      category: prev.category === "category_cash" ? "category_bank" : "category_cash",
    }));
  };

  return (
    <div>
      <Tooltip arrow title={"Add manual expense"}>
        <IconButton onClick={openManualModal} sx={{ mr: "0.5rem" }}>
          <AttachMoneyIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={isModalOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add new expense</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <label>Expense Type:</label>
              <Switch checked={isCashExpense} onChange={handleToggleExpenseType} />
              {isCashExpense ? <span>Cash Expense</span> : <span>Bank Transaction</span>}
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
                            <MenuItem key={category} value={category}>
                              {category.replace(/_/g, " ")}
                            </MenuItem>
                          ))
                        : goalOptions.map((goal) => (
                            <MenuItem key={goal} value={goal}>
                              {goal}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                ) : fieldName === "movement" ? (
                  <TextField
                    name={fieldName}
                    label={fieldName.replace(/_/g, " ")}
                    onChange={handleInputChange(fieldName)}
                    value={expenseForm[fieldName as keyof ExpenseForm]}
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
                    value={expenseForm[fieldName as keyof ExpenseForm]}
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
