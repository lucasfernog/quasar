<!--
Links
  Data: https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function
  Form Input Bindings: https://vuejs.org/v2/guide/forms.html#Basic-Usage
  Watchers: https://vuejs.org/v2/guide/computed.html#Watchers
Src
  https://github.com/CorpGlory/d3vue/blob/master/src/d3-components/size-controller.vue
-->
<style lang="stylus">
.quasar__logo
  opacity: 0.09

.circle
  font-size 20px
  color #fff
  text-align center
  line-height 0
  border-radius 50%
  background #eee
  opacity 0.8
  z-index 2 /* above svg */
  border-width 2px
  border-style solid
  border-color white
  &--dark
    background #111
    border-color black
  .q-card
    margin 5%
    background transparent

    .btn__close
      margin-top 65%
      color black

    .btn__docs
      margin-top 20%
      color black

    .q-tabs
      padding-top 3px

    .q-tab
      border-radius 20px 20px 0 0

    .q-tab-panels
      border-radius 0 0 10px 10px!important
      height 80%

      .q-scrollarea
        height: 160px

      p
        line-height: 1
        height: 140px
        overflow-y: auto
        margin-bottom 0
        text-align left

.components__root
  min-width 100%
  width 100%
  height 750px

  &--dark
    background-image: radial-gradient(circle closest-side, rgba(0,0,0,0.9), rgba(0,0,0,.8), rgba(0,0,0,0))

svg
  z-index: 1 /* above logo to catch mousemove */
</style>

<template lang="pug">
  .column.relative-position.components__root(:class="{'components__root--dark': this.dark}")
    .row
      svg.absolute-center(:width="width" :height="height")
      .quasar__logo.absolute-center(v-show="!showComponentDetails" :style="dimensions")
        img(src="https://cdn.quasar-framework.org/logo/svg/quasar-logo.svg")
      .circle.absolute-center(v-if="showComponentDetails" ref="circle" :style="dimensions")
        q-card(v-if="focusedComponentIndex !== null" flat :style="cardDimensions")
          .row(style="margin-top:-10px")
            .col-1
            q-field.col-10.absolute-center(v-if="!search" dense rounded outlined bg-color="white")
              template(v-slot:append)
                q-btn(flat round size="sm" icon="search" @click="search = true" style="margin-right:-8px")
              template(v-slot:control)
                div.self-center.full-width.no-outline.text-center(@click="search = true" style="font-weight:800;font-size:1.2em;margin-left:8px")
                  span {{ filteredComponents[focusedComponentIndex].name }}
            q-input.col-10.absolute-center(v-else v-model="filter" rounded outlined dense placeholder="Search" debounce="500" ref="search" bg-color="white")
              template(v-slot:append)
                q-btn(flat round size="sm" icon="close" @click="search = false" style="margin-right:-8px")
          // q-tabs(v-model="tab" dense)
            q-tab(name="description" label="Description")
            q-tab(name="example" label="Example")
          // q-tab-panels(v-model="tab")
            q-tab-panel.text-amber-1.bg-black(name="description" v-html="filteredComponents[focusedComponentIndex].description")
            q-tab-panel.text-amber-1.bg-black(name="related")
              q-list(dense dark)
                q-scroll-area(:thumb-style="thumbStyle")
                  q-item(@click="onRelatedClick(related)" clickable v-ripple v-for="related in focusedComponentRelated" :key="related")
                    q-item-section {{ related }}
          .row.absolute-center.btn__docs
            q-btn(flat label="docs" :to="route(filteredComponents[focusedComponentIndex].name)")
            q-btn(flat label="api")
          q-btn.btn__close.absolute-center(flat round dense icon="close" @click="showComponentDetails = false")

      doc-api.relative-bottom.full-width(
        v-if="showComponentDetails"
        :file="filteredComponents[focusedComponentIndex].name"
        :style="{top: Math.min(685, this.height * 1.1) + 'px', 'z-index': 1}"
      )
</template>

<script>
import { colors } from 'quasar'
const { lighten, textToRgb, rgbToHsv, hsvToRgb } = colors // lighten,

/**
 * Saturate or desaturate a hex color
 *
 * @param color
 * @param percent
 * @returns {string} - e.g. #ffffff
 */
