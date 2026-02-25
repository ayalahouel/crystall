const classSelectionScreen = document.getElementById("class-selection-screen");
const gameUiScreen = document.getElementById("game-ui");
const classOptionCards = document.querySelectorAll(".class-card");

const playerClassDisplay = document.getElementById("player-class");
const playerLevelDisplay = document.getElementById("player-level");
const playerXpDisplay = document.getElementById("player-xp");
const playerXpNeededDisplay = document.getElementById("player-xp-needed");
const playerHpDisplay = document.getElementById("player-hp");
const playerMaxHpDisplay = document.getElementById("player-max-hp");
const playerManaDisplay = document.getElementById("player-mana");
const playerMaxManaDisplay = document.getElementById("player-max-mana");
const playerGoldDisplay = document.getElementById("player-gold");

const playerFoodDisplay = document.getElementById("player-food");
const playerIdlePointsDisplay = document.getElementById("player-idle-points");
const displayUserId = document.getElementById("display-user-id");
const playerClassImage = document.getElementById("player-class-image");

const messageLogElement = document.getElementById("message-log");
const customMessageBox = document.getElementById("custom-message-box");

const gameViewButtons = document.querySelectorAll(".game-footer .game-button");

const gameFooter = document.getElementsByClassName("game-footer");

const gameViews = {
    map: document.getElementById("map-screen"),
    inventory: document.getElementById("inventory-screen"),
    shop: document.getElementById("shop-screen"),
    skills: document.getElementById("skills-screen"),
    combat: document.getElementById("combat-screen"),
    camp: document.getElementById("camp-screen"),
};

const inventoryTabButtons = document.querySelectorAll(".inventory-tab-button");
const inventoryTabs = {
    equip: document.getElementById("equip-tab"),
    use: document.getElementById("use-tab"),
    materials: document.getElementById("materials-tab"),
};

const locationContainer = document.getElementById("location-container");
const currentLocationDisplay = document.getElementById(
    "current-location-display"
);
const locationActionsContainer = document.getElementById("location-actions");

const playerCombatHpDisplay = document.getElementById("player-combat-hp");
const playerCombatManaDisplay = document.getElementById("player-combat-mana");

const enemyImageDisplay = document.getElementById("enemy-image");
const enemyIconDisplay = document.getElementById("enemy-icon");
const enemyNameDisplay = document.getElementById("enemy-name");
const enemyHpDisplay = document.getElementById("enemy-hp");
const enemyMaxHpDisplay = document.getElementById("enemy-max-hp");
const attackButton = document.getElementById("attack-button");
const spellButton = document.getElementById("spell-button");
const fleeButton = document.getElementById("flee-button");

const craftingRecipeSelect = document.getElementById("crafting-recipe-select");
const craftButton = document.getElementById("craft-button");
const craftingMessage = document.getElementById("crafting-message");

const shopBuyItemsContainer = document.getElementById("shop-buy-items");
const shopSellItemsContainer = document.getElementById("shop-sell-items");
const shopMessage = document.getElementById("shop-message");

const campBuildingsContainer = document.getElementById(
    "camp-buildings-container"
);
const campMessage = document.getElementById("camp-message");

let player = {
    class: null,
    level: 1,
    xp: 0,
    xpNeeded: 100,
    hp: 0,
    maxHp: 0,
    mana: 0,
    maxMana: 0,
    gold: 0,

    food: 100,
    maxFood: 100,
    actionPoints: 0,
    inventory: {
        equip: [],
        use: [],
        materials: [],
    },
    equipped: {
        weapon: null,
        helmet: null,
        chest: null,
        boots: null,
    },
    skills: {},
    skillPoints: 0,
    currentLocation: "starting_plains",
    lastTick: Date.now(),
    bonuses: {},
    hpRegenPerTick: 0,
    manaRegenPerTick: 0,

    consecutiveFleeAttempts: 0,
    stats: {
        attack: 10,
        defense: 5,
        magicAttack: 10,
    },
    effectiveStats: {
        attack: 0,
        defense: 0,
        magicAttack: 0,
        critChance: 0,
        dodgeChance: 0,
    },
    allowedWeaponTypes: [],
    buildings: {},
    statusEffects: {},
};

let currentEnemy = null;

