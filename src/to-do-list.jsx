import { useState, useEffect } from 'react';
import './App.css';
import {supabase} from './supabase'

// Basic ToDoList framwork
function ToDoList() {
    // Memory for whats typed
    const [inputValue, setInputValue] = useState("");
    const [DescriptionValue, setDescriptionValue] = useState("");
    const [DueDateValue, setDueDateValue] = useState("");
    const [estimatedTimeValue, setEstimatedTimeValue] = useState("");
    // Memory for list of tasks
    const [todos, setTodos] = useState([]);

    // IDs of the tasks that are currently "open"
    const [expandedTasks, setExpandedTasks] = useState([]);

    // DATABASE: Fetch existing data when page loads
    useEffect(() => {
        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .order('created_at', { ascending: true }); // Or order by 'id'
            
            if (!error && data) {
                setTodos(data);
            }
        };
        fetchTasks();
    }, []);

    // CREATE: Add a new task
    const addTask = async () => {
        if (inputValue.trim() === "") return; // prevent empty tasks

        const newTask = {
          text: inputValue,
          description: DescriptionValue,
          dueDate: DueDateValue,
          estimatedTime: estimatedTimeValue === "" ? null : Number(estimatedTimeValue),
          completed: false, // starts as not done
        };

        const { data, error } = await supabase
          .from('items')
          .insert([newTask])
          .select();

        if (error) {
          console.error("Error adding task", error);
          alert("Error: " + error.message);
        } else if (data) { 
          const savedTask = { ...data[0], showDetails: false };

          setTodos([...todos, data[0]]); // Copy old list, add new task
          setInputValue(""); // Clear the input box
          setDescriptionValue(""); // Clear the description box
          setDueDateValue(""); // Clears the due date box
          setEstimatedTimeValue(""); // Clears the estimated time box
        }
    };

    // UPDATE: Check or uncheck a task
    const toggleTask = async (id) => {
        const taskToToggle = todos.find((task) => task.id === id); 
        if (!taskToToggle) return;

        const newStatus = !taskToToggle.completed;

        const { error } = await supabase
          .from('items')
          .update({ completed: newStatus })
          .eq('id', id);
        if (error) {
          console.error("Error updating task:", error);
        } else {
          const updatedList = todos.map((task) =>
            task.id === id ? { ...task, completed: newStatus } : task
          );
        setTodos(updatedList);
        }
    };

    // DELETE: Remove a task completely
    const deleteTask = async (id) => {
        // Delete from database
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting task:", error);
        } else {
            // Update UI
            const filteredList = todos.filter((task) => task.id !== id);
            setTodos(filteredList);
        }
    };

    // count the number of tasks incomplete
    const incompleteCount = todos.filter((task) => !task.completed).length;

    // Logic for collapsible list
    const toggleDetails = (taskId) => {
      if (expandedTasks.includes(taskId)) {
        // if its already open, filter it out to close it
        setExpandedTasks(expandedTasks.filter(id => id !== taskId));
      } else {
        // if its closed, add it to the list of open tasks
        setExpandedTasks([...expandedTasks, taskId]);
      }
    };

    // Visual stuff
    return (
    <div style={{ 
      padding: '15px 12px' ,
      marginTop: '40px' , 
      backgroundColor: '#2644ca44',  
      border: '5px solid rgba(48, 36, 36, 0.6)' , 
      borderRadius:'20px'
      }} 
      className="todo-container">
      
      {/* The Input Area */}
      <div className="task-form-card">
        <input 
          type = "text" 
          value = {inputValue} 
          onChange = {(e) => setInputValue(e.target.value)} 
          placeholder= "What needs to be done?" 
          className='form-input'
        />
        <textarea
          value = {DescriptionValue}
          onChange = {(e) => setDescriptionValue(e.target.value)}
          placeholder = "Description of task"
          rows = "3"
          className='form-input'
        />

      <div style = {{display: 'flex', gap: '10px'}}>
        <input
          type = "date"
          value = {DueDateValue}
          onChange = {(e) => setDueDateValue(e.target.value)}
          className='form-input'
        />
        <input
          type = "number"
          value = {estimatedTimeValue}
          onChange = {(e) => setEstimatedTimeValue(e.target.value)}
          placeholder = "Hours to Complete"
          className='form-input'
        />


      </div>
        <button className="form-submit-button" onClick={addTask} >Add Task</button>
    </div>
      
      {/* Header Row */}
      <div className="task-header-row">
        <h2 className="task-header-title">My Tasks</h2>
        <div className="task-counter-badge">
          {incompleteCount} Left
        </div>
      </div>

      {/* The ACTUAL list of stuff */}
      <ul className='todo-list'>
        {todos.map((task) => (
          <li key={task.id} className='todo-item' style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> 
            <div style={{ flexBasis: '100%', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input 
                type="checkbox" 
                checked={task.completed}
                onChange={() => toggleTask(task.id)} 
              />
          
              {/* If completed, add a strikethrough */}
              <span 
                className='todo-text'
                style={{ textDecoration: task.completed ? 'line-through' : 'none', marginLeft: '8px', fontSize: '1.1em', fontWeight: 'bold' }}>
                {task.text}
              </span>
            
              {/* The Arrow Toggle Button */}
              <button 
                className="icon-btn" 
                onClick={() => toggleDetails(task.id)}
              >
                {expandedTasks.includes(task.id) ? '▲' : '▼'}
              </button>

              {/* The Delete Button */}
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" height="24" viewBox="0 0 24 24" 
                  fill="none" stroke="currentColor" stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  class="lucide lucide-trash2-icon lucide-trash-2"
                >
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>

            </div>  

            {expandedTasks.includes(task.id) && (
            <div className="todo-details-box">
              <p className="task-description-text">
                <strong>Description:</strong> 
                <br />
                {task.description}
              </p>
              <p><strong>Due:</strong> {task.dueDate}</p>
              <p><strong>Estimated Time:</strong> {task.estimatedTime}h</p>
            </div>
            )}

          </li>
        ))}
      </ul>
    </div>
  );
}


export default ToDoList;
