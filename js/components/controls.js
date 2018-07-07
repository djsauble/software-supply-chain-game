import { scoreboard } from './scoreboard.js';
import { actions } from './actions.js';

export var controls = {
  props: ['config'],
  template: `
    <div id="controls">
      <scoreboard
          :elapsed="config.daysElapsed"
          :funds="config.funds"
          :mrr="config.netPerMonth">
      </scoreboard>
      <actions
          :config="config"
          v-on:feature-built="$emit('feature-built')"
          v-on:build-feature="$emit('build-feature')"
          v-on:hire-developer="$emit('hire-developer')"
          v-on:buy-repo="$emit('buy-repo')"
          v-on:buy-firewall="$emit('buy-firewall')"
          v-on:buy-governance="$emit('buy-governance')">
      </actions>
    </div>
  `,
  components: {
    'scoreboard': scoreboard,
    'actions': actions
  }
};
