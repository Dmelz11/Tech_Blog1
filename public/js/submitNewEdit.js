let blogPost = window.location.pathname.split("/");
console.log(blogPost);
// Allows editing of blog posts
const submitEdit = async (event) => {
  event.preventDefault();
  const title = document.getElementById("#new-post-title").value;
  const description = document.getElementById("#new-post-body").value;

  if (title && description) {
    const response = await fetch(`/api/post/${blogPost[1]}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        description,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    if (response.ok) {
      document.location.assign("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
};

const submitButton = document.getElementById("#submitEdit");

// Event Listener
submitButton.addEventListener("submit", submitEdit);