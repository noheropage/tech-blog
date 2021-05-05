const id = document.querySelector(".update-buttons").dataset.id;

const editPost = async (event) => {
  event.preventDefault();

  document.querySelector("#update-post").setAttribute("hidden", "true");

  let inputEl = document.getElementById("new-input-area");
  let node = document.createElement("form");
  let postInput = document.createElement("textarea");

  postInput.setAttribute("id", "new-post-content");
  postInput.setAttribute("rows", "4")
  postInput.setAttribute("cols", "50")

  node.setAttribute("class", "m-4")

  let oldPost = document.getElementById("post-content").innerText;
  postInput.value = oldPost;

  let submitBtn = document.createElement("button");
  submitBtn.setAttribute("type", "submit");
  submitBtn.setAttribute("class", "btn btn-outline-success")
  submitBtn.setAttribute("id", "edit-post");
  submitBtn.innerText = "Update Post";

  node.appendChild(postInput);
  node.appendChild(submitBtn);
  inputEl.appendChild(node);

  document
    .querySelector("#edit-post")
    .addEventListener("click", updatePostHandler);
};

// update
const updatePostHandler = async (event) => {
  event.preventDefault();

  const content = document.querySelector("#new-post-content").value.trim();

  if (content) {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        content,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    if (response.ok) {
        document.location.reload();
    } else {
      alert("Failed to edit post");
    }
  }
};

// delete
const delButtonHandler = async (event) => {
  event.preventDefault();
  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    document.location.replace("/profile");
  } else {
    alert("Failed to delete post");
  }
};

document.querySelector("#update-post").addEventListener("click", editPost);

document
  .querySelector("#delete-post")
  .addEventListener("click", delButtonHandler);
