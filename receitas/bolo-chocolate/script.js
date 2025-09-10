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
    name: "Bolo",
    description: "Um bolo",
    ingredients: [
      "2 xícaras de farinha",
      "1 xícara de tal tal",
      "1 xícara de açúcar",
      "1 colher de tal",
      "1/2 colher de chá",
      "1/2 chá de sal",
      "2 ovos grandes",
      "1 xícara de leite",
      "1/2 xícara de óleo vegetal",
      "1 colher de chá de tal",
      "1 xícara de água quente",
    ],
    steps: [
      { text: "Pré aqueça o forno a 180°C. Unte e enfarinhe", 
        image: "./img/passo1.jpg", 
        timer: 0 },
      { text: "Adicione a água à massa e misture delicadamente", 
        image: "./img/passo2.jpg", 
        timer: 0 },
      { text: "Despeje a massa na forma untada e leve ao forno etc", 
        image: "./img/passo3.jpg", 
        timer: 0 },
      { text: "Retire o bolo do forno e deixe esfriar na forma", 
        image: "./img/passo4.jpg", 
        timer: 0 },
      { text: "Seu bolo de chocolate está pronto! Sirva com a cobertura", 
        image: "./img/bolo.jpg", 
        timer: 0 },
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
      recipe.ingredients.forEach((ingredient) => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        ingredientsListEl.appendChild(li);
      });
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