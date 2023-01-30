import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";
import TodoItem from "../components/TodoItem";
import { useForm, SubmitHandler } from "react-hook-form";
import { CreateTodoSchema, TodoSchema } from "../server/api/routers/todo";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CreateTodoForm from "../components/CreateTodoForm";
import { BiHelpCircle, MdOutlineClose } from "../utils/icons"
import Layout from "../components/Layout";

const Home: NextPage = () => {

  const client = api.useContext();

  // Fetch TODO's from backend
  const { data: todo } = api.todo?.getTodos.useQuery();

  const [priority, setPriority] = useState<"Critical" | "High" | "Medium" | "Low">("Critical");
  const [category, setCategory] = useState<"Work" | "Personal" | "Errands" | "Groceries">("Work");

  // React-Hook-Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTodoSchema>();

  // API Call to create a new TODO
  const { mutate: createTodo } = api.todo.createTodo.useMutation({
    onSuccess: async () => {
      await client.todo.getTodos.invalidate();
      reset();
      setPriority("Critical")
      setCategory("Work")
    }
  });

  const [helpMenu, setHelpMenu] = useState("closed");

  // Collapse All 
  const [collapseAll, setCollapseAll] = useState(false);

  // Store the todo fetched from api and store it in todoData
  const [todoData, setTodoData] = useState<TodoSchema[]>(todo);

  // store the form option value in the sortState
  const [sortState, setSortState] = useState<string>("");

  // store the search input value in the searchQuery
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Set the default currentPage for the pagination to 1
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Control the number of results per page
  const resultsPerPage = 5;

  // Set the default total number of pages
  const [totalPages, setTotalPages] = useState<number>(0)

  const [noResults, setNoResults] = useState<boolean>(false);

  const [startingBulkDelete, setStartingBulkDelete] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<string[]>([]);
  const [bulkDeleteOptions, setBulkDeleteOptions] = useState<boolean>(false)

  const { mutate: deleteManyTodos } = api.todo.deleteManyTodos.useMutation({
    onSuccess: async () => {
      await client.todo.getTodos.invalidate();
      setToBeDeleted([])
      setStartingBulkDelete(false);
      setBulkDeleteOptions(false);
    },
    onError: (e) => console.log(e.message)
  });

  const handleDeleteManyTodos = () => {
    deleteManyTodos({ ids: toBeDeleted })
  }

  // Submit Handler Function that takes in data from react-hook-form and passes the data to the tRPC createTodo({}) function.
  const createTodoHandler: SubmitHandler<CreateTodoSchema> = (data) => {
    createTodo({ ...data, priority, category })
  }

  useEffect(() => {
    // Fetch the data and search / sort

    // First check to see if a todo exists and if so, execute logic
    if (todo) {

      // filter through the todo and store matching data in the filteredData variable 
      let filteredData = todo?.filter(todo => {
        return todo.title.toLowerCase().includes(searchQuery.toLowerCase())
          || todo.category.toLowerCase().includes(searchQuery.toLowerCase())
          || todo.priority.toLowerCase().includes(searchQuery.toLowerCase())
      });

      const priorityMap = {
        "Critical": 1,
        "High": 2,
        "Medium": 3,
        "Low": 4
      };

      // sort the filtered data
      if (sortState === "Title A-Z") {
        filteredData = filteredData.sort((a, b) => a.title.localeCompare(b.title));
      }

      else if (sortState === "Title Z-A") {
        filteredData = filteredData.sort((a, b) => b.title.localeCompare(a.title));
      }

      else if (sortState === "Priority High") {
        filteredData = filteredData.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority])
      }

      else if (sortState === "Priority Low") {
        filteredData = filteredData.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
      }

      else if (sortState === "Created Asc") {
        filteredData = filteredData.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }

      else if (sortState === "Created Desc") {
        filteredData = filteredData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      else if (sortState === "Completed") {
        filteredData = filteredData.sort((a, b) => {
          if (a.completed === b.completed) {
            return 0;
          }
          else if (a.completed === true) {
            return -1;
          }
          else {
            return 1;
          }
        });
      }

      if (filteredData.length === 0) {

        // A couple of options here. 
        // You can set noResults to true and hide the pagination.
        // You can set the current and total pages to 1 so that the user reads 1 of 1.
        // You can do both so that even though the user cannot see the pagination if there no results, but the logic is still sound.

        setNoResults(true)
        // setCurrentPage(1);
        // setTotalPages(1);
      }
      else {
        // If there are results, then set noResults back to false.
        setNoResults(false)

        // Divide the results by 5, round up to the nearest whole number, and store the result in the variable.
        const totalPages = Math.ceil(filteredData.length / resultsPerPage);

        // update the totalPages state
        setTotalPages(totalPages);

        // Check if current page is greater than total pages
        // We use this check for when we are on, say, page 5, but the results only occupy page 1. Therefore, we are taken back to page one rather than seeing empty pages.
        if (currentPage > totalPages) {
          setCurrentPage(1);
        }
      }

      const data = filteredData.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

      // if (sortState === "Title A-Z") {
      //   data = data.sort((a, b) => a.title.localeCompare(b.title));
      // }

      // else if (sortState === "Title Z-A") {
      //   data = data.sort((a, b) => b.title.localeCompare(a.title));
      // }

      // else if (sortState === "Priority High") {
      //   data = data.sort((a, b) => a.priority.localeCompare(b.priority))
      // }

      // else if (sortState === "Priority Low") {
      //   data = data.sort((a, b) => b.priority.localeCompare(a.priority))
      // }

      // else if (sortState === "Created Asc") {
      //   data = data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      // }

      // else if (sortState === "Created Desc") {
      //   data = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      // }

      // else if (sortState === "Completed") {
      //   data = data.sort((a, b) => {
      //     if (a.completed === b.completed) {
      //       return 0;
      //     }
      //     else if (a.completed === true) {
      //       return -1;
      //     }
      //     else {
      //       return 1;
      //     }
      //   });
      // }

      setTodoData(data);
    }
  }, [todo, currentPage, sortState, searchQuery,]);



  useEffect(() => {
    JSON.parse(window.localStorage.getItem("to-be-deleted") || '[]')
  }, [toBeDeleted])


  useEffect(() => {
    window.localStorage.setItem("to-be-deleted", JSON.stringify(toBeDeleted));
    window.localStorage.setItem("bulk-delete-is-active", JSON.stringify(startingBulkDelete));
    window.localStorage.setItem("bulk-delete-options", JSON.stringify(bulkDeleteOptions));


  }, [toBeDeleted, startingBulkDelete, bulkDeleteOptions])

  return (
    <Layout>
      <Head>
        <title>ALStudio TODO</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex flex-col items-center pb-10">
        <h1 className="mt-8 text-slate-100 tracking-wide font-quicksand text-3xl">TODO Application</h1>

        <div className="flex flex-col items-center lg:flex-row lg:items-start max-w-7xl w-full gap-x-10">

          {/* Create TASK Column */}
          <div className="md:flex-1 w-full overflow-x-hidden shadow-xl rounded-lg mt-10 p-10 flex flex-col items-center overflow-y-auto font-quicksand max-h-[683px]">
            <div className="flex flex-col items-center">

              <h2 className="text-slate-100 text-center text-xl">Create TODO</h2>

              <div className="flex flex-col gap-x-20 items-center col-span-2">

                <div className="flex flex-col gap-y-3 mt-10 w-full items-center">

                  <label className="text-slate-200 font-normal text-xl">Priority: {priority}</label>

                  <div className="flex  gap-x-3">
                    <button type="button" onClick={() => setPriority("Critical")} className={` font-bold text-[14px] md:text-base min-w-[60px] rounded-lg  p-2 relative ${priority === "Critical" ? "bg-[#ff0000a7] text-slate-200 before:bg-[#ff0000a7]  before:absolute before:h-1 before:w-full before:-bottom-3 before:left-0 before:rounded-lg" : "bg-[#00000038] text-white"}`} >Critical</button>
                    <button type="button" onClick={() => setPriority("High")} className={`font-bold text-[14px] md:text-base min-w-[60px] rounded-lg  p-2 relative ${priority === "High" ? "bg-[#ffa600ad] text-slate-200 before:bg-[#ffa600ad]  before:absolute before:h-1 before:w-full before:-bottom-3 before:left-0 before:rounded-lg" : "bg-[#00000038] text-white"}`}>High</button>
                    <button type="button" onClick={() => setPriority("Medium")} className={`font-bold text-[14px] md:text-base min-w-[60px] rounded-lg   p-2 relative ${priority === "Medium" ? "bg-[#0051ffb1] text-slate-200 before:bg-[#0051ffb1]  before:absolute before:h-1 before:w-full before:-bottom-3 before:left-0 before:rounded-lg" : "bg-[#00000038] text-white"}`}>Medium</button>
                    <button type="button" onClick={() => setPriority("Low")} className={`font-bold text-[14px] md:text-base min-w-[60px] rounded-lg   p-2 relative ${priority === "Low" ? "bg-[#008011b1] text-slate-200 before:bg-[#008011b1]  before:absolute before:h-1 before:w-full before:-bottom-3 before:left-0 before:rounded-lg" : "bg-[#00000038] text-white"}`}>Low</button>
                  </div>
                </div>

                <div className="flex flex-col w-full items-center gap-y-3 mt-10">
                  <label className="text-slate-200 font-normal text-xl">Category: {category}</label>
                  <div className="flex  gap-x-3">
                    <button type="button" onClick={() => setCategory("Work")} className={`min-w-[60px] text-[14px] md:text-base rounded-lg border p-2 text-slate-200 relative ${category === "Work" && "before:bg-slate-200 before:absolute before:h-1 before:w-full before:-bottom-3 before:left-0 before:rounded-lg"}`}>Work</button>
                    <button type="button" onClick={() => setCategory("Personal")} className={`min-w-[60px] text-[14px] md:text-base rounded-lg border p-2 text-slate-200  relative ${category === "Personal" && "before:bg-slate-200 before:absolute before:h-1 before:w-full before:-bottom-3 before:left-0 before:rounded-lg"}`}>Personal</button>
                    <button type="button" onClick={() => setCategory("Errands")} className={`min-w-[60px] text-[14px] md:text-base rounded-lg border p-2 text-slate-200 relative ${category === "Errands" && "before:bg-slate-200 before:absolute before:h-1 before:w-full before:-bottom-3 before:left-0 before:rounded-lg"}`}>Errands</button>
                    <button type="button" onClick={() => setCategory("Groceries")} className={`min-w-[60px] text-[14px] md:text-base rounded-lg border p-2 text-slate-200 relative ${category === "Groceries" && "before:bg-slate-200 before:absolute before:h-1 before:w-full before:-bottom-3 before:left-0 before:rounded-lg"}`}>Groceries</button>
                  </div>
                </div>
              </div>

            </div>
            {/* After Refactor */}
            {/* <CreateTodoForm
              createTodoHandler={createTodoHandler}
            /> */}

            {/* Before Refactor */}
            <form onSubmit={handleSubmit(createTodoHandler)} className="flex flex-col items-center md:grid md:grid-cols-2 gap-x-8 gap-y-8 justify-items-center mt-10">

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

              <button type="submit" className="border w-full p-2 text-slate-200 rounded-lg col-span-2"  >Create Your TODO</button>

            </form>
          </div>

          {/* Get Tasks Column */}

          <div className=" max-w-[500px] w-[98%] shadow-xl rounded-lg mt-10 py-10 px-5 flex flex-col items-center justify-between relative ">
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
                  <li>Sort by Title, Priority, Date of Creation, and Completion</li>
                  <li>Bulk Delete</li>
                </ul>
              </div>
            </div>}
            <div className="flex flex-col items-center justify-between w-full">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-slate-100 w-full text-left text-2xl font-quicksand">My TODO&apos;s</h2>
                <button type="button" onClick={() => setHelpMenu("open")} > <BiHelpCircle className="text-slate-200 text-2xl" /></button>
              </div>
              <div className="flex flex-col pt-8 md:flex-row items-center justify-between w-full">
                <input placeholder='Start typing...' onChange={(e) => setSearchQuery(e.target.value)} type="search" className='p-2 rounded-lg w-full md:w-auto  font-nunito focus:p-2 focus:pl-2 shadow-lg' />
                <select className="bg-slate-300 w-full md:w-auto p-2 cursor-pointer mt-5 rounded-lg mb-6" onChange={(e) => setSortState(e.target.value)}>
                  <option value="default">Default</option>
                  <option>Title A-Z</option>
                  <option>Title Z-A</option>
                  <option>Priority High</option>
                  <option>Priority Low</option>
                  <option>Created Asc</option>
                  <option>Created Desc</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col h-full w-full py-5 relative">

              <div className="flex gap-x-3 items-center justify-between pb-5">
                <p className="text-slate-200"> {todo?.length} Todo Items</p>
                <div className="flex flex-col md:flex-row gap-y-2  gap-x-2 items-center w-fit  md:w-[250px]">
                  <button onClick={() => setCollapseAll(true)} className="bg-slate-200 text-[#18202F] w-full border rounded-lg p-2">Collapse All</button>
                  {<button onClick={() => { setCollapseAll(true); setStartingBulkDelete(!startingBulkDelete); setToBeDeleted([]); setBulkDeleteOptions(false) }} className="text-slate-200 border rounded-lg p-2 w-full" >{startingBulkDelete ? "Cancel Delete" : "Bulk Delete"}</button>}
                </div>

              </div>
              {todoData?.length === 0 ? <p className="text-slate-200">No Results Found...</p> :
                todoData?.map((todo) => {
                  return (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      collapseAll={collapseAll}
                      setCollapseAll={setCollapseAll}
                      startingBulkDelete={startingBulkDelete}
                      setToBeDeleted={setToBeDeleted}
                      toBeDeleted={toBeDeleted}
                    />
                  )
                })
              }
              {toBeDeleted.length > 0 && <button className="text-white  bg-[#811d1d] p-2 rounded-lg w-[200px] mx-auto" onClick={() => setBulkDeleteOptions(true)}>Delete {toBeDeleted.length} Tasks</button>}
              {bulkDeleteOptions && (
                <div className="text-slate-200 w-full pt-12">
                  <span className="text-center block ">Are you sure you want to delete {toBeDeleted.length} tasks?</span>
                  <div className="flex items-center gap-x-3 justify-center pt-5 pb-10">
                    <button className="bg-slate-200 text-[#18202F] border rounded-lg w-[100px] p-1" onClick={handleDeleteManyTodos}>Yes</button>
                    <button className="text-slate-200 border rounded-lg w-[100px] p-1" onClick={() => { setBulkDeleteOptions(false); setToBeDeleted([]); setStartingBulkDelete(false); }}>No</button>
                  </div>
                </div>
              )}
            </div>
            {noResults ? null : <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />}
          </div>
        </div>
      </main>
      <footer className={`py-3  w-full `}>
        <small className="text-slate-200 text-base text-center block">&copy; ALStudio {new Date().getFullYear()}</small>
      </footer>
    </Layout>
  );
};

export default Home;
