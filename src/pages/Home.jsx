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
    <div className="min-h-screen bg-emerald-50/40 pb-12 font-sans">
      <Header />
      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        <TodoForm editTodo={editTodo} setEditTodo={setEditTodo} />

        <div className="mb-6 mt-2 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-emerald-900 tracking-tight">
            Your Tasks
          </h2>
          {todos.length > 0 && (
            <span className="text-sm font-medium text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full shadow-sm">
              {todos.filter((t) => t.isCompleted).length} / {todos.length}{" "}
              Completed
            </span>
          )}
        </div>

        {/* FIX 3: Spinner tabhi dikhaye jab list khali ho (Initial Load) */}
        {isLoading && todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-800 font-medium animate-pulse">
              Loading your tasks...
            </p>
          </div>
        ) : todos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todos.map((todo) => (
              <div
                key={todo._id}
                className={`flex flex-col bg-white rounded-2xl p-5 shadow-sm border ${
                  todo.isCompleted
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-gray-100"
                }`}
              >
                {/* Image Section */}
                {todo.image && (
                  <div className="mb-4 relative rounded-xl overflow-hidden shadow-sm transition-opacity">
                    <img
                      src={todo.image}
                      alt={todo.title}
                      className={`w-full h-44 object-cover transition-all duration-300 ${
                        todo.isCompleted ? "grayscale opacity-60" : ""
                      }`}
                    />
                  </div>
                )}

                {/* Content Section */}
                <div className="flex items-start gap-3.5 mb-2 flex-grow">
                  <div className="relative flex items-center justify-center mt-1 shrink-0">
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => handleToggleCompleted(todo)}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer transition-all duration-200"
                    />
                    <svg
                      className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`text-lg font-bold leading-tight mb-1.5 transition-colors duration-200 ${
                        todo.isCompleted
                          ? "line-through text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p
                        className={`text-sm leading-relaxed ${
                          todo.isCompleted ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center h-7">
                    {todo.isCompleted ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-semibold text-gray-500 bg-gray-100/80 px-2.5 py-1 rounded-md">
                        In Progress
                      </span>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      // Bonus Fix apply kiya gaya hai yaha
                      onClick={() => handleEditClick(todo)}
                      className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white rounded-3xl p-12 shadow-sm border border-gray-100 mt-6 max-w-2xl mx-auto">
             <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks yet</h3>
             <p className="text-gray-500 max-w-sm mx-auto">
               You're all caught up! Use the form above to create your first task and stay organized.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;