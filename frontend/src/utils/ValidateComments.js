export const validateComments = (value) => {
    let error;
    if (!value) {
      error = "Required";
    }
    return error;
  };