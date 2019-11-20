<template>
  <div class="q-layout-padding" style="min-height: 100vh">
    <div class="q-gutter-md" style="max-width: 500px">
      <q-badge color="blue">
        #4D96F2
      </q-badge>

      <q-badge color="orange" text-color="black" label="2" />

      <q-badge color="purple">
        <q-icon name="fab fa-bluetooth-b" color="white" />
      </q-badge>

      <q-badge color="red">
        12 <q-icon name="warning" color="white" class="q-ml-xs" />
      </q-badge>

      <div class="text-h6">
        Badge <q-badge color="primary">
          v1.0.0+
        </q-badge>
      </div>

      <div class="text-h6">
        Badge <q-badge color="primary" multi-line style="width: 40px">
          v1.0.0+ multi liiiiine
        </q-badge>
      </div>

      <div>
        Feature <q-badge color="primary">
          v1.0.0+
        </q-badge>
      </div>

      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-avatar rounded>
            <img src="https://cdn.quasar.dev/img/chaosmonkey.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            Ganglia
          </q-item-label>
          <q-item-label caption>
            <q-badge color="yellow-6" text-color="black">
              3
              <q-icon
                name="fas fa-exclamation-triangle"
                size="14px"
                class="q-ml-xs"
              />
            </q-badge>
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <span>2 min ago</span>
        </q-item-section>
      </q-item>

      <div class="text-h4">
        Title
        <q-badge align="top">
          cli v1.0.0
        </q-badge>
      </div>

      <q-separator />

      <div class="text-h4">
        Title
        <q-badge align="middle">
          app v1.0.0
        </q-badge>
      </div>

      <q-separator />

      <div class="text-h4">
        Title
        <q-badge align="bottom">
          docs v1.0.0
        </q-badge>
      </div>

      <q-btn push color="white" text-color="primary" label="Unread Mails">
        <q-badge color="orange" floating>
          22
        </q-badge>
      </q-btn>

      <q-btn dense color="purple" round icon="email" class="q-ml-md">
        <q-badge color="red" floating>
          4
        </q-badge>
      </q-btn>

      <q-btn color="teal" size="sm" label="Unread Mails">
        <q-badge color="orange" floating transparent>
          ∞
        </q-badge>
      </q-btn>

      <q-btn dense round flat icon="email">
        <q-badge color="red" floating transparent>
          4
        </q-badge>
      </q-btn>

      <div class="text-h4">
        Title
        <q-badge transparent align="middle" color="orange">
          app v1.0.0
        </q-badge>
      </div>

      <div>Some text <q-badge>100</q-badge></div>
      <div>
        Some text <q-badge color="orange">
          100
        </q-badge>
      </div>
      <div>
        Some text <q-badge color="yellow" text-color="black">
          100
        </q-badge>
      </div>

      <q-btn color="primary" label="Button">
        <q-badge color="orange" floating>
          100+
        </q-badge>
      </q-btn>
      <q-btn size="sm" color="primary" label="Button" class="q-ml-md">
        <q-badge color="orange" floating>
          100+
        </q-badge>
      </q-btn>
      <q-btn size="lg" dense color="primary" label="Button" class="q-ml-md">
        <q-badge color="orange" floating>
          4
        </q-badge>
      </q-btn>
      <q-btn color="primary" icon="map" round class="q-ml-md">
        <q-badge color="orange" floating>
          2
        </q-badge>
      </q-btn>
      <q-btn dense color="primary" icon="map" round class="q-ml-md">
        <q-badge color="orange" floating>
          2
        </q-badge>
      </q-btn>

      <h2>
        Some title
        <q-badge align="top">
          1.0.0+
        </q-badge>
      </h2>

      <h2>
        Some title
        <q-badge>1.0.0+</q-badge>
      </h2>

      <q-badge color="orange" label="Outline" outline />

      <q-avatar icon="mail" size="60px">
        <q-badge text-color="red" floating outline position="left">
          40
        </q-badge>
      </q-avatar>

      <div class="text-h4">
        Text
        <q-badge outline align="middle" color="primary">
          v1.0.0
        </q-badge>
      </div>
    </div>

    <q-avatar icon="mail" size="60px">
      <q-badge text-color="red" floating flat>
        Flat
      </q-badge>
    </q-avatar>

    <h3>Position + Align</h3>
    <q-toggle v-model="floating" label="Floating" />

    <div class="row">
      <q-avatar icon="mail" size="120px">
        <q-badge text-color="red" flat position="left" :floating="floating">
          Left
        </q-badge>
      </q-avatar>
      <q-avatar icon="mail" size="120px">
        <q-badge text-color="red" flat position="middle" :floating="floating">
          Middle
        </q-badge>
      </q-avatar>
      <q-avatar icon="mail" size="120px">
        <q-badge text-color="red" flat position="right" :floating="floating">
          Right
        </q-badge>
      </q-avatar>
    </div>

    <div class="row">
      <q-avatar icon="mail" size="120px">
        <q-badge text-color="red" flat position="left" align="top" :floating="floating">
          Left-top
        </q-badge>
      </q-avatar>
      <q-avatar icon="mail" size="120px">
        <q-badge text-color="red" flat position="middle" align="top" :floating="floating">
          Middle-top
        </q-badge>
      </q-avatar>
      <q-avatar icon="mail" size="120px">
        <q-badge text-color="red" flat position="right" align="top" :floating="floating">
          Right-top
        </q-badge>
      </q-avatar>
    </div>

    <div class="row">
      <q-avatar icon="mail" size="120px">
        <q-badge text-color="red" flat position="left" align="middle" :floating="floating">
          Left-middle
        </q-badge>
      </q-avatar>
      <q-avatar icon="mail" size="120px">
        <q-badge text-color="red" flat position="middle" align="middle" :floating="floating">
          Middle-middle
        </q-badge>
      </q-avatar>
      <q-avatar icon="mail" size="120px">
        <q-badge text-color="red" flat position="right" align="middle" :floating="floating">
          Right-middle
        </q-badge>
      </q-avatar>
    </div>

    <div class="row">
      <q-avatar icon="mail" size="120px">
        <q-badge text-color="red" flat position="left" align="bottom" :floating="floating">
          Left-bottom
        </q-badge>
      </q-avatar>
      <q-avatar icon="mail" size="120px">
        <q-badge text-color="red" flat position="middle" align="bottom" :floating="floating">
          Middle-bottom
        </q-badge>
      </q-avatar>
      <q-avatar icon="mail" size="120px">
        <q-badge text-color="red" flat position="right" align="bottom" :floating="floating">
          Right-bottom
        </q-badge>
      </q-avatar>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dense: false,
      floating: false
    }
  }
}
</script>
