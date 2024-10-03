import bcrypt from "bcrypt";

const saltrounds = 10;
export const hashpassword = (password) => {
  try {
    const salt = bcrypt.genSaltSync(saltrounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

export const comparepassword = (plain, hashed) => {
  try {
    return bcrypt.compareSync(plain, hashed);
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
};
