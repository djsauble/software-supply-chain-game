import { config } from './config.js';
import { controls } from './components/controls.js';
import { logger } from './components/logger.js';

var vm = new Vue({
  el: '#app',
  data: config,
  template: `
    <div id="app">
      <controls
          :config="$data"
          v-on:feature-built="features += 1"
          v-on:build-feature="buildFeature"
          v-on:hire-developer="developers += 1"
          v-on:buy-repo="repoManager = true"
          v-on:buy-firewall="repoFirewall = true"
          v-on:buy-governance="governance = true">
      </controls>
      <logger :output="output"></logger>
    </div>
  `,
  watch: {
    features: function () {
      this.buildingFeature = false;
    },
    developers: function () {
      this.log("Hiring a new developer");
    },
    repoManager: function () {
      this.log("Buying a repository manager");
    },
    repoFirewall: function () {
      this.log("Buying a repository firewall");
    },
    governance: function () {
      this.log("Buying a governance solution");
    }
  },
  components: {
    'controls': controls,
    'logger': logger
  },
  methods: {
    start: function () {
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

      // Is the game over?
      if (this.funds < 0) {
        this.end("You ran out of money!");
      } else if (this.netPerMonth * 12 >= this.goalPerYear) {
        this.end("You win!");
      }
    },
    buildFeature: function () {
      if (!this.buildingFeature) {
        this.buildStarted = this.daysElapsed;
        this.buildingFeature = true;
        this.log("Building a new feature with " + this.developers + " developers");
      }
    },
    log: function (str) {
      this.output = str + "<br/>" + this.output;
    },
    dailyNet: function () {
      var monthlyNet = 0;

      monthlyNet += this.features * this.netPerFeature;
      monthlyNet += this.developers * this.netPerDeveloper;
      monthlyNet += (this.repoManager ? this.repoManagerPerDev * this.developers : 0);
      monthlyNet += (this.repoFirewall ? this.repoFirewallPerDev * this.developers : 0);
      monthlyNet += (this.governance ? this.governancePerDev * this.developers : 0);

      return (monthlyNet * 12) / 365;
    }
  },
  mounted: function() {
    this.$nextTick(this.start);
  }
});
