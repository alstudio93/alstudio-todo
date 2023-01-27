import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";
import TodoItem from "../components/TodoItem";
import { SubmitHandler } from "react-hook-form";
import { CreateTodoSchema } from "../server/api/routers/todo";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CreateTodoForm from "../components/CreateTodoForm";
import { BiHelpCircle, MdOutlineClose } from "../utils/icons"

// TODO -- Maybe create export as JSON / CSV file?


const Home: NextPage = () => {

  const client = api.useContext();
  const { data: todo } = api.todo?.getTodos.useQuery();

  const [helpMenu, setHelpMenu] = useState("closed");

  const [todoData, setTodoData] = useState(todo);
  const [sortState, setSortState] = useState<string>("");


  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const resultsPerPage = 5;
  const totalPages = Math.ceil(todo?.length / resultsPerPage);

  const [priority, setPriority] = useState<"Critical" | "High" | "Medium" | "Low">("Critical");
  const [category, setCategory] = useState<"Work" | "Personal" | "Errands" | "Groceries">("Work");

  const { mutate: createTodo } = api.todo.createTodo.useMutation({
    onSuccess: async () => {
      await client.todo.getTodos.invalidate();
    }
  });

  const createTodoHandler: SubmitHandler<CreateTodoSchema> = (data) => {
    createTodo({ ...data, priority, category })
  }

  // Archive (soft delete)

  useEffect(() => {
    // Fetch the data and search / sort
    if (todo) {
      const filteredData = todo?.filter(todo => {
        return todo.title.toLowerCase().includes(searchQuery.toLowerCase())
          || todo.category.toLowerCase().includes(searchQuery.toLowerCase())
          || todo.priority.toLowerCase().includes(searchQuery.toLowerCase())
      });
      let data = filteredData.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

      if (sortState === "Title A-Z") {
        data = data.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortState === "Title Z-A") {
        data = data.sort((a, b) => b.title.localeCompare(a.title));
      } else if (sortState === "Priority High") {
        data = data.sort((a, b) => a.priority.localeCompare(b.priority))
      }
      else if (sortState === "Priority Low") {
        data = data.sort((a, b) => b.priority.localeCompare(a.priority))
      }
      setTodoData(data);
    }
  }, [todo, currentPage, sortState, searchQuery]);

  return (
    <div className="bg-slate-800">
      <Head>
        <title>ALStudio TODO</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex flex-col items-center justify-center pb-10">
        <h1 className="mt-8 text-slate-100 tracking-wide font-quicksand text-3xl">TODO Application</h1>

        <div className="flex max-w-7xl w-full gap-x-10">

          {/* Create TASK Column */}
          <div className="flex-1   shadow-xl rounded-lg mt-10 py-10 flex flex-col items-center overflow-y-auto font-quicksand max-h-[683px]">
            <div className="flex flex-col items-center">

              <h2 className="text-slate-100 text-center text-xl">Create TODO</h2>

              <div className="flex flex-col gap-x-20 items-center col-span-2">

                <div className="flex flex-col gap-y-3 mt-10 w-full items-center">

                  <label className="text-slate-200 font-normal text-xl">Priority: {priority}</label>

                  <div className="flex  gap-x-3">
                    <button type="button" onClick={() => setPriority("Critical")} className=" font-bold  min-w-[60px] rounded-lg bg-[red] p-2">Critical</button>
                    <button type="button" onClick={() => setPriority("High")} className="font-bold  min-w-[60px] rounded-lg bg-[orange] p-2">High</button>
                    <button type="button" onClick={() => setPriority("Medium")} className="font-bold  min-w-[60px] rounded-lg bg-[blue] p-2">Medium</button>
                    <button type="button" onClick={() => setPriority("Low")} className="font-bold  min-w-[60px] rounded-lg bg-[green] p-2">Low</button>
                  </div>
                </div>

                <div className="flex flex-col w-full items-center gap-y-3 mt-10">
                  <label className="text-slate-200 font-normal text-xl">Category: {category}</label>
                  <div className="flex  gap-x-3">
                    <button type="button" onClick={() => setCategory("Work")} className=" min-w-[60px] rounded-lg border p-2 text-slate-200">Work</button>
                    <button type="button" onClick={() => setCategory("Personal")} className="min-w-[60px] rounded-lg border p-2 text-slate-200">Personal</button>
                    <button type="button" onClick={() => setCategory("Errands")} className="min-w-[60px] rounded-lg border p-2 text-slate-200">Errands</button>
                    <button type="button" onClick={() => setCategory("Groceries")} className="min-w-[60px] rounded-lg border p-2 text-slate-200">Groceries</button>
                  </div>
                </div>
              </div>

            </div>
            {/* After Refactor */}
            {/* <CreateTodoForm
              createTodoHandler={createTodoHandler}
            /> */}

            {/* Before Refactor */}
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
          </div>

          {/* Get Tasks Column */}

          <div className=" w-[500px]  shadow-xl rounded-lg mt-10 py-10 px-5 flex flex-col items-center justify-between relative ">
            {helpMenu === "open" && <div className="absolute top-0 right-0 bottom-0 left-0 bg-[#18202F] z-20 p-5 rounded-lg text-slate-200">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-2xl font-quicksand">What&apos;s Included?</h2>
                <button type="button" onClick={() => setHelpMenu("closed")}><MdOutlineClose className="text-slate-200 text-2xl" /></button>
              </div>
              <div className="mt-5">
                <h3 className="text-lg">This TODO App includes the following features:</h3>
                <ul className="flex flex-col gap-y-5 list-disc px-5  py-5">
                  <li>Speed up your TODO creation with duplication!</li>
                  <li>Archive Your TODO item. This will help with clutter, and if you want to restore it back to your main list, you can also do that!</li>
                  <li>Search by any property that is attached to your card (title, category, priority, etc...)</li>
                  <li>Efficient Sorting</li>
                </ul>
              </div>
            </div>}
            <div className="flex flex-col items-center justify-between w-full">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-slate-100 w-full text-left text-2xl font-quicksand">My TODO&apos;s</h2>
                <button type="button" onClick={() => setHelpMenu("open")} > <BiHelpCircle className="text-slate-200 text-2xl" /></button>
              </div>
              <div className="flex items-center justify-between w-full">
                <input placeholder='' onChange={(e) => setSearchQuery(e.target.value)} type="search" className='p-2 rounded-lg  font-nunito focus:p-2 focus:pl-2 shadow-lg' />
                <select className="bg-slate-300 p-2 cursor-pointer mt-5 rounded-lg mb-6" onChange={(e) => setSortState(e.target.value)}>
                  <option value="default">Sort By</option>
                  <option>Title A-Z</option>
                  <option>Title Z-A</option>
                  <option>Priority High</option>
                  <option>Priority Low</option>
                  {/* <option>Created Asc</option>
                <option>Created Desc</option> */}
                </select>
              </div>
            </div>

            <div className="flex flex-col h-full w-full pt-5">
              {
                todoData?.map((todo) => {
                  return (
                    <TodoItem key={todo.id} todo={todo} />
                  )
                })
              }
            </div>
            {<Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />}
          </div>
        </div>
      </main>
      <footer className={`py-3  w-full `}>
        <small className="text-slate-200 text-base text-center block">&copy; ALStudio {new Date().getFullYear()}</small>
      </footer>
    </div>
  );
};

export default Home;
