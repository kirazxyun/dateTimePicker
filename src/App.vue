<template>
  <div id="app">
    <div>
      <Row align="middle">
        <Col span="12"><h1>日期选择组件</h1></Col>
      </Row>
      <Row align="middle" style="height: 80px;">
        <Col span="3">
          <Button type="primary" @click="handleSetToday">今天</Button>
          <Button type="primary" @click="handleSetminDate">min6/10</Button>
        </Col>
        <Col span="5">
          <datepicker v-model="date" :minDate="minDate" :maxDate="maxDate" :range="false" @on-change="handleDateChange"></datepicker>
        </Col>
        <Col span="5">
          <span>当前选中的日期{{date}}</span>
        </Col>
      </Row>
      <Row align="middle" style="height: 80px;">
        <Col span="5" offset="3">
          <datepicker v-model="rangeDate" 
                      :minDate="minDate" 
                      :maxDate="maxDate" 
                      :range="true"></datepicker>
        </Col>
        <Col span="5">
          <span>当前选中的日期{{rangeDate}}</span>
        </Col>
      </Row>
      <Row align="middle">
        <Col span="12"><datetimepicker v-model="date1"
                                       :minDate="minDate" 
                                       :maxDate="maxDate"></datetimepicker></Col>
        <Col span="12">
          <span>当前选中的日期{{date1}}</span>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import {datepicker, datetimepicker} from './components/datepicker';

export default {
  name: 'app',
  components: {
    datepicker,
    datetimepicker
  },
  data () {
    return {
      date: '',
      date1: '',
      rangeDate: '',
      minDate: '2017-6-5',
      maxDate: '2017-12-12'
    };
  },
  methods: {
    handleSetToday () {
      var now = new Date();
      this.date= now.getFullYear() + '-' +( now.getMonth() + 1) + '-' + now.getDate();
    },
    handleSetminDate () {
      this.minDate = "2017-6-10";
    },
    handleDateChange (val) {
      console.log(val);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
