import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodos, addTodo, deleteTodo, toggleTodo, editTodo, startTodosListener } from '../utils/todosSlice';
import TodoList from './TodoList';
import '../assets/css/Tasks.css';

function Todo() {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.items);

  useEffect(() => {
    dispatch(fetchTodos());
    dispatch(startTodosListener());
  }, [dispatch]);

  const handleAddTodo = () => {
    if (text) {
      dispatch(addTodo(text));
      setText('');
    }
  };

  return (
    <div className="container">
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

export default Todo;