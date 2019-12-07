/* Zebra stuff */

const getAverageTitaniumPerTrade = () => {
    let standingRatio = game.getEffect("standingRatio");

    if (game.prestige.getPerk("diplomacy").researched) {
        standingRatio += 10;
    }

    const zebras = game.diplomacy.get("zebras");

    const tradeFailProbability = zebras.attitude === "hostile" ? (1 - zebras.standing - standingRatio / 100) : 0;
    const tradeSuccessProbability = 1 - tradeFailProbability;

    const shipAmount = game.resPool.get("ship").value;
    const titaniumProbability = 0.15 + shipAmount * 0.0035;
    const titaniumRatio = 1 + (shipAmount / 100) * 2; // 2% more titanium per ship

    const avgTitaniumPerTrade = Math.min(titaniumProbability, 1) * titaniumRatio * 1.5 * tradeSuccessProbability;

    return avgTitaniumPerTrade;
}

const getOptimalZebraTrades = () => {
    const titanium = game.resPool.get("titanium");
    const titaniumBelowMax = titanium.maxValue - titanium.value;
    const avgTitaniumPerTrade = getAverageTitaniumPerTrade();
    return Math.floor(titaniumBelowMax / avgTitaniumPerTrade) + 1;
}

const getCappedResourcesForTrading = (tradeResName, tradeResAmt) => {
    const tradeCaps = [
        { res: "gold", cost: 15 },
        { res: "manpower", cost: 50 },
        { res: tradeResName, cost: tradeResAmt },
    ].map(({ res, cost }) => {
        const gameRes = game.resPool.get(res);
        return {
            res,
            amt: Math.floor(gameRes.value / cost),
        };
    });

    const tradesPossible = Math.min(...tradeCaps.map(({amt}) => amt));
    const cappedResources = tradeCaps
        .filter(cap => cap.amt === tradesPossible)
        .map(cap => cap.res);

    return {
        tradesPossible,
        cappedResources,
    };
}

const tradeToCapTitanium = () => {
    const { tradesPossible, cappedResources } = getCappedResourcesForTrading("slab", 50);

    if (tradesPossible === 0) {
        game.msg(`Not enough ${cappedResources.join(",")} to trade with zebras`);
        return;
    }

    const optimalZebraTrades = getOptimalZebraTrades();
    const nbTrades = Math.min(tradesPossible, optimalZebraTrades);

    game.msg(`Approximately ${optimalZebraTrades} trades needed to cap Titanium`);
    if (nbTrades < optimalZebraTrades) {
        game.msg(`Trade with zebras limited to ${nbTrades} by ${cappedResources.join(",")}`);
    }

    var zebras = game.diplomacy.get("zebras");
    game.diplomacy.tradeMultiple(zebras, nbTrades);
}


/* Coal stuff */ 

const coalTrades = [{ amt: 350, trades: 1 }];
const average = arr => {
    const { amt, trades } = arr.reduce( ( tally, current ) => ({
        amt: tally.amt + current.amt,
        trades: tally.trades + current.trades,
    }), { amt: 0, trades: 0 });
    return amt / trades;
}

const tradeWithSpiders = () => {
    const { tradesPossible, cappedResources } = getCappedResourcesForTrading("scaffold", 50);

    // If we don't have enough resources to trade
    if (tradesPossible === 0) {
        game.msg(`Not enough ${cappedResources.join(",")} to trade with spiders`);
        return;
    }

    const coal = game.resPool.get("coal");
    const iron = game.resPool.get("iron");
    const coalNeededToCap = coal.maxValue - coal.value;
    const desiredCoal = Math.min(iron.value - coal.value, coalNeededToCap);

    // If we don't need any coal based on current coal and iron
    if (desiredCoal <= 0) {
        game.msg("No trades for coal needed");
        return;
    }

    // Use a rolling average to determine approximate coal per trade
    if (coalTrades.length > 10) {
        coalTrades.shift();
    }
    const coalPerTrade = average(coalTrades);

    if (coalPerTrade === 0) {
        game.msg("Didn't get any coal... Not enough information to trade");
        return;
    }

    const optimalSpiderTrades = Math.floor(desiredCoal / coalPerTrade) + 1;
    const nbTrades = Math.min(optimalSpiderTrades, tradesPossible);

    game.msg(`Approximately ${optimalSpiderTrades} trades needed to cap Coal`);
    if (nbTrades < optimalSpiderTrades) {
        game.msg(`Trade with spiders limited to ${nbTrades} by ${cappedResources.join(",")}`);
    }

    const oldCoal = game.resPool.get("coal").value;
    var spiders = game.diplomacy.get("spiders");
    game.diplomacy.tradeMultiple(spiders, nbTrades);

    const newCoal = game.resPool.get("coal").value;
    coalTrades.push({ trades: nbTrades, amt: newCoal - oldCoal });
}

