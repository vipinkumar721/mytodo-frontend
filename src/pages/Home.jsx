import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getTodos, deleteTodo, updateTodo, reset } from "../redux/todoSlice";
import Header from "../components/Header";
import TodoForm from "../components/TodoForm";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [editTodo, setEditTodo] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { todos, isLoading, isError, message } = useSelector(
    (state) => state.todo,
  );

  // FIX 1: Error handling ke liye alag useEffect lagayein
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  // FIX 2: Data fetch aur Auth check ke liye alag useEffect lagayein
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(getTodos());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Todo?")) {
      dispatch(deleteTodo(id));
    }
  };

  const handleToggleCompleted = (todo) => {
    dispatch(
      updateTodo({
        id: todo._id,
        todoData: { isCompleted: !todo.isCompleted },
      }),
    );
  };
  
  // BONUS: Edit button par click karne par smoothly top par scroll hone ka function
  const handleEditClick = (todo) => {
    setEditTodo(todo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
<div className="min-h-screen bg-white pb-12">
  <Header />
  
  <div className="max-w-7xl mx-auto p-4 sm:p-8">
    <TodoForm editTodo={editTodo} setEditTodo={setEditTodo} />

    {/* Section Header */}
    <div className="mb-4 mt-8 flex items-center justify-between border-b border-[#8b8b8b] pb-2">
      <h2 className="text-xl font-bold">
        Your Tasks
      </h2>
      {todos.length > 0 && (
        <span className="text-sm font-semibold">
          {todos.filter((t) => t.isCompleted).length} / {todos.length} Completed
        </span>
      )}
    </div>

    {/* Loading State */}
    {isLoading && todos.length === 0 ? (
      <div className="p-8 border border-[#8b8b8b] rounded-[8px] text-center font-bold">
        Loading your tasks...
      </div>
    ) : todos.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className={`border border-[#8b8b8b] rounded-[8px] p-4 bg-white transition-colors ${
              todo.isCompleted ? "bg-gray-100" : ""
            }`}
          >
            {/* Image Section */}
            {todo.image && (
              <div className="mb-3 border border-[#2b2b2b] rounded-[4px]">
                <img
                  src={todo.image}
                  alt={todo.title}
                  className="w-full h-40 object-cover rounded-[4px]"
                />
              </div>
            )}

            {/* Content Section */}
            <div className="flex items-start gap-3 mb-2">
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => handleToggleCompleted(todo)}
                className="mt-1 w-4 h-4 cursor-pointer accent-black"
              />
              <div>
                <h3
                  className={`text-lg font-bold ${
                    todo.isCompleted ? "line-through text-gray-500" : "text-black"
                  }`}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className="text-sm text-gray-700 mt-1">
                    {todo.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#8b8b8b] text-sm">
              <div className="font-semibold text-[13px]">
                {todo.isCompleted ? "Completed" : "In Progress"}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(todo)}
                  className="cursor-pointer px-3 py-1 border border-[#2b2b2b] rounded-[4px] text-xs font-semibold hover:bg-black hover:text-white transition-colors focus:outline-none"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="cursor-pointer px-3 py-1 border border-red-500 text-red-600 rounded-[4px] text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center border border-[#8b8b8b] rounded-[8px] p-8 bg-white">
        <h3 className="text-lg font-bold mb-2">No tasks yet</h3>
        <p className="text-sm">
          You're all caught up! Use the form above to create your first task.
        </p>
      </div>
    )}
  </div>
</div>
  );
};

export default Home;