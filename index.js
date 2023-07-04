const root = document.getElementById("root");
const imageCountStatus = document.getElementById("imageCount");
const paginationStatus = document.getElementById("paginationStatus");
const goToTop = document.getElementById("goToTop");
paginationStatus.innerText = "listening";
let shouldPaginationTrigger = true;
let pageCount = 2;
let imageCount = 0;
const generateRandom = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const appendImageChilds = (url, name) => {
  let image = new Image();
  image.src = url;
  image.alt = name;
  image.classList.add("images");
  image.style.gridRow = `span ${generateRandom(0, 4)}`;
  image.style.gridColumn = `span ${generateRandom(0, 5)}`;
  image.loading = "lazy";
  root.appendChild(image);
};
goToTop.addEventListener("click", () => {
  window.scrollTo(0, 0);
});
window.addEventListener("load", async () => {
  await fetch("https://picsum.photos/v2/list/")
    .then((response) => response.json())
    .then((data) => {
      data.map((data, i) => appendImageChilds(data.download_url, data.author));
      imageCount += data.length;
      imageCountStatus.innerText = imageCount;
    });
});
window.addEventListener("scroll", async () => {
  if (window.scrollY + window.innerHeight >= root.scrollHeight - 200) {
    if (shouldPaginationTrigger) {
      shouldPaginationTrigger = false;
      paginationStatus.innerText = "pagination request sent";
      await fetch(`https://picsum.photos/v2/list?page=${pageCount}&limit=50`)
        .then((response) => response.json())
        .then((data) => {
          shouldPaginationTrigger = true;
          paginationStatus.innerText = "listening";

          pageCount++;
          data.map((data) => appendImageChilds(data.download_url, data.author));
          imageCount += data.length;
          imageCount += data.length;
          imageCountStatus.innerText = imageCount;
        });
    }
  }
});
