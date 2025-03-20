import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase/credentials';
import { ref, push, get, set, remove, update, onValue } from 'firebase/database';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const snapshot = await get(ref(db, 'todos'));
  const todos = snapshot.exists() ? snapshot.val() : {};
  return Object.keys(todos).map((key) => ({ id: key, ...todos[key] }));
});

export const addTodo = createAsyncThunk('todos/addTodo', async (text) => {
  const newTodoRef = push(ref(db, 'todos'));
  const todo = { text, completed: false };
  await set(newTodoRef, todo);
  return { id: newTodoRef.key, ...todo };
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id, { rejectWithValue }) => {
  try {
    await remove(ref(db, `todos/${id}`));
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const toggleTodo = createAsyncThunk('todos/toggleTodo', async (id, { getState, rejectWithValue }) => {
  try {
    const todo = getState().todos.items.find((todo) => todo.id === id);
    const updatedCompleted = !todo.completed; // Invierte el estado actual
    await update(ref(db, `todos/${id}`), { completed: updatedCompleted }); // Actualiza en Firebase
    return { id, completed: updatedCompleted }; // Devuelve el ID y el nuevo estado
  } catch (error) {
    return rejectWithValue(error.message); // Maneja errores
  }
});

export const editTodo = createAsyncThunk('todos/editTodo', async ({ id, text }, { rejectWithValue }) => {
  try {
    await update(ref(db, `todos/${id}`), { text });
    return { id, text };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const startTodosListener = createAsyncThunk('todos/startTodosListener', (_, { dispatch, getState }) => {
  const todosRef = ref(db, 'todos');
  onValue(todosRef, (snapshot) => {
    const todos = snapshot.exists() ? snapshot.val() : {};
    const formattedTodos = Object.keys(todos).map((key) => ({ id: key, ...todos[key] }));
    const currentTodos = getState().todos.items;
    const mergedTodos = formattedTodos.map((todo) => {
      const existingTodo = currentTodos.find((t) => t.id === todo.id);
      return existingTodo ? { ...existingTodo, ...todo } : todo;
    });
    dispatch(syncTodos(mergedTodos));
  });
});

const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], status: 'idle' },
  reducers: {
    syncTodos(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        if (!state.items.find((todo) => todo.id === action.payload.id)) {
          state.items.push(action.payload);
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const todo = state.items.find((todo) => todo.id === action.payload.id);
        if (todo) todo.completed = action.payload.completed; // Actualiza el estado local
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        const todoIndex = state.items.findIndex((todo) => todo.id === action.payload.id);
        if (todoIndex !== -1) {
          state.items[todoIndex].text = action.payload.text;
        }
      });
  },
});

export const { syncTodos } = todosSlice.actions;
export default todosSlice.reducer;
