export var scoreboard = {
  props: ['elapsed', 'funds', 'mrr'],
  template: `
    <div>
      <div>
        <strong>Elapsed: </strong>
        <span id="elapsed">{{ elapsed }} days</span>
      </div>
      <div>
        <strong>Funds: </strong>
        <span id="funds">&dollar;{{ funds.toFixed(0) }} (&dollar;{{ mrr.toFixed(0) }}/mo)</span>
      </div>
    </div>
  `
};