const gameData = {
    classes: {
        Warrior: {
            name: "Warrior",
            icon: "⚔️",
            description:
                "High HP & Physical Strength. Master of Swords and Axes.",
            bonusText: "Bonus: +10% Gold from combat.",
            baseStats: {
                hp: 120,
                maxHp: 120,
                mana: 30,
                maxMana: 30,
                attack: 15,
                defense: 10,
                magicAttack: 5,
            },
            bonuses: { goldBonus: 0.1 },
            allowedWeaponTypes: ["sword", "axe"],
            skillTree: [
                "warrior_cleave",
                "warrior_shield_bash",
                "warrior_berserk",
            ],
            image: "warrior.jpg",
        },
        Mage: {
            name: "Mage",
            icon: "🪄",
            description:
                "High Magic Damage & Mana Regen. Wields Staves and Orbs.",
            bonusText: "Bonus: +10% XP from combat.",
            baseStats: {
                hp: 80,
                maxHp: 80,
                mana: 100,
                maxMana: 100,
                attack: 5,
                defense: 5,
                magicAttack: 15,
            },
            bonuses: { xpBonus: 0.1, manaRegenBonus: 0.05 },
            allowedWeaponTypes: ["staff", "orb"],
            skillTree: [
                "mage_fireball",
                "mage_mana_shield",
                "mage_arcane_mastery",
                "mage_explosion",
            ],
            image: "mage.jpg",
        },
        Thief: {
            name: "Thief",
            icon: "�",
            description:
                "High Critical Chance & Dodge Rate. Prefers Daggers and Bows.",
            bonusText: "Bonus: +10% chance for rare materials.",
            baseStats: {
                hp: 90,
                maxHp: 90,
                mana: 50,
                maxMana: 50,
                attack: 12,
                defense: 7,
                magicAttack: 8,
            },
            bonuses: {
                rareMaterialChance: 0.1,
                critChance: 0.1,
                dodgeChance: 0.05,
            },
            allowedWeaponTypes: ["dagger", "bow"],
            skillTree: [
                "thief_backstab",
                "thief_evasion",
                "thief_poison_blade",
            ],
            image: "thief.jpg",
        },
        Healer: {
            name: "Healer",
            icon: "🩹",
            description:
                "Passive Healing & Support Buffs. Uses Wands and Holy Symbols.",
            bonusText: "Bonus: +5 HP regen per second.",
            baseStats: {
                hp: 100,
                maxHp: 100,
                mana: 80,
                maxMana: 80,
                attack: 7,
                defense: 8,
                magicAttack: 10,
            },
            bonuses: { hpRegenPerTickBonus: 5 },
            allowedWeaponTypes: ["wand", "holy_symbol"],
            skillTree: ["healer_heal", "healer_bless", "healer_divine_barrier"],
            image: "healer.jpg",
        },
        Guns: {
            name: "Guns",
            icon: "/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿",
            description: "Brr Brr",
            bonusText: "Bonus: Aura",
            baseStats: {
                hp: 70,
                maxHp: 70,
                mana: 120,
                maxMana: 120,
                attack: 10,
                defense: 6,
                magicAttack: 10,
            },
            bonuses: { manaRegenBonus: 0.15 },
            allowedWeaponTypes: ["gun", "orb", "wand", "holy_symbol"],
            skillTree: ["have_you_ever_tried_this_one", "sybau"],
            image: "guns.jpg",
        },
        "Forest Warden": {
            name: "Forest Warden",
            icon: "🌳",
            description: "Guardian of nature. Proficient with Bows and Spears.",
            bonusText: "Bonus: No",
            baseStats: {
                hp: 110,
                maxHp: 110,
                mana: 60,
                maxMana: 60,
                attack: 10,
                defense: 9,
                magicAttack: 7,
            },
            bonuses: { staminaRegenBonus: 0.1 },
            allowedWeaponTypes: ["bow", "spear"],
            skillTree: ["forest_arrow_volley", "forest_nature_call"],
            image: "forest-warden.jpg",
        },
    },
    locations: {
        starting_plains: {
            id: "starting_plains",
            name: "Starting Plains",
            icon: "🏞️",
            description: "Gentle fields, perfect for beginners.",
            levelRequirement: 1,
            type: "biome",
            activities: ["explore_combat", "gather_plain_resources"],
            monsters: ["Slime", "Goblin"],
            resources: ["plain_grass", "small_stone"],
            connectedLocations: [
                "whispering_woods",
                "forest_clearing",
                "the_guild",
            ],
        },
        whispering_woods: {
            id: "whispering_woods",
            name: "Whispering Woods",
            icon: "🌲",
            description: "An eerie forest, home to sly creatures.",
            levelRequirement: 5,
            type: "biome",
            activities: [
                "explore_combat",
                "gather_forest_resources",
                "chop_wood",
            ],
            monsters: ["Forest Sprite", "Dire Wolf Pup"],
            resources: ["oak_wood", "forest_herb"],
            connectedLocations: ["starting_plains", "mountain_pass"],
        },
        forest_clearing: {
            id: "forest_clearing",
            name: "Forest Clearing",
            icon: "🌳",
            description: "A peaceful clearing, good for foraging.",
            levelRequirement: 3,
            type: "gathering_zone",
            activities: ["gather_forest_resources", "forage_berries"],
            resources: ["forest_herb", "wild_berries"],
            connectedLocations: ["starting_plains", "whispering_woods"],
        },
        the_guild: {
            id: "the_guild",
            name: "The Adventurer's Guild",
            icon: "🏛️",
            description: "Where adventurers gather for quests and supplies.",
            levelRequirement: 1,
            type: "town",
            activities: ["visit_shop", "take_quest"],
            connectedLocations: ["starting_plains"],
        },
        mountain_pass: {
            id: "mountain_pass",
            name: "Mountain Pass",
            icon: "⛰️",
            description: "A treacherous path through the mountains.",
            levelRequirement: 8,
            type: "biome",
            activities: ["explore_combat", "mine_ore"],
            monsters: ["Rock Golem", "Mountain Troll"],
            resources: ["iron_ore", "coal"],
            connectedLocations: ["whispering_woods", "molten_peaks"],
        },
        molten_peaks: {
            id: "molten_peaks",
            name: "Molten Peaks",
            icon: "🌋",
            description:
                "Volcanic mountains, dangerous and rich in rare minerals.",
            levelRequirement: 10,
            type: "biome",
            activities: ["explore_combat", "mine_rare_ore"],
            monsters: ["Fire Elemental", "Lava Golem"],
            resources: ["obsidian_shard", "volcanic_ash"],
            connectedLocations: ["mountain_pass", "sunken_city"],
        },
        sunken_city: {
            id: "sunken_city",
            name: "Sunken City",
            icon: "🦑",
            description:
                "Ancient ruins submerged, filled with aquatic horrors.",
            levelRequirement: 15,
            type: "biome",
            activities: ["explore_combat", "fish_abyssal"],
            monsters: ["Kraken Spawn", "Deep Sea Naga"],
            resources: ["coral_fragment", "abyssal_pearl"],
            connectedLocations: ["molten_peaks", "shadowfell_citadel"],
        },
        shadowfell_citadel: {
            id: "shadowfell_citadel",
            name: "Shadowfell Citadel",
            icon: "🏰",
            description:
                "The Demon King's stronghold. Only the strongest may enter.",
            levelRequirement: 20,
            type: "biome",
            activities: ["explore_combat"],
            monsters: ["Demon Imp", "Shadow Beast", "Demon King"],
            resources: ["shadow_essence", "demonic_ore"],
            connectedLocations: ["sunken_city"],
        },
    },
    activities: {
        explore_combat: {
            name: "Explore (Combat)",
            icon: "⚔️",
            foodCost: 5,
            type: "combat",
            description: "Venture forth and seek out monsters to fight.",
        },
        gather_plain_resources: {
            name: "Gather Plains Resources",
            icon: "🧺",
            foodCost: 2,
            type: "gather",
            description: "Collect grass and small stones.",
            yields: [
                { itemId: "plain_grass", min: 1, max: 3 },
                { itemId: "small_stone", min: 1, max: 2 },
            ],
        },
        gather_forest_resources: {
            name: "Gather Forest Resources",
            icon: "🌿",
            foodCost: 3,
            type: "gather",
            description: "Forage for herbs and other forest materials.",
            yields: [
                { itemId: "forest_herb", min: 1, max: 3 },
                { itemId: "oak_wood", min: 0, max: 1 },
            ],
        },
        chop_wood: {
            name: "Chop Wood",
            icon: "🪓",
            foodCost: 7,
            type: "gather",
            description: "Chop down trees for lumber.",
            yields: [{ itemId: "oak_wood", min: 2, max: 5 }],
        },
        forage_berries: {
            name: "Forage for Berries",
            icon: "🍓",
            foodCost: 1,
            type: "gather",
            description: "Search for edible berries to restore food.",
            yields: [{ itemId: "wild_berries", min: 2, max: 5, isFood: true }],
        },
        visit_shop: {
            name: "Visit Shop",
            icon: "🛒",
            foodCost: 0,
            type: "interaction",
            description: "Browse and trade items with the local merchant.",
        },
        take_quest: {
            name: "Take Quest",
            icon: "📜",
            foodCost: 0,
            type: "interaction",
            description: "Accept new challenges from the Guild Master.",
        },
        mine_ore: {
            name: "Mine Ore",
            icon: "⛏️",
            foodCost: 6,
            type: "gather",
            description: "Mine for common ores like iron and coal.",
            yields: [
                { itemId: "iron_ore", min: 1, max: 3 },
                { itemId: "coal", min: 1, max: 2 },
            ],
        },
        mine_rare_ore: {
            name: "Mine Rare Ore",
            icon: "💎",
            foodCost: 10,
            type: "gather",
            description: "Mine for rare volcanic minerals.",
            yields: [
                { itemId: "obsidian_shard", min: 1, max: 2 },
                { itemId: "volcanic_ash", min: 1, max: 3 },
            ],
        },
        fish_abyssal: {
            name: "Fish Abyssal",
            icon: "🎣",
            foodCost: 8,
            type: "gather",
            description: "Fish for exotic creatures in the sunken depths.",
            yields: [
                { itemId: "abyssal_pearl", min: 0, max: 1 },
                { itemId: "mana_crystal", min: 0, max: 1 },
            ],
        },
    },
    items: {
        slime_goo: {
            id: "slime_goo",
            name: "Slime Goo",
            type: "materials",
            description: "A sticky, jiggly substance.",
            icon: "🧪",
            sellPrice: 1,
        },
        goblin_ear: {
            id: "goblin_ear",
            name: "Goblin Ear",
            type: "materials",
            description: "A grotesque trophy.",
            icon: "👂",
            sellPrice: 2,
        },
        oak_wood: {
            id: "oak_wood",
            name: "Oak Wood",
            type: "materials",
            description: "Sturdy wood for crafting.",
            icon: "🪵",
            sellPrice: 3,
        },
        forest_herb: {
            id: "forest_herb",
            name: "Forest Herb",
            type: "materials",
            description: "A common herb.",
            icon: "🌿",
            sellPrice: 1,
        },
        iron_ore: {
            id: "iron_ore",
            name: "Iron Ore",
            type: "materials",
            description: "Raw iron.",
            icon: "🪨",
            sellPrice: 5,
        },
        leather_scrap: {
            id: "leather_scrap",
            name: "Leather Scrap",
            type: "materials",
            description: "Small piece of leather.",
            icon: "✂️",
            sellPrice: 2,
        },
        mana_crystal: {
            id: "mana_crystal",
            name: "Mana Crystal",
            type: "materials",
            description: "Shimmering crystal, imbued with magic.",
            icon: "💎",
            sellPrice: 10,
        },
        demon_blood: {
            id: "demon_blood",
            name: "Demon Blood",
            type: "materials",
            description: "Corrupted blood, highly potent.",
            icon: "🩸",
            sellPrice: 50,
        },
        plain_grass: {
            id: "plain_grass",
            name: "Plain Grass",
            type: "materials",
            description: "Common grass from the plains.",
            icon: "🌱",
            sellPrice: 0.5,
        },
        small_stone: {
            id: "small_stone",
            name: "Small Stone",
            type: "materials",
            description: "A small, ordinary stone.",
            icon: "🪨",
            sellPrice: 0.5,
        },
        dire_wolf_pup_meat: {
            id: "dire_wolf_pup_meat",
            name: "Dire Wolf Pup Meat",
            type: "materials",
            description: "Raw meat from a dire wolf pup.",
            icon: "🥩",
            sellPrice: 4,
        },
        wild_berries: {
            id: "wild_berries",
            name: "Wild Berries",
            type: "materials",
            description: "Sweet berries, can be eaten for food.",
            icon: "🍓",
            sellPrice: 1,
            effect: { food: 5, hp: 1 },
        },
        coal: {
            id: "coal",
            name: "Coal",
            type: "materials",
            description: "A black, combustible mineral.",
            icon: "⚫",
            sellPrice: 2,
        },
        obsidian_shard: {
            id: "obsidian_shard",
            name: "Obsidian Shard",
            type: "materials",
            description: "Sharp volcanic glass.",
            icon: "🔪",
            sellPrice: 8,
        },
        volcanic_ash: {
            id: "volcanic_ash",
            name: "Volcanic Ash",
            type: "materials",
            description: "Fine ash from volcanic activity.",
            icon: "🌫️",
            sellPrice: 3,
        },
        coral_fragment: {
            id: "coral_fragment",
            name: "Coral Fragment",
            type: "materials",
            description: "A piece of vibrant coral.",
            icon: "🐚",
            sellPrice: 4,
        },
        abyssal_pearl: {
            id: "abyssal_pearl",
            name: "Abyssal Pearl",
            type: "materials",
            description: "A rare pearl from the deep sea.",
            icon: "⚪",
            sellPrice: 25,
        },
        shadow_essence: {
            id: "shadow_essence",
            name: "Shadow Essence",
            type: "materials",
            description: "Condensed darkness.",
            icon: "🌌",
            sellPrice: 30,
        },
        demonic_ore: {
            id: "demonic_ore",
            name: "Demonic Ore",
            type: "materials",
            description: "Ore from the Demon King's domain.",
            icon: "🪨",
            sellPrice: 40,
        },

        healing_potion_small: {
            id: "healing_potion_small",
            name: "Small Healing Potion",
            type: "use",
            effect: { hp: 20 },
            description: "Restores 20 HP.",
            icon: "🧪",
            sellPrice: 5,
            buyPrice: 10,
        },
        mana_potion_small: {
            id: "mana_potion_small",
            name: "Small Mana Potion",
            type: "use",
            effect: { mana: 20 },
            description: "Restores 20 Mana.",
            icon: "💧",
            sellPrice: 5,
            buyPrice: 10,
        },
        bread: {
            id: "bread",
            name: "Bread",
            type: "use",
            effect: { food: 10, hp: 5 },
            description: "A basic loaf of bread, restores 10 food.",
            icon: "🍞",
            sellPrice: 2,
            buyPrice: 5,
        },
        cooked_meat: {
            id: "cooked_meat",
            name: "Cooked Meat",
            type: "use",
            effect: { food: 25, hp: 10 },
            description: "Hearty meal, restores 25 food.",
            icon: "🍖",
            sellPrice: 8,
            buyPrice: 15,
        },

        wooden_sword: {
            id: "wooden_sword",
            name: "Wooden Sword",
            type: "equip",
            slot: "weapon",
            weaponType: "sword",
            stats: { attack: 5 },
            description: "A simple wooden sword.",
            icon: "🗡️",
            sellPrice: 10,
            buyPrice: 20,
        },
        iron_sword: {
            id: "iron_sword",
            name: "Iron Sword",
            type: "equip",
            slot: "weapon",
            weaponType: "sword",
            stats: { attack: 15 },
            description: "A sturdy iron sword.",
            icon: "⚔️",
            sellPrice: 50,
            buyPrice: 100,
        },
        apprentice_staff: {
            id: "apprentice_staff",
            name: "Apprentice Staff",
            type: "equip",
            slot: "weapon",
            weaponType: "staff",
            stats: { magicAttack: 8 },
            description: "A basic staff for new mages.",
            icon: "杖",
            sellPrice: 12,
            buyPrice: 25,
        },
        leather_dagger: {
            id: "leather_dagger",
            name: "Leather Dagger",
            type: "equip",
            slot: "weapon",
            weaponType: "dagger",
            stats: { attack: 7, critChance: 0.05 },
            description: "A small, sharp dagger.",
            icon: "🔪",
            sellPrice: 10,
            buyPrice: 20,
        },
        iron_axe: {
            id: "iron_axe",
            name: "Iron Axe",
            type: "equip",
            slot: "weapon",
            weaponType: "axe",
            stats: { attack: 18 },
            description: "A heavy iron axe.",
            icon: "🪓",
            sellPrice: 60,
            buyPrice: 120,
        },

        leather_helmet: {
            id: "leather_helmet",
            name: "Leather Helmet",
            type: "equip",
            slot: "helmet",
            stats: { defense: 2 },
            description: "A basic leather helmet.",
            icon: "🪖",
            sellPrice: 5,
            buyPrice: 10,
        },
        leather_chest: {
            id: "leather_chest",
            name: "Leather Tunic",
            type: "equip",
            slot: "chest",
            stats: { defense: 5 },
            description: "A light leather tunic.",
            icon: "👕",
            sellPrice: 8,
            buyPrice: 15,
        },
        leather_boots: {
            id: "leather_boots",
            name: "Leather Boots",
            type: "equip",
            slot: "boots",
            stats: { defense: 1 },
            description: "Simple leather boots.",
            icon: "👢",
            sellPrice: 3,
            buyPrice: 7,
        },
    },
    recipes: {
        healing_potion_small: {
            name: "Small Healing Potion",
            materials: [
                { id: "forest_herb", quantity: 2 },
                { id: "slime_goo", quantity: 1 },
            ],
            result: { id: "healing_potion_small", quantity: 1 },
            description: "Craft a small healing potion.",
            icon: "🧪",
        },
        iron_sword: {
            name: "Iron Sword",
            materials: [
                { id: "iron_ore", quantity: 3 },
                { id: "oak_wood", quantity: 1 },
            ],
            result: { id: "iron_sword", quantity: 1 },
            description: "Craft a sturdy iron sword.",
            icon: "⚔️",
        },
        cooked_meat: {
            name: "Cooked Meat",
            materials: [
                { id: "dire_wolf_pup_meat", quantity: 1 },
                { id: "forest_herb", quantity: 1 },
            ],
            result: { id: "cooked_meat", quantity: 1 },
            description: "Cook raw meat to restore more food.",
            icon: "🍖",
        },
        iron_axe: {
            name: "Iron Axe",
            materials: [
                { id: "iron_ore", quantity: 4 },
                { id: "oak_wood", quantity: 2 },
            ],
            result: { id: "iron_axe", quantity: 1 },
            description: "Craft a powerful iron axe.",
            icon: "🪓",
        },
    },
    skills: {
        warrior_cleave: {
            id: "warrior_cleave",
            name: "Cleave",
            class: "Warrior",
            cost: 1,
            levelRequirement: 2,
            prerequisites: [],
            description: "Unleash a powerful attack hitting all enemies.",
            maxLevel: 5,
            baseEffects: { damageMultiplier: 1.2, manaCost: 10 },
            levelScaling: { damageMultiplier: 0.1 },
            type: "active",
        },
        warrior_shield_bash: {
            id: "warrior_shield_bash",
            name: "Shield Bash",
            class: "Warrior",
            cost: 1,
            levelRequirement: 5,
            prerequisites: ["warrior_cleave"],
            description: "Stun an enemy for 1 turn.",
            maxLevel: 3,
            baseEffects: { stunChance: 0.7, manaCost: 15 },
            levelScaling: { stunChance: 0.1 },
            type: "active",
        },
        warrior_berserk: {
            id: "warrior_berserk",
            name: "Berserk",
            class: "Warrior",
            cost: 2,
            levelRequirement: 10,
            prerequisites: ["warrior_shield_bash"],
            description:
                "Greatly increase attack for 3 turns, but lower defense. Passive effect.",
            maxLevel: 3,
            baseEffects: { attackBoost: 0.5, defensePenalty: 0.2 },
            levelScaling: { attackBoost: 0.1, defensePenalty: -0.05 },
            type: "passive",
        },

        mage_fireball: {
            id: "mage_fireball",
            name: "Fireball",
            class: "Mage",
            cost: 1,
            levelRequirement: 2,
            prerequisites: [],
            description: "Hurl a fiery projectile at an enemy.",
            maxLevel: 5,
            baseEffects: { magicDamageMultiplier: 1.5, manaCost: 10 },
            levelScaling: { magicDamageMultiplier: 0.2 },
            type: "active",
        },
        mage_mana_shield: {
            id: "mage_mana_shield",
            name: "Mana Shield",
            class: "Mage",
            cost: 1,
            levelRequirement: 5,
            prerequisites: ["mage_fireball"],
            description: "Convert incoming damage to mana loss for 2 turns.",
            maxLevel: 3,
            baseEffects: {
                damageToManaConversion: 0.5,
                duration: 2,
                manaCost: 20,
            },
            levelScaling: { damageToManaConversion: 0.1 },
            type: "active",
        },
        mage_arcane_mastery: {
            id: "mage_arcane_mastery",
            name: "Arcane Mastery",
            class: "Mage",
            cost: 2,
            levelRequirement: 10,
            prerequisites: ["mage_mana_shield"],
            description:
                "Increase all magic damage and mana regeneration. Passive effect.",
            maxLevel: 3,
            baseEffects: { magicAttackBoost: 0.15, manaRegenBoost: 0.1 },
            levelScaling: { magicAttackBoost: 0.05, manaRegenBoost: 0.02 },
            type: "passive",
        },
        mage_explosion: {
            id: "mage_explosion",
            name: "Explosion",
            class: "Mage",
            cost: 3,
            levelRequirement: 15,
            prerequisites: ["mage_arcane_mastery"],
            description:
                "Unleash a devastating explosion. Consumes all mana. At max level, it's an instant kill.",
            maxLevel: 3,
            baseEffects: { damage: 100, manaCost: "all" },
            levelScaling: { damage: 50 },
            type: "active",
        },

        thief_backstab: {
            id: "thief_backstab",
            name: "Backstab",
            class: "Thief",
            cost: 1,
            levelRequirement: 2,
            prerequisites: [],
            description: "Deal massive damage if enemy HP is above 70%.",
            maxLevel: 5,
            baseEffects: {
                damageMultiplier: 2.0,
                hpThreshold: 0.7,
                manaCost: 10,
            },
            levelScaling: { damageMultiplier: 0.15 },
            type: "active",
        },
        thief_evasion: {
            id: "thief_evasion",
            name: "Evasion",
            class: "Thief",
            cost: 1,
            levelRequirement: 5,
            prerequisites: ["thief_backstab"],
            description: "Greatly increase dodge chance for 1 turn.",
            maxLevel: 3,
            baseEffects: { dodgeBoost: 0.5, duration: 1, manaCost: 15 },
            levelScaling: { dodgeBoost: 0.1 },
            type: "active",
        },
        thief_poison_blade: {
            id: "thief_poison_blade",
            name: "Poison Blade",
            class: "Thief",
            cost: 2,
            levelRequirement: 10,
            prerequisites: ["thief_evasion"],
            description:
                "Attacks have a chance to poison enemy for damage over time. Passive effect.",
            maxLevel: 3,
            baseEffects: {
                poisonChance: 0.2,
                poisonDamage: 5,
                poisonDuration: 3,
            },
            levelScaling: { poisonChance: 0.05, poisonDamage: 2 },
            type: "passive",
        },

        healer_heal: {
            id: "healer_heal",
            name: "Heal",
            class: "Healer",
            cost: 1,
            levelRequirement: 2,
            prerequisites: [],
            description: "Restore a moderate amount of your HP.",
            maxLevel: 5,
            baseEffects: { hpRestore: 40, manaCost: 10 },
            levelScaling: { hpRestore: 10 },
            type: "active",
        },
        healer_bless: {
            id: "healer_bless",
            name: "Bless",
            class: "Healer",
            cost: 1,
            levelRequirement: 5,
            prerequisites: ["healer_heal"],
            description: "Increase your defense for 3 turns.",
            maxLevel: 3,
            baseEffects: { defenseBoost: 0.2, duration: 3, manaCost: 15 },
            levelScaling: { defenseBoost: 0.05 },
            type: "active",
        },
        healer_divine_barrier: {
            id: "healer_divine_barrier",
            name: "Divine Barrier",
            class: "Healer",
            cost: 2,
            levelRequirement: 10,
            prerequisites: ["healer_bless"],
            description:
                "Gain a temporary shield that absorbs damage. Passive effect.",
            maxLevel: 3,
            baseEffects: { shieldAmount: 50 },
            levelScaling: { shieldAmount: 20 },
            type: "passive",
        },

        arcane_nova: {
            id: "arcane_nova",
            name: "Arcane Nova",
            class: "Arcane Sage",
            cost: 3,
            levelRequirement: 12,
            prerequisites: [],
            description:
                "Deal massive magic damage to all enemies. High Mana cost.",
            maxLevel: 5,
            baseEffects: { magicDamageMultiplier: 2.5, manaCost: 30 },
            levelScaling: { magicDamageMultiplier: 0.3 },
            type: "active",
        },
        arcane_time_warp: {
            id: "arcane_time_warp",
            name: "Time Warp",
            class: "Arcane Sage",
            cost: 2,
            levelRequirement: 15,
            prerequisites: ["arcane_nova"],
            description: "Gain an extra turn in combat. Very high Mana cost.",
            maxLevel: 1,
            baseEffects: { extraTurn: true, manaCost: 50 },
            levelScaling: {},
            type: "active",
        },

        forest_arrow_volley: {
            id: "forest_arrow_volley",
            name: "Arrow Volley",
            class: "Forest Warden",
            cost: 2,
            levelRequirement: 12,
            prerequisites: [],
            description: "Rain arrows on all enemies, dealing physical damage.",
            maxLevel: 5,
            baseEffects: { damageMultiplier: 1.5, manaCost: 20 },
            levelScaling: { damageMultiplier: 0.2 },
            type: "active",
        },
        forest_nature_call: {
            id: "forest_nature_call",
            name: "Nature's Call",
            class: "Forest Warden",
            cost: 2,
            levelRequirement: 15,
            prerequisites: ["forest_arrow_volley"],
            description: "Heal yourself and gain a temporary defense boost.",
            maxLevel: 3,
            baseEffects: {
                hpRestore: 30,
                defenseBoost: 0.15,
                duration: 3,
                manaCost: 25,
            },
            levelScaling: { hpRestore: 10, defenseBoost: 0.05 },
            type: "active",
        },
    },
    monsters: {
        Slime: {
            name: "Slime",
            icon: "🦠",
            image: "slime.png",
            hp: 20,
            maxHp: 20,
            attack: 5,
            defense: 2,
            xpDrop: 10,
            goldDrop: 5,
            lootTable: [
                { itemId: "slime_goo", chance: 0.8, quantity: 1 },
                { itemId: "plain_grass", chance: 0.5, quantity: 1 },
            ],
            attackType: "physical",
            effects: [],
        },
        Goblin: {
            name: "Goblin",
            icon: "👺",
            image: "goblin.png",
            hp: 35,
            maxHp: 35,
            attack: 8,
            defense: 3,
            xpDrop: 15,
            goldDrop: 8,
            lootTable: [
                { itemId: "goblin_ear", chance: 0.5, quantity: 1 },
                { itemId: "small_stone", chance: 0.4, quantity: 1 },
            ],
            attackType: "physical",
            effects: [
                { type: "weakness", chance: 0.1, duration: 2, strength: 0.1 },
            ],
        },
        "Forest Sprite": {
            name: "Forest Sprite",
            icon: "🧚",
            image: "forest_sprite.png",
            hp: 50,
            maxHp: 50,
            attack: 10,
            defense: 5,
            xpDrop: 25,
            goldDrop: 12,
            lootTable: [{ itemId: "forest_herb", chance: 0.6, quantity: 1 }],
            attackType: "magic",
            effects: [{ type: "mana_drain", chance: 0.15, amount: 5 }],
        },
        "Dire Wolf Pup": {
            name: "Dire Wolf Pup",
            icon: "🐺",
            image: "dire_wolf_pup.png",
            hp: 60,
            maxHp: 60,
            attack: 15,
            defense: 4,
            xpDrop: 30,
            goldDrop: 15,
            lootTable: [
                { itemId: "leather_scrap", chance: 0.4, quantity: 1 },
                { itemId: "dire_wolf_pup_meat", chance: 0.7, quantity: 1 },
            ],
            attackType: "physical",
            effects: [
                { type: "bleed", chance: 0.2, duration: 3, damagePerTurn: 3 },
            ],
        },
        "Rock Golem": {
            name: "Rock Golem",
            icon: "🪨",
            image: "rock_golem.png",
            hp: 70,
            maxHp: 70,
            attack: 18,
            defense: 10,
            xpDrop: 35,
            goldDrop: 18,
            lootTable: [
                { itemId: "small_stone", chance: 0.8, quantity: 3 },
                { itemId: "iron_ore", chance: 0.5, quantity: 1 },
            ],
            attackType: "physical",
            effects: [{ type: "stun", chance: 0.1, duration: 1 }],
        },
        "Mountain Troll": {
            name: "Mountain Troll",
            icon: "🧌",
            image: "mountain_troll.png",
            hp: 90,
            maxHp: 90,
            attack: 22,
            defense: 15,
            xpDrop: 45,
            goldDrop: 22,
            lootTable: [
                { itemId: "iron_ore", chance: 0.6, quantity: 2 },
                { itemId: "leather_scrap", chance: 0.3, quantity: 1 },
            ],
            attackType: "physical",
            effects: [
                {
                    type: "defense_down",
                    chance: 0.15,
                    duration: 2,
                    strength: 0.1,
                },
            ],
        },
        "Fire Elemental": {
            name: "Fire Elemental",
            icon: "🔥",
            image: "fire_elemental.png",
            hp: 80,
            maxHp: 80,
            attack: 20,
            defense: 8,
            xpDrop: 40,
            goldDrop: 20,
            lootTable: [{ itemId: "obsidian_shard", chance: 0.7, quantity: 1 }],
            attackType: "magic",
            effects: [
                { type: "burn", chance: 0.25, duration: 3, damagePerTurn: 5 },
            ],
        },
        "Lava Golem": {
            name: "Lava Golem",
            icon: "🪨🔥",
            image: "lava_golem.png",
            hp: 100,
            maxHp: 100,
            attack: 25,
            defense: 12,
            xpDrop: 50,
            goldDrop: 25,
            lootTable: [
                { itemId: "obsidian_shard", chance: 0.5, quantity: 2 },
                { itemId: "iron_ore", chance: 0.3, quantity: 1 },
            ],
            attackType: "physical",
            effects: [{ type: "slow", chance: 0.2, duration: 2 }],
        },
        "Kraken Spawn": {
            name: "Kraken Spawn",
            icon: "🦑",
            image: "kraken_spawn.png",
            hp: 120,
            maxHp: 120,
            attack: 30,
            defense: 10,
            xpDrop: 60,
            goldDrop: 30,
            lootTable: [{ itemId: "abyssal_pearl", chance: 0.4, quantity: 1 }],
            attackType: "physical",
            effects: [{ type: "wet", chance: 0.2, duration: 2, strength: 0.1 }],
        },
        "Deep Sea Naga": {
            name: "Deep Sea Naga",
            icon: "🧜‍♀️",
            image: "deep_sea_naga.png",
            hp: 150,
            maxHp: 150,
            attack: 35,
            defense: 15,
            xpDrop: 75,
            goldDrop: 35,
            lootTable: [{ itemId: "mana_crystal", chance: 0.5, quantity: 1 }],
            attackType: "magic",
            effects: [{ type: "mana_burn", chance: 0.2, amount: 10 }],
        },
        "Demon Imp": {
            name: "Demon Imp",
            icon: "😈",
            image: "demon_imp.png",
            hp: 180,
            maxHp: 180,
            attack: 40,
            defense: 18,
            xpDrop: 90,
            goldDrop: 40,
            lootTable: [{ itemId: "demon_blood", chance: 0.3, quantity: 1 }],
            attackType: "magic",
            effects: [{ type: "fear", chance: 0.1, duration: 1 }],
        },
        "Shadow Beast": {
            name: "Shadow Beast",
            icon: "👤",
            image: "shadow_beast.png",
            hp: 200,
            maxHp: 200,
            attack: 45,
            defense: 20,
            xpDrop: 100,
            goldDrop: 45,
            lootTable: [{ itemId: "shadow_essence", chance: 0.4, quantity: 1 }],
            attackType: "physical",
            effects: [
                { type: "blind", chance: 0.15, duration: 2, strength: 0.2 },
            ],
        },
        "Demon King": {
            name: "Demon King",
            icon: "👑👹",
            image: "demon_king.jpg",
            hp: 500,
            maxHp: 500,
            attack: 60,
            defense: 30,
            xpDrop: 500,
            goldDrop: 200,
            lootTable: [
                { itemId: "demon_blood", chance: 1.0, quantity: 5 },
                { itemId: "mana_crystal", chance: 0.8, quantity: 3 },
            ],
            attackType: "magic",
            effects: [
                { type: "curse", chance: 0.3, duration: 5, strength: 0.1 },
            ],
        },
    },
    shopItems: [
        { id: "healing_potion_small", type: "use", price: 10, stock: 10 },
        { id: "mana_potion_small", type: "use", price: 10, stock: 10 },
        { id: "bread", type: "use", price: 5, stock: 20 },
        { id: "wooden_sword", type: "equip", price: 20, stock: 5 },
        { id: "apprentice_staff", type: "equip", price: 25, stock: 5 },
        { id: "leather_dagger", type: "equip", price: 20, stock: 5 },
        { id: "leather_helmet", type: "equip", price: 10, stock: 8 },
        { id: "leather_chest", type: "equip", price: 15, stock: 8 },
        { id: "leather_boots", type: "equip", price: 7, stock: 8 },
        { id: "iron_ore", type: "materials", price: 15, stock: 10 },
        { id: "oak_wood", type: "materials", price: 10, stock: 10 },
    ],
    buildings: {
        farm: {
            id: "farm",
            name: "Farm 🧑‍🌾",
            description: "Produces 1 food every 10 seconds.",
            cost: {
                gold: 50,
                materials: [
                    { id: "oak_wood", quantity: 10 },
                    { id: "plain_grass", quantity: 20 },
                ],
            },
            effects: { foodProductionRate: 1 / 10 },
            icon: "🧑‍🌾",
        },
        workshop: {
            id: "workshop",
            name: "Workshop 🛠️",
            description: "Unlocks advanced crafting recipes.",
            cost: {
                gold: 100,
                materials: [
                    { id: "iron_ore", quantity: 5 },
                    { id: "oak_wood", quantity: 15 },
                ],
            },
            effects: { unlocksRecipes: ["iron_axe"] },
            icon: "🛠️",
        },
    },
};

