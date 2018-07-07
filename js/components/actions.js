export var actions = {
  props: ['config'],
  computed: {
    productivity: function () {
      var net = this.config.baseProductivity;

      net += (this.config.repoManager ? this.config.repoManagerProductivityBonus : 0);
      net += (this.config.repoFirewall ? this.config.repoFirewallProductivityBonus : 0);
      net += (this.config.governance ? this.config.governanceProductivityBonus : 0);

      return net;
    },
    progress: function () {
      if (this.config.buildingFeature) {
        return (this.config.daysElapsed - this.config.buildStarted) * (this.config.developers * this.productivity * 12 / 365);
      }
      else {
        return 0;
      }
    }
  },
  watch: {
    progress: function (progress) {
      if (progress >= 1) {
        this.$emit('feature-built');
      }
    }
  },
  template: `
    <div>
      <h3 id="features">{{ config.features }} features</h3>
      <button id="build" v-bind:disabled="config.buildingFeature" v-on:click="$emit('build-feature')">{{ config.buildingFeature ? "Building... (" + (this.progress * 100).toFixed(0) + "%)" : "Build Feature (+$" + config.netPerFeature.toFixed(0) + "/mo)" }}</button>

      <h3 id="developers">{{ config.developers }} developer</h3>
      <button id="hire" v-on:click="$emit('hire-developer')">Hire Developer (&dollar;{{ config.netPerDeveloper }}/mo)</button>

      <h3>Technology</h3>
      <button id="buy_repo_manager" v-bind:disabled="config.repoManager" v-on:click="$emit('buy-repo')">Buy Repo Manager (&dollar;{{ config.developers * config.repoManagerPerDev }}/mo)</button><br/>
      <button id="buy_firewall" v-bind:disabled="config.repoFirewall" v-on:click="$emit('buy-firewall')">Buy Repo Firewall (&dollar;{{ config.developers * config.repoFirewallPerDev }}/mo)</button><br/>
      <button id="buy_governance" v-bind:disabled="config.governance" v-on:click="$emit('buy-governance')">Buy Governance (&dollar;{{ config.developers * config.governancePerDev }}/mo)</button>
    </div>
  `
};
