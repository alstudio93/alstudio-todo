import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";


export const todoSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    dueDate: z.string().nullable(),
    note: z.string().nullable(),
    priority: z.enum(["Critical", "High", "Medium", "Low"]),
    category: z.enum(["Work", "Personal", "Errands", "Groceries"]),
})


export type CreateTodoSchema = z.TypeOf<typeof todoSchema>

export const editTodoSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    dueDate: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
    priority: z.enum(["Critical", "High", "Medium", "Low"]).optional(),
    category: z.enum(["Work", "Personal", "Errands", "Groceries"]).optional(),
    completed: z.boolean(),
})


export type EditTodoSchema = z.TypeOf<typeof editTodoSchema>

export const todoRouter = createTRPCRouter({
    getTodos: publicProcedure.query(async ({ ctx }) => {
        try {
            const todos = await ctx.prisma.todo.findMany();
            return todos;
        } catch (error) {
            console.error(error);
        }
    }),

    createTodo: publicProcedure
        .input(todoSchema)
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
            const todo = await ctx.prisma.todo.delete({
                where: {
                    id: input.id
                }
            })
        })

});
