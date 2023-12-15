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

const EditCategory: React.FC<EditCategoryProps> = ({
  categoryId,
  categories,
  setCategories,
}) => {
  const [editedData, setEditedData] = useState({
    title: "",
    limit: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = () => {
    const category = categories.find((category) => category.id === categoryId);
    if (category) {
      setEditedData({
        title: category.title,
        limit: category.limit,
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
    const value = key === "limit" ? Number(e.target.value) : e.target.value;
    setEditedData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleEdit = () => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? { ...category, title: editedData.title, limit: editedData.limit }
          : category,
      ),
    );
    setIsModalOpen(false);
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
            <div className="">Edit category</div>
            <Tooltip arrow title={"Close"}>
              <IconButton onClick={handleClose} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </h1>
          <div className="flex flex-col items-center py-4 space-y-4">
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
              name="limit"
              label="Limit"
              onChange={(e) => handleInputChange(e, "limit")}
              value={editedData.limit}
            />
          </div>
          <div className="flex justify-end pb-3 mt-[0.5rem] w-full">
            <button
              className="text-slate-300 h-[35px] w-[80px] font-bold hover:text-slate-600  bg-slate-500 hover:bg-slate-400 rounded-sm mr-4 px-4"
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

export default EditCategory;
