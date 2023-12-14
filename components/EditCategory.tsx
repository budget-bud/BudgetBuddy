// COMPONENTS
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Tooltip, Modal, Box } from "@mui/material";
import { EditCategoryProps } from "@/types/types";

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

const EditCategory: React.FC<EditCategoryProps> = ({ categoryId,categories}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = () => {
    console.log(categoryId);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleTitleChange = () => {
    
  };

  return (
    <div>
      <Tooltip arrow title={"Edit category"}>
        <IconButton onClick={openEditModal}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box sx={style}>
          <h1 className="bg-slate-500 font-semibold pl-4 text-gray-50 flex flex-row items-center justify-between">
            <div className="">Add new expense</div>
            <Tooltip arrow title={"Close"}>
              <IconButton onClick={() => handleClose()} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </h1>
          <div className="flex flex-col items-center py-4 space-y-4">
            <TextField
              required
              name="title"
              label="Title"
              onChange={handleTitleChange}
              value={
                categories.find((category) => category.id === categoryId)
                  ?.title || ""
              }
            />
            <TextField
              required
              name="limit"
              label="Limit"
              //onChange={handleFormChange}
              //value={expenseForm.place}
            />
          </div>
          <div className="flex justify-end pb-3 mt-[0.5rem] w-full">
            <button
              className="text-slate-300 h-[35px] w-[80px] font-bold hover:text-slate-600  bg-slate-500 hover:bg-slate-400 rounded-sm mr-4 px-4"
              //onClick={handleAdd}
            >
              Edit
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default EditCategory;
