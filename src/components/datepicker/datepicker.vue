<template>
  <div :class="[prefixCls]" :style="styles">
    <div :class="[prefixCls + '-trigger']"  @mouseenter.stop="handleHover" @mouseleave.stop="handleLeave" @click="handleTriggerClick">
        <i :class="[prefixCls + '-input-icon']" v-show="!showDelete"><Icon type="calendar"></Icon></i>
        <i :class="[prefixCls + '-input-icon']" v-show="showDelete" @click="handleDelete"><Icon type="close-circled"></Icon></i>
        <input :class="[prefixCls + '-input']" v-model="formatSelectedDate" :placeholder="placeholder" readonly="readonly"/>
    </div>
    <div :class="[prefixCls + '-drop']" v-show="dropShow">
      <div :class="[prefixCls + '-header']">
          <span :class="[prefixCls + '-btn', prefixCls +'-pre-btn']" @click="handlePreClick"><Icon type="chevron-left"></Icon></span>
          <span :class="[prefixCls + '-label']">{{ year }}年</span>
          <span :class="[prefixCls + '-label']">{{ month + 1 }}月</span>
          <span :class="[prefixCls + '-btn', prefixCls + '-next-btn']" @click="handleNextClick"><Icon type="chevron-right"></Icon></span>
      </div>
      <div :class="[prefixCls + '-content']">
        <div :class="[prefixCls + '-table']">
            <div :class="[prefixCls + '-table-header']">
							<span v-for="week in weeks">{{ week }}</span>
            </div>
            <span :class="getCellCls(cell)" v-for="(cell, index) in cells">
            	<em :index="index" @click="handleCellClick">{{ cell.text }}</em>
            </span>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
