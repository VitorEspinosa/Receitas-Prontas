document.addEventListener("DOMContentLoaded", () => {
  const recipeTitleEl = document.getElementById("recipe-title");
  const recipeDescriptionEl = document.getElementById("recipe-description");
  const ingredientsListEl = document.getElementById("ingredients-list");
  const stepNumberEl = document.getElementById("step-number");
  const stepTextEl = document.getElementById("step-text");
  const stepNextEl = document.getElementById("step-next");
  const stepImageEl = document.getElementById("step-image");
  const timerDisplayEl = document.getElementById("timer-display");
  const timerMinutesEl = document.getElementById("timer-minutes");
  const timerSecondsEl = document.getElementById("timer-seconds");
  const stepCompletedCheckBox = document.getElementById("step-completed-checkbox");
  const prevStepBtn = document.getElementById("prev-step-btn");
  const nextStepBtn = document.getElementById("next-step-btn");
  const restartRecipeBtn = document.getElementById("restart-recipe-btn");
  const messageBox = document.getElementById("message-box");
  const messageText = document.getElementById("message-text");
  const closeMessageBtn = document.getElementById("close-message-btn");

  const recipe = {
    name: "🍨 Sorvete Napolitano 🍨",
    description: "Delicie-se com o clássico sabor do sorvete napolitano feito em casa! Nossa receita combina camadas generosas de chocolate, baunilha e morango, criando a mistura perfeita de sabores que agrada a todos. Feito com ingredientes frescos e sem conservantes, este sorvete é cremoso, suave e ideal para dias quentes ou como sobremesa após qualquer refeição. Prepare, congele e surpreenda sua família e amigos com esta versão caseira do queridinho da infância.",
    ingredients: {
        base: [
           "2 caixas de creme de leite (400 ml)",
           "1 lata de leite condensado (395 g)",
           "1 colher (chá) de essência de baunilha"
        ],
        sabores: {
            baunilha: ["Use a base pronta (já contém essência de baunilha)"],
            morango: [
                "1 xícara de morangos batidos (ou 2 colheres de sopa de geleia de morango"
            ],
            chocolate: [
                "3 colheres (sopa) de chocolate em pó ou cacau em pó"
            ]
        }
    },
    steps: [
    { text: "Bata o creme de leite até ficar aerado.", 
        image:"./img/passo1.jpg", 
        timer: 0 },
    { text: "Adicione o leite condensado e a baunilha, misture bem.", 
        image: "./img/passo2.png", 
        timer: 0 },
    { text: "Separe a mistura em 3 partes: baunilha, morango e chocolate.", 
        image: "./img/passo3.png", 
        timer: 0 },
    { text: "Monte em camadas num pote e congele por 6 horas.",
        image: "./img/passo4.jpg", 
        timer: 0 },
    { text: "Sirva em pedaços ou bolas de sorvete. 🍨", 
        image: "./img/sorvete.png", 
        timer: 0 }
  ],
};

  let currentStepIndex = 0;
  let timerInterval = null;
  let timerRemaining = 0;

  function showMessage(message) {
    if (messageText) messageText.textContent = message;
    if (messageBox) messageBox.style.display = "flex";
  }

  function hideMessage() {
    if (messageBox) messageBox.style.display = "none";
  }

  function formatTime(totalSeconds) {
    totalSeconds = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`; // sem quebras de linha
  }

  function updateTimerDisplay(totalSeconds) {
    const formatted = formatTime(totalSeconds);
    if (timerMinutesEl && timerSecondsEl) {
      const [m, s] = formatted.split(":");
      timerMinutesEl.textContent = m;
      timerSecondsEl.textContent = s;
      if (timerDisplayEl) timerDisplayEl.style.display = "flex";
    } else if (timerDisplayEl) {
      timerDisplayEl.textContent = formatted;
      timerDisplayEl.style.display = "block";
    }
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startStepTimer(durationInSeconds) {
    stopTimer();
    timerRemaining = Math.max(0, Math.floor(durationInSeconds));
    if (timerRemaining <= 0) {
      if (timerDisplayEl) timerDisplayEl.style.display = "none";
      return;
    }
    updateTimerDisplay(timerRemaining);
    timerInterval = setInterval(() => {
      timerRemaining--;
      if (timerRemaining <= 0) {
        updateTimerDisplay(0);
        stopTimer();
        showMessage("Tempo esgotado para este passo!");
        if (timerDisplayEl) timerDisplayEl.style.display = "none";
      } else {
        updateTimerDisplay(timerRemaining);
      }
    }, 1000);
  }

  function displayStep(index) {
    stopTimer();
    const step = recipe.steps[index];
    if (!step) return;

    if (stepNumberEl) stepNumberEl.textContent = `Passo ${index + 1} de ${recipe.steps.length}`;
    if (stepTextEl) stepTextEl.textContent = step.text || "";
    if (stepNextEl) {
      const next = recipe.steps[index + 1];
      stepNextEl.textContent = next ? `Próximo: ${next.text}` : "";
    }

    if (step.image) {
      stepImageEl.src = step.image;
      stepImageEl.style.display = "block";
    } else {
      stepImageEl.src = "";
      stepImageEl.style.display = "none";
    }

    if (step.timer && step.timer > 0) {
      startStepTimer(step.timer);
    } else {
      if (timerDisplayEl) timerDisplayEl.style.display = "none";
    }

    if (stepCompletedCheckBox) {
      stepCompletedCheckBox.checked = false;
      stepCompletedCheckBox.disabled = false;
    }

    prevStepBtn.disabled = index === 0;
    nextStepBtn.disabled = false;
    nextStepBtn.textContent = index === recipe.steps.length - 1 ? "Finalizar Receita" : "Próximo";
  }

  function handleNextStep() {
    if (currentStepIndex < recipe.steps.length - 1) {
      currentStepIndex++;
      displayStep(currentStepIndex);
    } else {
      showMessage("Parabéns! Você concluiu a receita. Bom apetite!");
      prevStepBtn.disabled = true;
      nextStepBtn.disabled = true;
      if (stepCompletedCheckBox) stepCompletedCheckBox.disabled = true;
      stopTimer();
    }
  }

  function handlePreviousStep() {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      displayStep(currentStepIndex);
    }
  }

  function handleStepCompletedCheckbox() {
    if (!stepCompletedCheckBox) return;
    if (stepCompletedCheckBox.checked) {
      showMessage(`Passo ${currentStepIndex + 1} marcado como concluído!`);
      stopTimer();
      if (timerDisplayEl) timerDisplayEl.style.display = "none";
    } else {
      showMessage(`Passo ${currentStepIndex + 1} desmarcado`);
    }
  }

  function restartRecipe() {
    if (confirm("Tem certeza que deseja reiniciar a receita do início?")) {
      currentStepIndex = 0;
      displayStep(currentStepIndex);
      showMessage("Receita reiniciada!");
    }
  }

  function initializeRecipe() {
  if (recipeTitleEl) recipeTitleEl.textContent = recipe.name;
  if (recipeDescriptionEl) recipeDescriptionEl.textContent = recipe.description;

  if (ingredientsListEl) {
    ingredientsListEl.innerHTML = "";

    // Base
    const baseTitle = document.createElement("h3");
    baseTitle.textContent = "Base";
    ingredientsListEl.appendChild(baseTitle);
    recipe.ingredients.base.forEach((ingredient) => {
      const li = document.createElement("li");
      li.textContent = ingredient;
      ingredientsListEl.appendChild(li);
    });

    // Sabores
    const saboresTitle = document.createElement("h3");
    saboresTitle.textContent = "Sabores";
    ingredientsListEl.appendChild(saboresTitle);

    for (const sabor in recipe.ingredients.sabores) {
      const saborTitle = document.createElement("h4");
      saborTitle.textContent = sabor.charAt(0).toUpperCase() + sabor.slice(1);
      ingredientsListEl.appendChild(saborTitle);

      recipe.ingredients.sabores[sabor].forEach((ingredient) => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        ingredientsListEl.appendChild(li);
      });
    }
  }

  displayStep(currentStepIndex);
}


  prevStepBtn.addEventListener("click", handlePreviousStep);
  nextStepBtn.addEventListener("click", handleNextStep);
  if (stepCompletedCheckBox) stepCompletedCheckBox.addEventListener("change", handleStepCompletedCheckbox);
  restartRecipeBtn.addEventListener("click", restartRecipe);
  closeMessageBtn.addEventListener("click", hideMessage);
  messageBox.addEventListener("click", (e) => {
    if (e.target === messageBox) hideMessage();
  });

  initializeRecipe();
});