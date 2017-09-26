<template>
  <div :class="[prefixCls]">
      <dateTableHeader></dateTableHeader>
      <cell v-for="(cell, index) in cells" 
            :selected="cellSelected(index)" 
            :disabled="cellDisabled(index)"
            :type="cell.type"
            :text="cell.text"
            @click="handleCellClick(index)"></cell>
  </div>
</template>

<script>
const prefixCls = 'date-picker-table';
import moment from 'moment';
import dateTableHeader from './date-table-header';
import cell from './cell';
export default {

  name: 'date-table',

  components: {
    dateTableHeader,
    cell
  },

  props: {
  	year: {
  		type: Number
  	},
  	month: {
  		type: Number
  	},
    selectedDate: {
      type: Date
    },
    today: {
      type: Date
    }
  },

  data () {
    return {
      prefixCls: prefixCls, //样式前缀
    	cells: []
    };
  },

  methods: {
    getCells () {
      const year = this.year;
      const month = this.month;
      const firstDayOfMonth = new Date(year, month, 1).getDay(); //当月的第一天是星期几
      const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); //当月的最后一天
      const lastDateOfLastMonth = new Date(year, month, 0).getDate(); //上个月的最后一天

      const prevYear = month === 0 ? year - 1 : year; //上个月的年份
      const prevMonth = month === 0 ? 11 : month - 1; //上个月的月份
      const nextYear = month === 11 ? year + 1 : year; //下个月的年份
      const nextMonth = month === 11 ? 0 : month + 1; //下个月的月份

      let temp = [];
      for(let len = (firstDayOfMonth === 7 ? 0 : firstDayOfMonth); len >= 0; len--) {
        temp.push({
          text: lastDateOfLastMonth - len,
          day: lastDateOfLastMonth - len,
          year: prevYear,
          month: prevMonth,
          type: 'prev-month'
        });
      }
      for(let i = 1, len = lastDateOfMonth; i <= len; i++) {
        temp.push({
          text: i,
          day: i,
          year: year,
          month: month,
          type: false
        });
      }
      for(let i = 0, len = 42 -  temp.length; i < len; i++) {
        temp.push({
          text: i + 1,
          day: i + 1,
          year: nextYear,
          month: nextMonth,
          type: 'next-month'
        })
      }
      this.cells = temp;
    },

    cellSelected(index) {
      return false;
    },

    cellDisabled(index) {
      let cell = this.cells[index];
      if(cell.type === 'next-month' || cell.type === 'prev-month') {
        return false;
      }

      return true;
    },

    handleCellClick(index) {
      let cell = this.cells[index];
      this.$emit('cellclick', cell);
    }
  },

  watch: {
    year(val) {
      this.getCells();
    },

    month(val) {
      this.getCells();
    }
  },

  created() {
    this.getCells();
  }
};
</script>

<style lang="scss" scoped>
.date-picker-table {
	width: 220px;
	margin: 10px;
	white-space: normal;
}
</style>