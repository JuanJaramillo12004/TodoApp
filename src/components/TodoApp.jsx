// src/components/TodoApp.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodos, addTodo, deleteTodo, toggleTodo, editTodo } from '../utils/todosSlice';
import TodoList from './TodoList';
import '../App.css';

function TodoApp() {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.items);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = () => {
    if (text) {
      dispatch(addTodo(text));
      setText('');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Todo App</h1>
      </header>
      <div className="input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nueva tarea"
        />
        <button className="add-btn" onClick={handleAddTodo}>
          Añadir
        </button>
      </div>
      <TodoList
        todos={todos}
        onDelete={(id) => dispatch(deleteTodo(id))}
        onCheck={(id) => dispatch(toggleTodo(id))}
        onEdit={(id, text) => dispatch(editTodo({ id, text }))}
      />
    </div>
  );
}

export default TodoApp;
