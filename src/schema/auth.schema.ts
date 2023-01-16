import { object, string, TypeOf } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).regex(new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@(alunos.)?ipca\.pt$',),{ message: "Not a valid email"}),
    password: string({
      required_error: "Password is required",
    }).min(6, "Invalid email or password"),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"];