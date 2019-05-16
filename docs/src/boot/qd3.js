import * as d3 from 'd3'

// D3 is now available through this.$d3
// this.$d3.selectAll('p').style('color', 'white');
// API: https://github.com/d3/d3/blob/master/API.md

export default ({
  Vue
}) => {
  Vue.prototype.$d3 = d3
  // Vue.component('q-d3', QD3)
}
