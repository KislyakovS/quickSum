import { OpenAI } from "./model.js";

const API_KEY = "";
const MODEL = "google/gemma-3n-e2b-it:free";

// const client = new OpenAI({
//   url: "https://openrouter.ai/api/v1",
//   apiKey: API_KEY,
//   model: MODEL,
// });

// const question = "Привет! Как твои дела?";
// client.chat([{ role: "user", content: question }], {
//   onMessage: (message) => {
//     output.innerText += message;
//   },
//   onError: (error) => {
//     console.error(error.message);
//   },
// });

const summaryModal = document.querySelector(".summaryModel");

const buttonSummary = document.querySelector(".buttonSummary");
const buttonClose = document.querySelector(".buttonClose");
const buttonCopy = document.querySelector(".buttonCopy");

const iconCopySuccess = document.querySelector(".copySuccessfully");

buttonCopy.addEventListener("click", () => {
  buttonCopy.classList.add("none");
  iconCopySuccess.classList.remove("none");

  setTimeout(() => {
    buttonCopy.classList.remove("none");
    iconCopySuccess.classList.add("none");
  }, 1000);
});

buttonClose.addEventListener("click", () => {
  summaryModal.classList.add("none");
});

buttonSummary.addEventListener("click", () => {
  summaryModal.classList.remove("none");
});

document.addEventListener("mouseup", (e) => {
  setTimeout(() => {
    if (e.target.closest(".summaryModel")) {
      return;
    }

    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      buttonSummary.style.left = `${rect.left + window.scrollX}px`;
      buttonSummary.style.top = `${rect.bottom + window.scrollY + 5}px`;
      buttonSummary.classList.remove("none");
    } else {
      buttonSummary.classList.add("none");
    }
  });
});
