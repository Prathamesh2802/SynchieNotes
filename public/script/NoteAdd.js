document.addEventListener("DOMContentLoaded", () => {
  let SynchieSubmitNote = document.querySelector("#Synchie_SubmitNote");
  if (SynchieSubmitNote) {
    SynchieSubmitNote.addEventListener("submit", async (event) => {
      event.preventDefault();
      const heading = document.querySelector("#Heading_synchie").value;
      const description = document.querySelector("#Description_Synchie").value;
      if (heading === "") {
        alert("Heading cannot be Empty");
      }
      if (description === "") {
        alert("Description cannot be Empty");
      }

      const url = "/NotesAdd";

      const data = {
        heading: heading,
        description: description,
      };
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          const result = await response.json();
          // Notes Created
          console.log(result.message);
          window.location.href = "/";
        } else {
          const result = await response.json();
          console.log(result.message);
          window.location.href = "/";
        }
      } catch (ex) {
        console.log(ex);
      }
    });
  }
});
