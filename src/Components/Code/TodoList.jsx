const TodoList = ({ todos }) => {
  if (!todos || todos.length === 0) {
    return <p className="text-gray-600">No pending tasks.</p>;
  }

  return (
    <ul className="list-disc pl-6 space-y-2">
      {todos.map((todo) => (
        <li key={todo._id} className="text-gray-800">
          {todo.task}{" "}
          {todo.status === "done" && (
            <span className="text-green-600">(Completed)</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
