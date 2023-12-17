// COMPONENTS
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Tooltip, Modal, Box } from "@mui/material";
import { IEditGoalProps } from "@/types/types";

// MUI ICONS
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

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

const EditGoal: React.FC<IEditGoalProps> = ({ goalId, goals, setGoals }) => {
  const [editedData, setEditedData] = useState({
    title: "",
    goal_amount: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = () => {
    const goal = goals.find((goal) => goal.id === goalId);
    if (goal) {
      setEditedData({
        title: goal.title,
        goal_amount: goal.goal_amount,
      });
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
  ) => {
    const value =
      key === "goal_amount" ? Number(e.target.value) : e.target.value;
    setEditedData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleEdit = () => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              title: editedData.title,
              goal_amount: editedData.goal_amount,
            }
          : goal,
      ),
    );
    setIsModalOpen(false);
  };

  return (
    <div>
      <Tooltip arrow title={"Edit goal"}>
        <IconButton onClick={openEditModal}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box sx={style}>
          <h1 className="flex flex-row items-center justify-between bg-slate-500 pl-4 font-semibold text-gray-50">
            <div className="">Edit goal</div>
            <Tooltip arrow title={"Close"}>
              <IconButton onClick={handleClose} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </h1>
          <div className="flex flex-col items-center space-y-4 py-4">
            <TextField
              required
              name="title"
              label="Title"
              onChange={(e) => handleInputChange(e, "title")}
              value={editedData.title}
            />
            <TextField
              required
              type="number"
              name="goal_amount"
              label="Goal amount"
              onChange={(e) => handleInputChange(e, "goal_amount")}
              value={editedData.goal_amount}
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

export default EditGoal;
