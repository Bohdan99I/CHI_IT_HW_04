const apiURL = "https://rickandmortyapi.com/api/character";
let currentPage = 1;
let totalPages = 1;
let isLoading = false;

const charactersDiv = document.querySelector("#characters");
const loadingText = document.querySelector("#loading");

const modal = document.querySelector("#modal");
const closeModal = document.querySelector(".close");
const modalImage = document.querySelector("#modal-image");
const modalName = document.querySelector("#modal-name");
const modalStatus = document.querySelector("#modal-status");

async function fetchCharacters(page = 1) {
  if (isLoading || page > totalPages) return;

  isLoading = true;
  loadingText.textContent = "Loading...";

  try {
    const response = await fetch(`${apiURL}?page=${page}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    totalPages = data.info.pages;
    displayCharacters(data.results);
    loadingText.textContent = "";
  } catch (error) {
    console.error("Помилка завантаження даних:", error);
    loadingText.textContent = "Failed to load data!";
  }

  isLoading = false;
}

function displayCharacters(characters) {
  characters.forEach((character) => {
    const characterDiv = document.createElement("div");
    characterDiv.classList.add("character");
    characterDiv.setAttribute("data-id", character.id);
    characterDiv.innerHTML = `
      <img src="${character.image}" alt="${character.name}" width="100">
      <p>${character.name}</p>
    `;
    charactersDiv.appendChild(characterDiv);
  });
}

charactersDiv.addEventListener("click", async (event) => {
  const characterDiv = event.target.closest(".character");
  if (characterDiv) {
    const characterId = characterDiv.getAttribute("data-id");
    if (characterId) {
      try {
        const response = await fetch(`${apiURL}/${characterId}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const character = await response.json();
        openModal(character);
      } catch (error) {
        console.error("Помилка завантаження персонажа:", error);
      }
    }
  }
});

function openModal(character) {
  modalImage.src = character.image;
  modalName.textContent = character.name;
  modalStatus.textContent = `Status: ${character.status}`;
  modal.style.display = "block";
}

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !isLoading
  ) {
    currentPage++;
    fetchCharacters(currentPage);
  }
});

fetchCharacters(currentPage);