let activeGameLoop = null;
const TICK_INTERVAL = 1000;
const MONSTER_AGRESSION_CHANCE_PER_TICK = 0.02;

function initializeGame() {
    console.log("Initializing Demon Slayer...");
    addLogMessage(
        "Welcome, Adventurer! Choose your class to begin your journey.",
        "system"
    );

    classOptionCards.forEach((card) => {
        card.addEventListener("click", () => {
            const selectedClassName = card.dataset.class;
            if (gameData.classes[selectedClassName]) {
                selectClass(selectedClassName);
            } else {
                console.error("Unknown class selected:", selectedClassName);
                addLogMessage(
                    `Error: Class ${selectedClassName} not found.`,
                    "error"
                );
            }
        });
    });

    gameViewButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const viewId = button.dataset.view;
            switchView(viewId);
        });
    });

    inventoryTabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const tabId = button.dataset.tab;
            switchInventoryTab(tabId);
        });
    });

    if (craftButton) {
        craftButton.addEventListener("click", craftItem);
    }
    populateCraftingRecipes();

    if (displayUserId) displayUserId.textContent = "Local Player";

    if (attackButton) attackButton.addEventListener("click", playerAttack);
    if (spellButton) spellButton.addEventListener("click", castSpell);
    if (fleeButton) fleeButton.addEventListener("click", fleeCombat);

    if (attackButton) attackButton.disabled = true;
    if (spellButton) spellButton.disabled = true;
    if (fleeButton) fleeButton.disabled = true;

    calculateEffectiveStats();
}

