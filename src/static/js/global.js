// @ts-nocheck

//modal for images
document.addEventListener("DOMContentLoaded", () => {
  //use event delegation to add event listener to all images
  document.body.addEventListener("click", function (event) {
    if (event.target && event.target.matches("img.modal-trigger")) {
      showModal(event.target.src, event.target.alt || "");
    }
  });

  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  const span = document.getElementsByClassName("close")[0];

  function showModal(src) {
    modal.style.display = "flex";
    modalImg.src = src;
  }

  span.onclick = () => (modal.style.display = "none");
});
