<template>
  <v-container>
    <h1>每週里程</h1>

    <v-layout wrap justify-space-around>
      <v-flex xs12 md5 d-flex>
        <v-date-picker
          v-model="month"
          type="month"
          locale="zh-TW"
          :max="maxMonth"
          :min="minMonth"
          full-width
        ></v-date-picker>
      </v-flex>

      <v-flex xs12 md2 d-flex>
        <v-select
          v-model="week"
          :items="weeks"
          label="第幾週"
        ></v-select>
      </v-flex>
    </v-layout>
    <br />
    <v-data-table
      :headers="headers"
      :items="data"
      no-data-text="無資料"
      class="elevation-1"
      :loading="loading"
    >
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          抱歉！這週沒有資料 :(
        </v-alert>
      </template>
      <template slot="items" slot-scope="props">
        <tr :class="props.item.distance >= 50 ? 'green lighten-5' : ''">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.distance }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar" :timeout="3000" color="error" bottom>
      {{'發生錯誤！'}}
    </v-snackbar>

    <br>
    <br>
  </v-container>
</template>

<script>
export default {
  data () {
    const month = this.$moment().format('YYYY-MM')
    const maxMonth = this.$moment().format('YYYY-MM')
    const minMonth = this.$moment().subtract(3, 'months').format('YYYY-MM')
    const week = this.$moment().week()

    return {
      maxMonth,
      minMonth,
      month,
      week,
      headers: [
        {
          text: '姓名',
          align: 'left',
          sortable: false,
          value: name
        },
        { text: '里程', sortable: true, value: 'distance' }
      ],
      data: [],
      snackbar: false,
      loading: false
    }
  },
  computed: {
    weeks () {
      const selectedDate = this.$moment(this.month).format('YYYYMMDD')
      const startMonth = this.$moment(selectedDate).startOf('month')
      const endMonth = this.$moment(selectedDate).endOf('month')
      const diff = endMonth.diff(startMonth, 'weeks')
      const startMonthWeek = this.$moment(this.month).startOf('month').week()
      const weekArr = Array(diff + 1).fill(0).map((week, index) => ({
        text: startMonthWeek + index,
        value: startMonthWeek + index
      }))

      return weekArr
    }
  },
  watch: {
    month () {
      this.week = this.$moment(this.month).startOf('month').week()
    },
    week () {
      this.query()
    }
  },
  methods: {
    async query () {
      if (this.loading) return
      this.loading = true

      const dateId = `${this.month.split('-')[0]}_${this.week}`

      try {
        const querySnapShot = await this.$firebase.firestore().collection('weeks')
          .doc(dateId)
          .collection('Athletes')
          .get()

        const unsortData = querySnapShot.docs.map((doc) => {
          const data = doc.data()
          const totalDis = data.activities.reduce((accumulator, activity) => accumulator + activity.distance, 0)

          return {
            id: data.id,
            name: `${data.firstname} ${data.lastname}`,
            distance: (totalDis / 1000).toFixed(2)
          }
        })

        this.data = unsortData.sort((a, b) => (b - a))
      } catch (error) {
        this.snackbar = true
        this.data = []
      }

      this.loading = false
    },
    async rewrite () {
      console.log('rewrite')
      try {
        const querySnapShot = await this.$firebase.firestore().collection('weeks')
          .doc('201901_5')
          .collection('Athletes')
          .get()

        querySnapShot.docs.map(async (doc) => {
          const data = doc.data()

          await this.$firebase.firestore().collection('weeks')
            .doc('2019_5')
            .collection('Athletes')
            .doc(String(data.id))
            .set(data)
        })
      } catch (error) {
        console.log('error', error)
      }
    }
  },
  mounted () {
    this.query()
    // this.rewrite()
  }
}
</script>
