import React, { useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../utils/api';
import TodoItem from '../components/TodoItem';
import Pagination from '../components/Pagination';

const Archive = () => {
    const { data: archivedTodos } = api.todo?.getArchivedTodos.useQuery();

    // Collapse All 
    const [collapseAll, setCollapseAll] = useState(false);

    // Set the default currentPage for the pagination to 1
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Control the number of results per page
    const resultsPerPage = 5;
    const totalPages = Math.ceil(archivedTodos?.length / resultsPerPage);

    const data = archivedTodos?.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);


    const [startingBulkDelete, setStartingBulkDelete] = useState(false);
    const [toBeDeleted, setToBeDeleted] = useState<string[]>([]);

    return (
        <Layout>
            <main className="max-w-xl mx-auto p-10 rounded-lg shadow-xl">
                <h1 className='text-slate-200 text-center text-2xl font-quicksand'>Archived Tasks</h1>
                <p className='text-slate-200 text-center text-lg font-quicksand'>Delete or Restore your Tasks</p>
                <div className="min-h-[500px] pt-10">
                    <div className="flex gap-x-3 items-center justify-between pb-5">
                        <p className="text-slate-200"> {archivedTodos?.length} Archived Tasks</p>
                        <div className="flex flex-col gap-y-2 md:flex-row gap-x-2 items-center">
                            {<button onClick={() => { setCollapseAll(true); setStartingBulkDelete(!startingBulkDelete); setToBeDeleted([]) }} className="text-slate-200 w-fit" >{startingBulkDelete ? "Cancel Delete" : "Bulk Delete"}</button>}
                            <button onClick={() => setCollapseAll(true)} className="text-slate-200 w-fit" >Collapse All</button>
                        </div>

                    </div>
                    {
                        data?.map((todo) => {
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
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </main>
        </Layout>
    )
}

export default Archive