/**
 * Selects a class for the player, initializes stats, and starts the game loop.
 * @param {string} className - The name of the class to select.
 */
function selectClass(className) {
    const classData = gameData.classes[className];
    if (!classData) {
        console.error("Attempted to select invalid class:", className);
        addLogMessage(`Error: Could not select class ${className}.`, "error");
        return;
    }

    player.class = className;
    Object.assign(player, classData.baseStats);
    player.stats = {
        attack: classData.baseStats.attack,
        defense: classData.baseStats.defense,
        magicAttack: classData.baseStats.magicAttack,
    };
    player.bonuses = { ...classData.bonuses };
    player.allowedWeaponTypes = [...classData.allowedWeaponTypes];

    player.hpRegenPerTick = player.bonuses.hpRegenPerTickBonus || 1;

    addLogMessage(
        `You have chosen the path of the ${className} ${classData.icon}!`,
        "system"
    );
    console.log("Player selected class:", player);

    if (playerClassImage) {
        const imageName = classData.image || "default.jpg";
        playerClassImage.src = `../img/class/${imageName}`;
        playerClassImage.alt = `${className} Image`;
        playerClassImage.onerror = () => {
            playerClassImage.src =
                "https://placehold.co/150x150/cccccc/000000?text=Class";
            playerClassImage.alt = "Default Class Image";
        };
    }

    classSelectionScreen.classList.replace("active-screen", "hidden-screen");
    gameUiScreen.classList.replace("hidden-screen", "active-screen");

    updatePlayerStatsUI();
    updateLocationUI();
    updateLocationActionsUI();
    calculateEffectiveStats();
    startGameLoop();
}

/**
 * Starts the main game loop for passive effects and monster aggression.
 */
function startGameLoop() {
    if (activeGameLoop) {
        clearInterval(activeGameLoop);
    }
    player.lastTick = Date.now();
    activeGameLoop = setInterval(gameTick, TICK_INTERVAL);
    console.log(
        "Game tick loop started for passive regeneration and monster aggression."
    );

    gameFooter[0].classList.add("active");
}

/**
 * Applies and manages player status effects.
 * @param {string} effectType - The type of effect (ex:, "poison", "weakness").
 * @param {object} effectData - Data for the effect (example., duration, strength, damage).
 */
function applyPlayerStatusEffect(effectType, effectData) {
    player.statusEffects[effectType] = {
        ...effectData,
        turnsLeft: effectData.duration,
    };
    addLogMessage(`You are afflicted with ${effectType}!`, "effect");
    console.log("Player status effects:", player.statusEffects);
    calculateEffectiveStats();
}

/**
 * Removes a player status effect.
 * @param {string} effectType - The type of effect to remove.
 */
function removePlayerStatusEffect(effectType) {
    if (player.statusEffects[effectType]) {
        delete player.statusEffects[effectType];
        addLogMessage(`${effectType} has worn off.`, "effect");
        calculateEffectiveStats();
    }
}

/**
 * Executes every game tick (second), handling passive regeneration, food consumption, and monster aggression.
 */
function gameTick() {
    const now = Date.now();
    const deltaTime = (now - player.lastTick) / 1000;

    for (const effectType in player.statusEffects) {
        const effect = player.statusEffects[effectType];
        if (effect.damagePerTurn) {
            player.hp = Math.max(
                0,
                player.hp - effect.damagePerTurn * deltaTime
            );
            addLogMessage(
                `You take ${Math.floor(
                    effect.damagePerTurn * deltaTime
                )} damage from ${effectType}.`,
                "combat"
            );
        }
    }

    if (player.buildings.farm) {
        const farmEffect = gameData.buildings.farm.effects;
        if (farmEffect.foodProductionRate) {
            player.food = Math.min(
                player.maxFood,
                player.food + farmEffect.foodProductionRate * deltaTime
            );
        }
    }

    const currentLocationData = gameData.locations[player.currentLocation];
    if (
        currentLocationData &&
        currentLocationData.type === "biome" &&
        gameViews.map.classList.contains("active-view") &&
        !currentEnemy
    ) {
        if (Math.random() < MONSTER_AGRESSION_CHANCE_PER_TICK * deltaTime) {
            addLogMessage("You are ambushed!", "combat");
            performActivity("explore_combat");
        }
    }

    player.lastTick = now;
    updatePlayerStatsUI();
}

/**
 * Levels up the player, increasing stats and granting skill points.
 */
function levelUp() {
    player.level++;
    player.xp = player.xp - player.xpNeeded;
    player.xpNeeded = Math.floor(player.xpNeeded * 1.5);

    const levelUpHpBonus = 10 + Math.floor(player.level * 1.5);
    const levelUpManaBonus = 5 + Math.floor(player.level * 0.75);

    player.maxHp += levelUpHpBonus;
    player.hp = player.maxHp;
    player.maxMana += levelUpManaBonus;
    player.mana = player.maxMana;

    player.stats.attack += 1;
    player.stats.defense += 1;
    if (player.class === "Mage" || player.class === "Arcane Sage")
        player.stats.magicAttack += 2;
    else player.stats.magicAttack += 1;

    player.skillPoints++;

    addLogMessage(
        `Congratulations! You've reached Level ${player.level}! Stats increased. You gained 1 skill point.`,
        "system"
    );
    showMessageBox(`Level Up! You are now Level ${player.level}!`, 3000);
    updatePlayerStatsUI();
    updateSkillsUI();
    calculateEffectiveStats();
}

/**
 * Calculates the player's effective combat stats based on base stats, equipped items, and learned skills, and active status effects.
 */
function calculateEffectiveStats() {
    player.effectiveStats = { ...player.stats };

    for (const slot in player.equipped) {
        const item = player.equipped[slot];
        if (item && item.stats) {
            for (const stat in item.stats) {
                player.effectiveStats[stat] =
                    (player.effectiveStats[stat] || 0) + item.stats[stat];
            }
        }
    }

    player.effectiveStats.critChance = player.bonuses.critChance || 0;
    player.effectiveStats.dodgeChance = player.bonuses.dodgeChance || 0;

    for (const skillId in player.skills) {
        const skillLevel = player.skills[skillId];
        if (skillLevel > 0) {
            const skill = gameData.skills[skillId];
            if (skill && skill.type === "passive") {
                for (const effectStat in skill.baseEffects) {
                    let value = skill.baseEffects[effectStat];
                    if (skill.levelScaling && skill.levelScaling[effectStat]) {
                        value +=
                            skill.levelScaling[effectStat] * (skillLevel - 1);
                    }
                    if (effectStat.includes("Boost")) {
                        player.effectiveStats[effectStat.replace("Boost", "")] =
                            (player.effectiveStats[
                                effectStat.replace("Boost", "")
                            ] || 0) *
                            (1 + value);
                    } else if (effectStat.includes("Penalty")) {
                        player.effectiveStats[
                            effectStat.replace("Penalty", "")
                        ] =
                            (player.effectiveStats[
                                effectStat.replace("Penalty", "")
                            ] || 0) *
                            (1 - value);
                    } else if (effectStat === "manaRegenBoost") {
                        player.bonuses.manaRegenBonus =
                            (player.bonuses.manaRegenBonus || 0) + value;
                    } else {
                        player.effectiveStats[effectStat] =
                            (player.effectiveStats[effectStat] || 0) + value;
                    }
                }
            }
        }
    }

    for (const effectType in player.statusEffects) {
        const effect = player.statusEffects[effectType];
        if (effect.type === "weakness") {
            player.effectiveStats.attack =
                player.effectiveStats.attack * (1 - (effect.strength || 0));
        } else if (effect.type === "defense_down") {
            player.effectiveStats.defense =
                player.effectiveStats.defense * (1 - (effect.strength || 0));
        } else if (effect.type === "wet") {
            player.effectiveStats.magicDefense =
                (player.effectiveStats.magicDefense ||
                    player.stats.magicAttack) *
                (1 - (effect.strength || 0));
        } else if (effect.type === "blind") {
            player.effectiveStats.critChance =
                player.effectiveStats.critChance * (1 - (effect.strength || 0));
        } else if (effect.type === "curse") {
            player.effectiveStats.attack =
                player.effectiveStats.attack * (1 - (effect.strength || 0));
            player.effectiveStats.defense =
                player.effectiveStats.defense * (1 - (effect.strength || 0));
            player.effectiveStats.magicAttack =
                player.effectiveStats.magicAttack *
                (1 - (effect.strength || 0));
        }
    }

    player.effectiveStats.attack = Math.max(0, player.effectiveStats.attack);
    player.effectiveStats.defense = Math.max(0, player.effectiveStats.defense);
    player.effectiveStats.magicAttack = Math.max(
        0,
        player.effectiveStats.magicAttack
    );

    console.log("Effective Stats:", player.effectiveStats);
    updatePlayerStatsUI();
}

/**
 * Initiates combat with a random monster from the current biome.
 */
function startCombat() {
    if (currentEnemy) {
        addLogMessage("Already in combat!", "error");
        return;
    }

    const currentLocationData = gameData.locations[player.currentLocation];
    if (
        !currentLocationData ||
        currentLocationData.type !== "biome" ||
        !currentLocationData.monsters ||
        currentLocationData.monsters.length === 0
    ) {
        addLogMessage(
            `No monsters to fight in ${
                gameData.locations[player.currentLocation].name
            }.`,
            "system"
        );
        showMessageBox("It's peaceful here...", 2000);
        return;
    }

    const monsterName =
        currentLocationData.monsters[
            Math.floor(Math.random() * currentLocationData.monsters.length)
        ];
    const monsterTemplate = gameData.monsters[monsterName];

    if (!monsterTemplate) {
        addLogMessage(
            `Error: Monster template for ${monsterName} not found.`,
            "error"
        );
        return;
    }

    currentEnemy = { ...monsterTemplate };
    currentEnemy.hp = currentEnemy.maxHp;
    currentEnemy.statusEffects = {};

    addLogMessage(
        `A wild ${currentEnemy.name} ${currentEnemy.icon} appears!`,
        "combat"
    );
    switchView("combat");
    updateCombatUI();

    if (attackButton) attackButton.disabled = false;
    if (spellButton) spellButton.disabled = false;
    if (fleeButton) fleeButton.disabled = false;
}

/**
 * Handles the player's physical attack action during combat.
 */
function playerAttack() {
    if (!currentEnemy || currentEnemy.hp <= 0) return;

    if (player.statusEffects.stun && player.statusEffects.stun.turnsLeft > 0) {
        addLogMessage("You are stunned and cannot attack!", "effect");
        player.statusEffects.stun.turnsLeft--;
        if (player.statusEffects.stun.turnsLeft <= 0)
            removePlayerStatusEffect("stun");
        enemyAttack();
        return;
    }

    let damageDealt = Math.max(
        1,
        player.effectiveStats.attack - currentEnemy.defense
    );

    let isCritical = false;
    if (Math.random() < player.effectiveStats.critChance) {
        damageDealt = Math.floor(damageDealt * 1.5);
        isCritical = true;
    }

    if (
        player.skills.thief_poison_blade &&
        player.skills.thief_poison_blade > 0
    ) {
        const skill = gameData.skills.thief_poison_blade;
        const currentLevel = player.skills.thief_poison_blade;
        const poisonChance =
            skill.baseEffects.poisonChance +
            skill.levelScaling.poisonChance * (currentLevel - 1);
        const poisonDamage =
            skill.baseEffects.poisonDamage +
            skill.levelScaling.poisonDamage * (currentLevel - 1);

        if (Math.random() < poisonChance) {
            currentEnemy.statusEffects.poison = {
                damage: poisonDamage,
                duration: skill.baseEffects.poisonDuration,
                turnsLeft: skill.baseEffects.poisonDuration,
            };
            addLogMessage(`${currentEnemy.name} is poisoned!`, "combat");
        }
    }

    currentEnemy.hp -= damageDealt;
    addLogMessage(
        `You attack ${currentEnemy.name} for ${damageDealt} damage${
            isCritical ? " (CRITICAL HIT!)" : ""
        }.`,
        "combat"
    );

    if (currentEnemy.hp <= 0) {
        winCombat();
    } else {
        enemyAttack();
    }
    updateCombatUI();
    updatePlayerStatsUI();
}

