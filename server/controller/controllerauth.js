import { user } from "../schema/user.js";
import { hashpassword,comparepassword } from "../utils/helper.js";

const login = async (req, res) => {
  const locals = {
    title: "Synchie Login",
    heading_name: "Synchie Notes",
  };

  const loggedUser = req.user;
  if (loggedUser) return res.redirect("/");
  res.render("Auth/login", {
    locals,
    loggedUser,
  });
};
export { login };

const register = async (req, res) => {
  const locals = {
    title: "Synchie Register",
    heading_name: "Synchie Notes",
  };
  const loggedUser = req.user;
  if (loggedUser) return res.redirect("/");
  res.render("Auth/Register", { locals, loggedUser });
};

export { register };

const PostRegistration = async (req, res) => {
  const { body } = req;
  try {
    if (body.honeypot) {
      return res.status(400).redirect("/");
    }

    body.password = hashpassword(body.password);
    const users = new user(body);
    const newusers = await users.save();
    res.status(201).redirect("/login");
  } catch (ex) {
    console.log(ex);
    res.status(404).send({ err: ex });
  }
};

export { PostRegistration };

const UpdatePass = async (req, res) => {
  const loggedUser = req.user;
  if (!loggedUser) return res.redirect("/login");

  const { currpass, newpassword } = req.body;

  if (!comparepassword(currpass, loggedUser.password)) {
    return res.status(404).send({ message: "Invalid credentials" });
  }

  if (currpass === newpassword) {
    return res.status(401).send({ message: "New Password cannot be your current password" });
  }

  const hashedNewPass = hashpassword(newpassword);
  // Assuming you save the new password to the user object here
  loggedUser.password = hashedNewPass;

  // Save the user with the new password
  await loggedUser.save();

  res.status(200).send({ message: "Password updated successfully" });
};

export { UpdatePass }

const isLogging = (req, res) => {
  let success = "";
  res.status(200).json({
    success: "Login successful",
  });
};

export { isLogging };

const Profile = async (req, res) => {
  const loggedUser = req.user;
  if (!loggedUser) {
    return res.redirect("/login");
  }
  res.status(201).render("Auth/Profile", { loggedUser });
};

export { Profile };

const isloggingout = async (req, res) => {
  if (!req.user) res.status(404);
  req.logout((err) => {
    if (err) return res.status(404);
    res.status(201).redirect("/");
  });
};

export { isloggingout };
