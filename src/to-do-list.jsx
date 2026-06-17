import { useState, useEffect } from 'react';
import './App.css';
import {supabase} from './supabase'
/* Icons Import*/
import { FaRegTrashAlt } from "react-icons/fa"; 
import { MdEdit } from "react-icons/md";

// Basic ToDoList framwork
function ToDoList() {
    // Memory for whats typed
    const [inputValue, setInputValue] = useState("");
    const [DescriptionValue, setDescriptionValue] = useState("");
    const [DueDateValue, setDueDateValue] = useState("");
    const [estimatedTimeValue, setEstimatedTimeValue] = useState("");
    // Memory for list of tasks
    const [todos, setTodos] = useState([]);

    // EDITING: Memory for which task is being edited and its temporary values
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editValues, setEditValues] = useState({ text: "", description: "", dueDate: "", estimatedTime: "" });

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

    // EDIT: Start editing a specific task
    const startEditing = (task) => {
        setEditingTaskId(task.id);
        // fill the temporary memory with the task's current data
        setEditValues({ 
            text: task.text, 
            description: task.description || "", 
            dueDate: task.dueDate || "", 
            estimatedTime: task.estimatedTime || "" 
        });
        // make sure the details box is open so they can see all the fields
        if (!expandedTasks.includes(task.id)) {
            setExpandedTasks([...expandedTasks, task.id]);
        }
    };

    // EDIT: Cancel editing
    const cancelEditing = () => {
        setEditingTaskId(null);
    };

    // EDIT: Save changes to database
    const saveEdit = async (id) => {
        if (editValues.text.trim() === "") return; // Don't save an empty title

        // 1. prep data for DB
        const updatedData = {
            text: editValues.text,
            description: editValues.description,
            dueDate: editValues.dueDate,
            estimatedTime: editValues.estimatedTime === "" ? null : Number(editValues.estimatedTime)
        };

        // 2. save to Supabase
        const { error } = await supabase
            .from('items')
            .update(updatedData)
            .eq('id', id);

        if (error) {
            console.error("Error saving edit:", error.message);
            alert("Failed to save edits.");
        } else {
            // 3. update UI
            const updatedList = todos.map((task) =>
                task.id === id ? { ...task, ...updatedData } : task
            );
            setTodos(updatedList);
            setEditingTaskId(null); // Close edit mode
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
            {/*Editing UI*/}
            {editingTaskId === task.id ? (
              <div style={{ flexBasis: '100%', display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px 0' }}>
                <input 
                  type="text" 
                  value={editValues.text}
                  onChange={(e) => setEditValues({...editValues, text: e.target.value})}
                  className="form-input"
                />
                <textarea 
                  value={editValues.description}
                  onChange={(e) => setEditValues({...editValues, description: e.target.value})}
                  className="form-input"
                  rows="2"
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="date" 
                    value={editValues.dueDate}
                    onChange={(e) => setEditValues({...editValues, dueDate: e.target.value})}
                    className="form-input"
                  />
                  <input 
                    type="number" 
                    value={editValues.estimatedTime}
                    onChange={(e) => setEditValues({...editValues, estimatedTime: e.target.value})}
                    className="form-input"
                    placeholder="Hours"
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <button className ='save' onClick={() => saveEdit(task.id)}>Save</button>
                  <button className ='logout' onClick={cancelEditing}>Cancel</button>
                </div>
              </div>

            ) : (

            /* Normal Display UI */
            <> 
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

              {/* The Edit Button */}
              <button className="edit-btn" onClick={() => startEditing(task)} style={{ marginLeft: '10px' }}>
                <MdEdit size={22}/>
              </button>

              {/* The Delete Button */}
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                <FaRegTrashAlt size={22} />
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
          </>
          )}
          </li>
        ))}
      </ul>
    </div>
  );
}


export default ToDoList;