/**
 * Handles the player casting a spell during combat.
 */
function castSpell() {
    if (
        player.class === "Mage" &&
        player.skills.mage_explosion &&
        player.skills.mage_explosion > 0
    ) {
        const skill = gameData.skills.mage_explosion;
        const currentLevel = player.skills.mage_explosion;

        if (skill.baseEffects.manaCost === "all") {
            if (player.mana < player.maxMana) {
                showMessageBox("You need full mana to cast Explosion!", 2000);
                return;
            }
            player.mana = 0;
        } else if (player.mana < skill.baseEffects.manaCost) {
            showMessageBox("Not enough mana to cast Explosion!", 2000);
            return;
        } else {
            player.mana -= skill.baseEffects.manaCost;
        }

        if (currentLevel === skill.maxLevel) {
            currentEnemy.hp = 0;
            addLogMessage(
                `You unleash a devastating Explosion, instantly defeating ${currentEnemy.name}!`,
                "combat"
            );
        } else {
            let damage =
                skill.baseEffects.damage +
                skill.levelScaling.damage * (currentLevel - 1);
            currentEnemy.hp -= damage;
            addLogMessage(
                `You cast Explosion on ${currentEnemy.name} for ${Math.floor(
                    damage
                )} magic damage!`,
                "combat"
            );
        }

        if (currentEnemy.hp <= 0) {
            winCombat();
        } else {
            enemyAttack();
        }
        updateCombatUI();
        updatePlayerStatsUI();
    } else {
        showMessageBox(
            "No active spells available or Mage Explosion not learned/maxed!",
            2000
        );
    }
}

/**
 * Handles the enemy's attack action during combat.
 */
function enemyAttack() {
    if (!currentEnemy || player.hp <= 0) return;

    for (const effectType in currentEnemy.statusEffects) {
        const effect = currentEnemy.statusEffects[effectType];
        if (effect.damage) {
            currentEnemy.hp = Math.max(0, currentEnemy.hp - effect.damage);
            addLogMessage(
                `${currentEnemy.name} takes ${effect.damage} damage from ${effectType}.`,
                "combat"
            );
        }
        if (effect.turnsLeft !== undefined) {
            effect.turnsLeft--;
            if (effect.turnsLeft <= 0) {
                delete currentEnemy.statusEffects[effectType];
                addLogMessage(
                    `${currentEnemy.name}'s ${effectType} has worn off.`,
                    "combat"
                );
            }
        }
    }
    if (currentEnemy.hp <= 0) {
        winCombat();
        return;
    }

    if (Math.random() < player.effectiveStats.dodgeChance) {
        addLogMessage(
            `${currentEnemy.name} attacks, but you DODGED!`,
            "combat"
        );
        updateCombatUI();
        return;
    }

    let damageTaken;
    if (currentEnemy.attackType === "physical") {
        damageTaken = Math.max(
            1,
            currentEnemy.attack - player.effectiveStats.defense
        );
    } else if (currentEnemy.attackType === "magic") {
        const playerMagicDefense = player.effectiveStats.magicAttack;
        damageTaken = Math.max(1, currentEnemy.attack - playerMagicDefense);
    } else {
        damageTaken = Math.max(1, currentEnemy.attack);
    }

    if (player.statusEffects?.manaShield?.active) {
        const manaCost =
            damageTaken * player.statusEffects.manaShield.conversionRate;
        if (player.mana >= manaCost) {
            player.mana -= manaCost;
            damageTaken = 0;
            addLogMessage(
                `Mana Shield absorbed ${Math.floor(manaCost)} damage!`,
                "combat"
            );
        } else {
            damageTaken -=
                player.mana / player.statusEffects.manaShield.conversionRate;
            player.mana = 0;
            addLogMessage(`Mana Shield partially absorbed damage.`, "combat");
        }
    }

    player.hp -= damageTaken;
    addLogMessage(
        `${currentEnemy.name} attacks you for ${Math.floor(
            damageTaken
        )} damage.`,
        "combat"
    );

    if (currentEnemy.effects && currentEnemy.effects.length > 0) {
        currentEnemy.effects.forEach((effect) => {
            if (Math.random() < effect.chance) {
                if (
                    effect.type === "weakness" ||
                    effect.type === "defense_down" ||
                    effect.type === "wet" ||
                    effect.type === "blind" ||
                    effect.type === "curse"
                ) {
                    applyPlayerStatusEffect(effect.type, {
                        ...effect,
                        turnsLeft: effect.duration,
                    });
                } else if (effect.type === "mana_drain") {
                    player.mana = Math.max(0, player.mana - effect.amount);
                    addLogMessage(
                        `You lose ${effect.amount} mana from ${currentEnemy.name}'s attack!`,
                        "combat"
                    );
                } else if (effect.type === "mana_burn") {
                    player.mana = Math.max(0, player.mana - effect.amount);
                    addLogMessage(
                        `Your mana is burned for ${effect.amount} by ${currentEnemy.name}'s attack!`,
                        "combat"
                    );
                } else if (effect.type === "stun") {
                    applyPlayerStatusEffect(effect.type, {
                        ...effect,
                        turnsLeft: effect.duration,
                    });
                    addLogMessage(
                        `You are stunned by ${currentEnemy.name}'s attack!`,
                        "combat"
                    );
                } else if (effect.type === "bleed" || effect.type === "burn") {
                    applyPlayerStatusEffect(effect.type, {
                        ...effect,
                        turnsLeft: effect.duration,
                    });
                } else if (effect.type === "slow") {
                    applyPlayerStatusEffect(effect.type, {
                        ...effect,
                        turnsLeft: effect.duration,
                    });
                    addLogMessage(
                        `You are slowed by ${currentEnemy.name}'s attack!`,
                        "combat"
                    );
                } else if (effect.type === "fear") {
                    applyPlayerStatusEffect(effect.type, {
                        ...effect,
                        turnsLeft: effect.duration,
                    });
                    addLogMessage(
                        `You are filled with fear by ${currentEnemy.name}'s attack!`,
                        "combat"
                    );
                }
            }
        });
    }

    if (player.hp <= 0) {
        loseCombat();
    }
    updateCombatUI();
    updatePlayerStatsUI();
}

/**
 * Handles the logic when the player wins a combat encounter.
 */
function winCombat() {
    addLogMessage(`You defeated the ${currentEnemy.name}!`, "reward");

    let xpGained = currentEnemy.xpDrop;
    let goldGained = currentEnemy.goldDrop;

    if (player.bonuses.xpBonus) {
        xpGained = Math.floor(xpGained * (1 + player.bonuses.xpBonus));
        addLogMessage(
            `Mage bonus: +${Math.floor(
                currentEnemy.xpDrop * player.bonuses.xpBonus
            )} XP!`,
            "reward"
        );
    }
    if (player.bonuses.goldBonus) {
        goldGained = Math.floor(goldGained * (1 + player.bonuses.goldBonus));
        addLogMessage(
            `Warrior bonus: +${Math.floor(
                currentEnemy.goldDrop * player.bonuses.goldBonus
            )} Gold!`,
            "reward"
        );
    }

    player.xp += xpGained;
    player.gold += goldGained;

    addLogMessage(`Gained ${xpGained} XP and ${goldGained} Gold.`, "reward");

    if (currentEnemy.lootTable) {
        currentEnemy.lootTable.forEach((loot) => {
            let dropChance = loot.chance;
            if (
                player.bonuses.rareMaterialChance &&
                gameData.items[loot.itemId]?.type === "materials"
            ) {
                dropChance += player.bonuses.rareMaterialChance;
            }

            if (Math.random() < dropChance) {
                const itemData = gameData.items[loot.itemId];
                if (itemData) {
                    addItemToInventory(loot.itemId, loot.quantity);
                    addLogMessage(
                        `Found x${loot.quantity} ${itemData.name} ${
                            itemData.icon || ""
                        }!`,
                        "reward"
                    );
                }
            }
        });
    }

    player.consecutiveFleeAttempts = 0;
    player.statusEffects = {};

    if (currentEnemy.name === "Demon King") {
        addLogMessage(
            "You have defeated the Demon King! The realm is safe!",
            "system"
        );
        showMessageBox("VICTORY! You have saved the realm!", 5000);
        setTimeout(() => {
            if (gameViews.combat.classList.contains("active-view")) {
                switchView("map");
            }
        }, 5500);
    } else {
        currentEnemy = null;
        if (attackButton) attackButton.disabled = true;
        if (spellButton) spellButton.disabled = true;
        if (fleeButton) fleeButton.disabled = true;

        showMessageBox("Victory!", 2000);
        setTimeout(() => {
            if (gameViews.combat.classList.contains("active-view")) {
                switchView("map");
            }
        }, 2500);
    }

    if (player.xp >= player.xpNeeded) {
        levelUp();
    }
    updatePlayerStatsUI();
}

/**
 * Handles the logic when the player loses a combat encounter.
 */
function loseCombat() {
    player.hp = 0;
    addLogMessage("You have been defeated...", "error");
    player.hp = Math.floor(player.maxHp * 0.1);
    player.gold = Math.max(0, player.gold - Math.floor(player.gold * 0.1));

    addLogMessage(
        `You lost 10% of your gold. Respawning with low HP.`,
        "error"
    );

    player.consecutiveFleeAttempts = 0;
    player.statusEffects = {};

    currentEnemy = null;
    if (attackButton) attackButton.disabled = true;
    if (spellButton) spellButton.disabled = true;
    if (fleeButton) fleeButton.disabled = true;

    showMessageBox("Defeated...", 3000);
    setTimeout(() => {
        if (gameViews.combat.classList.contains("active-view")) {
            switchView("map");
        }
    }, 3500);
    updatePlayerStatsUI();
}

/**
 * Attempts to flee from combat.
 */
function fleeCombat() {
    if (!currentEnemy) return;

    if (player.consecutiveFleeAttempts >= 3) {
        addLogMessage("You are too exhausted to flee again!", "error");
        showMessageBox("Cannot flee! You've tried too many times.", 2000);
        return;
    }

    let fleeChance = 0.5;

    if (currentEnemy.statusEffects.fear) {
        fleeChance += currentEnemy.statusEffects.fear.strength;
    }

    if (Math.random() < fleeChance) {
        addLogMessage("You successfully fled from combat!", "system");
        player.consecutiveFleeAttempts = 0;
        player.statusEffects = {};
        currentEnemy = null;
        if (attackButton) attackButton.disabled = true;
        if (spellButton) spellButton.disabled = true;
        if (fleeButton) fleeButton.disabled = true;
        switchView("map");
        showMessageBox("Escaped!", 1500);
    } else {
        addLogMessage("Failed to flee!", "combat");
        player.consecutiveFleeAttempts++;
        addLogMessage(
            `Flee attempts: ${player.consecutiveFleeAttempts}/3`,
            "combat"
        );
        enemyAttack();
    }
}

/**
 * Performs a specific activity based on the current location.
 * @param {string} activityId - The ID of the activity to perform.
 */
function performActivity(activityId) {
    const activity = gameData.activities[activityId];
    if (!activity) {
        showMessageBox("Unknown activity!", 2000);
        return;
    }

    if (player.food < activity.foodCost) {
        showMessageBox(
            `Not enough food for ${activity.name}! (${activity.foodCost} needed)`,
            2000
        );
        return;
    }

    player.food = Math.max(0, player.food - activity.foodCost);
    addLogMessage(`You perform: ${activity.name}.`, "system");

    if (activity.type === "combat") {
        startCombat();
    } else if (activity.type === "gather") {
        if (activity.yields) {
            activity.yields.forEach((yieldItem) => {
                const quantity =
                    Math.floor(
                        Math.random() * (yieldItem.max - yieldItem.min + 1)
                    ) + yieldItem.min;
                if (quantity > 0) {
                    if (yieldItem.isFood) {
                        player.food = Math.min(
                            player.maxFood,
                            player.food + quantity
                        );
                        addLogMessage(
                            `Gained ${quantity} food from ${
                                gameData.items[yieldItem.itemId]?.name ||
                                yieldItem.itemId
                            }.`,
                            "reward"
                        );
                    } else {
                        addItemToInventory(yieldItem.itemId, quantity);
                        addLogMessage(
                            `Found ${quantity}x ${
                                gameData.items[yieldItem.itemId]?.name ||
                                yieldItem.itemId
                            }.`,
                            "reward"
                        );
                    }
                }
            });
        } else {
            addLogMessage("You gathered nothing of note.", "system");
        }
    } else if (activity.type === "interaction") {
        if (activityId === "visit_shop") {
            switchView("shop");
        } else if (activityId === "take_quest") {
            showMessageBox(
                "The Guild Master has no quests for you at the moment.",
                2000
            );
            addLogMessage(
                "You visit the Quest Board, but find no new quests.",
                "system"
            );
        }
    }
    updatePlayerStatsUI();
}

