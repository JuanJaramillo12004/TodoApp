import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, onDelete, onCheck, onEdit }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onCheck={onCheck} onEdit={onEdit} />
      ))}
    </ul>
  );
}

export default TodoList;
