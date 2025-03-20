import React from "react";
import Todo from "../components/Todo";

function Tasks() {
  return (
    <div className="tasks">
        <h2>Your Tasks</h2>
        <p>Here you can manage all your tasks.</p>
        <Todo />
    </div>
  );
}

export default Tasks;