/**
 * Updates the player's stats display on the UI.
 */
function updatePlayerStatsUI() {
    if (!player.class) return;

    playerClassDisplay.textContent = `${player.class} ${
        gameData.classes[player.class].icon
    }`;
    playerLevelDisplay.textContent = player.level;
    playerXpDisplay.textContent = Math.floor(player.xp);
    playerXpNeededDisplay.textContent = player.xpNeeded;
    playerHpDisplay.textContent = Math.floor(player.hp);
    playerMaxHpDisplay.textContent = player.maxHp;
    playerManaDisplay.textContent = Math.floor(player.mana);
    playerMaxManaDisplay.textContent = player.maxMana;
    playerGoldDisplay.textContent = Math.floor(player.gold);

    playerFoodDisplay.textContent = `${Math.floor(player.food)}/${
        player.maxFood
    }`;
    playerIdlePointsDisplay.textContent = Math.floor(player.actionPoints);
    document.getElementById("skill-points").textContent = player.skillPoints;
}

/**
 * Updates the combat UI to reflect current player and enemy HP/Mana.
 */
function updateCombatUI() {
    if (playerCombatHpDisplay)
        playerCombatHpDisplay.textContent = Math.floor(player.hp);
    if (playerCombatManaDisplay)
        playerCombatManaDisplay.textContent = Math.floor(player.mana);

    if (currentEnemy) {
        if (enemyImageDisplay) {
            const imageName = currentEnemy.image || "default_monster.jpg";
            enemyImageDisplay.src = `../img/monsters/${imageName}`;
            enemyImageDisplay.alt = `${currentEnemy.name} Image`;
            enemyImageDisplay.onerror = () => {
                enemyImageDisplay.src =
                    "https://placehold.co/100x100/cccccc/000000?text=Enemy";
                enemyImageDisplay.alt = "Default Enemy Image";
            };
        }
        if (enemyIconDisplay) enemyIconDisplay.textContent = currentEnemy.icon;
        if (enemyNameDisplay) enemyNameDisplay.textContent = currentEnemy.name;
        if (enemyHpDisplay)
            enemyHpDisplay.textContent = Math.max(
                0,
                Math.floor(currentEnemy.hp)
            );
        if (enemyMaxHpDisplay)
            enemyMaxHpDisplay.textContent = currentEnemy.maxHp;
    } else {
        if (enemyImageDisplay)
            enemyImageDisplay.src =
                "https://placehold.co/100x100/cccccc/000000?text=Enemy";
        if (enemyIconDisplay) enemyIconDisplay.textContent = "";
        if (enemyNameDisplay) enemyNameDisplay.textContent = "No Enemy";
        if (enemyHpDisplay) enemyHpDisplay.textContent = "0";
        if (enemyMaxHpDisplay) enemyMaxHpDisplay.textContent = "0";
    }
}

/**
 * Adds a message to the game log.
 * @param {string} message - The message to add.
 * @param {string} type - The type of message (e.g., "normal", "combat", "error", "reward", "system", "effect").
 */
function addLogMessage(message, type = "normal") {
    const logEntry = document.createElement("p");
    logEntry.classList.add("log-entry");
    if (type !== "normal") {
        logEntry.classList.add(`${type}-message`);
    }
    logEntry.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
    messageLogElement.appendChild(logEntry);
    messageLogElement.scrollTop = messageLogElement.scrollHeight;
}

/**
 * Displays a temporary message box to the user.
 * @param {string} message - The message to display.
 * @param {number} duration - How long the message should be displayed in milliseconds.
 */
function showMessageBox(message, duration = 3000) {
    customMessageBox.textContent = message;
    customMessageBox.style.display = "block";
    setTimeout(() => {
        customMessageBox.style.display = "none";
    }, duration);
}

/**
 * Switches the currently active game view.
 * @param {string} viewId - The ID of the view to switch to (e.g., "map", "inventory").
 */
function switchView(viewId) {
    console.log("Switching view to:", viewId);

    gameUiScreen.classList.replace("hidden-screen", "active-screen");
    classSelectionScreen.classList.replace("active-screen", "hidden-screen");

    Object.values(gameViews).forEach((view) => {
        if (view) view.classList.replace("active-view", "hidden-view");
    });

    if (gameViews[viewId]) {
        gameViews[viewId].classList.replace("hidden-view", "active-view");
        if (viewId !== "combat") {
            addLogMessage(
                `Navigated to ${
                    viewId.charAt(0).toUpperCase() + viewId.slice(1)
                } screen.`,
                "system"
            );
        }

        if (viewId === "map") {
            updateLocationUI();
            updateLocationActionsUI();
        } else if (viewId === "inventory") updateInventoryUI();
        else if (viewId === "shop") updateShopUI();
        else if (viewId === "skills") updateSkillsUI();
        else if (viewId === "combat") updateCombatUI();
        else if (viewId === "camp") updateCampUI();
    } else {
        console.error("Attempted to switch to unknown view:", viewId);
        addLogMessage(
            `Error: View ${viewId} not found. Defaulting to Map.`,
            "error"
        );
        gameViews.map.classList.replace("hidden-view", "active-view");
        updateLocationUI();
        updateLocationActionsUI();
    }
}

/**
 * Switches the active tab within the inventory screen.
 * @param {string} tabId - The ID of the tab to switch to (e.g., "equip", "use", "materials").
 */
function switchInventoryTab(tabId) {
    inventoryTabButtons.forEach((button) =>
        button.classList.remove("active-tab")
    );
    Object.values(inventoryTabs).forEach((tabContent) =>
        tabContent.classList.replace("active-tab-content", "hidden-tab-content")
    );

    const activeButton = document.querySelector(
        `.inventory-tab-button[data-tab="${tabId}"]`
    );
    if (activeButton) activeButton.classList.add("active-tab");

    if (inventoryTabs[tabId]) {
        inventoryTabs[tabId].classList.replace(
            "hidden-tab-content",
            "active-tab-content"
        );
        updateInventoryUI();
    } else {
        console.error("Unknown inventory tab:", tabId);
    }
}

/**
 * Updates the location UI, displaying available locations and current location.
 */
function updateLocationUI() {
    if (!locationContainer || !currentLocationDisplay) return;

    const currentLocationData = gameData.locations[player.currentLocation];
    currentLocationDisplay.textContent = currentLocationData
        ? currentLocationData.name
        : "Unknown";
    locationContainer.innerHTML = "";

    const connectedLocations = currentLocationData
        ? currentLocationData.connectedLocations
        : [];

    if (connectedLocations.length === 0) {
        locationContainer.innerHTML =
            "<p>No other accessible locations from here.</p>";
    } else {
        connectedLocations.forEach((locationId) => {
            const locationData = gameData.locations[locationId];
            if (!locationData) return;

            const isCurrent = locationId === player.currentLocation;
            const isLocked = player.level < locationData.levelRequirement;

            const locationCard = document.createElement("div");
            locationCard.classList.add("biome-card");
            if (isCurrent) {
                locationCard.classList.add("current");
            }
            if (isLocked) {
                locationCard.classList.add("locked");
            }

            locationCard.innerHTML = `
                <h3>${locationData.icon} ${locationData.name}</h3>
                <p>Lvl: ${locationData.levelRequirement}+</p>
                <p>${locationData.description}</p>
            `;
            locationCard.addEventListener("click", () => {
                if (currentEnemy) {
                    showMessageBox("Cannot travel while in combat!", 2000);
                    return;
                }
                if (isLocked) {
                    showMessageBox(
                        `You need to be Level ${locationData.levelRequirement} to enter ${locationData.name}!`,
                        2000
                    );
                    return;
                }
                player.currentLocation = locationId;
                addLogMessage(`Moved to ${locationData.name}.`, "system");
                updateLocationUI();
                updateLocationActionsUI();
            });
            locationContainer.appendChild(locationCard);
        });
    }
}

/**
 * Updates the action buttons available at the current location.
 */
function updateLocationActionsUI() {
    if (!locationActionsContainer) return;

    locationActionsContainer.innerHTML = "";

    const currentLocationData = gameData.locations[player.currentLocation];
    if (!currentLocationData || !currentLocationData.activities) {
        locationActionsContainer.innerHTML =
            "<p>No activities available here.</p>";
        return;
    }

    currentLocationData.activities.forEach((activityId) => {
        const activity = gameData.activities[activityId];
        if (!activity) return;

        const activityButton = document.createElement("button");
        activityButton.classList.add("game-button");
        activityButton.textContent = `${activity.name} ${activity.icon}`;
        activityButton.title = activity.description;
        activityButton.addEventListener("click", () =>
            performActivity(activityId)
        );
        locationActionsContainer.appendChild(activityButton);
    });
}

/**
 * Adds an item to the player's inventory.
 * @param {string} itemId - The ID of the item to add.
 * @param {number} quantity - The quantity of the item to add.
 */
function addItemToInventory(itemId, quantity = 1) {
    const itemData = gameData.items[itemId];
    if (!itemData) {
        console.error(`Attempted to add unknown item: ${itemId}`);
        return;
    }

    let inventoryCategory;
    if (itemData.type === "equip") inventoryCategory = player.inventory.equip;
    else if (itemData.type === "use") inventoryCategory = player.inventory.use;
    else if (itemData.type === "materials")
        inventoryCategory = player.inventory.materials;
    else {
        console.error(`Unknown item type for ${itemId}: ${itemData.type}`);
        return;
    }

    const existingItem = inventoryCategory.find((i) => i.id === itemId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        inventoryCategory.push({ ...itemData, quantity: quantity });
    }
    console.log(`Added ${quantity}x ${itemData.name} to inventory.`);
    updateInventoryUI();
}

/**
 * Removes an item from the player's inventory.
 * @param {string} itemId - The ID of the item to remove.
 * @param {number} quantity - The quantity of the item to remove.
 * @returns {boolean} True if items were successfully removed, false otherwise.
 */
function removeItemFromInventory(itemId, quantity = 1) {
    const itemData = gameData.items[itemId];
    if (!itemData) {
        console.error(`Attempted to remove unknown item: ${itemId}`);
        return false;
    }

    let inventoryCategory;
    if (itemData.type === "equip") inventoryCategory = player.inventory.equip;
    else if (itemData.type === "use") inventoryCategory = player.inventory.use;
    else if (itemData.type === "materials")
        inventoryCategory = player.inventory.materials;
    else {
        console.error(`Unknown item type for ${itemId}: ${itemData.type}`);
        return false;
    }

    const existingItemIndex = inventoryCategory.findIndex(
        (i) => i.id === itemId
    );
    if (existingItemIndex > -1) {
        if (inventoryCategory[existingItemIndex].quantity > quantity) {
            inventoryCategory[existingItemIndex].quantity -= quantity;
            updateInventoryUI();
            return true;
        } else if (inventoryCategory[existingItemIndex].quantity === quantity) {
            inventoryCategory.splice(existingItemIndex, 1);
            updateInventoryUI();
            return true;
        }
    }
    return false;
}

/**
 * Generates a descriptive string for an item's stats.
 * @param {object} item - The item object.
 * @returns {string} A string describing the item's stats.
 */
function getItemStatsDescription(item) {
    if (!item.stats) return "";
    let stats = [];
    for (const stat in item.stats) {
        stats.push(`${stat}: ${item.stats[stat]}`);
    }
    return stats.length > 0 ? `Stats: ${stats.join(", ")}` : "";
}

/**
 * Updates the inventory UI for the currently active tab.
 */
function updateInventoryUI() {
    const activeTabElement = document.querySelector(
        ".inventory-tab-button.active-tab"
    );
    if (!activeTabElement) return;

    const activeTab = activeTabElement.dataset.tab;
    let itemsToShow = [];
    let listElementId = "";

    if (activeTab === "equip") {
        itemsToShow = player.inventory.equip;
        listElementId = "inventory-equip-list";
    } else if (activeTab === "use") {
        itemsToShow = player.inventory.use;
        listElementId = "inventory-use-list";
    } else if (activeTab === "materials") {
        itemsToShow = player.inventory.materials;
        listElementId = "inventory-materials-list";
    }

    const itemListElement = document.getElementById(listElementId);
    if (!itemListElement) return;

    itemListElement.innerHTML = "";

    if (itemsToShow.length === 0) {
        itemListElement.innerHTML = `<p>No ${activeTab} items yet.</p>`;
    } else {
        itemsToShow.forEach((item) => {
            const itemCard = document.createElement("div");
            itemCard.classList.add("item-card");

            let tooltipContent = item.description || "An item.";
            const statsDescription = getItemStatsDescription(item);
            if (statsDescription) {
                tooltipContent += `<br><b>${statsDescription}</b>`;
            }
            if (item.effect) {
                let effectDesc = [];
                if (item.effect.hp)
                    effectDesc.push(`Restores ${item.effect.hp} HP`);
                if (item.effect.mana)
                    effectDesc.push(`Restores ${item.effect.mana} Mana`);
                if (item.effect.food)
                    effectDesc.push(`Restores ${item.effect.food} Food`);
                if (effectDesc.length > 0) {
                    tooltipContent += `<br><i>${effectDesc.join(", ")}</i>`;
                }
            }

            itemCard.innerHTML = `
                <span class="item-name">${item.icon || ""} ${item.name}</span>
                <span class="item-quantity">x${item.quantity}</span>
                <div class="item-tooltip">${tooltipContent}</div>
            `;
            itemCard.addEventListener("click", () =>
                handleItemClick(item, activeTab)
            );
            itemListElement.appendChild(itemCard);
        });
    }

    document.getElementById("equipped-weapon").innerHTML = player.equipped
        .weapon
        ? `${player.equipped.weapon.icon || "⚔️"} ${
              player.equipped.weapon.name
          }`
        : "None ⚔️";
    document.getElementById("equipped-helmet").innerHTML = player.equipped
        .helmet
        ? `${player.equipped.helmet.icon || "🪖"} ${
              player.equipped.helmet.name
          }`
        : "None 🪖";
    document.getElementById("equipped-chest").innerHTML = player.equipped.chest
        ? `${player.equipped.chest.icon || "👕"} ${player.equipped.chest.name}`
        : "None 👕";
    document.getElementById("equipped-boots").innerHTML = player.equipped.boots
        ? `${player.equipped.boots.icon || "👢"} ${player.equipped.boots.name}`
        : "None 👢";
}

