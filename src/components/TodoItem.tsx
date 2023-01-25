import React, { useState } from 'react'
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"
import { BsGear } from "react-icons/bs"
import { CreateTodoSchema } from '../server/api/routers/todo';


const TodoItem: React.FC<{
    todo: CreateTodoSchema;
}> = ({
    todo
}) => {
        const [todoState, setTodoState] = useState("closed");

        const setTodoExpanded = () => {
            if (todoState === "closed") {
                setTodoState("open")
            }
            if (todoState === "open") {
                setTodoState("closed")
            }
        }

        const priorityCritical = todo.priority === "CRITICAL" && "bg-[red]";
        const priorityHigh = todo.priority === "HIGH" && "bg-[orange]";
        const priorityMedium = todo.priority === "HIGH" && "bg-[blue]";
        const priorityLow = todo.priority === "LOW" && "bg-[green]";

        return (
            <>
                <div className="p-3 w-full rounded-lg mb-8">
                    <div className={`flex flex-col  ${todoState === "open" ? "" : ""}`}>
                        <button
                            type="button"
                            onClick={setTodoExpanded}
                            className="pl-3 text-xl text-left text-slate-200 font-nunito w-full relative">
                            {todo.title}
                            {todoState === "closed" && <AiOutlinePlus className='text-white absolute top-1 right-2' />}
                            {todoState === "open" && <AiOutlineMinus className='text-white absolute top-1 right-2' />}
                        </button>

                        <div className={`mt-5  rounded-lg bg-[#00000037] ${todoState === "open" ? "block" : "hidden"}`} >
                            <div className={`${priorityCritical || priorityHigh || priorityMedium || priorityLow} h-2 w-full rounded-t-full`} />
                            <div className="p-3">
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <h2 className='text-xl text-slate-200'>{todo.title}</h2>
                                        <span className="text-slate-200">Category: {todo.category}</span>
                                    </div>
                                    <BsGear className='text-slate-200 text-xl cursor-pointer' />
                                </div>
                                {todo?.note && <p className='text-slate-200 py-2 mt-5'>{todo?.note}</p>}
                                <div className='flex items-center gap-x-2'>
                                    {/* {<span className={`${priorityCritical || priorityHigh || priorityMedium || priorityLow} p-2 rounded-lg`}>{todo.priority}</span>} */}
                                    {/* {todo.priority === "LOW" && <span className={`${todo.priority === "LOW" ? "bg-[green] rounded-lg p-2" : ""}`}>{todo.priority}</span>} */}
                                    {/* <span className="rounded-lg p-2 border text-slate-200">{todo.category}</span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

export default TodoItem