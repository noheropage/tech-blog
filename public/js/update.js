const id = document.querySelector(".update-buttons").dataset.id;

const editPost = async (event) => {
  event.preventDefault();

  document.querySelector("#update-post").setAttribute("hidden", "true");

  let podEl = document.getElementById("new-input-area");
  let node = document.createElement("form");
  let postInput = document.createElement("input");
  postInput.setAttribute("id", "new-post-content");

  let oldPost = document.getElementById("post-content").innerText;
  postInput.value = oldPost;

  let submitBtn = document.createElement("button");
  submitBtn.setAttribute("type", "submit");
  submitBtn.setAttribute("id", "edit-post");
  submitBtn.innerText = "Submit";

  node.appendChild(postInput);
  node.appendChild(submitBtn);
  podEl.appendChild(node);

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
