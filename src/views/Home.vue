<template>
  <v-container>
    <h2 v-if="athleteName">Hi! {{athleteName}}</h2>

    <v-btn color="primary" @click="updateData">上傳你的紀錄</v-btn>

    <div style="margin: 10px;"></div>

    <v-list two-line subheader>
      <v-subheader>{{year}}年{{month}}月 第{{weekOfYear}}週</v-subheader>
      <template v-for="(item, index) in activities">
        <v-list-tile
          :key="item.start_date"
          avatar
        >
          <v-list-tile-content>
            <v-list-tile-title v-text="item.name"></v-list-tile-title>
            <v-list-tile-sub-title>{{ item.distance | fixedDis }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            {{ item.start_date | formatDate }}
          </v-list-tile-action>
        </v-list-tile>
        <v-divider
          v-if="index + 1 < activities.length"
          :key="index"
        ></v-divider>
      </template>
    </v-list>

    <v-snackbar v-model="snackbar" :timeout="3000" color="success" bottom>
      {{'上傳成功'}}
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'

export default {
  filters: {
    fixedDis: function (value) {
      const dis = value / 1000
      return parseFloat(dis.toFixed(2)) + ' km'
    },
    formatDate: function (value) {
      const date = new Date(value)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}/${month}/${day}`
    }
  },
  data () {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const weekOfYear = moment().week()

    return {
      year,
      month,
      weekOfYear,
      snackbar: false
    }
  },
  computed: {
    ...mapState('strava', ['athlete', 'activities']),
    ...mapState('request', ['loading']),
    athleteName () {
      return this.athlete
        ? `${this.athlete.firstname} ${this.athlete.lastname}`
        : ''
    }
  },
  methods: {
    ...mapActions('strava', ['getAthlete', 'getActivities']),
    ...mapActions('request', ['requestStart', 'requestStop']),
    updateData () {
      if (this.activities.length === 0 || this.loading) return

      this.requestStart()

      const athleteId = String(this.athlete.id)
      const dateId = `${this.year}${this.addZero(this.month)}_${this.weekOfYear}`

      this.$firebase.firestore().collection('weeks')
        .doc(dateId)
        .collection('Athletes')
        .doc(athleteId)
        .set({ ...this.athlete, activities: this.activities })
        .then(() => {
          this.snackbar = true
          this.requestStop()
        })
        .catch(error => {
          alert(error)
          this.requestStop()
        })
    },
    addZero (i) {
      return i < 10 ? `0${i}` : i
    }
  },
  mounted () {
    if (!this.athlete) {
      this.getAthlete()
      this.getActivities({
        after: moment().startOf('week').add(1, 'days').format('X'),
        before: moment().endOf('week').add(1, 'days').format('X')
      })
    }
  }
}
</script>
