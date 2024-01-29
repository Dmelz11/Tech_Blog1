async function createPostHandler(event) {
    event.preventDefault();
    
    const title = document.querySelector("#new-post-title").value.trim();
    const body = document.querySelector("#new-post-body").value.trim();
    console.log(title, body)

    if (title && body) {
      //aquiring posts text with title
      const response = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          body,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      //checking if good
      if (response.ok) {
        localStorage.setItem("blog-post", JSON.stringify({postTitle: title, postBody: body}));
        var blogPost = JSON.parse(localStorage.getItem("blog-post"));
        console.log("Test");
 
        renderMessage();
        
      } else {
        alert(response.statusText);
    }
  }
}
// listening for create post button click
document
  .querySelector(".create-post-btn")
  .addEventListener("click", createPostHandler);


function renderMessage() {
  var lastpost = JSON.parse(localStorage.getItem("blog-post"));
  console.log(lastpost);
  if (lastpost !== null) {
    document.location.replace("/dashboard");
  }
}
