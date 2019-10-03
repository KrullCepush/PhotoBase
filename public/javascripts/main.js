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
    const newElement = document.createElement("div");
    newElement.classList.add("rediis");
    newElement.innerText = img.dataset.description;
    parent.prepend(newElement);
    imgBacgroundFunction();
  });
});
