<template>
	<span :class="classes">
  	<em>{{ cell.text }}</em>
  </span>
</template>

<script>
const prefixCls = 'date-picker-table-cell';
export default {

  name: 'cell',

  props: {
  	text: {
  		type: String,
  		default: ''
  	},
  	selected: {
  		type: Boolean,
  		default: false
  	},
  	disabled: {
  		type: Boolean,
  		default: false
  	},
  	type: {
  		type: String,
  		default: ''
  	}
  },

  data () {
    return {
      prefixCls: prefixCls, //样式前缀
    };
  },

  computed: {
  	classes: function(val) {
			return [
				prefixCls,
				{
					[`${prefixCls}-selected`]: this.selected,
	        [`${prefixCls}-disabled`]: this.disabled,
	        [`${prefixCls}-today`]: this.type === 'today',
	        [`${prefixCls}-prev-month`]: this.type === 'prev-month',
	        [`${prefixCls}-next-month`]: this.type === 'next-month'
				}
			];
  	}
  }
};
</script>

<style lang="less" scoped>
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
    z-index: 1
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
</style>