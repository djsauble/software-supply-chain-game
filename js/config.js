export var config = {
  controller: false,
  daysElapsed: 0,
  msPerDay: 1000,
  funds: 100000,
  netPerMonth: 0,
  goalPerYear: 100000000, // $100,000,000
  features: 0,
  buildingFeature: false,
  buildProgress: 0,
  netPerFeature: 50000, // $50,000/mo
  developers: 1,
  baseProductivity: 0.08, // Build 5% feature per dev per month
  netPerDeveloper: -8333, // -$8,333/mo
  repoManager: false,
  repoManagerPerDev: -10, // -$10/mo
  repoManagerProductivityBonus: 0.01, // 1% bonus
  repoFirewall: false,
  repoFirewallPerDev: -30, // -$30/mo
  repoFirewallProductivityBonus: 0.02, // 2% bonus;
  governance: false,
  governancePerDev: -65, // -$65/mo
  governanceProductivityBonus: 0.04 // 4% bonus;
};
