const enhancements = [
  {
    id: "move",
    label: "Move +1",
    baseCost: 30,
  },
  {
    id: "attack",
    label: "Attack +1",
    baseCost: 50,
  },
  {
    id: "range",
    label: "Range +1",
    baseCost: 30,
  },
  {
    id: "target",
    label: "Target +1",
    baseCost: 75,
  },
  {
    id: "shield",
    label: "Shield +1",
    baseCost: 80,
  },
  {
    id: "retaliate",
    label: "Retaliate +1",
    baseCost: 60,
  },
  {
    id: "pierce",
    label: "Pierce +1",
    baseCost: 30,
  },
  {
    id: "heal",
    label: "Heal +1",
    baseCost: 30,
  },
  {
    id: "push",
    label: "Push +1",
    baseCost: 30,
  },
  {
    id: "pull",
    label: "Pull +1",
    baseCost: 20,
  },
  {
    id: "teleport",
    label: "Teleport +1",
    baseCost: 50,
  },
  {
    id: "summonHP",
    label: "Summon HP +1",
    icon: "heal",
    baseCost: 40,
  },
  {
    id: "summonMove",
    label: "Summon Move +1",
    icon: "move",
    baseCost: 60,
  },
  {
    id: "summonAttack",
    label: "Summon Attack +1",
    icon: "attack",
    baseCost: 100,
  },
  {
    id: "summonRange",
    label: "Summon Range +1",
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

function _calculateCosts({
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
      icon: `/assets/img/${icon ?? id}.png`,
      altText: `Frosthaven icon for ${label}`,
    };
  });
}

document.addEventListener("alpine:init", () => {
  Alpine.store("costs", {
    calculated: null,
    calculateCosts(formValues) {
      this.calculated = [..._calculateCosts(formValues)];
    },
  });

  const enhancerLevel = window.localStorage.getItem("enhancerLevel") ?? 1;
  Alpine.data("form", () => ({
    enhancerLevel,
    cardLevel: 1,
    targets: 1,
    priorEnhancements: 0,
    isPersistent: false,
    isLoss: false,
    submit() {
      Alpine.store("costs").calculateCosts({
        enhancerLevel: this.enhancerLevel,
        cardLevel: this.cardLevel,
        targets: this.targets,
        priorEnhancements: this.priorEnhancements,
        isPersistent: this.isPersistent,
        isLoss: this.isLoss,
      });
      window.localStorage.setItem("enhancerLevel", this.enhancerLevel);
    },
  }));
});
