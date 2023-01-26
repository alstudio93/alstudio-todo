import React, { useState, useRef, useEffect } from 'react'
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"
import { BsSave2 } from "react-icons/bs"
import { CiEdit } from "react-icons/ci"
import { CreateTodoSchema } from '../server/api/routers/todo';
import { api } from "../utils/api";
import { useForm } from "react-hook-form"


const TodoItem: React.FC<{
    todo: CreateTodoSchema;
}> = ({
    todo
}) => {
        const client = api.useContext();
        const [todoState, setTodoState] = useState("closed");
        const [elementToEdit, setElementToEdit] = useState("no-edit");
        const [editElement, setEditElement] = useState("");
        const [showSave, setShowSave] = useState(false);

        const updatedTitle = useRef(todo?.title);

        const titleRef = useRef(null);
        const noteRef = useRef(null);

        const setTodoExpanded = () => {
            if (todoState === "closed") {
                setTodoState("open")
            }
            if (todoState === "open") {
                setTodoState("closed")
            }
        }

        useEffect(() => {
            if (elementToEdit === "h2") {
                titleRef.current?.focus();
            } else if (elementToEdit === "p") {
                noteRef.current?.focus();

            }
        }, [elementToEdit]);

        const priorityCritical = todo.priority === "CRITICAL" && "bg-[red]";
        const priorityHigh = todo.priority === "HIGH" && "bg-[orange]";
        const priorityMedium = todo.priority === "MEDIUM" && "bg-[blue]";
        const priorityLow = todo.priority === "LOW" && "bg-[green]";

        const { mutate: updateTodo } = api.todo.updateTodo.useMutation({
            onSuccess: async () => {
                await client.todo.getTodos.invalidate();
            }
        });

        const handleUpdateTodo = () => {
            const updatedTitle = titleRef.current?.textContent;

            updateTodo()
        }

        const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateTodoSchema>();
        useEffect(() => {
            setValue("title", todo.title);
        }, [todo.title, setValue]);

        // useEffect(() => {
        //     if (todo?.title !== updatedTitle.current) {
        //         // handleUpdateTodo();
        //         setShowSave(true);
        //     }
        // }, [todo?.title, updatedTitle])


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
                            <div className="p-3 relative">
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <div className="text-white text-xl flex gap-x-2 items-center pr-3" onMouseOver={() => setEditElement("h2")} onMouseLeave={() => setEditElement("")}>
                                            {/* <h2
                                                className='text-xl text-slate-200'
                                                tabIndex={0}
                                                onFocus={() => setEditElement("h2")}
                                                contentEditable={elementToEdit === "h2" ? "true" : "false"}
                                                ref={titleRef}>
                                                {todo.title}
                                            </h2> */}
                                            <h2
                                                className={`text-xl text-slate-200 ${elementToEdit === "h2" ? "hidden" : "block"}`}
                                                tabIndex={0}
                                                // onFocus={() => setEditElement("h2")}
                                                ref={titleRef}>
                                                {todo.title}
                                            </h2>

                                            {elementToEdit === "h2" && <input
                                                defaultValue={todo?.title}
                                                name="title"
                                                {...register("title")}
                                                className=' pr-10 text-lg text-slate-200 bg-transparent'
                                                readOnly={elementToEdit !== "h2"}
                                            />}
                                            {editElement === "h2" && <button type="button" onClick={() => setElementToEdit("h2")}><CiEdit className="cursor-pointer" /></button>}
                                            {todo?.title !== updatedTitle.current && <BsSave2 />}
                                        </div>
                                        <span className="text-slate-200">Category: {todo.category}</span>
                                    </div>
                                    <fieldset className="flex gap-x-2 items-center text-white p-2">
                                        <input type="checkbox" className="h-4 w-4 cursor-pointer" />
                                    </fieldset>
                                </div>
                                <div>
                                    {
                                        todo?.note &&
                                        <div className="flex items-center pr-6 w-full" onMouseOver={() => setEditElement("p")} onMouseLeave={() => setEditElement("")}>
                                            {/* <p tabIndex={0} onFocus={() => setEditElement("p")} className='text-slate-200 py-2 pr-3 mt-5' contentEditable={elementToEdit === "p" ? "true" : "false"} ref={noteRef}>{todo?.note}</p> */}
                                            <p tabIndex={0} onFocus={() => setEditElement("p")} className={`text-slate-200 py-2 pr-3 mt-5 ${elementToEdit === "p" ? "hidden" : "block"}`} ref={noteRef}>{todo?.note}</p>

                                            {elementToEdit === "p" && <textarea tabIndex={0} onFocus={() => setEditElement("p")} className='bg-transparent text-slate-200 py-2 pr-3 mt-5 w-[350px]' contentEditable={elementToEdit === "p" ? "true" : "false"} ref={noteRef}>{todo?.note}</textarea>}
                                            {editElement === "p" && <button type="button" onClick={() => setElementToEdit("p")}><CiEdit className="cursor-pointer text-2xl text-slate-200 " /></button>}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

export default TodoItem