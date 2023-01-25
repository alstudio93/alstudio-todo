import { type NextPage } from "next";
import Head from "next/head";
import { BsPlusLg } from "react-icons/bs"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { MdOutlineCancel } from "react-icons/md"

import { api } from "../utils/api";
import TodoItem from "../components/TodoItem";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen bg-slate-800 flex flex-col items-center justify-center">
        <h1 className="mt-8 text-slate-100 tracking-wide font-quicksand text-3xl">TODO Application</h1>

        <div className="flex max-w-7xl w-full gap-x-10">
          {/* Create Column */}
          <div className="flex-1 h-[600px]  shadow-xl rounded-lg mt-10 py-10 flex flex-col items-center overflow-y-auto ">
            <div className="flex flex-col items-center">
              <h2 className="text-slate-100 text-center text-xl">Create TODO</h2>
              {/* <button className="mt-5"><BsPlusLg className=" text-slate-100" fontSize="20" /></button> */}

              <div className="flex flex-col gap-x-20 items-center">
                <div className="flex flex-col gap-y-3 mt-10 font-nunito font-semibold w-full items-center">
                  <label className="text-slate-200 font-normal text-xl">Priority</label>
                  <div className="flex  gap-x-3">
                    <button className=" min-w-[60px] rounded-lg bg-[red] p-2">Critical</button>
                    <button className="min-w-[60px] rounded-lg bg-[#cb820d] p-2">High</button>
                    <button className="min-w-[60px] rounded-lg bg-[#5a89cf] p-2">Medium</button>
                    <button className="min-w-[60px] rounded-lg bg-[#4eca38] p-2">Low</button>
                  </div>
                </div>

                <div className="flex flex-col w-full items-center gap-y-3 mt-10 font-nunito">
                  <label className="text-slate-200 font-normal text-xl">Category</label>
                  <div className="flex  gap-x-3">
                    <button className=" min-w-[60px] rounded-lg border p-2 text-slate-200">Work</button>
                    <button className="min-w-[60px] rounded-lg border p-2 text-slate-200">Personal</button>
                    <button className="min-w-[60px] rounded-lg border p-2 text-slate-200">Errands</button>
                    <button className="min-w-[60px] rounded-lg border p-2 text-slate-200">Groceries</button>
                  </div>
                </div>
              </div>
            </div>
            <form className="grid grid-cols-2 gap-x-8 gap-y-8 justify-items-center mt-10">
              <fieldset className="flex flex-col gap-y-1">
                <label className="text-slate-200 text-xl" htmlFor="title">Title</label>
                <input id="title" type="text" className="border-b-2 bg-transparent w-[300px] focus:border-b-2 focus:outline-none text-white p-2" />
              </fieldset>


              <fieldset className="flex flex-col gap-y-1">
                <label className="text-slate-200 text-xl" htmlFor="dueDate">Due Date</label>
                <input id="dueDate" type="date" className="border-b-2 bg-transparent w-[300px] focus:border-b-2 focus:outline-none text-white py-2" />
              </fieldset>

              <fieldset className="flex flex-col gap-y-1 col-span-2 w-full ">
                <label className="text-slate-200 text-xl" htmlFor="optionalNote">Optional Note</label>
                <textarea id="optionalNote" className="border bg-transparent text-white p-2 rounded-lg " />
              </fieldset>
              <button className="border w-full p-2 text-slate-200 rounded-lg col-span-2" >Create Your TODO</button>
            </form>

          </div>

          {/* Get Tasks Column */}
          <div className="h-[600px] w-[500px]  shadow-xl rounded-lg mt-10 pt-10 px-5 flex flex-col items-center overflow-y-auto">
            <h2 className="text-slate-100 text-center text-2xl">Update TODO</h2>
            <select className="bg-slate-300 p-2 cursor-pointer mt-5 rounded-lg mb-6">
              <option>Sort by A - Z</option>
              <option>Sort by Z - A</option>
              <option>Sort by Created Asc</option>
              <option>Sort by Created Desc</option>
            </select>
            <TodoItem />
            <TodoItem />
            <TodoItem />
            <TodoItem />
            <TodoItem />
            <TodoItem />

          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
