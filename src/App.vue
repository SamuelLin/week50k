<template>
  <v-app>
    <Loader />

    <v-toolbar dark color="primary" dense>
      <v-toolbar-title class="headline text-uppercase white--text">
        <span>week50k</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon v-if="loggedIn" to="/">
        <v-icon>cloud_upload</v-icon>
      </v-btn>

      <v-btn icon v-if="loggedIn" to="/leaderboard">
        <v-icon>sort</v-icon>
      </v-btn>

      <v-btn icon v-if="loggedIn" @click="logout">
        <v-icon>link_off</v-icon>
      </v-btn>

      <v-btn icon v-if="!loggedIn" to="/login" >
        <v-icon>link</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loader from './components/Loader'

export default {
  name: 'App',
  components: {
    Loader
  },
  computed: {
    ...mapGetters('auth', ['loggedIn'])
  },
  methods: {
    ...mapActions('auth', ['logout'])
  }
}
</script>
