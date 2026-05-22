function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className="todo-title">{todo.title}</span>
      <button className="delete-btn" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}

export default TodoItem;
