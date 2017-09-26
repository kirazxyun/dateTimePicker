<template>
		<div :class="[prefixCls]" :style="styles">
	    <div :class="[prefixCls + '-trigger']"  @mouseenter.stop="handleHover" @mouseleave.stop="handleLeave" @click="handleTriggerClick">
	        <i :class="[prefixCls + '-input-icon', 'wsicon wsicon-calendar']" v-show="!showDelete"></i>
	        <i :class="[prefixCls + '-input-icon', 'wsicon wsicon-error']" v-show="showDelete" @click="handleDelete"></i>
	        <input :class="[prefixCls + '-input']" v-model="formatSelectedDate" :placeholder="placeholder" readonly="readonly"/>
	    </div>
	    <div :class="[prefixCls + '-drop']" v-show="dropShow">
	      <div :class="[prefixCls + '-header']">
	          <span :class="[prefixCls + '-btn', prefixCls +'-pre-btn', 'wsicon wsicon-triangle-left']" @click="handlePreClick"></span>
	          <span :class="[prefixCls + '-label']">{{ year }}年</span>
	          <span :class="[prefixCls + '-label']">{{ month + 1 }}月</span>
	          <span :class="[prefixCls + '-btn', prefixCls + '-next-btn', 'wsicon wsicon-triangle-right']" @click="handleNextClick"></span>
	      </div>
	      <datetable></datetable>
	    </div>
    </div>
</template>

<script>
const prefixCls = 'date-picker';
import moment from 'moment';
import datetable from './date-table';
export default {

  name: 'datetimepicker',

  props: {
  	value: { //默认选中的日期
  		type: String,
      default: ''
  	},
  	format: { //格式化
  		type: String,
  		default: 'YYYY-MM-DD'
  	},
  	minDate: { //可选的最小日期
  		type: [Date, String]
  	},
  	maxDate: { //可选的最大日期
  		type: [Date, String]
  	},
  	range: { //是否多选，默认单选
  		type: Boolean,
  		default: false
  	},
  	placeholder: {
  		type: String,
  		default: function() {
  			return this.range ? '请选择日期范围' : '请选择日期';
  		}
  	}
  },

  data () {
    return {
    	prefixCls: prefixCls, //样式前缀
    	year: '', //当前显示的年份
    	month: '', //当前显示的月份
    	selectedDate: null, //单选模式下选中的日期-moment
    	startDate: null, //多选模式下的开始日期-moment
    	endDate: null, //多选模式下的结束日期-moment
    	separator: '~', //多选模式的时间分隔符
    	readMinDate: this.minDate ? moment(this.minDate).valueOf() : null, //可选的最小日期-时间戳
    	readMaxDate: this.maxDate ? moment(this.maxDate).valueOf() : null, //可选的最大日期-时间戳
    	hover: false, //trigger区域是否hover
    	dropShow: this.show
		};
  },
  computed: {
  	styles () {
  		return {
  			'display': 'inline-block'
			};
  	},
  }
};
</script>

<style lang="css" scoped>
</style>