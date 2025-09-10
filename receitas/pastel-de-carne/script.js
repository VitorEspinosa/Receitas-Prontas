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
    name: "🥟 Pastel Frito de Carne 🥟",
    description: "Crocante por fora e suculento por dentro, o pastel frito de carne é um clássico das feiras brasileiras. Com massa fininha e recheio bem temperado, essa receita vai trazer aquele gostinho irresistível que combina com qualquer ocasião.",
    ingredients: {
      massa: [
        "500 g de farinha de trigo",
        "1 colher (sopa) de óleo",
        "1 colher (chá) de sal",
        "1 colher (sopa) de cachaça (opcional, deixa a massa crocante)",
        "200 ml de água morna (aprox.)"
      ],
      recheio: [
        "300 g de carne moída",
        "1 cebola média picada",
        "2 dentes de alho picados",
        "2 colheres (sopa) de óleo",
        "Sal e pimenta a gosto",
        "Cheiro-verde picado a gosto"
      ],
      extra: [
        "Óleo para fritar",
        "Farinha para polvilhar"
      ]
    },
    steps: [
      { text: "Prepare o recheio: refogue o alho e a cebola no óleo, adicione a carne moída, tempere com sal, pimenta e finalize com cheiro-verde.", 
        image: "./img/passo1.png", 
        timer: 0 },
      { text: "Abra a massa com um rolo, corte em discos ou retângulos e recheie com a carne pronta.", 
        image: "./img/passo2.png", 
        timer: 0 },
      { text: "Dobre e feche bem as bordas do pastel, pressionando com um garfo.", 
        image: "./img/passo3.png", 
        timer: 0 },
      { text: "Frite em óleo quente até dourar, escorra em papel toalha.", 
        image: "./img/passo4.jpg", 
        timer: 0 },
      { text: "Sirva quente e aproveite seu pastel crocante!", 
        image: "./img/pastel.jpg", 
        timer: 0 }
    ]
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
    return `${minutes}:${seconds}`;
  }

  function updateTimerDisplay(totalSeconds) {
    const formatted = formatTime(totalSeconds);
    if (timerMinutesEl && timerSecondsEl) {
      const [m, s] = formatted.split(":");
      timerMinutesEl.textContent = m;
      timerSecondsEl.textContent = s;
      if (timerDisplayEl) timerDisplayEl.style.display = "flex";
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

      // Massa
      const massaTitle = document.createElement("h3");
      massaTitle.textContent = "Massa";
      ingredientsListEl.appendChild(massaTitle);
      recipe.ingredients.massa.forEach((ingredient) => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        ingredientsListEl.appendChild(li);
      });

      // Recheio
      const recheioTitle = document.createElement("h3");
      recheioTitle.textContent = "Recheio";
      ingredientsListEl.appendChild(recheioTitle);
      recipe.ingredients.recheio.forEach((ingredient) => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        ingredientsListEl.appendChild(li);
      });

      // Extra
      const extraTitle = document.createElement("h3");
      extraTitle.textContent = "Para fritar";
      ingredientsListEl.appendChild(extraTitle);
      recipe.ingredients.extra.forEach((ingredient) => {
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
