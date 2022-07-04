let modeControls = {};
let imageContainer = {};
let searchBox = {};
let loadingIndicator = {};
let errorContainer = {};
let errorMessage = {};
let errorAlert = {};
let root = {};

const MODE_SELECTOR_POS = "--mode-selector-position";
const IMG_SELECTOR_POS = "--image-selector-position";
const API_KEY = "4WEk6oEdTsiv2uAhjSPgda33jFnRta97";

let currMode = "";
let currImgType = "";

function setup() {
  modeControls = document.body.querySelector(".toolbar-options");
  root = document.documentElement;
  imageContainer = document.body.querySelector(".images-container");
  searchBox = document.body.querySelector(".searchbox");
  loadingIndicator = document.body.querySelector(".loading-indicator");
  errorContainer = document.body.querySelector(".error-alert-container");
  errorAlert = document.body.querySelector(".error-alert");
  errorMessage = document.body.querySelector("#errorMessage");

  initialState();
  getTrending();
}

function initialState() {
  currMode = "trending";
  currImgType = "gifs";
}

function selectMode(mode, type) {
  let shift = 0;
  switch (mode) {
    case "word-to-gif":
    case "stickers":
      shift = 150;
      break;
  }

  if (type === "mode") {
    currMode = mode;
  } else {
    currImgType = mode;
  }
  if (mode === "trending") {
    getTrending();
  } else {
    getTranslate("happy");
  }
  root.style.setProperty(
    type === "mode" ? MODE_SELECTOR_POS : IMG_SELECTOR_POS,
    `${shift}px`
  );
}

//Modes
async function getTrending() {
  try {
    setLoading(true);
    let response = await fetch(
      `https://api.giphy.com/v1/${currImgType}/trending?` +
        new URLSearchParams({
          api_key: `${API_KEY}`,
          limit: 30,
        })
    );
    let data = await response.json();
    showImages(data.data);
  } catch (e) {
    showError(e);
  }
}

async function getSearchResults(search) {
    if(search===''){
        getTrending();
        return;
    }
    console.log('Entered! World')
  try {
    setLoading(true);
    let response = await fetch(
      `https://api.giphy.com/v1/${currImgType}/search?` +
        new URLSearchParams({
          api_key: `${API_KEY}`,
          limit: 30,
          q: search,
        })
    );
    let data = await response.json();
    showImages(data.data);
  } catch (e) {
    showError(e);
  }
}

async function getTranslate(search) {
  if (searchBox.value !== "") {
    search = searchBox.value;
  }
  try {
    let data = [];
    setLoading(true);
    for (let i = 0; i <= 10; i++) {
      let response = await fetch(
        `https://api.giphy.com/v1/${currImgType}/translate?` +
          new URLSearchParams({
            api_key: `${API_KEY}`,
            s: search,
            weirdness: i,
          })
      );
      let imageObj = await response.json();
      data.push(imageObj.data);
    }
    showImages(data);
  } catch (e) {
    showError(e);
  }
}

function handleChange() {
  if (currMode === "trending") {
    console.log('Entered Search')
    getSearchResults(searchBox.value);
  } else {
    getTranslate(searchBox.value);
  }
}

function showImages(imagesObj) {
  setLoading(false);
  imageContainer.innerHTML = "";
  imagesObj.forEach((imageObj) => {
    addImage(imageObj);
  });
}

function addImage(imageObj) {
  let image = document.createElement("img");
  image.src = imageObj.images.fixed_height.url;
  image.classList.add("element");
  imageContainer.appendChild(image);
}

function setLoading(isLoading) {
  if (isLoading) {
    loadingIndicator.style.display = "block";
  } else {
    loadingIndicator.style.display = "none";
  }
}

function showError(message) {
  window.scrollTo(0, 0);
  errorMessage.innerHTML = message;
  errorContainer.style.display = "flex";
  setTimeout(() => {
    errorContainer.style.setProperty("background-color", "rgba(0, 0,0, 0.8)");
    errorAlert.classList.add("showError");
    document.body.classList.add("diasable-scroll");
  }, 50);
}

function closeError() {
  document.body.classList.remove("diasable-scroll");
  errorAlert.classList.remove("showError");
  errorContainer.style.setProperty("background-color", "rgba(0, 0,0, 0)");
  setTimeout(() => (errorContainer.style.display = "none"), 300);
}
