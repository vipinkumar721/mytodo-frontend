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
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 mb-8">
      <h3 className="text-2xl font-extrabold mb-6 text-emerald-900 border-b border-gray-100 pb-4">
        {editTodo ? "Edit Task" : "Create New Task"}
      </h3>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* Title Input Area */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Buy groceries, Finish project report..."
            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Description Input Area */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add important details or steps here..."
            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Image Upload Area with clear UX */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Attach an Image (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Upload a photo or screenshot to help you remember the context of
            this task.
          </p>

          {/* Dashed drop-zone style container for better UX */}
          <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-4 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-200 flex items-center justify-between">
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-sm text-gray-600 
                file:mr-4 file:py-2.5 file:px-5 
                file:rounded-lg file:border-0 
                file:text-sm file:font-bold file:cursor-pointer
                file:bg-emerald-100 file:text-emerald-800 
                hover:file:bg-emerald-200 transition-colors cursor-pointer"
            />

            {/* 👇 AGAR IMAGE HAI TOH CROSS BUTTON DIKHAYO 👇 */}
            {image && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="ml-3 p-1.5 text-red-600 flex-shrink-0 flex items-center gap-1.5 px-3"
                title="Remove Selected Image"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <button
            type="submit"
            className="flex-1 bg-emerald-600 text-white p-3.5 rounded-xl font-bold shadow-md hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
          >
            {editTodo ? "Update Task" : "Save Task"}
          </button>

          {editTodo && (
            <button
              type="button"
              onClick={cancelEdit}
              className="flex-1 bg-white border-2 border-gray-200 text-gray-700 p-3.5 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
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