const prefixCls = 'date-picker';
import moment from 'moment';
export default {
  name: 'datepicker',
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
    	weeks: ['日', '一', '二', '三', '四', '五', '六'], //星期
    	year: '', //当前显示的年份
    	month: '', //当前显示的月份
    	cells: [], //日期表格元素
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
  	tempCells () { //获取日期表格元素，为了能监听到year和month的变化，做成计算属性
  		const now = new Date();
  		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(); //今天的时间戳

  		const year = this.year;
  		const month = this.month;
  		const firstDayOfMonth = new Date(year, month, 1).getDay(); //当月的第一天是星期几
  		const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); //当月的最后一天
  		const lastDateOfLastMonth = new Date(year, month, 0).getDate(); //上个月的最后一天

  		const prevYear = this.month === 0 ? this.year - 1 : this.year; //上个月的年份
  		const prevMonth = this.month === 0 ? 11 : this.month - 1; //上个月的月份
  		const nextYear = this.month === 11 ? this.year + 1 : this.year; //下个月的年份
  		const nextMonth = this.month === 11 ? 0 : this.month + 1; //下个月的月份

  		let i = 0, 
  				len = firstDayOfMonth === 7 ? 0 : firstDayOfMonth, 
  				temp = [],
  				text = '',
  				date = null;
  		for(len = len - 1; len >= 0; len--) {
  			text = lastDateOfLastMonth - len;
  			date = new Date(prevYear, prevMonth, text);
  			temp.push({
  				text: text,
  				date: date,
  				type: 'prev-month',
  				disabled: !this.isSelectable(date),
  				selected: this.isSelected(date)
  			});
  		}
  		for(i = 1, len = lastDateOfMonth; i <= len; i++) {
  			text = i;
  			date = new Date(this.year, this.month, text);
  			temp.push({
  				text: text,
  				date: date,
  				type: date.getTime() === today ? 'today' : 'cur-month',
  				disabled: !this.isSelectable(date),
  				selected: this.isSelected(date)
  			});
  		}
  		for(i = 0, len = 42 -  temp.length; i < len; i++) {
  			text = i + 1;
  			date = new Date(nextYear, nextMonth, text);
  			temp.push({
  				text: text,
  				date: date,
  				type: 'next-month',
  				disabled: !this.isSelectable(date),
  				selected: this.isSelected(date)
  			})
  		}
  		return temp;
  	},
  	formatSelectedDate () { //显示在input框中的日期-格式化后的
  		if(this.range) {
        if(this.startDate && this.endDate) {
          return moment(this.startDate).format(this.format) + this.separator + moment(this.endDate).format(this.format);
        } else if(this.startDate){
          return moment(this.startDate).format(this.format);
        }
  		}
  		if(!this.range && this.selectedDate) {
        var date = moment(this.selectedDate).format(this.format);
        this.$emit('input', date);
  			return date;
  		}
  		return '';
  	},
  	showDelete () {
  		return this.formatSelectedDate && this.hover;
  	}
  },
  methods: {
  	handlePreClick () {
  		if(this.month === 0) {
  			this.year--;
  			this.month = 11;
  		} else {
  			this.month--;
  		}
  	},
  	handleNextClick: function() {
  		if(this.month === 11) {
  			this.year++;
  			this.month = 0;
  		} else {
  			this.month++;
  		}
  	},
  	handleCellClick: function(e) {
  		const target = e.target;
  		const cell = this.cells[parseInt(target.getAttribute('index'))];
      if(cell.disabled) return;
      if(cell.selected) {
        if(!this.range) return;
        if(!this.startDate || !this.endDate) return;
      }

  		const date = moment(cell.date);
			this.year = cell.date.getFullYear();
			this.month = cell.date.getMonth();
			if(this.range) {
				if(!!this.startDate === !!this.endDate) { //都有还是都没有
					this.startDate = moment(cell.date);
					this.endDate = null;
				} else if(this.startDate) { //只有开始时间
					if(this.startDate.isBefore(date)) {
						this.endDate = date;
					} else {
						this.endDate = moment(this.startDate);
						this.startDate = date;
					}
					this.dropShow = false;
				} else { //只有结束时间
					if(this.endDate.isAfter(date)) {
						this.startDate = date;
					} else {
						this.startDate = moment(this.endDate);
						this.endDate = date;
					}
					this.dropShow = false;
				}
			} else {
				this.selectedDate = date;
				this.dropShow = false;
			}
  	},
  	handleHover: function() {
  		this.hover = true;
  	},
  	handleLeave: function() {
  		this.hover = false;
  	},
  	handleDelete () {
  		this.selectedDate = null;
  		this.startDate = null;
  		this.endDate = null;
  	},
  	handleTriggerClick (e) {
  		if(this.showDelete) return;
  		this.dropShow = true;
  	},
  	getCellCls (cell) {
  		return [
  			`${prefixCls}-table-cell`,
  			{
  				[`${prefixCls}-table-cell-selected`]: cell.selected,
          [`${prefixCls}-table-cell-disabled`]: cell.disabled,
          [`${prefixCls}-table-cell-today`]: cell.type === 'today',
          [`${prefixCls}-table-cell-prev-month`]: cell.type === 'prev-month',
          [`${prefixCls}-table-cell-next-month`]: cell.type === 'next-month'
  			}
  		];
  	},
  	isSelectable (date) {
  		if(this.readMinDate && this.readMinDate > date.getTime()) {
  			return false;
  		}
  		if(this.readMaxDate && this.readMaxDate <  date.getTime()) {
  			return false;
  		}
  		return true;
  	},
  	isSelected (date) {
  		if(this.range) {
  			if(this.startDate && this.endDate) {
  				return moment(date).isBetween(this.startDate, this.endDate, null, '[]');
  			}
  			if(this.startDate) return this.startDate.valueOf() === date.getTime();
  			if(this.endDate) return this.endDate.valueOf() === date.getTime()
  			return false;
  		} else {
  			return this.selectedDate ? this.selectedDate.valueOf() === date.getTime() : false;
  		}
  	},
  	init () {
  		let day = null;
	  	if(this.range) { //多选则初始化startDate和endDate
	  		const dates = this.value ? this.value.split(this.separator) : [];
				this.startDate = dates[0] && moment(dates[0]);
				this.endDate = dates[1] && moment(dates[1]);
				day = moment(this.startDate || {});
	  	} else { //单选初始化selectedDate
	  		this.selectedDate = this.value && moment(this.value);
	  		day = moment(this.selectedDate || {});
	  	}
	  	this.year = day.get('year');
	  	this.month = day.get('month');
  	}
  },
  mounted () {
  	this.init();
  	document.addEventListener('click', (e) => {
	   if(!this.$el.contains(e.target)) this.dropShow = false
  	});
  },
  watch: {
  	tempCells: {
  		handler (temp) {
  			this.cells = temp;
  		},
  		immediate: true
  	},
    value (val) {
      this.init();
    },
    formatSelectedDate (val, old) {
      this.$emit('input', val);
      this.$emit('on-change', val);
    },
    minDate (val) {
      this.readMinDate = val ? moment(val).valueOf() : null;
    },
    maxDate (val) {
      this.readMaxDate = val ? moment(val).valueOf() : null;
    }
  }
};
</script>

