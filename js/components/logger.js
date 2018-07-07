export var logger = {
  props: ['output'],
  template: `
    <div id="log" v-html="output"></div>
  `
};
