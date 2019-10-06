const imgs = document.querySelectorAll(".img");
const like = document.getElementById("like");

if (like) {
  like.addEventListener("click", async () => {
    const param = window.location.pathname;

    const response = await fetch(param, {
      method: "put",
      body: JSON.stringify({ status: 1 }),
      headers: {
        "content-type": "application/json"
      }
    });
    const status = await response.json();
    const likeCounter = document.getElementsByClassName("like-counter");

    if (status.status === "update") {
      likeCounter[0].innerText = +likeCounter[0].innerText + 1;
    } else {
      likeCounter[0].innerText = +likeCounter[0].innerText - 1;
    }
  });
}

function imgBacgroundFunction() {
  const imgBacground = document.querySelector(".rediis");
  imgBacground.addEventListener("mouseout", () => {
    imgBacground.remove();
  });
}

imgs.forEach(img => {
  img.addEventListener("mouseover", () => {
    const parent = img.parentElement;
    const newElement = document.createElement("div");
    newElement.classList.add("rediis");
    newElement.innerText = img.dataset.description;

    parent.prepend(newElement);
    imgBacgroundFunction();
  });
});
