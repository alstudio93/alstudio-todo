import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const todoSchema = z.object({
    id: z.string(),
    title: z.string(),
    dueDate: z.string().nullable(),
    note: z.string().nullable(),
    priority: z.enum(["Critical", "High", "Medium", "Low"]),
    category: z.enum(["Work", "Personal", "Errands", "Groceries"]),
    archived: z.boolean(),
    completed: z.boolean(),
    createdAt: z.date(),
})
export type TodoSchema = z.TypeOf<typeof todoSchema>



export const createTodoSchema = z.object({
    title: z.string(),
    dueDate: z.string().nullable(),
    note: z.string().nullable(),
    priority: z.enum(["Critical", "High", "Medium", "Low"]),
    category: z.enum(["Work", "Personal", "Errands", "Groceries"]),
})


export type CreateTodoSchema = z.TypeOf<typeof createTodoSchema>

export const editTodoSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    dueDate: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
    priority: z.enum(["Critical", "High", "Medium", "Low"]).optional(),
    category: z.enum(["Work", "Personal", "Errands", "Groceries"]).optional(),
    archived: z.boolean(),
    completed: z.boolean().optional(),
})


export type EditTodoSchema = z.TypeOf<typeof editTodoSchema>

export const todoRouter = createTRPCRouter({
    getTodos: publicProcedure.query(async ({ ctx }) => {
        try {
            const todos = await ctx.prisma.todo.findMany({
                where: {
                    archived: false,
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            return todos;
        } catch (error) {
            console.error(error);
        }
    }),
    getArchivedTodos: publicProcedure.query(async ({ ctx }) => {
        try {
            const archivedTodos = await ctx.prisma.todo.findMany({
                where: {
                    archived: true,
                },
                orderBy: {
                    title: "asc"
                }
            });
            return archivedTodos;
        } catch (error) {
            console.error(error);
        }
    }),

    createTodo: publicProcedure
        .input(createTodoSchema)
        .mutation(({ ctx, input }) => {
            const todo = ctx.prisma.todo.create({
                data: {
                    title: input.title,
                    dueDate: input.dueDate,
                    note: input.note,
                    priority: input.priority,
                    category: input.category,
                    completed: false,
                }
            });
            return todo;
        }),

    updateTodo: publicProcedure
        .input(editTodoSchema)
        .mutation(({ ctx, input }) => {
            const todo = ctx.prisma.todo.update({
                where: {
                    id: input?.id,
                },
                data: {
                    title: input.title,
                    dueDate: input.dueDate,
                    note: input.note,
                    priority: input.priority,
                    category: input.category,
                    archived: input.archived,
                    completed: input.completed
                }
            })
            return todo;
        }),
    duplicateTodo: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const originalTodo = await ctx.prisma.todo.findUnique({
                where: {
                    id: input.id
                }
            });

            const todo = await ctx.prisma.todo.create({
                data: {
                    title: originalTodo.title,
                    dueDate: originalTodo.dueDate,
                    note: originalTodo.note,
                    priority: originalTodo.priority,
                    category: originalTodo.category,
                    completed: originalTodo.completed,
                }
            });
            return todo;
        }),
    deleteTodo: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.todo.delete({
                where: {
                    id: input.id
                }
            })
        }),
    deleteManyTodos: publicProcedure
        .input(z.object({ ids: z.array(z.string()) }))
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.todo.deleteMany({
                where: {
                    id: {
                        in: input.ids
                    }
                }
            });
        })

});
