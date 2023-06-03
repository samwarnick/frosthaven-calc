const enhancements = {
  move: "Move",
  attack: "Attack",
  range: "Range",
  target: "Target",
  shield: "Shield",
  retaliate: "Retaliate",
  pierce: "Pierce",
  heal: "Heal",
  push: "Push",
  pull: "Pull",
  teleport: "Teleport",
  summonHP: "Summon HP",
  summonMove: "Summon Move",
  summonAttack: "Summon Attack",
  summonRange: "Summon Range",
  regenerate: "Regenerate",
  ward: "Ward",
  strengthen: "Strengthen",
  bless: "Bless",
  wound: "Wound",
  poison: "Poison",
  immobilize: "Immobilize",
  muddle: "Muddle",
  curse: "Curse",
  element: "Element",
  wildElement: "Wild Element",
  jump: "Jump",
  areaHex: "Area-of-Effect Hex",
};

const baseCosts = {
  move: 30,
  attack: 50,
  range: 30,
  target: 75,
  shield: 80,
  retaliate: 60,
  pierce: 30,
  heal: 30,
  push: 30,
  pull: 20,
  teleport: 50,
  summonHP: 40,
  summonMove: 60,
  summonAttack: 100,
  summonRange: 50,
  regenerate: 40,
  ward: 75,
  strengthen: 100,
  bless: 75,
  wound: 75,
  poison: 50,
  immobilize: 150,
  muddle: 40,
  curse: 150,
  element: 100,
  wildElement: 150,
  jump: 60,
  areaHex: 200,
};

const enhancementForm = document.getElementById("enhancementForm");
enhancementForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cardLevel = parseInt(document.getElementById("cardLevel").value);
  const targets = parseInt(document.getElementById("targets").value);
  const priorEnhancements = parseInt(
    document.getElementById("priorEnhancements").value
  );
  const persistent = document.getElementById("persistent").checked;
  const loss = document.getElementById("loss").checked;
  const enhancerLevel = parseInt(
    document.getElementById("enhancerLevel").value
  );

  const calculatedCosts = Object.keys(enhancements).map((enhancement) => {
    let cost = baseCosts[enhancement];
    if (enhancement === "areaHex") {
      cost = Math.ceil(cost / targets / 5) * 5;
    }

    if (
      targets > 1 &&
      !["areaHex", "element", "wildElement", "target"].includes(enhancement)
    ) {
      cost = cost * 2;
    }
    if (loss && !persistent) {
      cost = cost / 2;
    }
    if (persistent && !enhancement.startsWith("Summon")) {
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
      id: enhancement,
      cost,
      label: enhancements[enhancement],
    };
  });

  displayCosts(calculatedCosts);
});

function displayCosts(costs) {
  const container = document.getElementById("costs");
  if (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const grid = document.createElement("div");
  grid.classList.add("costs");

  costs.forEach(({ label, cost, id }) => {
    const iconEl = document.createElement("img");
    let icon = id;
    if (id === "summonHP") {
      icon = "heal";
    } else if (id === "summonMove") {
      icon = "move";
    } else if (id === "summonAttack") {
      icon = "attack";
    } else if (id === "summonRange") {
      icon = "range";
    }
    iconEl.src = `/assets/img/${icon}.png`;
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
