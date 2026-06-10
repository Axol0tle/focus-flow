import {useState} from 'react';
import './App.css';

// Basic ToDoList framwork
function ToDoList() {
    // Memory for whats typed
    const [inputValue, setInputValue] = useState("");
    const [DescriptionValue, setDescriptionValue] = useState("");
    const [DueDateValue, setDueDateValue] = useState("");
    const [estimatedTimeValue, setEstimatedTimeValue] = useState("");
    // Memory for list of tasks
    const [todos, setTodos] = useState([]);

    // CREATE: Add a new task
    const addTask = () => {
        if (inputValue.trim() === "") return; // prevent empty tasks

        const newTask = {
        id: Date.now(), // unique ID based on date so React can track it (prevents repeat tasks being confused)
        text: inputValue,
        description: DescriptionValue,
        dueDate: DueDateValue,
        estimatedTime: estimatedTimeValue,
        completed: false // starts as not done
        };

        setTodos([...todos, newTask]); // Copy old list, add new task
        setInputValue(""); // Clear the input box
        setDescriptionValue(""); // Clear the description box
        setDueDateValue(""); // Clears the due date box
        setEstimatedTimeValue(""); // Clears the estimated time box
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
      <div style ={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom:'20px'}}>
        <input 
          type = "text" 
          value = {inputValue} 
          onChange = {(e) => setInputValue(e.target.value)} 
          placeholder= "What needs to be done? (Task Title)" 
        />
        <textarea
        value = {DescriptionValue}
        onChange = {(e) => setDescriptionValue(e.target.value)}
        placeholder = "Description of task"
        rows = "3"
        />

      <div style = {{display: 'flex', gap: '10px'}}>
        <input
        type = "date"
        value = {DueDateValue}
        onChange = {(e) => setDueDateValue(e.target.value)}
        />
        <input
        type = "number"
        value = {estimatedTimeValue}
        onChange = {(e) => setEstimatedTimeValue(e.target.value)}
        placeholder = "Estimated time of completion (Hours)"
        />


      </div>
        <button onClick={addTask}>Add Task</button>
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
