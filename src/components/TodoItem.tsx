import React, { useState, useRef, useEffect } from 'react'
import { EditTodoSchema, TodoSchema } from '../server/api/routers/todo';
import { api } from "../utils/api";
import { useForm, SubmitHandler } from "react-hook-form"
import {
    AiOutlinePlus, AiOutlineMinus, AiOutlineDelete,
    BiArchiveIn, BsFillGearFill, CiEdit,
    HiOutlineDuplicate, MdOutlineClose, MdRestore
} from "../utils/icons"
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

const TodoItem: React.FC<{
    todo: TodoSchema;
    collapseAll?: boolean;
    setCollapseAll?: React.Dispatch<React.SetStateAction<boolean>>;
    startingBulkDelete?: boolean;
    toBeDeleted?: string[];
    setToBeDeleted?: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({
    todo,
    collapseAll,
    setCollapseAll,
    startingBulkDelete,
    setToBeDeleted,
    toBeDeleted
}) => {
        const router = useRouter();
        const date = dayjs(todo.createdAt).format("ddd, MMM D, hh:m:ssa")
        const client = api.useContext();

        const [todoOpen, setTodoOpen] = useState(false);
        const [isEditing, setIsEditing] = useState(false);

        const [archived, setArchived] = useState(todo.archived === false);

        const [showEditIconForElement, setShowEditIconForElement] = useState("");

        const [showOptions, setShowOptions] = useState(false);

        const titleRef = useRef(null);
        const noteRef = useRef(null);

        useEffect(() => {
            if (collapseAll) {
                setTodoOpen(false)
            }
        }, [collapseAll])

        const setTodoExpanded = () => {

            if (todoOpen === false) {
                setCollapseAll(false);
                setTodoOpen(true)
            }
            if (todoOpen === true) {
                setTodoOpen(false)
            }
        }

        const getBackgroundColor = (priority: string) => {
            switch (priority) {
                case "Critical":
                    return "bg-[red]";
                case "High":
                    return "bg-[orange]";
                case "Medium":
                    return "bg-[blue]";
                case "Low":
                    return "bg-[green]";
                default:
                    return "";
            }
        }

        const priorityBackgroundColor = getBackgroundColor(todo.priority);

        const handleCardPriorityColor = (priority: string) => {
            switch (priority) {
                case "Critical":
                    return "before:bg-[red]";
                case "High":
                    return "before:bg-[orange]";
                case "Medium":
                    return "before:bg-[blue]";
                case "Low":
                    return "before:bg-[green]";
                default:
                    return "";
            }
        }

        const priorityCardColor = handleCardPriorityColor(todo.priority);

        const { mutate: updateTodo } = api.todo.updateTodo.useMutation({
            onSuccess: async () => {
                await client.todo.getTodos.invalidate();
                await client.todo.getArchivedTodos.invalidate();
                setIsEditing(false)
            },
            onError: (e) => console.log(e.message)
        });

        const handleArchiveTodo = () => {
            const id = todo?.id;
            setArchived(todo.archived === true);
            updateTodo({ id, archived })
        }
        const handleUndoArchiveTodo = () => {
            const id = todo?.id;
            setArchived(todo.archived === false);
            updateTodo({ id, archived })
        }

        const handleUpdateTodo: SubmitHandler<EditTodoSchema> = (data) => {
            const id = todo?.id;
            updateTodo({ ...data, id, archived })
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


        const { register, handleSubmit, setValue, formState: { errors } } = useForm<EditTodoSchema>();
        useEffect(() => {
            setValue("title", todo.title);
            setValue("note", todo?.note);
            setValue("category", todo?.category);
        }, [todo.title, todo?.note, setValue]);


        const archivePage = router.pathname === "/archive";

        return (
            <>
                <div className={`p-3 w-full rounded-lg mb-8 relative 
                before:absolute before:h-full before:rounded-lg before:w-2 before:top-0 before:left-0 
                ${priorityCardColor} ${todoOpen === true && "before:hidden"}`}>


                    <div className={`flex flex-col`}>
                        <div className='flex gap-x-2 items-center'>
                            <button
                                type="button"
                                onClick={setTodoExpanded}
                                className={`px-3 flex justify-between items-center text-xl text-left text-slate-200 font-nunito w-full relative ${todo?.completed === true && "line-through"}`}>
                                {todo.title}
                                {todoOpen === false && <AiOutlinePlus className='text-white' />}
                                {todoOpen === true && <AiOutlineMinus className='text-white' />}
                            </button>
                            {startingBulkDelete && <input type="checkbox" className='cursor-pointer' onChange={(e) => {
                                if (e.target.checked) {
                                    setToBeDeleted([...toBeDeleted, todo.id]);
                                } else {
                                    setToBeDeleted(toBeDeleted.filter(itemId => itemId !== todo.id));
                                }
                            }} />}
                        </div>

                        <div className={` mt-5 relative rounded-lg bg-[#18202F] ${todoOpen === true ? "block" : "hidden"}`}>
                            <div className={`${priorityBackgroundColor} h-2 w-full rounded-t-full`} />
                            <button aria-flowto='settingsClose' type="button" onClick={() => setShowOptions(true)} className='absolute top-5 right-3 z-10'>
                                <BsFillGearFill
                                    className="text-white text-lg "
                                />
                            </button>
                            {showOptions && <div className="text-white absolute top-0 left-0 w-full h-full rounded-lg bg-[#18202F] z-10 flex flex-col justify-center items-center gap-y-5 p-3">
                                <button id="settingsClose" onClick={() => setShowOptions(false)} className="absolute top-2 right-3"><MdOutlineClose className=" text-white text-2xl" /></button>
                                <div className=" flex flex-col gap-y-3 w-[150px]">
                                    {!archivePage &&
                                        <>
                                            <button onClick={handleArchiveTodo} className="flex  gap-x-2 items-center justify-between w-full">Archive <BiArchiveIn /></button>
                                            <button className="flex  gap-x-2 items-center justify-between w-full" onClick={handleDuplicateTodo}>Duplicate <HiOutlineDuplicate className="text-slate-200" /></button>
                                        </>
                                    }

                                    {archivePage && <button onClick={handleUndoArchiveTodo} className="flex  gap-x-2 items-center justify-between">Undo Archive <MdRestore className=" text-white text-2xl" /></button>}

                                    <button className="flex  gap-x-2 items-center justify-between w-full" onClick={handleDeleteTodo}>Delete <AiOutlineDelete className='' /></button>
                                </div>
                            </div>
                            }

                            <form className="p-3" onSubmit={handleSubmit(handleUpdateTodo)}>
                                <div className='flex justify-between items-start relative'>
                                    <div className="flex flex-col gap-y-1">
                                        <div className="text-white text-xl flex gap-x-2 items-center pr-3" onMouseOver={() => setShowEditIconForElement("todoTitle")} onMouseLeave={() => setShowEditIconForElement("")}>
                                            <h2
                                                className={`text-xl text-slate-200 ${isEditing ? "hidden" : "block"}`}
                                                tabIndex={0}
                                                onFocus={() => setShowEditIconForElement("todoTitle")}
                                                ref={titleRef}>
                                                {todo.title}
                                            </h2>

                                            {/* TODO: Press escape to cancel editing */}
                                            {isEditing &&
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
                                                    onClick={() => setIsEditing(true)}>
                                                    <CiEdit className="cursor-pointer" />
                                                </button>
                                            }
                                        </div>

                                        <div className="flex flex-col">
                                            <div className={`flex gap-x-2`} onMouseOver={() => setShowEditIconForElement("todoPriority")} onMouseLeave={() => setShowEditIconForElement("")}>
                                                <p
                                                    tabIndex={0}
                                                    onFocus={() => setShowEditIconForElement("todoPriority")}
                                                    className={`text-slate-200 text-sm ${isEditing ? "hidden" : "block"}`}
                                                >
                                                    Priority: <span>{todo.priority}</span>
                                                </p>

                                                {/* TODO: Press escape to cancel editing */}
                                                {isEditing &&
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
                                                        onClick={() => setIsEditing(true)}>
                                                        <CiEdit className="cursor-pointer text-white" />
                                                    </button>
                                                }
                                            </div>
                                        </div>


                                        <div className="flex flex-col">
                                            <div className={`flex gap-x-2`} onMouseOver={() => setShowEditIconForElement("todoCategory")} onMouseLeave={() => setShowEditIconForElement("")}>
                                                <p
                                                    tabIndex={0}
                                                    onFocus={() => setShowEditIconForElement("todoCategory")}
                                                    className={`text-slate-200 text-sm ${isEditing ? "hidden" : "block"}`}
                                                >Category: <span>{todo.category}</span>
                                                </p>

                                                {/* TODO: Press escape to cancel editing */}
                                                {isEditing &&
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
                                                        onClick={() => setIsEditing(true)}>
                                                        <CiEdit className="cursor-pointer text-white" />
                                                    </button>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {
                                    todo?.note &&
                                    <div className="flex items-center pr-6 w-full mt-5" onMouseOver={() => setShowEditIconForElement("todoNote")} onMouseLeave={() => setShowEditIconForElement("")}>
                                        <p
                                            tabIndex={0}
                                            onFocus={() => setShowEditIconForElement("todoNote")}
                                            className={`text-slate-200 py-2 pr-3 w-[375px]  ${isEditing ? "hidden" : "block"}`}
                                            ref={noteRef}>
                                            {todo?.note}
                                        </p>
                                        {/* TODO: Press escape to cancel editing */}
                                        {isEditing &&
                                            <textarea
                                                {...register("note")}
                                                defaultValue={todo?.note}
                                                rows={4}
                                                className='bg-transparent text-slate-200 py-2 pr-3 mt-5 w-[375px]' />}
                                        {showEditIconForElement === "todoNote" && <button type="button" onClick={() => setIsEditing(true)}><CiEdit className="cursor-pointer text-2xl text-slate-200 " /></button>}
                                    </div>
                                }
                                <div className="flex items-center justify-between pt-5">
                                    <fieldset className="flex items-center gap-x-2">
                                        <label className="text-white" htmlFor="completed" >Mark as Completed</label>
                                        <input {...register("completed")} type="checkbox" defaultChecked={todo.completed === true ? true : false} className="h-4 w-4 cursor-pointer" />
                                    </fieldset>

                                    <button type="submit" className="text-sm text-white text-right">Update</button>
                                </div>
                                <small className="text-slate-200">{date}</small>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }

export default TodoItem