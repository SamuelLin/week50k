<template>
  <v-container>
    <h4 class="display-1">歡迎來到週週50K</h4>

    <v-divider class="my-3"></v-divider>

    <p class="subheading">
目的： 鼓勵大家外出騎車，我們發現買了車不騎的人數太多了，所以呢？義工團決定投入時間及物力來糾大家騎車。</p>

    <p class="subheading">社團運作方式：每週騎二次車，里程超過 50 公里，即完成本週目標。 重點不在比快，比遠，重點在是否能夠持之以恆的快樂騎車。

請大家使用 Strava 做為記錄工具，分享你騎車的快樂！並於星期五貼出你的本週統計。</p>

    <p class="subheading">當月，完成每週目標的朋友，即有機會獲得我們為大家準備的小小贈品。

每季，我們會有季統計，同樣提供贈品獎勵朋友。

計劃剛成型，如有不足之處，再請提出，同時也期待大家的讚助，同時也需要義工協助運作。</p>

    <h1 v-if="athleteName">Hi! {{athleteName}}</h1>

    <v-btn color="primary" @click="updateData" :disabled="activities.length === 0">上傳你本週的紀錄</v-btn>

    <div style="margin: 10px;"></div>

    <v-list two-line subheader>
      <v-subheader>{{year}}年{{month}}月 第{{weekOfYear}}週</v-subheader>
      <div v-if="activities.length > 0">
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
      </div>
      <div v-else>
        <v-list-tile>這週無資料，該去騎車囉！</v-list-tile>
      </div>
    </v-list>

    <v-snackbar v-model="snackbar" :timeout="3000" color="success" bottom>
      {{'上傳成功'}}
    </v-snackbar>

    <br>
    <br>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

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
    const weekOfYear = this.$moment().week()

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
    async updateData () {
      if (this.activities.length === 0 || this.loading) return

      this.requestStart()

      const athleteId = String(this.athlete.id)
      const dateId = `${this.year}${this.addZero(this.month)}_${this.weekOfYear}`

      try {
        await this.$firebase.firestore().collection('weeks')
          .doc(dateId)
          .collection('Athletes')
          .doc(athleteId)
          .set({ ...this.athlete, activities: this.activities })

        this.snackbar = true
      } catch (error) {
        alert(error)
      }

      this.requestStop()
    },
    addZero (i) {
      return i < 10 ? `0${i}` : i
    }
  },
  mounted () {
    if (!this.athlete) {
      this.getAthlete()
      this.getActivities({
        after: this.$moment().startOf('week').format('X'),
        before: this.$moment().endOf('week').format('X')
      })
    }
  }
}
</script>
