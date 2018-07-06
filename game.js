//
// Variables
//

var daysElapsed = 0;
var msPerDay = 1000;
var funds = 100000;
var netPerMonth = 0;
var goalPerYear = 100000000; // $100,000,000
var features = 0;
var buildingFeature = false;
var buildProgress = 0;
var netPerFeature = 50000; // $50,000/mo
var developers = 1;
var baseProductivity = 0.08; // Build 5% feature per dev per month
var netPerDeveloper = -8333; // -$8,333/mo
var repoManager = false;
var repoManagerPerDev = -10; // -$10/mo
var repoManagerProductivityBonus = 0.01; // 1% bonus
var repoFirewall = false;
var repoFirewallPerDev = -30; // -$30/mo
var repoFirewallProductivityBonus = 0.02; // 2% bonus;
var governance = false;
var governancePerDev = -65; // -$65/mo
var governanceProductivityBonus = 0.04; // 4% bonus;

//
// Main loop
//

var controller = null;

function start() {
  if (!controller) {
    controller = setInterval(step, msPerDay);
  }
}

function end(msg) {
  clearInterval(controller);
  controller = null;
  alert(msg);
}

function step() {
  var net = dailyNet();

  // Update game variables
  daysElapsed += 1;
  funds += net;
  netPerMonth = net * 30;
  if (buildingFeature) {
    if (buildProgress < 1) {
      buildProgress += (developers * productivity() * 12 / 365);
    }
    else {
      features += 1;
      buildingFeature = false;
      buildProgress = 0;
    }
  }

  // Update the screen
  updateScreen();

  // Is the game over?
  if (funds < 0) {
    end("You ran out of money!");
  } else if (netPerMonth * 12 >= goalPerYear) {
    end("You win!");
  }
}

function updateScreen() {
  var elapsedText = daysElapsed + " days";
  document.getElementById("elapsed").innerHTML = elapsedText;

  var fundsText = dolla(funds) + " (" + dolla(netPerMonth) + "/mo)";
  document.getElementById("funds").innerHTML = fundsText;

  var featuresText = features + " features";
  document.getElementById("features").innerHTML = featuresText;

  var buildText = "Build Feature (+" + dolla(netPerFeature) + "/mo)";
  if (buildingFeature) {
    var daysLeft = ((1 - buildProgress)/(developers * productivity() * 12 / 365)).toFixed(0);
    buildText = "Building... (" + daysLeft + " days left)";
  }
  document.getElementById("build").innerHTML = buildText;
  document.getElementById("build").disabled = buildingFeature;

  var developersText = developers + " developers";
  document.getElementById("developers").innerHTML = developersText;

  var buyRepoManagerText = "Buy Repo Manager (" + dolla(developers * repoManagerPerDev) + "/mo)";
  document.getElementById("buy_repo_manager").innerHTML = buyRepoManagerText;

  var buyFirewallText = "Buy Repo Firewall (" + dolla(developers * repoFirewallPerDev) + "/mo)";
  document.getElementById("buy_firewall").innerHTML = buyFirewallText;

  var buyGovernanceText = "Buy Governance (" + dolla(developers * governancePerDev) + "/mo)";
  document.getElementById("buy_governance").innerHTML = buyGovernanceText;
}

//
// Event handlers
//

function buildFeature() {
  if (!buildingFeature) {
    buildingFeature = true;
    document.getElementById("build").disabled = true;
    log("Building a new feature with " + developers + " developers");
  }
}

function hireDeveloper() {
  developers += 1;
  log("Hiring a new developer");
}

function buyRepoManager() {
  if (!repoManager) {
    repoManager = true;
    document.getElementById("buy_repo_manager").disabled = true;
    log("Buying a repository manager");
  }
}

function buyFirewall() {
  if (!repoFirewall) {
    repoFirewall = true;
    document.getElementById("buy_firewall").disabled = true;
    log("Buying a repository firewall");
  }
}

function buyGovernance() {
  if (!governance) {
    governance = true;
    document.getElementById("buy_governance").disabled = true;
    log("Buying a governance solution");
  }
}

//
// Helpers
//

// Add a message to the game log
function log(str) {
  var log = document.getElementById("log");
  log.innerHTML = str + "<br/>" + log.innerHTML;
}

// Get a number formatted as currency
function dolla(num) {
  return "$" + num.toFixed(0);
}

// Get the daily net revenue
function dailyNet() {
  var monthlyNet = 0;

  monthlyNet += features * netPerFeature;
  monthlyNet += developers * netPerDeveloper;
  monthlyNet += (repoManager ? repoManagerPerDev * developers : 0);
  monthlyNet += (repoFirewall ? repoFirewallPerDev * developers : 0);
  monthlyNet += (governance ? governancePerDev * developers : 0);

  return (monthlyNet * 12) / 365;
}

// Calculate developer productivity
function productivity() {
  var net = baseProductivity;

  net += (repoManager ? repoManagerProductivityBonus : 0);
  net += (repoFirewall ? repoFirewallProductivityBonus : 0);
  net += (governance ? governanceProductivityBonus : 0);

  return net;
}
