<template>
		<div :class="[prefixCls]" :style="styles">
			<trigger @click.native="handleTriggerClick"
							 @delete="handleDelete"
							 :selected-date="formatDate(this.selectedDate)"
							 :placeholder="placeholder"></trigger>
	    <div :class="[prefixCls + '-drop']" v-show="dropShow">
        <div :class="[prefixCls + '-panel']">
          <div :class="[prefixCls + '-content', prefixCls + '-content-left']">
            <div :class="[prefixCls + '-header']">
              <span :class="[prefixCls + '-btn', prefixCls +'-pre-btn']" 
                    @click="handlePreClick"><Icon type="chevron-left"></Icon></span>
              <span :class="[prefixCls + '-label']">{{ year }}年</span>
              <span :class="[prefixCls + '-label']">{{ month + 1 }}月</span>
            </div>
            <datetable @cellclick="handleCellClick"
                       :selected-date="this.selectedDate"
                       :year="year"
                       :month="month"
                       :today="today"
                       :min-date="readDate(minDate)"
                       :max-date="readDate(maxDate)"></datetable>
          </div>
          <div :class="[prefixCls + '-content', prefixCls + '-content-right']">
            <div :class="[prefixCls + '-header']">
              <span :class="[prefixCls + '-label']">{{ rYear }}年</span>
              <span :class="[prefixCls + '-label']">{{ rMonth + 1 }}月</span>
              <span :class="[prefixCls + '-btn', prefixCls + '-next-btn']" 
                    @click="handleNextClick"><Icon type="chevron-right"></Icon></span>
            </div>
            <datetable @cellclick="handleCellClick"
                       :selected-date="this.selectedDate"
                       :year="rYear"
                       :month="rMonth"
                       :today="today"
                       :min-date="readDate(minDate)"
                       :max-date="readDate(maxDate)"></datetable>
          </div>
        </div>
	    </div>
    </div>
</template>

<script>
const prefixCls = 'date-picker';
const now =  new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
import unit from './util';
import trigger from './trigger';
import datetable from './date-table';
export default {

  name: 'doubledatepicker',

  components: {
  	trigger,
  	datetable
  },

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
    	today: today,

    	year: '', //当前显示的年份
    	month: '', //当前显示的月份
    	selectedDate: null, //单选模式下选中的日期
    	dropShow: false,

    	startDate: null, //多选模式下的开始日期
    	endDate: null, //多选模式下的结束日期
    	separator: '~', //多选模式的时间分隔符
		};
  },
  computed: {
  	styles () {
  		return {
  			'display': 'inline-block'
			};
  	},
    rYear () {
      if(this.month === 11) {
        return this.year + 1;
      }
      return this.year;
    },
    rMonth () {
      if(this.month === 11) {
        return 0;
      }
      return this.month + 1;
    }
  },
  methods: {
  	handleTriggerClick() {
  		this.dropShow = true;
  	},
  	handleDelete() {
  		this.selectedDate = null;
      this.$emit('input', '');
      this.$emit('on-clear');
  	},
  	handlePreClick() {
  		if(this.month === 0) {
  			this.year--;
  			this.month = 11;
  		} else {
  			this.month--;
  		}
  	},
  	handleNextClick() {
  		if(this.month === 11) {
  			this.year++;
  			this.month = 0;
  		} else {
  			this.month++;
  		}
  	},
  	handleCellClick(cell) {
  		if(cell.disabled) return;
  		if(!this.range && cell.selected) return;
  		const date = unit.createDate(cell.year, cell.month, cell.day);
  		if(this.range) {
  			if(this.startDate && this.endDate) {
  				this.startDate = date;
  				this.selectedDate = date;
  				this.endDate = null;
  			}
  			else if(this.startDate) {
  				if(this.startDate.getTime() > date.getTime()) {
  					this.endDate = this.startDate;
  					this.startDate = date;
  				} else {
  					this.endDate = date;
  				}
  				this.selectedDate = [unit.createDate(this.startDate), unit.createDate(this.endDate)];
	  			this.$emit('input', this.formatDate(this.selectedDate));
	      	this.$emit('on-change', this.formatDate(this.selectedDate));
	      	this.dropShow = false;
  			} else {
  				this.startDate = date;
  				this.selectedDate = date;
  			}
  		} else {
  			this.selectedDate = date;
  			this.$emit('input', this.formatDate(this.selectedDate));
      	this.$emit('on-change', this.formatDate(this.selectedDate));
				this.dropShow = false;
  		}
  	},
  	formatDate(date) {
  		if(!date) return '';
  		if(date.length !== undefined) {
  			return unit.format(date[0], this.format) + this.separator + unit.format(date[1], this.format);
  		}
      return unit.format(date, this.format);
  	},
  	readDate(date) {
  		return unit.createDate(date);
  	},
  	initSingleDate: function() {
  		this.selectedDate = unit.createDate(this.value);
  		if(this.selectedDate) {
	  		this.year = this.selectedDate.getFullYear();
	  		this.month = this.selectedDate.getMonth();
  		}
  	},
  	initRangeDate: function() {
  		const dates = this.value ? this.value.split(this.separator) : [];
  		if(dates.length === 2) {
  			this.startDate = unit.createDate(dates[0]);
  			this.endDate = unit.createDate(dates[1]);
  			this.year = this.startDate.getFullYear();
  			this.month = this.startDate.getMonth();
  			this.selectedDate = [unit.cloneDate(this.startDate), unit.cloneDate(this.endDate)];
  		}
  	},
  	init() {
  		if(this.range) {
  			this.initRangeDate();
  		} else {
  			this.initSingleDate();
  		}
  		if(!this.year) {
  			this.year = this.today.getFullYear();
  			this.month = this.today.getMonth()
  		}
  	},
  	attachEvents() {
  		document.addEventListener('click', (e) => {
		   if(!this.$el.contains(e.target)) {
		   	this.dropShow = false;
		   	this.selectedDate = null;
		   	this.startDate = null;
		   	this.endDate = null;
		   	this.init();
		   }
	  	});
  	}
  },
  mounted() {
  	this.init();
  	this.attachEvents();
  },
  watch: {
  	value(val) {
  		this.init();
  	}
  }
};
</script>

<style lang="less" scoped>
.date-picker {
    line-height: normal; 

    .date-picker-drop {
        position: absolute;
        z-index: 999;
    		width: 500px;
    		padding: 0;
    		overflow: visible;
    		max-height: none;
        background: #fff;
        border: 1px solid #DEDEDE;
        border-radius: 2px;
        opacity: 0.95;
        transition: all 0.5s ease;

        .date-picker-header {
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-bottom: 1px solid #e9eaec;

            .date-picker-btn {
                display: inline-block;
                width: 20px;
                height: 24px;
                line-height: 26px;
                margin-top: 4px;
                text-align: center;
                cursor: pointer;
                color: #bbbec4;
                transition: color .2s ease-in-out;
            }
            .date-picker-label {
                cursor: pointer;
                transition: color .2s ease-in-out;
            }

            .date-picker-pre-btn {
                float: left;
                margin-left: 10px;
            }

            .date-picker-next-btn {
                float: right;
                margin-right: 10px;
            }
        }

        .date-picker-content-left {
          float: left;
        }

        .date-picker-content-right {
          float: left;
        }
    }
}
</style>