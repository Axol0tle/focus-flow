import {useState} from 'react';

// Basic ToDoList framwork
function ToDoList() {
    // Memory for whats typed
    const [inputValue, setInputValue] = useState("");
    // Memory for list of tasks
    const [todos, setTodos] = useState("[]");

    // Visual stuff
    return (
        <div style={{ padding: '15px 12px' ,marginTop: '40px' , backgroundColor: '#030d1c',  border: '2px solid rgba(57, 51, 51, 0.6)' , borderRadius:'20px'}}>
            <h2>To-Do-List</h2>
            <input type="text" placeholder="Type a task here..."/>
            <button> Add Task </button>

            <ul>
                <li> placeholder task#1 </li>
                <li> placeholder task#2 </li>
                <li> placeholder task#3 </li>
            </ul>
        </div>
    );
}


export default ToDoList;
