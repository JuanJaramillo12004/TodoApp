import React, { useState } from 'react';

function TodoItem({ todo, onDelete, onCheck, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing && newText !== todo.text) {
      onEdit(todo.id, newText);
    }
    setIsEditing(!isEditing);
  };

  return (
    <li className={`${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onCheck(todo.id)}
      />
      {isEditing ? (
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
      ) : (
        <span>{todo.text}</span>
      )}
      <button className="edit-btn" onClick={handleEdit}>
        {isEditing ? 'Guardar' : 'Editar'}
      </button>
      <button className="delete-btn" onClick={() => onDelete(todo.id)}>
        Eliminar
      </button>
    </li>
  );
}

export default TodoItem;
