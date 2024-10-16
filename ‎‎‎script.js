const apiURL = "https://rickandmortyapi.com/api/character";
let currentPage = 1;
let totalPages = 1;

const charactersDiv = document.getElementById("characters");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const pageNumberSpan = document.getElementById("pageNumber");
const loadingText = document.getElementById("loading");

async function fetchCharacters(page = 1) {
  charactersDiv.innerHTML = "";
  loadingText.textContent = "Loading...";
  try {
    const response = await fetch(`${apiURL}?page=${page}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    totalPages = data.info.pages;
    updatePaginationButtons(page);
    displayCharacters(data.results);
    loadingText.textContent = "";
  } catch (error) {
    console.error("Помилка завантаження даних:", error);
    loadingText.textContent = "Failed to load data!";
  }
}

function displayCharacters(characters) {
  characters.forEach((character) => {
    const characterDiv = document.createElement("div");
    characterDiv.classList.add("character");
    characterDiv.innerHTML = `
            <img src="${character.image}" alt="${character.name}" width="100">
            <p>${character.name}</p>
        `;
    charactersDiv.appendChild(characterDiv);
  });
}

function updatePaginationButtons(page) {
  currentPage = page;
  pageNumberSpan.textContent = `Page ${currentPage} of ${totalPages}`;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    fetchCharacters(currentPage - 1);
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    fetchCharacters(currentPage + 1);
  }
});

fetchCharacters();