/**
 * Handles a click on an item in the inventory, triggering equip/use logic.
 * @param {object} item - The item object that was clicked.
 * @param {string} tabType - The type of inventory tab the item is in.
 */
function handleItemClick(item, tabType) {
    if (tabType === "equip") {
        const isEquipped = Object.values(player.equipped).some(
            (eqItem) => eqItem && eqItem.id === item.id
        );

        if (isEquipped) {
            unequipItem(item.slot);
            addLogMessage(`Unequipped ${item.name}.`, "system");
        } else {
            if (
                item.slot === "weapon" &&
                item.weaponType &&
                !player.allowedWeaponTypes.includes(item.weaponType)
            ) {
                showMessageBox(
                    `Your class (${player.class}) cannot wield ${item.weaponType} weapons!`,
                    3000
                );
                return;
            }
            equipItem(item);
            addLogMessage(`Equipped ${item.name}.`, "system");
        }
    } else if (tabType === "use") {
        useConsumable(item);
    } else if (tabType === "materials") {
        if (item.effect && item.effect.food) {
            useConsumable(item);
        } else {
            showMessageBox(
                `Material: ${item.name}. Cannot be directly used or equipped.`,
                2000
            );
        }
    }
    updateInventoryUI();
    updatePlayerStatsUI();
    calculateEffectiveStats();
}

/**
 * Equips an item to the player.
 * @param {object} itemToEquip - The item object to equip.
 */
function equipItem(itemToEquip) {
    if (player.equipped[itemToEquip.slot]) {
        const currentlyEquipped = player.equipped[itemToEquip.slot];
        addItemToInventory(currentlyEquipped.id, 1);
    }

    removeItemFromInventory(itemToEquip.id, 1);
    player.equipped[itemToEquip.slot] = itemToEquip;
}

/**
 * Unequips an item from the player.
 * @param {string} slot - The equipment slot to unequip from.
 */
function unequipItem(slot) {
    const itemToUnequip = player.equipped[slot];
    if (itemToUnequip) {
        addItemToInventory(itemToUnequip.id, 1);
        player.equipped[slot] = null;
    }
}

/**
 * Uses a consumable item from the player's inventory.
 * @param {object} item - The consumable item to use.
 */
function useConsumable(item) {
    if (
        item.type !== "use" &&
        !(item.type === "materials" && item.effect && item.effect.food)
    ) {
        showMessageBox(`${item.name} cannot be used.`, 2000);
        return;
    }

    if (removeItemFromInventory(item.id, 1)) {
        if (item.effect) {
            if (item.effect.hp) {
                player.hp = Math.min(player.maxHp, player.hp + item.effect.hp);
                addLogMessage(
                    `Used ${item.name}, restored ${item.effect.hp} HP.`,
                    "system"
                );
            }
            if (item.effect.mana) {
                player.mana = Math.min(
                    player.maxMana,
                    player.mana + item.effect.mana
                );
                addLogMessage(
                    `Used ${item.name}, restored ${item.effect.mana} Mana.`,
                    "system"
                );
            }
            if (item.effect.food) {
                player.food = Math.min(
                    player.maxFood,
                    player.food + item.effect.food
                );
                addLogMessage(
                    `Used ${item.name}, restored ${item.effect.food} Food.`,
                    "system"
                );
            }
        }
        updatePlayerStatsUI();
    } else {
        showMessageBox(`You don't have any ${item.name}!`, 2000);
    }
}

/**
 * Populates the crafting recipe dropdown with available recipes.
 */
function populateCraftingRecipes() {
    craftingRecipeSelect.innerHTML =
        '<option value="">-- Select Recipe --</option>';
    for (const recipeId in gameData.recipes) {
        const recipe = gameData.recipes[recipeId];
        if (recipeId === "iron_axe" && !player.buildings.workshop) {
            continue;
        }
        const option = document.createElement("option");
        option.value = recipeId;
        option.textContent = recipe.name;
        craftingRecipeSelect.appendChild(option);
    }
}

/**
 * Attempts to craft the selected item.
 */
function craftItem() {
    const selectedRecipeId = craftingRecipeSelect.value;
    if (!selectedRecipeId) {
        craftingMessage.textContent = "Please select a recipe.";
        return;
    }

    const recipe = gameData.recipes[selectedRecipeId];
    if (!recipe) {
        craftingMessage.textContent = "Invalid recipe selected.";
        return;
    }

    if (selectedRecipeId === "iron_axe" && !player.buildings.workshop) {
        craftingMessage.textContent = "You need a Workshop to craft this item!";
        return;
    }

    let canCraft = true;
    let missingMaterials = [];

    recipe.materials.forEach((material) => {
        const playerMaterial = player.inventory.materials.find(
            (item) => item.id === material.id
        );
        if (!playerMaterial || playerMaterial.quantity < material.quantity) {
            canCraft = false;
            missingMaterials.push(
                `${material.quantity}x ${
                    gameData.items[material.id]?.name || material.id
                }`
            );
        }
    });

    if (canCraft) {
        recipe.materials.forEach((material) => {
            removeItemFromInventory(material.id, material.quantity);
        });

        addItemToInventory(recipe.result.id, recipe.result.quantity);
        craftingMessage.textContent = `Successfully crafted ${
            recipe.result.quantity
        }x ${gameData.items[recipe.result.id]?.name}!`;
        addLogMessage(
            `Crafted ${recipe.result.quantity}x ${
                gameData.items[recipe.result.id]?.name
            }.`,
            "system"
        );
        updateInventoryUI();
    } else {
        craftingMessage.textContent = `Missing materials: ${missingMaterials.join(
            ", "
        )}.`;
    }
}

/**
 * Updates the shop UI, displaying items for sale and player's sellable items.
 */
function updateShopUI() {
    if (!shopBuyItemsContainer || !shopSellItemsContainer || !shopMessage)
        return;

    shopBuyItemsContainer.innerHTML = "";
    shopSellItemsContainer.innerHTML = "";
    shopMessage.textContent = "";

    if (gameData.shopItems.length === 0) {
        shopBuyItemsContainer.innerHTML =
            "<p>No items available for purchase.</p>";
    } else {
        gameData.shopItems.forEach((shopItem) => {
            const itemData = gameData.items[shopItem.id];
            if (!itemData) return;

            const itemCard = document.createElement("div");
            itemCard.classList.add("item-card");
            itemCard.innerHTML = `
                <span class="item-name">${itemData.icon || ""} ${
                itemData.name
            }</span>
                <span class="item-quantity">Cost: ${shopItem.price} 💰</span>
                <div class="item-tooltip">${getItemTooltipContent(
                    itemData
                )}</div>
                <button class="game-button" data-item-id="${
                    shopItem.id
                }">Buy</button>
            `;
            const buyButton = itemCard.querySelector("button");
            buyButton.addEventListener("click", () => buyItem(shopItem.id));
            shopBuyItemsContainer.appendChild(itemCard);
        });
    }

    const sellableItems = [
        ...player.inventory.equip,
        ...player.inventory.use,
        ...player.inventory.materials,
    ];
    if (sellableItems.length === 0) {
        shopSellItemsContainer.innerHTML = "<p>No items to sell.</p>";
    } else {
        sellableItems.forEach((playerItem) => {
            const itemData = gameData.items[playerItem.id];
            if (!itemData || !itemData.sellPrice) return;

            const itemCard = document.createElement("div");
            itemCard.classList.add("item-card");
            itemCard.innerHTML = `
                <span class="item-name">${itemData.icon || ""} ${
                itemData.name
            }</span>
                <span class="item-quantity">x${playerItem.quantity} | Sell: ${
                itemData.sellPrice
            } 💰</span>
                <div class="item-tooltip">${getItemTooltipContent(
                    itemData
                )}</div>
                <button class="game-button" data-item-id="${
                    playerItem.id
                }">Sell 1</button>
            `;
            const sellButton = itemCard.querySelector("button");
            sellButton.addEventListener("click", () =>
                sellItem(playerItem.id, 1)
            );
            shopSellItemsContainer.appendChild(itemCard);
        });
    }
    updatePlayerStatsUI();
}

/**
 * Helper function to generate full tooltip content for items.
 * @param {object} item - The item object.
 * @returns {string} The full HTML content for the tooltip.
 */
function getItemTooltipContent(item) {
    let tooltipContent = item.description || "An item.";
    const statsDescription = getItemStatsDescription(item);
    if (statsDescription) {
        tooltipContent += `<br><b>${statsDescription}</b>`;
    }
    if (item.effect) {
        let effectDesc = [];
        if (item.effect.hp) effectDesc.push(`Restores ${item.effect.hp} HP`);
        if (item.effect.mana)
            effectDesc.push(`Restores ${item.effect.mana} Mana`);
        if (item.effect.food)
            effectDesc.push(`Restores ${item.effect.food} Food`);
        if (effectDesc.length > 0) {
            tooltipContent += `<br><i>${effectDesc.join(", ")}</i>`;
        }
    }
    return tooltipContent;
}

/**
 * Buys an item from the shop.
 * @param {string} itemId - The ID of the item to buy.
 */
function buyItem(itemId) {
    const shopItem = gameData.shopItems.find((item) => item.id === itemId);
    const itemData = gameData.items[itemId];

    if (!shopItem || !itemData) {
        shopMessage.textContent = "Item not available.";
        return;
    }
    if (shopItem.stock <= 0) {
        shopMessage.textContent = `${itemData.name} is out of stock!`;
        return;
    }
    if (player.gold < shopItem.price) {
        shopMessage.textContent = `Not enough gold to buy ${itemData.name}.`;
        return;
    }

    player.gold -= shopItem.price;
    addItemToInventory(itemId, 1);
    shopItem.stock--;
    shopMessage.textContent = `Bought 1x ${itemData.name} for ${shopItem.price} gold.`;
    addLogMessage(`Bought 1x ${itemData.name}.`, "system");
    updateShopUI();
    updatePlayerStatsUI();
}

/**
 * Sells an item to the shop.
 * @param {string} itemId - The ID of the item to sell.
 * @param {number} quantity - The quantity to sell (default 1).
 */
function sellItem(itemId, quantity = 1) {
    const itemData = gameData.items[itemId];
    if (!itemData || !itemData.sellPrice) {
        shopMessage.textContent = "This item cannot be sold.";
        return;
    }

    if (removeItemFromInventory(itemId, quantity)) {
        const goldGained = itemData.sellPrice * quantity;
        player.gold += goldGained;
        shopMessage.textContent = `Sold ${quantity}x ${itemData.name} for ${goldGained} gold.`;
        addLogMessage(`Sold ${quantity}x ${itemData.name}.`, "system");
        updateShopUI();
        updatePlayerStatsUI();
    } else {
        shopMessage.textContent = `You don't have ${quantity}x ${itemData.name} to sell.`;
    }
}

/**
 * Updates the skill tree UI, displaying available and learned skills for the player's class.
 */
