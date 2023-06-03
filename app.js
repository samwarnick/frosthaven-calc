const enhancements = [
  {
    id: "move",
    label: "Move",
    baseCost: 30,
  },
  {
    id: "attack",
    label: "Attack",
    baseCost: 50,
  },
  {
    id: "range",
    label: "Range",
    baseCost: 30,
  },
  {
    id: "target",
    label: "Target",
    baseCost: 75,
  },
  {
    id: "shield",
    label: "Shield",
    baseCost: 80,
  },
  {
    id: "retaliate",
    label: "Retaliate",
    baseCost: 60,
  },
  {
    id: "pierce",
    label: "Pierce",
    baseCost: 30,
  },
  {
    id: "heal",
    label: "Heal",
    baseCost: 30,
  },
  {
    id: "push",
    label: "Push",
    baseCost: 30,
  },
  {
    id: "pull",
    label: "Pull",
    baseCost: 20,
  },
  {
    id: "teleport",
    label: "Teleport",
    baseCost: 50,
  },
  {
    id: "summonHP",
    label: "Summon HP",
    icon: "heal",
    baseCost: 40,
  },
  {
    id: "summonMove",
    label: "Summon Move",
    icon: "move",
    baseCost: 60,
  },
  {
    id: "summonAttack",
    label: "Summon Attack",
    icon: "attack",
    baseCost: 100,
  },
  {
    id: "summonRange",
    label: "Summon Range",
    icon: "range",
    baseCost: 50,
  },
  {
    id: "regenerate",
    label: "Regenerate",
    baseCost: 40,
  },
  {
    id: "ward",
    label: "Ward",
    baseCost: 75,
  },
  {
    id: "strengthen",
    label: "Strengthen",
    baseCost: 100,
  },
  {
    id: "bless",
    label: "Bless",
    baseCost: 75,
  },
  {
    id: "wound",
    label: "Wound",
    baseCost: 75,
  },
  {
    id: "poison",
    label: "Poison",
    baseCost: 50,
  },
  {
    id: "immobilize",
    label: "Immobilize",
    baseCost: 150,
  },
  {
    id: "muddle",
    label: "Muddle",
    baseCost: 40,
  },
  {
    id: "curse",
    label: "Curse",
    baseCost: 150,
  },
  {
    id: "element",
    label: "Element",
    baseCost: 100,
  },
  {
    id: "wildElement",
    label: "Wild Element",
    baseCost: 150,
  },
  {
    id: "jump",
    label: "Jump",
    baseCost: 60,
  },
  {
    id: "areaHex",
    label: "Area-of-Effect Hex",
    baseCost: 200,
  },
];

function init() {
  const enhancementForm = document.getElementById("enhancementForm");
  enhancementForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formValues = getFormValues();
    const calculatedCosts = calculateCosts(formValues);
    displayCosts(calculatedCosts);
  });
}

function getFormValues() {
  const enhancerLevel = parseInt(
    document.getElementById("enhancerLevel").value
  );
  const cardLevel = parseInt(document.getElementById("cardLevel").value);
  const targets = parseInt(document.getElementById("targets").value);
  const priorEnhancements = parseInt(
    document.getElementById("priorEnhancements").value
  );
  const isPersistent = document.getElementById("persistent").checked;
  const isLoss = document.getElementById("loss").checked;

  return {
    enhancerLevel,
    cardLevel,
    targets,
    priorEnhancements,
    isPersistent,
    isLoss,
  };
}

function calculateCosts({
  enhancerLevel,
  cardLevel,
  targets,
  priorEnhancements,
  isPersistent,
  isLoss,
}) {
  return enhancements.map(({ id, label, baseCost, icon }) => {
    let cost = baseCost;
    if (id === "areaHex") {
      cost = Math.ceil(cost / targets / 5) * 5;
    }

    if (
      targets > 1 &&
      !["areaHex", "element", "wildElement", "target"].includes(id)
    ) {
      cost = cost * 2;
    }
    if (isLoss && !isPersistent) {
      cost = cost / 2;
    }
    if (isPersistent && !id.startsWith("summon")) {
      cost = cost * 3;
    }
    const cardLevelCost = enhancerLevel >= 3 ? 15 : 25;
    cost = cost + (cardLevel - 1) * cardLevelCost;
    const priorEnhancementCost = enhancerLevel === 4 ? 50 : 75;
    cost = cost + priorEnhancements * priorEnhancementCost;
    if (enhancerLevel >= 2) {
      cost = cost - 10;
    }
    return {
      id,
      cost,
      label,
      icon,
    };
  });
}

function displayCosts(costs) {
  const container = document.getElementById("costs");
  if (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const grid = document.createElement("div");
  grid.classList.add("costs");

  costs.forEach(({ label, cost, id, icon }) => {
    const iconEl = document.createElement("img");
    iconEl.src = `/assets/img/${icon ?? id}.png`;
    iconEl.alt = `Frosthaven icon for ${label}`;
    iconEl.classList.add("enhancementIcon");

    const labelEl = document.createElement("span");
    labelEl.textContent = label;
    labelEl.classList.add("enhancementLabel");

    const costEl = document.createElement("span");
    costEl.textContent = `${cost} gold`;
    costEl.classList.add("costLabel");

    grid.appendChild(iconEl);
    grid.appendChild(labelEl);
    grid.appendChild(costEl);
  });

  container.appendChild(grid);
}

init();
