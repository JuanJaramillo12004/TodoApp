import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase/credentials';
import { ref, push, get, set, remove, update } from 'firebase/database';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const snapshot = await get(ref(db, 'todos'));
  const todos = snapshot.exists() ? snapshot.val() : {};
  return Object.keys(todos).map((key) => ({
    id: key,
    ...todos[key],
  }));
});

export const addTodo = createAsyncThunk('todos/addTodo', async (text) => {
  const newTodoRef = push(ref(db, 'todos'));
  const todo = { text, completed: false };
  await set(newTodoRef, todo);
  return { id: newTodoRef.key, ...todo };
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
  await remove(ref(db, `todos/${id}`));
  return id;
});

export const toggleTodo = createAsyncThunk('todos/toggleTodo', async (id, { getState }) => {
  const todo = getState().todos.items.find((todo) => todo.id === id);
  await update(ref(db, `todos/${id}`), { completed: !todo.completed });
  return id;
});

export const editTodo = createAsyncThunk('todos/editTodo', async ({ id, text }) => {
  const todoRef = ref(db, `todos/${id}`);
  const snapshot = await get(todoRef);
  if (snapshot.exists()) {
    const todo = snapshot.val();
    await set(todoRef, { ...todo, text });
  }
  return { id, text };
});

const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const todo = state.items.find((todo) => todo.id === action.payload);
        if (todo) todo.completed = !todo.completed;
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        const todo = state.items.find((todo) => todo.id === action.payload.id);
        if (todo) {
          todo.text = action.payload.text;
        }
      });
  },
});

export default todosSlice.reducer;