<style lang="less" scoped>
.date-picker {
    line-height: normal;    
    .date-picker-trigger {
        position: relative;
        display: inline-block;
        width: 250px;
        position: relative;
        vertical-align: middle;
        .date-picker-input-icon {
            width: 32px;
            height: 32px;
            line-height: 32px;
            font-size: 16px;
            text-align: center;
            color: #80848f;
            position: absolute;
            right: 0;
            z-index: 3;
        }
        .date-picker-input {
            display: inline-block;
            width: 100%;
            height: 32px;
            line-height: 1.5;
            padding: 4px 28px 4px 7px;
            font-size: 12px;
            border: 1px solid #dddee1;
            border-radius: 4px;
            color: #495060;
            background-color: #fff;
            background-image: none;
            position: relative;
            cursor: pointer;
            transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
            box-sizing: border-box;
        }
    }
    .date-picker-drop {
        position: absolute;
        z-index: 999;
    		width: auto;
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
        .date-picker-content {
            .date-picker-table {
	            	width: 220px;
	            	margin: 10px;
	            	white-space: normal;
                .date-picker-table-header {
                	span {
                		line-height: 24px;
                		text-align: center;
                		margin: 2px;
                		color: #bbbec4;
                	}
                }
                .date-picker-table-cell {
                    width: 28px;
                    height: 28px;
                    cursor: pointer;
                    &:hover {
											background: #e1f0fe;
                    }
                }
                .date-picker-table-cell-next-month,
                .date-picker-table-cell-prev-month  {
                    em {
                        color: #bbbec4;
                    }
                    &:hover {
											background: 0 0;
                    }
                }
                .date-picker-table-cell-disabled {
                	cursor: not-allowed;
            	    background: #f7f7f7;
            	    color: #bbbec4;
            	    em {
            	    	color: inherit;
        	    	    background: inherit;
            	    }
                	&.ivu-date-picker-table-cell-selected {
                		em {
                			background: #bbbec4;
            			    color: #f7f7f7
                		}
                	}
                	&:hover {
      		        	cursor: not-allowed;
      		    	    background: #f7f7f7;
      		    	    color: #bbbec4;
      		    	    em {
      		    	    	color: inherit;
      			    	    background: inherit;
      		    	    }
                	}
                }
                .date-picker-table-cell-today {
                	&.ivu-date-picker-table-cell-selected {
                		em:after {
                			background: #fff;
                		}
                	}
                	em {
          		    	position: relative;
          		    	&:after {
          		    		content: "";
          				    display: block;
          				    width: 6px;
          				    height: 6px;
          				    border-radius: 50%;
          				    background: #2d8cf0;
          				    position: absolute;
          				    top: 1px;
          				    right: 1px
          		    	}
                	}
                	
                }
                .date-picker-table-cell-range {
                	em {
					        	position: relative;
					    	    z-index: 1;
					    	    &:before {
					    	    	content: "";
						    	    display: block;
						    	    background: #e1f0fe;
						    	    border-radius: 0;
						    	    border: 0;
						    	    position: absolute;
						    	    top: 2px;
						    	    bottom: 2px;
						    	    left: 0;
						    	    right: 0
					    	    }
                	}
                }
                .date-picker-table-cell-selected {
                	&:hover em, 
                	em{
                		background: #2d8cf0;
            		    color: #fff
                	}
                }
                span, 
                span em {
                  display: inline-block;
                  width: 24px;
                  height: 24px;
                }
                span {
                    em {
                        line-height: 24px;
                        margin: 2px;
                        font-style: normal;
                        border-radius: 3px;
                        text-align: center;
                        transition: all .2s ease-in-out;
                    }
                }
            }
        }
    }
}
</style>