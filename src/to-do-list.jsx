import {useState} from 'react';
import './App.css';

// Basic ToDoList framwork
function ToDoList() {
    // Memory for whats typed
    const [inputValue, setInputValue] = useState("");
    // Memory for list of tasks
    const [todos, setTodos] = useState([]);

    // CREATE: Add a new task
    const addTask = () => {
        if (inputValue.trim() === "") return; // prevent empty tasks

        const newTask = {
        id: Date.now(), // unique ID based on date so React can track it (prevents repeat tasks being confused)
        text: inputValue,
        completed: false // starts as not done
        };

        setTodos([...todos, newTask]); // Copy old list, add new task
        setInputValue(""); // Clear the input box
    };

    // UPDATE: Check or uncheck a task
    const toggleTask = (id) => {
        const updatedList = todos.map((task) => 
        task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTodos(updatedList);
    };

    // DELETE: Remove a task completely
    const deleteTask = (id) => {
        const filteredList = todos.filter((task) => task.id !== id);
        setTodos(filteredList);
    };


    // Visual stuff
    return (
    <div style={{ padding: '15px 12px' ,marginTop: '40px' , backgroundColor: '#ffffff',  border: '2px solid rgba(48, 36, 36, 0.6)' , borderRadius:'20px'}} className="todo-container">
      <h2>My Tasks</h2>
      
      {/* The Input Area */}
      <div>
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="What needs to be done?" 
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* The List Area */}
      <ul className='todo-list'>
        {todos.map((task) => (
          <li key={task.id} className='todo-item'>
            
            <input 
              type="checkbox" 
              checked={task.completed}
              onChange={() => toggleTask(task.id)} 
            />
            
            {/* If completed, add a strikethrough */}
            <span 
                className='todo-text'
                style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.text}
            </span>
            
            <button onClick={() => deleteTask(task.id)}>Delete</button>
            
          </li>
        ))}
      </ul>
    </div>
  );
}


export default ToDoList;