const saturate = function (color, percent) {
  if (typeof color !== 'string') {
    throw new TypeError('Expected a string as color')
  }
  if (typeof percent !== 'number') {
    throw new TypeError('Expected a numeric percent')
  }

  let rgb = textToRgb(color)
  // t = percent < 0 ? 0 : 255,
  // p = Math.abs(percent) / 100,

  const hsv = rgbToHsv(rgb)
  hsv[1] *= percent
  rgb = hsvToRgb(hsv)

  const R = rgb.r,
    G = rgb.g,
    B = rgb.b,
    text = '#' + (
      0x1000000 + R * 0x10000 + G * 0x100 + B
    ).toString(16).slice(1)
  // console.log(color, text)
  return text
}

const defaultChordOpacity = 0.8
const inactiveChordOpacity = 0.1
const defaultGroupOpacity = 0.9
const inactiveGroupOpacity = 0.4
const linkGroupOpacity = 0.7

export default {
  data () {
    return {
      filter: '',
      search: false,
      components: [],
      focusedComponentIndex: null,
      chords: [],
      groups: [],
      componentCount: 0,
      showComponentDetails: false,
      tab: 'description'
    }
  },

  props: {
    interactive: Boolean,
    dark: Boolean,
    width: {
      type: Number,
      default: 600
    },

    height: {
      type: Number,
      default: 600
    },
    active: {
      type: String,
      default: null
    }
  },

  methods: {
    onRelatedClick (related) {
      this.focusedComponentIndex = this.indexByName['$' + related]
    },

    // Returns the Flare package name for the given class name.
    name: name => name,

    // TODO change impl to "inSvgBounds"
    toCircle (e, field = 'toElement') {
      let element = e[field],
        flag = false

      if (element === null) {
        return false
      }

      do {
        if (element === this.$refs.circle) {
          flag = true
        }
        element = element.parentElement
      } while (!flag && element != null)

      return flag
    },

    mutateFocusedComponentIndex (amount) {
      if (amount === null) {
        this.focusedComponentIndex = null
      }
      else if (this.focusedComponentIndex === null) {
        this.focusedComponentIndex = 0
      }
      else {
        let index = this.focusedComponentIndex + amount
        if (index >= this.componentCount) {
          index = 0
        }
        else if (index < 0) {
          index = this.componentCount - 1
        }
        this.focusedComponentIndex = index
      }

      this.$nextTick(() => {
        if (this.focusedComponentIndex !== null && !this.hasActiveComponent) {
          this.mutateFocusedComponentIndex(amount > 0 ? 1 : -1)
        }
      })
    },

    route (component) {
      return `/vue-components/${component.split('Q')[1].replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase()}`
    },

    __mouseMove (e) {
      const d = e.target.__data__
      if (d) {
        const isChord = d.source && d.target
        if (isChord) {
          this.focusedComponentIndex = d.source.index
        }
        else {
          this.focusedComponentIndex = d.index
        }
      }

      // TODO focus svg
    },

    __focus (e) {},

    __keydown (e) {
      let index = this.focusedComponentIndex
      if (e.keyCode === 37 || e.keyCode === 40) { // left/down
        this.mutateFocusedComponentIndex(-1)
      }
      else if (e.keyCode === 39 || e.keyCode === 38) { // right/top
        this.mutateFocusedComponentIndex(1)
      }
      else if (e.keyCode === 27) {
        this.showComponentDetails = false
        this.mutateFocusedComponentIndex(null)
      }
      else {
        return
      }

      if (index !== null) {
        e.preventDefault()
      }
    },

    __click (e) {
      const d = e.target.__data__
      if (d) {
        this.showComponentDetails = true
      }
    }
  },

  computed: {
    dimensions () {
      let val = Math.min(this.height, this.width)
      return {
        width: val * 0.757 - 150 + 'px',
        height: val * 0.757 - 150 + 'px'
      }
    },

    cardDimensions () {
      let val = Math.min(this.height, this.width)
      return {
        height: val * 0.314 + 'px',
        width: val * 0.443 + 'px'
      }
    },

    thumbStyle () {
      return {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: this.fill(this.focusedComponentIndex),
        width: '5px',
        opacity: 0.75
      }
    },

    focusedComponentRelated () {
      const component = this.filteredComponents[this.focusedComponentIndex]
      return component.imports.concat(
        component.related.filter(item => component.imports.indexOf(item) < 0)
      )
    },

    filteredComponents () {
      if (this.filter) {
        let filter = this.filter.toLowerCase(),
          links = []

        this.components.forEach(c => {
          if (c.name.toLowerCase().includes(filter) || (c.group && c.group.toLowerCase().includes(filter))) {
            links = links.concat(c.imports).concat(c.related)
            links.push(c.name)
          }
        })

        return this.components.filter(c => links.includes(c.name))
      }
      return this.components
    },

    indexByName () {
      let indexByName = this.$d3.map(),
        n = 0
      // Compute a unique index for each package name.
      this.filteredComponents.forEach(d => {
        if (!indexByName.has(d = this.name(d.name))) {
          indexByName.set(d, n++)
        }
      })

      return indexByName
    },

    nameByIndex () {
      let nameByIndex = this.$d3.map(),
        n = 0
      // Compute a unique index for each package name.
      this.filteredComponents.forEach(d => {
        nameByIndex.set(n++, this.name(d.name))
      })

      return nameByIndex
    },
    matrix () {
      const matrix = [],
        n = Object.keys(this.indexByName).length

      // Construct a square matrix counting package imports.
      this.filteredComponents.forEach(d => {
        var source = this.indexByName.get(this.name(d.name)),
          row = matrix[source]
        if (!row) {
          row = matrix[source] = []
          for (var i = -1; ++i < n;) row[i] = 0
        }

        (d.imports.length ? d.imports : d.related).forEach(d => {
          row[this.indexByName.get(this.name(d))]++
        })
      })

      return matrix
    }
  },

  created (createElement) {
    this.components = require('../statics/quasar-api.json')
  },

  destroyed () {
    const svgEl = this.$el.querySelector('svg')
    svgEl.removeEventListener('mousemove', this.__mouseMove)
    svgEl.removeEventListener('focus', this.__focus)
    svgEl.removeEventListener('keydown', this.__keydown)
    svgEl.removeEventListener('click', this.__click)
  },

  mounted () {
    if (this.interactive) {
      const svgEl = this.$el.querySelector('svg')

      svgEl.addEventListener('mousemove', this.__mouseMove)
      svgEl.addEventListener('focus', this.__focus)
      svgEl.addEventListener('keydown', this.__keydown)
      svgEl.addEventListener('click', this.__click)
    }
  },

  watch: {
    search (newValue) {
      if (newValue === true) {
        this.$refs.search.focus()
      }
    },
    focusedComponentIndex (newValue) {
      if (newValue !== null) {
        let hasActiveComponent = false
        for (const chord of this.chords) {
          let active = chord.__data__.source.index === newValue
          if (active) {
            chord.style.opacity = defaultChordOpacity
            hasActiveComponent = true
          }
          else {
            chord.style.opacity = inactiveChordOpacity
          }
        }

        const links = []
        for (const name of this.filteredComponents[newValue].imports.length ? this.filteredComponents[newValue].imports : this.filteredComponents[newValue].related) {
          links.push(this.indexByName['$' + name])
        }
        for (const group of this.groups) {
          group.style.opacity = group.__data__.index === newValue ? defaultGroupOpacity
            : links.includes(group.__data__.index) ? linkGroupOpacity : inactiveGroupOpacity
        }

        this.hasActiveComponent = hasActiveComponent
      }
      else {
        this.showComponentDetails = false
        for (const chord of this.chords) {
          chord.style.opacity = defaultChordOpacity
        }
        for (const group of this.groups) {
          group.style.opacity = defaultGroupOpacity
        }
      }
    },

    matrix (matrix) {
      let child
      (child = this.$el.querySelector('svg').children[0]) && child.remove()

      const outerRadius = Math.min(this.height, this.width) / 2,
        innerRadius = outerRadius - 150,
        fill = this.$d3.scaleOrdinal().range(['#1b70fc', '#d50527', '#158940', '#f898fd', '#24c9d7', '#cb9b64', '#866888', '#22e67a', '#e509ae', '#9dabfa', '#437e8a', '#b21bff', '#ff7b91', '#94aa05', '#ac5906', '#82a68d', '#fe6616', '#7a7352', '#f9bc0f', '#b65d66', '#07a2e6', '#c091ae', '#8674d2', '#8a91a7', '#88fc07', '#ea42fe', '#9e8010', '#10b437', '#c281fe', '#f92b75', '#07c99d', '#a946aa', '#bfd544', '#16977e', '#ff6ac8', '#a88178', '#5776a9', '#678007', '#fa9316', '#85c070', '#6aa2a9', '#989e5d', '#fe9169', '#cd714a', '#6ed014', '#c5639c', '#c23271', '#698ffc', '#678275', '#c5a121', '#a978ba', '#ee534e', '#d24506', '#59c3fa', '#ca7b0a', '#6f7385', '#9a634a', '#48aa6f', '#ad9ad0', '#d7908c', '#6a8a53', '#8c46fc', '#8f5ab8', '#fd1105', '#7ea7cf', '#d77cd1', '#a9804b', '#0688b4', '#6a9f3e', '#ee8fba', '#a67389', '#9e8cfe', '#bd443c', '#6d63ff', '#d110d5', '#798cc3', '#df5f83', '#b1b853', '#bb59d8', '#1d960c', '#867ba8', '#18acc9', '#25b3a7', '#f3db1d', '#938c6d', '#936a24', '#a964fb', '#92e460', '#a05787', '#9c87a0', '#20c773', '#8b696d', '#78762d', '#638ba8', '#e154c6', '#40835f', '#d73656', '#1afd5c', '#c4f546', '#3d88d8', '#bd3896', '#1397a3', '#f940a5', '#66aeff', '#d097e7', '#fe6ef9', '#d86507', '#8b900a', '#d47270', '#e8ac48', '#cf7c97', '#cebb11', '#718a90', '#e78139', '#ff7463', '#bea1fd', '#f81d47', '#72b93c', '#7ba66a', '#656dc4', '#3a8278', '#66988b', '#a384d5', '#b35a3b', '#e07cfd', '#27cf4c', '#b224d4', '#b39579', '#b68f38', '#e51188', '#938747', '#5eb195', '#bba85b', '#f39f5a', '#9961a0', '#bd60b6', '#14a147', '#db8c67', '#9bc52e', '#96a0cd', '#7b68ac', '#039762', '#cf15fd', '#d1583d', '#b77163'])
      this.fill = fill
      const chord = this.$d3.chord()
        .padAngle(0.04)
        .sortSubgroups(this.$d3.descending)
        .sortChords(this.$d3.descending)(matrix)

      const arc = this.$d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius + 20)

      const svg = this.$d3.select(this.$el).select('svg')
        .attr('width', outerRadius * 2)
        .attr('height', outerRadius * 2)
        .append('g')
        .attr('transform', 'translate(' + outerRadius + ',' + outerRadius + ')')
      const g = svg.selectAll('.group')
        .data(chord.groups)
        .enter().append('g')
        .attr('class', 'group')
        .style('opacity', defaultGroupOpacity)
        // .attr('transform', 'rotate(20)')

      g.append('path')
        .style('opacity', defaultChordOpacity)
        .style('fill', d => fill(d.index))
        .style('stroke', d => fill(d.index))
        .attr('d', arc)

      g.append('text')
        .each(d => {
          d.angle = (d.startAngle + d.endAngle) / 2
        })
        .attr('dy', '.35em')
        .attr('transform', d => {
          return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')' +
            'translate(' + (innerRadius + 26) + ')' +
            (d.angle > Math.PI ? 'rotate(180)' : '')
        })
        .style('text-anchor', d => d.angle > Math.PI ? 'end' : null)
        .style('fill', d => fill(d.index))
        .style('stroke', d => fill(d.index))
        .style('text-shadow', () => {
          if (this.dark === true) return '0 0 3px black, 0 0 4px black ,0 0 5px black'
        })
        .style('cursor', 'pointer')
        .style('font-size', '13px')
        .text(d => this.nameByIndex.get(d.index))

      let colorProcessingPercentages = {}

      svg.selectAll('.chord')
        .data(chord)
        .enter().append('path')
        .attr('class', 'chord')
        .style('opacity', defaultChordOpacity)
        .style('stroke', d => this.$d3.rgb(fill(d.source.index)).darker())
        .style('fill', d => {
          let index = d.source.index
          let percentage = (colorProcessingPercentages[index] ? colorProcessingPercentages[index] : 70) - 30
          // // let percentage = (colorProcessingPercentages[index] ? colorProcessingPercentages[index] : 0.70) * index
          // console.log(index, percentage)
          colorProcessingPercentages[index] = percentage
          let color = fill(index)
          if (this.dark) {
            color = saturate(color, percentage)
          }
          // return
          return lighten(color, percentage)
        })
        .attr('d', this.$d3.ribbon().radius(innerRadius))

      this.chords = this.$el.querySelectorAll('.chord')
      this.groups = this.$el.querySelectorAll('.group')
      this.componentCount = Object.keys(this.indexByName).length
    }
  }
}
</script>
