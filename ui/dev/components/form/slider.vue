<template>
  <div>
    <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : ''">
      <q-toggle v-model="dark" :dark="dark" :dense="dense" label="Dark" :false-value="null" />
      <q-toggle v-model="dense" :dark="dark" :dense="dense" label="Dense" />

      <p class="caption">
        Standalone
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ standalone }}</em> &nbsp;&nbsp;(0 to 50)</span>
        </span>
      </p>
      <q-slider :dark="dark" :dense="dense" @change="onChange" @input="onInput" v-model="standalone" :min="0" :max="50" />
      <q-slider :dark="dark" :dense="dense" @change="val => { standalone = val; onChange(val); }" @input="onInput" :value="standalone" :min="0" :max="50" label />
      <q-slider :dark="dark" :dense="dense" v-model="standalone" :min="0" :max="50" />

      <q-slider :dark="dark" :dense="dense" label-color="orange" label-text-color="black" v-model="standalone" :min="0" :max="50" label />

      <p class="caption">
        Step 0
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ stepZero }}</em> &nbsp;&nbsp;(0 to 100)</span>
        </span>
      </p>
      <q-slider :dark="dark" :dense="dense" v-model="stepZero" :step="0" />

      <p class="caption">
        With Floating Point Precision
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ precision }}</em> &nbsp;&nbsp;(0.1 to 2.0, step 0.01)</span>
        </span>
      </p>
      <q-slider :dark="dark" :dense="dense" v-model="precision" :min="0.1" :max="2" :step="0.01" />

      <p class="caption">
        With Floating Point Precision
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ precision }}</em> &nbsp;&nbsp;(0.1 to 2.0, step 0.01)</span>
        </span>
      </p>
      <q-slider :dark="dark" :dense="dense" v-model="precision" :min="0.1" :max="2" :step="0.01" />

      <p class="caption">
        With Step
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ step }}</em> &nbsp;&nbsp;(0 to 45, step 5)</span>
        </span>
      </p>
      <q-slider :dark="dark" :dense="dense" v-model="step" :min="0" :max="45" :step="5" />

      <p class="caption">
        With Label
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ label }}</em> &nbsp;&nbsp;(-10 to 10, step 4)</span>
        </span>
      </p>
      <q-slider :dark="dark" :dense="dense" v-model="label" :min="-10" :max="10" :step="4" label />

      <p class="caption">
        Snaps to Steps
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ snap }}</em> &nbsp;&nbsp;(0 to 10, step 2)</span>
        </span>
      </p>
      <q-slider :dark="dark" :dense="dense" v-model="snap" :min="0" :max="10" :step="2" label snap />

      <p class="caption">
        With Markers. Snaps to Steps
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ marker }}</em> &nbsp;&nbsp;(0 to 10, step 2)</span>
        </span>
      </p>
      <q-slider :dark="dark" :dense="dense" color="orange" v-model="marker" :min="0" :max="10" :step="2" label snap markers />

      <p class="caption">
        Display Label Always
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ label }}</em> &nbsp;&nbsp;(-20000 to 20000, step 400)</span>
        </span>
      </p>
      <q-slider :dark="dark" :dense="dense" v-model="label" :min="-20000" :max="20000" :step="400" label-always />

      <p class="caption">
        With custom value for Label
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ label }}</em> &nbsp;&nbsp;(-20 to 20, step 4)</span>
        </span>
      </p>
      <q-slider :dark="dark" :dense="dense" v-model="label" markers :min="-20" :max="20" :step="4" label :label-value="`${label}px`" label-always />

      <p class="caption">
        Readonly State
      </p>
      <q-slider :dark="dark" :dense="dense" v-model="standalone" :min="0" :max="50" readonly />

      <p class="caption">
        Disabled State
      </p>
      <q-slider :dark="dark" :dense="dense" v-model="standalone" :min="0" :max="50" disable />

      <p class="caption">
        Null Value
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ nullValue === null ? 'null' : nullValue }}</em> &nbsp;&nbsp;(0 to 50)</span>
        </span>
      </p>
      <q-slider :dark="dark" :dense="dense" v-model="nullValue" :min="0" :max="50" />

      <p class="caption">
        Null Value with min
        <span class="label inline bg-secondary text-white">
          Model <span class="right-detail"><em>{{ nullValueMin === null ? 'null' : nullValueMin }}</em> &nbsp;&nbsp;(20 to 50)</span>
        </span>
      </p>
      <q-slider :dark="dark" :dense="dense" v-model="nullValueMin" :min="20" :max="50" />

      <p class="caption">
        Coloring
      </p>
      <q-slider :dark="dark" :dense="dense" color="secondary" v-model="standalone" :min="0" :max="50" label />
      <q-slider :dark="dark" :dense="dense" color="orange" label-text-color="black" v-model="standalone" :min="0" :max="50" label />
      <q-slider :dark="dark" :dense="dense" color="dark" v-model="standalone" :min="0" :max="50" label />
      <q-slider :dark="dark" :dense="dense" color="teal" label-color="black" v-model="standalone" :min="0" :max="50" label-always class="q-mt-md" />

      <p class="caption">
        Inside of a List
      </p>
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-icon name="volume_up" />
          </q-item-section>
          <q-item-section>
            <q-slider :dark="dark" :dense="dense" v-model="standalone" :min="0" :max="50" label />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon name="brightness_medium" />
          </q-item-section>
          <q-item-section>
            <q-slider :dark="dark" :dense="dense" v-model="standalone" :min="0" :max="50" label />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon name="mic" />
          </q-item-section>
          <q-item-section>
            <q-slider :dark="dark" :dense="dense" v-model="standalone" :min="0" :max="50" label />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: null,
      dense: false,

      nullValue: null,
      nullValueMin: null,
      standalone: 20,
      stepZero: 30.05,
      precision: 0.4,
      step: 30,
      label: 5,
      snap: 2,
      marker: 6
    }
  },
  watch: {
    standalone (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    },
    step (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>
