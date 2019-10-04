const imgs = document.querySelectorAll(".img");

function imgBacgroundFunction() {
  const imgBacground = document.querySelector(".rediis");
  imgBacground.addEventListener("mouseout", () => {
    imgBacground.remove();
  });
}

imgs.forEach(img => {
  img.addEventListener("mouseover", () => {
    const parent = img.parentElement;
    const ElementAuthor = document.createElement("div");
    const newElement = document.createElement("div");

    newElement.classList.add("rediis");
    ElementAuthor.classList.add("rediis");
    ElementAuthor.classList.add("rediis_right");

    ElementAuthor.innerText = img.dataset.description;
    newElement.innerText = img.dataset.description;

    parent.prepend(newElement);
    parent.prepend(ElementAuthor);
    imgBacgroundFunction();
  });
});
