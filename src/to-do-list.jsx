import {useState} from 'react';

// Basic ToDoList framwork
function ToDoList() {
    // Memory for whats typed
    const [inputValue, setInputValue] = useState("");
    // Memory for list of tasks
    const [todos, setTodos] = useState("[]");

    // Visual stuff
    return (
        <div style={{ marginTop: '40px' }}>
            <h2>My Tasks</h2>
            <input type="text" placeholder="Type a task here..."/>
            <button> Add Task </button>

            <ul>
                <li> placeholder task</li>
            </ul>
        </div>
    );
}

export default ToDoList;
