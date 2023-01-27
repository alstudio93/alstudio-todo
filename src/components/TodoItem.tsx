import React, { useState, useRef, useEffect } from 'react'
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"
import { CiEdit } from "react-icons/ci"
import { CreateTodoSchema, EditTodoSchema } from '../server/api/routers/todo';
import { api } from "../utils/api";
import { useForm, SubmitHandler } from "react-hook-form"
import { GrDuplicate } from "react-icons/gr"
import { BsFillGearFill } from "react-icons/bs"
import { MdOutlineClose } from "react-icons/md"


const TodoItem: React.FC<{
    todo: EditTodoSchema;
}> = ({
    todo
}) => {
        const client = api.useContext();
        const [todoState, setTodoState] = useState("closed");
        const [elementToEdit, setElementToEdit] = useState("undefined");
        const [showEditIconForElement, setShowEditIconForElement] = useState("");

        const [showOptions, setShowOptions] = useState(false);

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

        const priorityCritical = todo.priority === "Critical" && "bg-[red]";
        const priorityHigh = todo.priority === "High" && "bg-[orange]";
        const priorityMedium = todo.priority === "Medium" && "bg-[blue]";
        const priorityLow = todo.priority === "Low" && "bg-[green]";

        const { mutate: updateTodo } = api.todo.updateTodo.useMutation({
            onSuccess: async () => {
                await client.todo.getTodos.invalidate();
                setElementToEdit("")
            },
            onError: (e) => console.log(e.message)
        });

        const handleUpdateTodo: SubmitHandler<EditTodoSchema> = (data) => {
            const { title, note, category, completed } = data;
            const id = todo?.id

            updateTodo({ title, note, category, completed, id })
        }

        const { mutate: duplicateTodo } = api.todo.duplicateTodo.useMutation({
            onSuccess: async () => {
                await client.todo.getTodos.invalidate();
            },
            onError: (e) => console.log(e.message)
        });

        const handleDuplicateTodo = () => {
            const id = todo?.id
            duplicateTodo({ id })
        }


        const { mutate: deleteTodo } = api.todo.deleteTodo.useMutation({
            onSuccess: async () => {
                await client.todo.getTodos.invalidate();
            },
            onError: (e) => console.log(e.message)
        });

        const handleDeleteTodo = () => {
            const id = todo?.id
            deleteTodo({ id })
        }

        const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EditTodoSchema>();
        useEffect(() => {
            setValue("title", todo.title);
            setValue("note", todo?.note);
            setValue("category", todo?.category);
        }, [todo.title, todo?.note, setValue]);

        const todoClosedPseudoBeforeStyles = `${priorityCritical && "before:bg-[red]"} ${priorityHigh && "before:bg-[orange]"}
        ${priorityMedium && "before:bg-[blue]"} ${priorityLow && "before:bg-[green]"} ${todoState === "open" && "before:hidden"}`


        return (
            <>
                <div className={`p-3 w-full rounded-lg mb-8 relative 
                before:absolute before:h-full before:rounded-lg before:w-2 before:top-0 before:left-0 
                ${todoClosedPseudoBeforeStyles}`}>

                    <div className={`flex flex-col  ${todoState === "open" ? "" : ""}`}>
                        <button
                            type="button"
                            onClick={setTodoExpanded}
                            className={`pl-3 text-xl text-left text-slate-200 font-nunito w-full relative ${todo?.completed === true && "line-through"}`}>
                            {todo.title}
                            {todoState === "closed" && <AiOutlinePlus className='text-white absolute top-1 right-2' />}
                            {todoState === "open" && <AiOutlineMinus className='text-white absolute top-1 right-2' />}
                        </button>

                        <div className={` mt-5 relative rounded-lg bg-[#00000037] ${todoState === "open" ? "block" : "hidden"}`} >
                            <div className={`${priorityCritical || priorityHigh || priorityMedium || priorityLow} h-2 w-full rounded-t-full`} />
                            {showOptions && <div className="text-white absolute top-0 left-0 w-full h-full rounded-lg bg-black z-10 flex flex-col justify-center items-center gap-y-5 p-3">
                                <MdOutlineClose className="absolute top-2 right-3 text-white text-2xl cursor-pointer" onClick={() => setShowOptions(false)} />
                                <button>Archive</button>
                                <button onClick={handleDuplicateTodo}>Duplicate</button>
                                <button onClick={handleDeleteTodo}>Delete</button>
                            </div>}
                            <form className="p-3 relative" onSubmit={handleSubmit(handleUpdateTodo)}>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <div className="text-white text-xl flex gap-x-2 items-center pr-3" onMouseOver={() => setShowEditIconForElement("todoTitle")} onMouseLeave={() => setShowEditIconForElement("")}>
                                            <h2
                                                className={`text-xl text-slate-200 ${elementToEdit === "todoTitle" ? "hidden" : "block"}`}
                                                tabIndex={0}
                                                onFocus={() => setShowEditIconForElement("todoTitle")}
                                                ref={titleRef}>
                                                {todo.title}
                                            </h2>

                                            {/* TODO: Press escape to cancel editing */}
                                            {elementToEdit === "todoTitle" &&
                                                <input
                                                    defaultValue={todo?.title}
                                                    name="title"
                                                    {...register("title")}
                                                    className='pr-10 text-lg text-slate-200 bg-transparent'
                                                />
                                            }

                                            {showEditIconForElement === "todoTitle" &&
                                                <button
                                                    type="button"
                                                    onClick={() => setElementToEdit("todoTitle")}>
                                                    <CiEdit className="cursor-pointer" />
                                                </button>
                                            }
                                        </div>


                                        <div className="flex flex-col">
                                            <div className={`flex gap-x-2`} onMouseOver={() => setShowEditIconForElement("todoCategory")} onMouseLeave={() => setShowEditIconForElement("")}>
                                                <p
                                                    tabIndex={0}
                                                    onFocus={() => setShowEditIconForElement("todoCategory")}
                                                    className={`text-slate-200 ${elementToEdit === "todoCategory" ? "hidden" : "block"}`}
                                                >Category: <span>{todo.category}</span>
                                                </p>

                                                {/* TODO: Press escape to cancel editing */}
                                                {elementToEdit === "todoCategory" &&
                                                    <fieldset className="flex gap-x-2 items-center">
                                                        <label className='text-slate-200'>Category:</label>
                                                        <input
                                                            defaultValue={todo?.category}
                                                            name="category"
                                                            {...register("category")}
                                                            className='text-slate-200 bg-transparent w-[100px]'
                                                        />
                                                    </fieldset>
                                                }
                                                {showEditIconForElement === "todoCategory" &&
                                                    <button
                                                        type="button"
                                                        onClick={() => setElementToEdit("todoCategory")}>
                                                        <CiEdit className="cursor-pointer text-white" />
                                                    </button>
                                                }
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className={`flex gap-x-2`} onMouseOver={() => setShowEditIconForElement("todoPriority")} onMouseLeave={() => setShowEditIconForElement("")}>
                                                <p
                                                    tabIndex={0}
                                                    onFocus={() => setShowEditIconForElement("todoPriority")}
                                                    className={`text-slate-200 ${elementToEdit === "todoPriority" ? "hidden" : "block"}`}
                                                >Priority: <span>{todo.priority}</span>
                                                </p>

                                                {/* TODO: Press escape to cancel editing */}
                                                {elementToEdit === "todoPriority" &&
                                                    <fieldset className="flex gap-x-2 items-center">
                                                        <label className='text-slate-200'>Priority:</label>
                                                        <input
                                                            defaultValue={todo?.priority}
                                                            name="priority"
                                                            {...register("priority")}
                                                            className='text-slate-200 bg-transparent w-[100px]'
                                                        />
                                                    </fieldset>
                                                }
                                                {showEditIconForElement === "todoPriority" &&
                                                    <button
                                                        type="button"
                                                        onClick={() => setElementToEdit("todoPriority")}>
                                                        <CiEdit className="cursor-pointer text-white" />
                                                    </button>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                    <BsFillGearFill
                                        onClick={() => setShowOptions(true)}
                                        className="text-white text-lg cursor-pointer"
                                    />
                                </div>

                                {
                                    todo?.note &&
                                    <div className="flex items-center pr-6 w-full mt-5" onMouseOver={() => setShowEditIconForElement("todoNote")} onMouseLeave={() => setShowEditIconForElement("")}>
                                        <p
                                            tabIndex={0}
                                            onFocus={() => setShowEditIconForElement("todoNote")}
                                            className={`text-slate-200 py-2 pr-3  ${elementToEdit === "todoNote" ? "hidden" : "block"}`}
                                            ref={noteRef}>
                                            {todo?.note}
                                        </p>
                                        {/* TODO: Press escape to cancel editing */}
                                        {elementToEdit === "todoNote" &&
                                            <textarea
                                                {...register("note")}
                                                defaultValue={todo?.note}
                                                className='bg-transparent text-slate-200 py-2 pr-3 mt-5 w-[350px]' />}
                                        {showEditIconForElement === "todoNote" && <button type="button" onClick={() => setElementToEdit("todoNote")}><CiEdit className="cursor-pointer text-2xl text-slate-200 " /></button>}
                                    </div>
                                }
                                <div className="flex items-center justify-between pt-5">
                                    <fieldset className="flex items-center gap-x-2">
                                        <label className="text-white" htmlFor="completed">Mark as Completed</label>
                                        <input {...register("completed")} type="checkbox" className="h-4 w-4 cursor-pointer" />
                                    </fieldset>

                                    <button type="submit" className="text-sm text-white text-right">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }

export default TodoItem