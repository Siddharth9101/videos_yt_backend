import { ZodError } from "zod";
import { ApiError } from "./ApiError.js";

export const zodHandler = (schema, body) => {
  try {
    schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      let errArr = [];
      error.issues.forEach((issue) => {
        errArr.push(issue.message);
      });
      console.log(errArr);
      throw new ApiError(400, errArr.join(", "));
    } else {
      throw new ApiError(400, "Some unexpected error happened");
    }
  }
};
