const markTypes = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "square",
    label: "Square",
  },
  {
    id: "circle",
    label: "Circle",
  },
  {
    id: "diamond",
    label: "Diamond",
  },
  {
    id: "diamondPlus",
    label: "Diamond+",
  },
  {
    id: "hex",
    label: "Hex",
  },
];
const markTypeLevels = markTypes.reduce((levels, curr, index) => {
  return {
    ...levels,
    [curr.id]: index,
  };
}, {});
const enhancements = [
  {
    id: "move",
    label: "Move +1",
    baseCost: 30,
    markType: "square",
  },
  {
    id: "attack",
    label: "Attack +1",
    baseCost: 50,
    markType: "square",
  },
  {
    id: "range",
    label: "Range +1",
    baseCost: 30,
    markType: "square",
  },
  {
    id: "target",
    label: "Target +1",
    baseCost: 75,
    markType: "square",
  },
  {
    id: "shield",
    label: "Shield +1",
    baseCost: 80,
    markType: "square",
  },
  {
    id: "retaliate",
    label: "Retaliate +1",
    baseCost: 60,
    markType: "square",
  },
  {
    id: "pierce",
    label: "Pierce +1",
    baseCost: 30,
    markType: "square",
  },
  {
    id: "heal",
    label: "Heal +1",
    baseCost: 30,
    markType: "square",
  },
  {
    id: "push",
    label: "Push +1",
    baseCost: 30,
    markType: "square",
  },
  {
    id: "pull",
    label: "Pull +1",
    baseCost: 20,
    markType: "square",
  },
  {
    id: "teleport",
    label: "Teleport +1",
    baseCost: 50,
    markType: "square",
  },
  {
    id: "summonHP",
    label: "Summon HP +1",
    icon: "heal",
    baseCost: 40,
    markType: "square",
  },
  {
    id: "summonMove",
    label: "Summon Move +1",
    icon: "move",
    baseCost: 60,
    markType: "square",
  },
  {
    id: "summonAttack",
    label: "Summon Attack +1",
    icon: "attack",
    baseCost: 100,
    markType: "square",
  },
  {
    id: "summonRange",
    label: "Summon Range +1",
    icon: "range",
    baseCost: 50,
    markType: "square",
  },
  {
    id: "regenerate",
    label: "Regenerate",
    baseCost: 40,
    markType: "diamondPlus",
  },
  {
    id: "ward",
    label: "Ward",
    baseCost: 75,
    markType: "diamondPlus",
  },
  {
    id: "strengthen",
    label: "Strengthen",
    baseCost: 100,
    markType: "diamondPlus",
  },
  {
    id: "bless",
    label: "Bless",
    baseCost: 75,
    markType: "diamondPlus",
  },
  {
    id: "wound",
    label: "Wound",
    baseCost: 75,
    markType: "diamond",
  },
  {
    id: "poison",
    label: "Poison",
    baseCost: 50,
    markType: "diamond",
  },
  {
    id: "immobilize",
    label: "Immobilize",
    baseCost: 150,
    markType: "diamond",
  },
  {
    id: "muddle",
    label: "Muddle",
    baseCost: 40,
    markType: "diamond",
  },
  {
    id: "curse",
    label: "Curse",
    baseCost: 150,
    markType: "diamond",
  },
  {
    id: "element",
    label: "Element",
    baseCost: 100,
    markType: "circle",
  },
  {
    id: "wildElement",
    label: "Wild Element",
    baseCost: 150,
    markType: "circle",
  },
  {
    id: "jump",
    label: "Jump",
    baseCost: 60,
    markType: "square",
  },
  {
    id: "areaHex",
    label: "Area-of-Effect Hex",
    baseCost: 200,
    markType: "hex",
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
  return enhancements.map(({ id, label, baseCost, icon, markType }) => {
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
      markType,
      icon: `/assets/img/${icon ?? id}.png`,
      altText: `Frosthaven icon for ${label}`,
    };
  });
}

document.addEventListener("alpine:init", () => {
  Alpine.store("costs", {
    calculated: null,
    filtered: null,
    markType: "all",
    calculateCosts(formValues) {
      this.markType = "all";
      this.calculated = [..._calculateCosts(formValues)];
      this.filtered = this.calculated;
    },
    filterCosts(markType, calculated) {
      if (markType === "all") {
        this.filtered = calculated;
      } else if (markType === "hex") {
        this.filtered = this.calculated.filter((cost) => {
          return cost.markType === "hex";
        });
      } else {
        const selectedTypeLevel = markTypeLevels[markType];
        this.filtered = this.calculated.filter((cost) => {
          const level = markTypeLevels[cost.markType];
          return level <= selectedTypeLevel;
        });
      }
    },
  });

  Alpine.data("form", () => ({
    enhancerLevel: Alpine.$persist(1),
    cardLevel: 1,
    targets: 1,
    priorEnhancements: 0,
    isPersistent: false,
    isLoss: false,
  }));
});
