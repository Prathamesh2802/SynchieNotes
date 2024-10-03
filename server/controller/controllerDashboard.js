import { note } from "../schema/note.js";

const homepage = async (req, res) => {
  const locals = {
    title: "Synchie Notes",
    heading_name: "Synchie Notes",
  };

  const loggedUser = req.user;
  let SynchieNotesData = "";

  if (!loggedUser) {
    return res.render("index", {
      locals,
      loggedUser,
      SynchieNotesData,
    });
  }
  SynchieNotesData = await note.find({ username: loggedUser.username });

  res.status(201).render("index", {
    locals,
    loggedUser,
    SynchieNotesData,
  });
};
export { homepage };

const createNote = (req, res) => {
  const locals = {
    title: "Synchie Notes",
    heading_name: "Create a New Note",
  };
  const loggedUser = req.user;
  loggedUser
    ? res.status(200).render("Notes/NewNote", { locals, loggedUser })
    : res.status(401).redirect("/login");
};

export { createNote };

const NotesCreated = async (req, res) => {
  const { body } = req;
  try {
    const loggedUser = req.user;
    if (!loggedUser)
      return res.status(404).json({
        success: false,
        message: "User is Not Logged in",
      });
    body.username = loggedUser.username;
    const notes = new note(body);
    const SaveData = await notes.save();
    res.status(201).json({
      success: true,
      message: "Note Created Successfully",
    });
  } catch (ex) {
    res.status(404).send(ex);
  }
};

export { NotesCreated };

const NoteView = async (req, res) => {
  try {
    const loggedUser = req.user;
    if (!loggedUser) {
      return res.redirect("/login");
    }
    const noteid = req.params.id;
    const noteview = await note.findById(noteid);

    // Check if the note exists
    if (!noteview) {
      return res.status(404).send("Note not found");
    }

    // Ensure the logged-in user is the owner of the note
    if (noteview.username.toString() !== req.user.username.toString()) {
      return res.status(403).send("You are not authorized to view this note");
    }

    // If authorized, render the note details page
    res.status(201).render("Notes/viewNote", { noteview, loggedUser });
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).send("Server error");
  }
};

export { NoteView };

const NoteEdit = async (req, res) => {
  // GET: Display edit form for a note
  try {
    const loggedUser = req.user;
    if (!loggedUser) {
      return res.redirect("/login");
    }
    const noteid = req.params.id;
    const noteview = await note.findById(noteid);

    // Check if the note exists
    if (!noteview) {
      return res.status(404).send("Note not found");
    }

    // Ensure the logged-in user is the owner of the note
    if (noteview.username.toString() !== req.user.username.toString()) {
      return res.status(403).send("You are not authorized to edit this note");
    }

    // If authorized, render the edit page
    res.render("Notes/editNote", { noteview, loggedUser });
  } catch (error) {
    console.error("Error fetching note for edit:", error);
    res.status(500).send("Server error");
  }
};

export { NoteEdit };

// Delete: Delete the note
const EditedNote = async (req, res) => {
  try {
    const loggedUser = req.user;
    if (!loggedUser) {
      return res.redirect("/login");
    }
    const noteid = req.params.id;
    const noteview = await note.findById(noteid);
    const { heading, description } = req.body;

    // Check if the note exists
    if (!noteview) {
      return res.status(404).send("Note not found");
    }

    // Ensure the logged-in user is the owner of the note
    if (noteview.username.toString() !== req.user.username.toString()) {
      return res.status(403).send("You are not authorized to edit this note");
    }

    // Update the note fields
    noteview.heading = heading;
    noteview.description = description;
    await noteview.save();

    // Redirect to the updated note's detail page
    res.redirect(`/note/viewNote/${noteid}`);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).send("Server error");
  }
};

export { EditedNote };

// GET: Delete a note
const DeleteNote = async (req, res) => {
  try {
    const loggedUser = req.user;
    if (!loggedUser) {
      return res.redirect("/login");
    }
    const noteid = req.params.id;
    const noteview = await note.findById(noteid);
    // Check if the note exists
    if (!noteview) {
      return res.status(404).send("Note not found");
    }

    // Ensure the logged-in user is the owner of the note
    if (noteview.username.toString() !== req.user.username.toString()) {
      return res.status(403).send("You are not authorized to edit this note");
    }

    // If authorized, delete the note
    await note.findByIdAndDelete(noteid);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).send("Server error");
  }
};

export { DeleteNote };

const About = async (req, res) => {
  try {
    const loggedUser = req.user;
    res.status(201).render("About", { loggedUser });
  } catch (error) {
    console.error("Error While Loading Page: " + error);
  }
};

export { About };
