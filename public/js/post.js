// if logged_in user = post user
//  update, delete

// everyone
//  comment
const addComment = async (event) => {
  event.preventDefault();

  document.querySelector("#add-comment").setAttribute("hidden", "true");

  let podEl = document.getElementById("new-comment-area");
  let node = document.createElement("form");
  let commentInput = document.createElement("input");
  commentInput.setAttribute("id", "comment-content");
  commentInput.setAttribute("placeholder", "Enter Comment Here");

  let submitBtn = document.createElement("button");
  submitBtn.setAttribute("type", "submit");
  submitBtn.setAttribute("id", "submit-comment");
  submitBtn.innerText = "Submit";

  node.appendChild(commentInput);
  node.appendChild(submitBtn);
  podEl.appendChild(node);

  document
    .querySelector("#submit-comment")
    .addEventListener("click", commentFormHandler);
};

const commentFormHandler = async (event) => {
  event.preventDefault();

  const content = document.querySelector("#comment-content").value.trim();
  const post_id = document.querySelector('#add-comment').dataset.id;

  if (content && post_id) {
    const response = await fetch(`/api/posts/comment`, {
      method: "POST",
      body: JSON.stringify({ content, post_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert("Failed to create comment");
    }
  }
};

document.querySelector("#add-comment").addEventListener("click", addComment);
