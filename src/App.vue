<template>
  <v-app>
    <Loader/>

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

      <v-btn icon v-if="!loggedIn" to="/login">
        <v-icon>link</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer height="auto" dark>
      <v-card class="flex" flat tile>
        <v-card-title class="grey darken-1">
          <strong class="subheading">任何問題或建議歡迎來信: <a href="mailto:samuelhsnu@gmail.com">samuelhsnu@gmail.com</a></strong>

          <v-spacer></v-spacer>

          <v-btn v-for="icon in icons" :key="icon.name" class="mx-3" dark icon>
            <a :href="icon.href" target="_blank" class="iconButton">
              <v-icon size="24px">{{ icon.name }}</v-icon>
            </a>
          </v-btn>
        </v-card-title>

        <!-- <v-card-actions class="grey lighten-1 justify-center">
          &copy;2018 —
          <strong>week50k</strong>
        </v-card-actions> -->
      </v-card>
    </v-footer>
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
  data () {
    return {
      icons: [
        {
          name: 'fab fa-facebook',
          href: 'https://www.facebook.com/groups/182676019345850/'
        },
        {
          name: 'fab fa-strava',
          href: 'https://www.strava.com/clubs/weekride'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn'])
  },
  methods: {
    ...mapActions('auth', ['logout'])
  }
}
</script>

<style scoped>
.iconButton {
  text-decoration: none !important;
  color: white;
}
</style>
