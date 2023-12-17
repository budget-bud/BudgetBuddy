// COMPONENTS
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Tooltip, Modal, Box } from "@mui/material";
import { IEditCategoryProps } from "@/types/types";

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

const EditCategory: React.FC<IEditCategoryProps> = ({
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
          <h1 className="flex flex-row items-center justify-between bg-slate-500 pl-4 font-semibold text-gray-50">
            <div className="">Edit category</div>
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
              name="limit"
              label="Limit"
              onChange={(e) => handleInputChange(e, "limit")}
              value={editedData.limit}
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

export default EditCategory;