function updateSkillsUI() {
    const skillTreeContainer = document.getElementById("skill-tree-container");
    if (!skillTreeContainer) return;

    skillTreeContainer.innerHTML = "";

    const playerClassSkills = gameData.classes[player.class]?.skillTree;

    if (!playerClassSkills || playerClassSkills.length === 0) {
        skillTreeContainer.innerHTML =
            "<p>No skills available for your class yet.</p>";
        return;
    }

    playerClassSkills.forEach((skillId) => {
        const skill = gameData.skills[skillId];
        if (!skill || skill.class !== player.class) return;

        const currentLevel = player.skills[skillId] || 0;
        const isMaxLevel = currentLevel >= skill.maxLevel;
        const canUpgrade =
            !isMaxLevel &&
            player.skillPoints >= skill.cost &&
            player.level >= skill.levelRequirement;

        let hasPrerequisites = true;
        let missingPrereqs = [];
        skill.prerequisites.forEach((prereqId) => {
            if (!player.skills[prereqId] || player.skills[prereqId] <= 0) {
                hasPrerequisites = false;
                missingPrereqs.push(
                    gameData.skills[prereqId]?.name || prereqId
                );
            }
        });

        const skillCard = document.createElement("div");
        skillCard.classList.add("skill-card");
        if (currentLevel > 0) {
            skillCard.classList.add("learned");
        }
        if (isMaxLevel) {
            skillCard.classList.add("max-level");
        }

        let upgradeButtonHtml = "";
        let skillDescription = skill.description;

        let effectDetails = [];
        if (skill.baseEffects) {
            for (const effectKey in skill.baseEffects) {
                let effectValue = skill.baseEffects[effectKey];
                if (skill.levelScaling && skill.levelScaling[effectKey]) {
                    effectValue += skill.levelScaling[effectKey] * currentLevel;
                }

                if (effectKey === "damageMultiplier")
                    effectDetails.push(`Damage: x${effectValue.toFixed(1)}`);
                else if (effectKey === "magicDamageMultiplier")
                    effectDetails.push(
                        `Magic Damage: x${effectValue.toFixed(1)}`
                    );
                else if (effectKey === "manaCost")
                    effectDetails.push(`Mana Cost: ${effectValue}`);
                else if (effectKey === "staminaCost")
                    effectDetails.push(`Stamina Cost: ${effectValue}`);
                else if (effectKey === "stunChance")
                    effectDetails.push(
                        `Stun Chance: ${(effectValue * 100).toFixed(0)}%`
                    );
                else if (effectKey === "attackBoost")
                    effectDetails.push(
                        `Attack Boost: +${(effectValue * 100).toFixed(0)}%`
                    );
                else if (effectKey === "defensePenalty")
                    effectDetails.push(
                        `Defense Penalty: -${(effectValue * 100).toFixed(0)}%`
                    );
                else if (effectKey === "hpRestore")
                    effectDetails.push(`HP Restore: ${effectValue}`);
                else if (effectKey === "dodgeBoost")
                    effectDetails.push(
                        `Dodge Boost: +${(effectValue * 100).toFixed(0)}%`
                    );
                else if (effectKey === "poisonChance")
                    effectDetails.push(
                        `Poison Chance: ${(effectValue * 100).toFixed(0)}%`
                    );
                else if (effectKey === "poisonDamage")
                    effectDetails.push(
                        `Poison Damage: ${effectValue} per turn`
                    );
                else if (effectKey === "shieldAmount")
                    effectDetails.push(`Shield: ${effectValue}`);
                else if (effectKey === "manaRegenBoost")
                    effectDetails.push(
                        `Mana Regen: +${(effectValue * 100).toFixed(0)}%`
                    );
                else if (
                    effectKey === "damage" &&
                    skill.id === "mage_explosion"
                ) {
                    if (currentLevel === skill.maxLevel) {
                        effectDetails.push(`Instant Kill`);
                    } else {
                        effectDetails.push(`Base Damage: ${effectValue}`);
                    }
                }
            }
        }
        if (effectDetails.length > 0) {
            skillDescription += `<br><i>Effects: ${effectDetails.join(
                ", "
            )}</i>`;
        }

        if (isMaxLevel) {
            upgradeButtonHtml = `<button class="game-button" disabled>Max Level</button>`;
            skillDescription += ` (Level ${currentLevel}/${skill.maxLevel})`;
        } else if (!hasPrerequisites) {
            upgradeButtonHtml = `<button class="game-button" disabled>Requires: ${missingPrereqs.join(
                ", "
            )}</button>`;
        } else if (player.level < skill.levelRequirement) {
            upgradeButtonHtml = `<button class="game-button" disabled>Lvl ${skill.levelRequirement} Req</button>`;
        } else if (player.skillPoints < skill.cost) {
            upgradeButtonHtml = `<button class="game-button" disabled>Cost: ${skill.cost} SP</button>`;
        } else {
            upgradeButtonHtml = `<button class="game-button upgrade-skill-button" data-skill-id="${skillId}">Upgrade (${skill.cost} SP)</button>`;
            skillDescription += ` (Level ${currentLevel}/${skill.maxLevel})`;
        }

        skillCard.innerHTML = `
            <div>
                <h4>${skill.name}</h4>
                <p>${skillDescription}</p>
                <p class="cost">Current Level: ${currentLevel}</p>
                <p class="cost">Next Level Cost: ${skill.cost} Skill Points</p>
                <p class="cost">Level Required: ${skill.levelRequirement}</p>
            </div>
            ${upgradeButtonHtml}
        `;

        if (!isMaxLevel && canUpgrade && hasPrerequisites) {
            const upgradeButton = skillCard.querySelector(
                ".upgrade-skill-button"
            );
            if (upgradeButton) {
                upgradeButton.addEventListener("click", () =>
                    upgradeSkill(skillId)
                );
            }
        }
        skillTreeContainer.appendChild(skillCard);
    });
    document.getElementById("skill-points").textContent = player.skillPoints;
}

/**
 * Attempts to upgrade a skill for the player.
 * @param {string} skillId - The ID of the skill to upgrade.
 */
function upgradeSkill(skillId) {
    const skill = gameData.skills[skillId];
    if (!skill) {
        showMessageBox("Skill not found!", 2000);
        return;
    }

    const currentLevel = player.skills[skillId] || 0;

    if (currentLevel >= skill.maxLevel) {
        showMessageBox("This skill is already at max level!", 2000);
        return;
    }
    if (player.skillPoints < skill.cost) {
        showMessageBox("Not enough Skill Points!", 2000);
        return;
    }
    if (player.level < skill.levelRequirement) {
        showMessageBox(
            `You need to be Level ${skill.levelRequirement} to upgrade this skill!`,
            2000
        );
        return;
    }

    let hasPrerequisites = true;
    skill.prerequisites.forEach((prereqId) => {
        if (!player.skills[prereqId] || player.skills[prereqId] <= 0) {
            hasPrerequisites = false;
        }
    });

    if (!hasPrerequisites) {
        showMessageBox("You need to learn prerequisite skills first!", 2000);
        return;
    }

    player.skillPoints -= skill.cost;
    player.skills[skillId] = currentLevel + 1;
    addLogMessage(
        `Upgraded skill: ${skill.name} to Level ${player.skills[skillId]}!`,
        "system"
    );
    showMessageBox(
        `Upgraded ${skill.name} to Level ${player.skills[skillId]}!`,
        2500
    );

    if (skill.type === "passive") {
        calculateEffectiveStats();
    }

    updateSkillsUI();
    updatePlayerStatsUI();
}

/**
 * Updates the Camp UI, displaying available and built structures.
 */
function updateCampUI() {
    if (!campBuildingsContainer || !campMessage) return;

    campBuildingsContainer.innerHTML = "";
    campMessage.textContent = "";

    const availableBuildings = Object.values(gameData.buildings);

    if (availableBuildings.length === 0) {
        campBuildingsContainer.innerHTML =
            "<p>No buildings available to construct.</p>";
        return;
    }

    availableBuildings.forEach((building) => {
        const isBuilt = player.buildings[building.id];
        const canBuild = !isBuilt && player.gold >= building.cost.gold;

        let missingMaterials = [];
        let hasMaterials = true;
        building.cost.materials.forEach((material) => {
            const playerMaterial = player.inventory.materials.find(
                (item) => item.id === material.id
            );
            if (
                !playerMaterial ||
                playerMaterial.quantity < material.quantity
            ) {
                hasMaterials = false;
                missingMaterials.push(
                    `${material.quantity}x ${
                        gameData.items[material.id]?.name || material.id
                    }`
                );
            }
        });

        const buildingCard = document.createElement("div");
        buildingCard.classList.add("item-card");
        if (isBuilt) {
            buildingCard.classList.add("learned");
        }

        let buildButtonHtml = "";
        if (isBuilt) {
            buildButtonHtml = `<button class="game-button" disabled>Built</button>`;
        } else if (!hasMaterials) {
            buildButtonHtml = `<button class="game-button" disabled>Missing: ${missingMaterials.join(
                ", "
            )}</button>`;
        } else if (player.gold < building.cost.gold) {
            buildButtonHtml = `<button class="game-button" disabled>Cost: ${building.cost.gold} 💰</button>`;
        } else {
            buildButtonHtml = `<button class="game-button build-button" data-building-id="${building.id}">Build (${building.cost.gold} 💰)</button>`;
        }

        buildingCard.innerHTML = `
            <span class="item-name">${building.icon || ""} ${
            building.name
        }</span>
            <span class="item-quantity">${building.description}</span>
            ${buildButtonHtml}
        `;

        if (!isBuilt && canBuild && hasMaterials) {
            const buildButton = buildingCard.querySelector(".build-button");
            if (buildButton) {
                buildButton.addEventListener("click", () =>
                    buildStructure(building.id)
                );
            }
        }
        campBuildingsContainer.appendChild(buildingCard);
    });
    updatePlayerStatsUI();
}

/**
 * Attempts to build a structure at the camp.
 * @param {string} buildingId - The ID of the building to construct.
 */
function buildStructure(buildingId) {
    const building = gameData.buildings[buildingId];
    if (!building) {
        campMessage.textContent = "Building not found!";
        return;
    }
    if (player.buildings[buildingId]) {
        campMessage.textContent = "You have already built this structure!";
        return;
    }
    if (player.gold < building.cost.gold) {
        campMessage.textContent = "Not enough gold to build this!";
        return;
    }

    let hasMaterials = true;
    building.cost.materials.forEach((material) => {
        const playerMaterial = player.inventory.materials.find(
            (item) => item.id === material.id
        );
        if (!playerMaterial || playerMaterial.quantity < material.quantity) {
            hasMaterials = false;
        }
    });

    if (!hasMaterials) {
        campMessage.textContent = "Not enough materials to build this!";
        return;
    }

    player.gold -= building.cost.gold;
    building.cost.materials.forEach((material) => {
        removeItemFromInventory(material.id, material.quantity);
    });

    player.buildings[buildingId] = true;
    addLogMessage(`Successfully built the ${building.name}!`, "system");
    showMessageBox(`Built ${building.name}!`, 2500);

    if (building.effects.unlocksRecipes) {
        populateCraftingRecipes();
        addLogMessage(
            `New crafting recipes unlocked by ${building.name}!`,
            "system"
        );
    }

    updateCampUI();
    updatePlayerStatsUI();
}

document.addEventListener("DOMContentLoaded", initializeGame);

window.dev = {
    player,
    gameData,
    addXP: (amount) => {
        player.xp += amount;
        console.log(`Added ${amount} XP.`);
        if (player.xp >= player.xpNeeded) levelUp();
        updatePlayerStatsUI();
    },
    addGold: (amount) => {
        player.gold += amount;
        console.log(`Added ${amount} Gold.`);
        updatePlayerStatsUI();
    },
    addFood: (amount) => {
        player.food = Math.min(player.maxFood, player.food + amount);
        console.log(`Added ${amount} Food.`);
        updatePlayerStatsUI();
    },

    addSkillPoints: (amount) => {
        player.skillPoints += amount;
        console.log(`Added ${amount} Skill Points.`);
        updatePlayerStatsUI();
        updateSkillsUI();
    },
    levelUpTest: levelUp,
    addItem: (id, qty = 1) => addItemToInventory(id, qty),
    removeItem: (id, qty = 1) => removeItemFromInventory(id, qty),
    startCombatTest: (monsterName) => {
        if (gameData.monsters[monsterName]) {
            currentEnemy = { ...gameData.monsters[monsterName] };
            currentEnemy.hp = currentEnemy.maxHp;
            addLogMessage(
                `A wild ${currentEnemy.name} ${currentEnemy.icon} appears! (Test)`,
                "combat"
            );
            switchView("combat");
            updateCombatUI();
            if (attackButton) attackButton.disabled = false;
            if (spellButton) spellButton.disabled = false;
            if (fleeButton) fleeButton.disabled = false;
        } else {
            console.error("Test monster not found:", monsterName);
        }
    },
    showMessageTest: () => showMessageBox("This is a test message!", 2000),
    equipTest: (itemId) => {
        const item = gameData.items[itemId];
        if (item && item.type === "equip") {
            addItemToInventory(itemId, 1);
            equipItem(item);
            addLogMessage(`Equipped ${item.name} via dev command.`, "system");
        } else {
            console.error("Item not found or not equippable:", itemId);
        }
    },
    upgradeSkillTest: (skillId) => {
        player.skillPoints += 5;
        upgradeSkill(skillId);
    },
    buildTest: (buildingId) => {
        player.gold += 200;
        addItemToInventory("oak_wood", 50);
        addItemToInventory("plain_grass", 50);
        addItemToInventory("iron_ore", 50);
        addItemToInventory("small_stone", 50);
        buildStructure(buildingId);
    },
    setLocation: (locationId) => {
        if (gameData.locations[locationId]) {
            player.currentLocation = locationId;
            addLogMessage(
                `Teleported to ${gameData.locations[locationId].name}.`,
                "system"
            );
            updateLocationUI();
            updateLocationActionsUI();
        } else {
            console.error("Unknown location ID:", locationId);
        }
    },
    applyEffect: (effectType, duration, strength, damagePerTurn) => {
        applyPlayerStatusEffect(effectType, {
            type: effectType,
            duration,
            strength,
            damagePerTurn,
        });
    },
    removeEffect: (effectType) => {
        removePlayerStatusEffect(effectType);
    },
};
