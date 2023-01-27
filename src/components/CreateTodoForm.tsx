import { CreateTodoSchema } from '../server/api/routers/todo';
import { useForm } from "react-hook-form";



const CreateTodoForm: React.FC<{
    createTodoHandler: any;
}> = ({
    createTodoHandler
}) => {
        const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateTodoSchema>();
        return (
            <form onSubmit={handleSubmit(createTodoHandler)} className="grid grid-cols-2 gap-x-8 gap-y-8 justify-items-center mt-10">

                <fieldset className="flex flex-col gap-y-1">
                    <label className="text-slate-200 text-xl" htmlFor="title">Title</label>
                    <input {...register("title")} id="title" type="text" className="border-b-2 bg-transparent w-[300px] focus:border-b-2 focus:outline-none text-white p-2" />
                </fieldset>

                <fieldset className="flex flex-col gap-y-1">
                    <label className="text-slate-200 text-xl" htmlFor="dueDate">Due Date</label>
                    <input {...register("dueDate")} id="dueDate" type="date" className="border-b-2 bg-transparent w-[300px] focus:border-b-2 focus:outline-none text-white py-2" />
                </fieldset>

                <fieldset className="flex flex-col gap-y-1 col-span-2 w-full ">
                    <label className="text-slate-200 text-xl" htmlFor="optionalNote">Optional Note</label>
                    <textarea {...register("note")} id="optionalNote" className="border bg-transparent text-white p-2 rounded-lg " />
                </fieldset>

                <button type="submit" className="border w-full p-2 text-slate-200 rounded-lg col-span-2" >Create Your TODO</button>

            </form>
        )
    }

export default CreateTodoForm
