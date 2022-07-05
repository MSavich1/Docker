import { REQUIRED } from "../constants";

export const validateComments = (value) => {
    let error;
    if (!value) {
      error = REQUIRED;
    }
    return error;
  };