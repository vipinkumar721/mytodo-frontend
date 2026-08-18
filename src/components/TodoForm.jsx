import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createTodo, updateTodo } from "../redux/todoSlice";
import { toast } from "react-toastify";

const TodoForm = ({ editTodo, setEditTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
      setDescription(editTodo.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editTodo]);

  // NAYA FUNCTION: Image hatane aur input reset karne ke liye
  const handleRemoveImage = () => {
    setImage(null);
    const fileInput = document.getElementById("imageInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return toast.warning("Title cannot be empty!");
    }

    if (title.trim().length < 3) {
      return toast.error("Title must be at least 3 characters long");
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    if (editTodo) {
      dispatch(updateTodo({ id: editTodo._id, todoData: formData }));
      setEditTodo(null);
    } else {
      formData.append("isCompleted", false);
      dispatch(createTodo(formData));
    }

    setTitle("");
    setDescription("");
    handleRemoveImage(); // Form submit ke baad image aur input reset karega
  };

  const cancelEdit = () => {
    setEditTodo(null);
    setTitle("");
    setDescription("");
    handleRemoveImage(); // Cancel karne par bhi reset karega
  };

  return (
   <div className="border border-[#8b8b8b] rounded-[8px] p-6 mb-6 bg-white max-w-4xl">
  <h3 className="text-xl font-bold mb-4 pb-2">
    {editTodo ? "Edit Task" : "Create New Task"}
  </h3>

  <form onSubmit={onSubmit} className="space-y-4">
    {/* Title Input Area */}
    <div>
      <label className="block text-sm font-semibold mb-1">
        Task Title <span className="text-red-700">*</span>
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Buy groceries..."
        className="w-full p-2 border border-[#2b2b2b] rounded-[4px] focus:outline-none"
      />
    </div>

    {/* Description Input Area */}
    <div>
      <label className="block text-sm font-semibold mb-1">
        Description
      </label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add important details here..."
        className="w-full p-2 border border-[#2b2b2b] rounded-[4px] focus:outline-none"
      />
    </div>

    {/* Image Upload Area */}
    <div>
      <label className="block text-sm font-semibold mb-1">
        Attach an Image (Optional)
      </label>
      <p className="text-xs mb-2">
        Upload a photo or screenshot to help you remember.
      </p>

      <div className="flex items-center gap-2">
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full text-sm border border-[#2b2b2b] rounded-[4px] p-1.5 focus:outline-none cursor-pointer bg-white"
        />

        {/* AGAR IMAGE HAI TOH REMOVE BUTTON DIKHAYO */}
        {image && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="border border-[#2b2b2b] rounded-[4px] bg-white text-black px-3 py-1.5 text-sm font-semibold hover:bg-black hover:text-white transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-2 pt-2">
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 font-semibold hover:bg-white hover:text-black border border-[#2b2b2b] rounded-[4px] transition-colors"
      >
        {editTodo ? "Update Task" : "Save Task"}
      </button>

      {editTodo && (
        <button
          type="button"
          onClick={cancelEdit}
          className="border border-[#2b2b2b] rounded-[4px] bg-white text-black px-4 py-2 font-semibold hover:bg-black hover:text-white transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  </form>
</div>
  );
};

export default TodoForm;
