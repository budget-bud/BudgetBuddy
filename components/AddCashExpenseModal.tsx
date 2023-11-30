import React, { useState } from 'react';

// ICONS
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';

// COMPONENTS
import IconButton from '@mui/material/IconButton';
import { Tooltip, Modal, Box } from '@mui/material';
import TextField from '@mui/material/TextField';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 280,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 1,
    overflow: "hidden"
  };
  
interface Expense {
      amount: string;
      place: string;
      description: string;
      origin: string;    
      created_at: string;
}

const AddCashExpenseModal = () => {

    const [isModalOpen,setIsModalOpen] = useState(false);
    const [expenses,setExpenses] = useState<Expense[]>([]);
    const [expenseForm,setExpenseForm] = useState({
        amount: "",
        place: "",
        description: "",
        origin:"",
        created_at: ""
    });

    const openCashModal = () => {
        setIsModalOpen(!isModalOpen);
        console.log(isModalOpen);
    };

    const handleClose = () => {setIsModalOpen(false)};

    const handleAdd = () => {
        if (expenseForm.amount !== "" && expenseForm.place !== "") {
            setExpenses(prevExpenses => [...prevExpenses, expenseForm]);
            setExpenseForm({ amount: "", place: "", description: "", origin: "", created_at: new Date().toISOString() });
        } else {
            window.alert("Something is missing!");
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {setExpenseForm(prev=>({...prev,[e.target.name]:e.target.value}))};

  return (
    <div>
        <Tooltip arrow title={"Add cash expense"}>
            <IconButton onClick={openCashModal} sx={{mr:"0.5rem"}}>
                <AttachMoneyIcon/>
            </IconButton>
        </Tooltip>
        <Modal
            open={isModalOpen}
            onClose={handleClose}
        >
            <Box sx={style}>
                <h1 className="bg-slate-500 font-semibold pl-4 text-gray-50 flex flex-row items-center justify-between"> 
                    <div className="">Add new expense</div>
                    <Tooltip arrow title={"Close"}>
                        <IconButton onClick={() =>handleClose()} sx={{color: "white"}}>
                            <CloseIcon/>
                        </IconButton>
                    </Tooltip>
                </h1>
                <div className="flex flex-col items-center py-4 space-y-4">
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
                        sx={{width:"222.5px"}}
                        label="Description"
                        onChange={handleFormChange}
                        value={expenseForm.description}
                    />
                </div>
                <div className='flex justify-end pb-3 mt-[0.5rem] w-full'>
                    <button className="text-slate-300 h-[35px] w-[80px] font-bold hover:text-slate-600  bg-slate-500 hover:bg-slate-400 rounded-sm mr-4 px-4" 
                        onClick={handleAdd}
                    >
                        Add
                    </button>
                </div>
            </Box>
        </Modal>
    </div>
  )
}

export default AddCashExpenseModal