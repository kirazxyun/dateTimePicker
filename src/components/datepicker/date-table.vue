<template>
  <div :class="[prefixCls]">
      <dateTableHeader></dateTableHeader>
      <cell v-for="(cell, index) in cells" 
            :selected="cell.selected" 
            :disabled="cell.disabled"
            :type="cell.type"
            :text="cell.text"
            @click.native="handleCellClick(index)"></cell>
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
  		type: [Number, String]
  	},
  	month: {
  		type:[Number, String]
  	},
    selectedDate: {
      type: [Date, Array]
    },
    today: {
      type: Date
    },
    minDate: {
      type: Date,
      default: null
    },
    maxDate: {
      type: Date,
      default: null
    }
  },

  data () {
    return {
      prefixCls: prefixCls //样式前缀
    };
  },

  computed: {
    cells() {
      return this.getCells(this.year, this.month);
    }
  },

  methods: {
    getCells (year, month) {
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
          type: 'prev-month',
          selected: this.cellSelected(prevYear, prevMonth, lastDateOfLastMonth - len),
          disabled: this.cellDisabled(prevYear, prevMonth, lastDateOfLastMonth - len)
        });
      }
      for(let i = 1, len = lastDateOfMonth; i <= len; i++) {
        temp.push({
          text: i,
          day: i,
          year: year,
          month: month,
          type: this.cellToday(year, month, i) ? 'today' : '',
          selected: this.cellSelected(year, month, i),
          disabled: this.cellDisabled(year, month, i)
        });
      }
      for(let i = 0, len = 42 -  temp.length; i < len; i++) {
        temp.push({
          text: i + 1,
          day: i + 1,
          year: nextYear,
          month: nextMonth,
          type: 'next-month',
          selected: this.cellSelected(nextYear, nextMonth, i + 1),
          disabled: this.cellDisabled(nextYear, nextMonth, i + 1)
        })
      }
      return temp;
    },

    cellSelected(...dateArg) {
      if(this.selectedDate) {
        const date = new Date(...dateArg);
        if(this.selectedDate.length !== undefined) {
          return date.getTime() >= this.selectedDate[0].getTime() && date.getTime() <= this.selectedDate[1].getTime();
        }
        return date.getTime() === this.selectedDate.getTime();
      }
      return false;
    },

    cellDisabled(...dateArg) {
      if(this.minDate && this.maxDate) {
        const date = new Date(...dateArg);
        const time = date.getTime();
        if(this.minDate && time < this.minDate.getTime()) return true;
        if(this.maxDate && time > this.maxDate.getTime()) return true;
      }

      return false;
    },

    cellToday(...dateArg) {
      const date = new Date(...dateArg);
      return date.getTime() === this.today.getTime();
    },

    handleCellClick(index) {
      let cell = this.cells[index];
      this.$emit('cellclick', cell);
    }
  },

  created() {
    this.getCells();
  }
};
</script>

<style lang="less" scoped>
.date-picker-table {
	width: 220px;
	margin: 10px;
	white-space: normal;
}
</style>