/* Zebra stuff */

const getAverageTitaniumPerTrade = () => {
    let standingRatio = this.game.getEffect("standingRatio");

    if (this.game.prestige.getPerk("diplomacy").researched) {
        standingRatio += 10;
    }

    const zebras = game.diplomacy.get("zebras");

    const tradeFailProbability = zebras.attitude === "hostile" ? (1 - zebras.standing - standingRatio / 100) : 0;
    const tradeSuccessProbability = 1 - tradeFailProbability;

    const shipAmount = this.game.resPool.get("ship").value;
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

const tradeToCapTitanium = () => {
    const gold = game.resPool.get("gold").value;
    const slabs = game.resPool.get("slab").value;
    const catpower = game.resPool.get("manpower").value;
    const tradeCaps = [
        { res: "gold", amt: Math.floor(gold/15) },
        { res: "slab", amt: Math.floor(slabs/50) },
        { res: "catpower", amt: Math.floor(catpower/50) },
    ];
    const tradesPossible = Math.min(...tradeCaps.map(({amt}) => amt));
    const cappedResources = tradeCaps
        .filter(cap => cap.amt === tradesPossible)
        .map(cap => cap.res);

    if (tradesPossible === 0) {
        this.game.msg(`Not enough ${cappedResources.join(",")} to trade with zebras`);
        return;
    }

    const optimalZebraTrades = getOptimalZebraTrades();
    const nbTrades = Math.min(tradesPossible, optimalZebraTrades);

    this.game.msg(`Approximately ${optimalZebraTrades} trades needed to cap Titanium`);
    if (nbTrades < optimalZebraTrades) {
        this.game.msg(`Trade with zebras limited to ${nbTrades} by ${cappedResources.join(",")}`);
    }

    var zebras = game.diplomacy.get("zebras");
    game.diplomacy.tradeMultiple(zebras, nbTrades);
}

/* Game Logic*/

const spendCulture = () => {
    [
        "parchment",
        "manuscript",
        "compedium",
    ].forEach(res => gamePage.craftAll(res));
    gamePage.huntAll({ preventDefault: () => null });
}

const spendAndPray = () => {
    spendCulture();
    document.getElementById("fastPraiseContainer").firstChild.click()
};

const stuff = ["slab", "beam"];

const craftMyResources = (...extras) => {
    return () => {
        [...extras, ...stuff].forEach(res => gamePage.craftAll(res));
    }
};

/* User interface */

const header = document.getElementsByClassName("right-tab-header")[0];

const addButton = (text, handleClick) => {
    const newBtn = document.createElement("button");
    newBtn.appendChild(document.createTextNode(text));
    newBtn.onclick = handleClick;
    header.appendChild(newBtn);
}

addButton("Make stuff", craftMyResources());
addButton("Make stuff + plates", craftMyResources("plate"));
addButton("Make stuff + steel", craftMyResources("steel"));
addButton("Make all the stuff", craftMyResources("steel", "plate"));
addButton("Spend culture", spendCulture);
addButton("Spend culture and praise", spendAndPray);
addButton("Trade to cap titanium", tradeToCapTitanium);
