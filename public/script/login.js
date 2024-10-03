document.addEventListener("DOMContentLoaded", () => {
  const synchieSubmit = document.querySelector("#synchie_submit");

  if (synchieSubmit) {
    synchieSubmit.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        const email = document.querySelector("#synchie_email").value;
        const password = document.querySelector("#synchie_password").value;

        if (email === "" || password === "") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Email or Password Cannot be Empty.",
          });
          return; // Stop further execution if fields are empty
        }

        const url = "/login";

        const data = {
          email: email,
          password: password,
        };

        // Perform the POST request using fetch
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          // Successful login
          const result = await response.json();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: result.success || "Login successful",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.href = "/";
          });
        } else if (response.status === 401) {
          // Unauthorized (incorrect credentials)
          Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "Invalid credentials. Please try again.",
          });
        } else if (response.status === 429) {
          // Too many requests (rate limited / locked out)
          const result = await response.json();
          Swal.fire({
            icon: "error",
            title: "Too Many Attempts",
            text:
              result.message ||
              "You have made too many login attempts. Please try again later.",
          });
        } else {
          // Other error (generic handler)
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred. Please try again later.",
          });
        }
      } catch (error) {
        console.error("Error during request:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while processing your request. Please try again later.",
        });
      }
    });
  }
});
