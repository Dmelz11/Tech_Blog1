//user can delete post from their create post page
const deletePostHandler = async (event) => {
    event.preventDefault();
    console.log("clicked me");
    console.log(event.target);
  
    let post = window.location.pathname.split("/");
    console.log(post);
  
    const response = await fetch(`/api/readpost/${post[2]}`, {
      method: "DELETE",
    });
  
    if (response.ok) {
      document.location.assign(`/dashboard`);
    } else {
      alert(response.statusText);
    }
  };

const deleteButton = document.querySelectorAll("#deleteBtn");
  
// iteration to listen for delete button
  for (let i = 0; i < deleteButton.length; i++) {
    deleteButton[i].addEventListener("click", deletePostHandler);
  };