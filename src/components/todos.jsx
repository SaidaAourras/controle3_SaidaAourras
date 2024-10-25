import React, { useEffect, useReducer, useState } from 'react'
import axios from 'axios'
const initoalState = {
    tasks:[]
}

const myReducer = (state , action )=>{
    switch(action.type){
        case "fetch_task":
            return {
                ...state,
                tasks: [...state.tasks , action.payload]
            };
        case "add_task":
            return {
                ...state,
                tasks: [...state.tasks , action.payload]
            };
        case "edit_task":
            return {
                ...state,
                tasks: state.tasks.map((task)=>{
                    task.id === action.payload.id?
                    action.payload:task
                }) 
            };
        case "delete_task":
                return {
                    ...state,
                    tasks: state.tasks.filter((task)=>{
                        task.id != action.payload
                    }) 
                };
        default :
        return state;
    }
}

const Todos = () => {

    const [state , dispatch] = useReducer(myReducer, initoalState)
    const [isEditing , setIsEditing] = useState(false)
    const [dataForm , setDataForm] = useState({
        id:'',
        title:''
    })

    useEffect(()=>{
        const fetchTasks = async()=>{
            const res = await axios.get('https://jsonplaceholder.typicode.com/todos');
            dispatch({type:"fetch_task", payload:res.data})
        };
        fetchTasks();
    },[])

    const deleteTask =(id)=>{
        dispatch({type:"delete_task", payload:id})
    }

    const editTask =(task)=>{
        setDataForm(task)
        setIsEditing(true);
    }

    const handleSubmit =(e)=>{
        e.preventDefault()
        const newTask = {
            ...dataForm,
            id : isEditing? dataForm.id : Date.now()
        }

        if(isEditing){
            dispatch({type:"edit_task", payload:newTask})
            setIsEditing(false)
        }else{
            dispatch({type:"add_task", payload:newTask})
        }
    }

    const handleChange =(e)=>{
        const {name, value} = e.target;
        setDataForm({
            ...dataForm,
            [name]:value
        })
    }
    console.log(state.tasks)

  return (
    <div>
        <h1>What the plan for today ? </h1>
        <form  onSubmit={handleSubmit}>
            <input type='text' name='title' value={dataForm.task} onChange={(e)=>handleChange(e)}>
            </input>
            <button type='submit'>
                {isEditing? "update" : "Add Task"}
            </button>
        </form>

        <ul>
            {
                state.tasks.map((task)=>{
                    <li key={task.id}>
                        {task.title}
                    <button className='btn btn-edit' onClick={()=>editTask(task)}>
                        edit
                    </button>
                    <button className='btn btn-danger' onClick={()=>deleteTask(task.id)}>
                        delete
                    </button>
                    </li>
                } )
            }
        </ul>
      
    </div>
  )
}

export default Todos
