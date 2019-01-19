<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4 lg3 v-if="!authenticating">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary" dense>
            <v-toolbar-title>週週50K</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <p>歡迎來到week50k，請先登入strava</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="handleSubmit"
              :loading="authenticating"
              :disabled="authenticating"
            >登入</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { parse } from 'query-string'

export default {
  name: 'login',
  computed: {
    ...mapGetters('auth', [
      'authenticating',
      'authenticationError',
      'authenticationErrorCode'
    ])
  },
  methods: {
    ...mapActions('auth', ['login']),
    handleSubmit () {
      const clientId = process.env.VUE_APP_CLIENT_ID
      const { origin, pathname } = window.location
      const redirectUri = origin + pathname
      const responseType = 'code'
      const scope = 'activity:read_all'
      const requestAccessUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`

      window.location.href = requestAccessUrl
    }
  },
  mounted () {
    const search = window.location.search
    const parsed = parse(search)
    const code = parsed.code

    if (code) {
      this.login(code)
    }
  }
}
</script>

<style scoped>
.container {
  background: url('../assets/cycling.jpg') no-repeat center center;
}
</style>
