document.addEventListener("DOMContentLoaded", () => {
    const updatepass = document.querySelector("#updatePass");
  
    if (updatepass) {
      updatepass.addEventListener("click", async (event) => {
        event.preventDefault();
  
        try {
          const currpass = document.querySelector("#currPass").value;
          const newpassword = document.querySelector("#newPass").value;
  
          if (currpass === "" || newpassword === "") {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Current Password or New Password Cannot be Empty.",
            });
            return; // Stop further execution if fields are empty
          }
  
          const url = "/UpdatePass";
  
          const data = {
            currpass: currpass,
            newpassword: newpassword,
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
              text: result.success || "Password Updated successful",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              window.location.href = "/";
            });
          } else if (response.status === 401) {
            // Unauthorized (incorrect credentials)
            const errorResult = await response.json();

            Swal.fire({
              icon: "error",
              title: "Unauthorized",
              text: errorResult.message,
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
  