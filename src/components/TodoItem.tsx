import React, { useState } from 'react'
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"

const TodoItem: React.FC<{
    todo: any;
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

        console.log(todo.category)
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

                        <div className={`mt-5 p-3 rounded-lg bg-[#00000037] ${todoState === "open" ? "block" : "hidden"}`} >
                            <div className='flex justify-between items-center'>
                                <h2 className='text-xl text-slate-200'>{todo.title}</h2>
                                <div className='flex items-center gap-x-2'>
                                    <span className={`${todo.priority === "CRITICAL" ? "bg-[red] rounded-lg p-2" : ""}`}>{todo.priority}</span>
                                    <span className="rounded-lg p-2 border text-slate-200">{todo.category}</span>
                                </div>
                            </div>
                            <p className='text-slate-200 py-2 mt-5'>{todo?.note}</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

export default TodoItem