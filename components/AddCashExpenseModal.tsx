import React, { useState } from "react";

// ICONS
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CloseIcon from "@mui/icons-material/Close";

// COMPONENTS
import IconButton from "@mui/material/IconButton";
import { Tooltip, Modal, Box } from "@mui/material";
import TextField from "@mui/material/TextField";

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

interface Expense {
  amount: string; // Or movement
  place: string;
  description: string;
  origin: string;
  created_at: string;
  user_id: number;
  goal_id: number;
  category_id: number;
  // + id
}

const AddCashExpenseModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [expensesArray, setExpensesArray] = useState<Expense[]>([]);
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    place: "",
    description: "",
    origin: "",
    /*created_at: "",
    user_id: 0,
    goal_id: 0,
    category_id: 0,*/
  });

  const openCashModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    if (expenseForm.amount !== "" && expenseForm.place !== "") {
      const newExpense = {
        ...expenseForm,
        created_at: new Date().toISOString(),
        user_id: 1,
        goal_id: 1,
        category_id: 1,
      };

      setExpensesArray((prevExpenses) => [...prevExpenses, newExpense]);

      setExpenseForm({
        amount: "",
        place: "",
        description: "",
        origin: "",
      });
    } else {
      window.alert("Something is missing!");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpenseForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <Tooltip arrow title={"Add cash expense"}>
        <IconButton onClick={openCashModal} sx={{ mr: "0.5rem" }}>
          <AttachMoneyIcon />
        </IconButton>
      </Tooltip>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box sx={style}>
          <h1 className="flex flex-row items-center justify-between bg-slate-500 pl-4 font-semibold text-gray-50">
            <div className="">Add new expense</div>
            <Tooltip arrow title={"Close"}>
              <IconButton onClick={() => handleClose()} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </h1>
          <div className="flex flex-col items-center space-y-4 py-4">
            <TextField
              required
              name="amount"
              label="Amount"
              onChange={handleFormChange}
              value={expenseForm.amount}
            />
            <TextField
              required
              name="place"
              label="Place"
              onChange={handleFormChange}
              value={expenseForm.place}
            />
            <TextField
              required
              name="origin"
              label="Origin"
              onChange={handleFormChange}
              value={expenseForm.origin}
            />
            <TextField
              name="description"
              multiline
              rows={3}
              sx={{ width: "222.5px" }}
              label="Description"
              onChange={handleFormChange}
              value={expenseForm.description}
            />
          </div>
          <div className="mt-[0.5rem] flex w-full justify-end pb-3">
            <button
              className="mr-4 h-[35px] w-[80px] rounded-sm bg-slate-500  px-4 font-bold text-slate-300 hover:bg-slate-400 hover:text-slate-600"
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AddCashExpenseModal;
