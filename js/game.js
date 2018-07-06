import { config } from './config.js';

Vue.component('game-scoreboard', {
  template: `
    <div>
      <div>
        <strong>Elapsed: </strong>
        <span id="elapsed">0 days</span>
      </div>
      <div>
        <strong>Funds: </strong>
        <span id="funds">$100,000 (-$8,333/mo)</span>
      </div>
    </div>
  `
});

Vue.component('game-actions', {
  template: `
    <div>
      <h3 id="features">0 features</h3>
      <button id="build">Build Feature (+$50,000/mo)</button>

      <h3 id="developers">1 developer</h3>
      <button id="hire">Hire Developer (-$8,333/mo)</button>

      <h3>Technology</h3>
      <button id="buy_repo_manager">Buy Repo Manager (-$10/mo)</button><br/>
      <button id="buy_firewall">Buy Repo Firewall (-$30/mo)</button><br/>
      <button id="buy_governance">Buy Governance (-$65/mo)</button>
    </div>
  `
});

Vue.component('game-controls', {
  template: `
    <div id="controls">
      <game-scoreboard></game-scoreboard>
      <game-actions></game-actions>
    </div>
  `
});

Vue.component('game-log', {
  template: '<div id="log">Welcome to the Supply Chain Software game!</div>'
});

var vm = new Vue({
  el: '#app',
  data: config,
  template: `
    <div id="app">
      <game-controls></game-controls>
      <game-log></game-log>
    </div>
  `,
  methods: {
    start: function () {
      // Set up click events
      document.getElementById("build").addEventListener("click", this.buildFeature, false);
      document.getElementById("hire").addEventListener("click", this.hireDeveloper, false);
      document.getElementById("buy_repo_manager").addEventListener("click", this.buyRepoManager, false);
      document.getElementById("buy_firewall").addEventListener("click", this.buyFirewall, false);
      document.getElementById("buy_governance").addEventListener("click", this.buyGovernance, false);

      // Update the screen
      this.updateScreen();

      // Start main loop
      if (!this.controller) {
        this.controller = setInterval(this.step, this.msPerDay);
      }
    },
    end: function (msg) {
      clearInterval(this.controller);
      this.controller = false;
      alert(msg);
    },
    step: function () {
      var net = this.dailyNet();

      // Update game variables
      this.daysElapsed += 1;
      this.funds += net;
      this.netPerMonth = net * 30;
      if (this.buildingFeature) {
        if (this.buildProgress < 1) {
          this.buildProgress += (this.developers * this.productivity() * 12 / 365);
        }
        else {
          this.features += 1;
          this.buildingFeature = false;
          this.buildProgress = 0;
        }
      }

      // Update the screen
      this.updateScreen();

      // Is the game over?
      if (this.funds < 0) {
        this.end("You ran out of money!");
      } else if (this.netPerMonth * 12 >= this.goalPerYear) {
        this.end("You win!");
      }
    },
    updateScreen: function () {
      var elapsedText = this.daysElapsed + " days";
      document.getElementById("elapsed").innerHTML = elapsedText;

      var fundsText = this.dolla(this.funds) + " (" + this.dolla(this.netPerMonth) + "/mo)";
      document.getElementById("funds").innerHTML = fundsText;

      var featuresText = this.features + " features";
      document.getElementById("features").innerHTML = featuresText;

      var buildText = "Build Feature (+" + this.dolla(this.netPerFeature) + "/mo)";
      if (this.buildingFeature) {
        var daysLeft = ((1 - this.buildProgress)/(this.developers * this.productivity() * 12 / 365)).toFixed(0);
        buildText = "Building... (" + daysLeft + " days left)";
      }
      document.getElementById("build").innerHTML = buildText;
      document.getElementById("build").disabled = this.buildingFeature;

      var developersText = this.developers + " developers";
      document.getElementById("developers").innerHTML = developersText;

      var buyRepoManagerText = "Buy Repo Manager (" + this.dolla(this.developers * this.repoManagerPerDev) + "/mo)";
      document.getElementById("buy_repo_manager").innerHTML = buyRepoManagerText;

      var buyFirewallText = "Buy Repo Firewall (" + this.dolla(this.developers * this.repoFirewallPerDev) + "/mo)";
      document.getElementById("buy_firewall").innerHTML = buyFirewallText;

      var buyGovernanceText = "Buy Governance (" + this.dolla(this.developers * this.governancePerDev) + "/mo)";
      document.getElementById("buy_governance").innerHTML = buyGovernanceText;
    },
    buildFeature: function () {
      if (!this.buildingFeature) {
        this.buildingFeature = true;
        document.getElementById("build").disabled = true;
        this.log("Building a new feature with " + this.developers + " developers");
      }
    },
    hireDeveloper: function () {
      this.developers += 1;
      this.log("Hiring a new developer");
    },
    buyRepoManager: function () {
      if (!this.repoManager) {
        this.repoManager = true;
        document.getElementById("buy_repo_manager").disabled = true;
        this.log("Buying a repository manager");
      }
    },
    buyFirewall: function () {
      if (!this.repoFirewall) {
        this.repoFirewall = true;
        document.getElementById("buy_firewall").disabled = true;
        this.log("Buying a repository firewall");
      }
    },
    buyGovernance: function () {
      if (!this.governance) {
        this.governance = true;
        document.getElementById("buy_governance").disabled = true;
        this.log("Buying a governance solution");
      }
    },
    log: function (str) {
      var log = document.getElementById("log");
      log.innerHTML = str + "<br/>" + log.innerHTML;
    },
    dolla: function (num) {
      return "$" + num.toFixed(0);
    },
    dailyNet: function () {
      var monthlyNet = 0;

      monthlyNet += this.features * this.netPerFeature;
      monthlyNet += this.developers * this.netPerDeveloper;
      monthlyNet += (this.repoManager ? this.repoManagerPerDev * this.developers : 0);
      monthlyNet += (this.repoFirewall ? this.repoFirewallPerDev * this.developers : 0);
      monthlyNet += (this.governance ? this.governancePerDev * this.developers : 0);

      return (monthlyNet * 12) / 365;
    },
    productivity: function () {
      var net = this.baseProductivity;

      net += (this.repoManager ? this.repoManagerProductivityBonus : 0);
      net += (this.repoFirewall ? this.repoFirewallProductivityBonus : 0);
      net += (this.governance ? this.governanceProductivityBonus : 0);

      return net;
    }
  },
  mounted: function() {
    this.$nextTick(this.start);
  }
});
