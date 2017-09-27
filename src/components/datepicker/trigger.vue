<template>
		<div :class="[prefixCls + '-trigger']"  
					@mouseenter.stop="handleHover" 
					@mouseleave.stop="handleLeave">
		    <i :class="[prefixCls + '-input-icon']" 
		    	 v-show="!showDelete"><Icon type="calendar"></Icon></i>
		    <i :class="[prefixCls + '-input-icon']" 
		    	 @click.stop="handleDelete"
		    	 v-show="showDelete"><Icon type="close-circled"></Icon></i>
		    <input :class="[prefixCls + '-input']" 
		    			 :placeholder="placeholder"
		    			 v-model="selectedDate" readonly="readonly"/>
		</div>
</template>

<script>
const prefixCls = 'date-picker';
export default {

  name: 'trigger',

  props: {
  	selectedDate: {
  		type: String,
  		default: ''
  	},
  	placeholder: {
  		type: String,
  		default: ''
  	}
  },

  data () {
    return {
    	prefixCls: prefixCls, //样式前缀
      hover: false
    };
  },

  computed: {
  	showDelete() {
  		return this.selectedDate && this.hover;
  	},
  },

  methods: {
  	handleHover() {
  		this.hover = true;
  	},

  	handleLeave() {
  		this.hover = false;
  	},
  	handleDelete() {
  		this.$emit('delete');
  	}
  }
};
</script>

<style lang="less" scoped>
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
</style>