/* Game Logic*/

const spendCulture = () => {
    const resources = [ "parchment" ];
    const { blueprint, compendium, manuscript } = toggleValues;
    if (blueprint) {
        resources.push("blueprint");
    }
    if (compendium) {
        resources.push("compedium");
    }
    if (manuscript) {
        resources.push("manuscript");
    }
    resources.forEach(res => gamePage.craftAll(res));
    gamePage.huntAll({ preventDefault: () => null });
}

const spendAndPray = () => {
    spendCulture();
    document.getElementById("fastPraiseContainer").firstChild.click()
};


const craftMyResources = () => {
    const stuff = [];
    const { beam, slab, plate, steel, wood } = toggleValues;
    if (steel) {
        stuff.push("steel");
    }
    if (plate) {
        stuff.push("plate");
    }
    if (beam) {
        stuff.push("beam");
    }
    if (slab) {
        stuff.push("slab");
    }
    if (wood) {
        stuff.push("wood");
    }
    stuff.forEach(res => gamePage.craftAll(res));
};

/* User interface */


const header = document.getElementsByClassName("right-tab-header")[0];

const toggleValues = {};

const handleCheckbox = (name) => {
    toggleValues[name] = !(!!toggleValues[name]);
};

const withContainer = (callback, style) => {
    const containerDiv = document.createElement("div");
    if (style) {
        containerDiv.setAttribute("style", style);
    }
    const container = {
        addButton: (text, handleClick, id) => {
            const newBtn = document.createElement("button");
            newBtn.appendChild(document.createTextNode(text));
            newBtn.onclick = handleClick;
            newBtn.id = id;
            containerDiv.appendChild(newBtn);
        },
        addCheckbox: (labelText, name, checked) => { 
            const label = document.createElement("label");
            const checkbox = document.createElement("input");

            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("style", "display: inline;");
            checkbox.onclick = () => handleCheckbox(name);
            if (checked) {
                checkbox.click();
                checkbox.setAttribute("checked", true);
            }

            label.setAttribute("style", "display: block;");
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(labelText));
            containerDiv.appendChild(label);
        },
    };
    callback(container);
    header.append(containerDiv);
};

const borderStyle = `
    border: 1px solid darkgray; 
    margin-top: 4px;
    padding: 4px;
    border-radius: 3px;
`;

withContainer(({ addButton, addCheckbox }) => {
    addButton("Make stuff", craftMyResources);
    addCheckbox("Wood", "wood", true);
    addCheckbox("Beam", "beam", true);
    addCheckbox("Slab", "slab", true);
    addCheckbox("Plate", "plate");
    addCheckbox("Steel", "steel");
}, borderStyle);

withContainer(({ addButton, addCheckbox }) => {
    addButton("Do culture tasks", spendCulture);
    addButton("Do culture tasks and praise", spendAndPray);
    addCheckbox("Manuscripts", "manuscript", true);
    addCheckbox("Compendiums", "compendium");
    addCheckbox("Blueprints", "blueprint");
}, borderStyle);

withContainer(({ addButton }) => {
    addButton("Trade to cap titanium", tradeToCapTitanium);
    addButton("Trade for coal (match iron)", tradeWithSpiders, "spiderBtn");
}, borderStyle);
