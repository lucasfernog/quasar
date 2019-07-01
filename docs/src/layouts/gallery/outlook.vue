<template>
<q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-black text-white">
      <q-toolbar class="outlook__primary-toolbar">
        <q-btn icon="fab fa-microsoft" size="lg"/>
        <q-toolbar-title class="text-subtitle1 text-bold">Outlook</q-toolbar-title>
        <q-input dense v-model="search" filled bg-color="grey-5" placeholder="Search" :style="searchStyle"
          @focus="searchFocused = true" @blur="searchFocused = false">
          <template #prepend>
            <q-icon class="cursor-pointer" :name="searchFocused ? 'arrow_back' : 'search'" @click="searchFocused = false"/>
          </template>
          <template #after v-if="searchFocused">
            <q-btn icon="search" class="text-white search__button"/>
          </template>
        </q-input>
        <q-space/>
        <q-btn icon="fa fa-cog fa-xs" size="lg"/>
        <q-btn icon="fa fa-question" size="lg"/>
        <q-avatar class="q-ml-sm cursor-pointer" color="accent">L</q-avatar>
      </q-toolbar>
      <q-toolbar class="bg-grey-4 text-black outlook__secondary-toolbar">
        <q-btn flat icon="menu" @click="miniState = !miniState"/>
        <q-btn flat icon="add" @click="miniState = !miniState" no-caps style="width: 200px;">New message</q-btn>
        <q-btn flat icon="fa fa-trash-alt" no-caps>Empty folder</q-btn>
        <q-btn flat icon="email" no-caps>Mark all as read</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
    v-model="leftDrawerOpen"
    bordered
    :breakpoint="0"
    :width="254"
    :mini="miniState"
    >
    <q-scroll-area class="fit">
      <q-list padding>
        <q-item v-for="menu in menus" :key="menu.id" v-ripple clickable>
          <q-item-section avatar>
            <q-icon :name="menu.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ menu.text }}</q-item-label>
          </q-item-section>
        </q-item>
        </q-list>
    </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-splitter v-model="splitter">
        <template #before>
          <q-card>
            <q-list>
              <q-item>
                <q-item-section>Teste</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </template>
        <template #after>
          <router-view></router-view>
        </template>
      </q-splitter>
    </q-page-container>

</q-layout>
</template>

<script>
export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: true,
      miniState: true,
      searchFocused: false,
      splitter: 25,
      search: '',
      menus: [
        {
          id: 1,
          icon: 'fa fa-inbox',
          text: 'Inbox'
        },
        {
          id: 2,
          icon: 'fa fa-paper-plane',
          text: 'Sent'
        }
      ]
    }
  },
  computed: {
    searchStyle () {
      return {
        width: this.searchFocused ? '90%' : 'unset'
      }
    }
  }
}
</script>

<style lang="stylus">
.q-toolbar
  padding-left 0
  & .q-icon
    font-size 1.3rem!important

.q-btn
  border-radius 0

.q-item__label
  color #323130
.q-item .q-icon
  color #605e5c

.search__button
  background #0062AF
  margin-left -6px
  height 100%

.outlook__primary-toolbar
  & .q-toolbar__title
    flex 0 0 auto
    width: 200px
  & .q-btn:hover, .q-btn:focus
    background #0062AF

.outlook__secondary-toolbar
  color #0062AF!important
  & .q-btn
    font-weight 300
    font-size 14px!important
    height 50px
    & .q-focus-helper
      background #9FC5E4
</style>
