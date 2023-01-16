import {number, object, string, TypeOf} from 'zod'

export const createStudentSchema = object({
    body: object({
        courseID: number({
          required_error: "Course is required",
        }),
        year: number({
          required_error: "Course Year is required",
        }),
        erasmus: number({
          required_error: "Erasmus is required",
        }),
    }),
})

export const classStudentSchema = object({
  body: object({
      classID: number({
        required_error: "Class ID is required",
      }),
  }),
})

export type CreateStudentInput = TypeOf<typeof createStudentSchema>['body'];

export type ClassStudentInput = TypeOf<typeof classStudentSchema>['body'];
