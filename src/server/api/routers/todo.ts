import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";


export const todoSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    dueDate: z.string().nullable(),
    note: z.string().nullable(),
    priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
    category: z.enum(["Work", "Personal", "Errands", "Groceries"]),
})


export type CreateTodoSchema = z.TypeOf<typeof todoSchema>

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
                    category: input.category
                }
            });
            return todo;
        }),

    updateTodo: publicProcedure
        .input(todoSchema)
        .mutation(({ ctx, input }) => {
            const todo = ctx.prisma.todo.update({
                where: {
                    id: input?.id,
                },
                data: {
                    dueDate: input.dueDate,
                    note: input.note,
                    priority: input.priority,
                    category: input.category
                }
            })
            return todo;
        })

});
