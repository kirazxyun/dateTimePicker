<template>
		<div :class="classes">
			<span v-for="week in weeks">{{ week }}</span>
    </div>
</template>

<script>
const prefixCls = 'date-picker-table-header';
export default {

  name: 'date-table-header',

  props: {
  	weeks: {
  		type: Array,
  		default: ['日', '一', '二', '三', '四', '五', '六']
  	}
  },

  data () {
    return {
      prefixCls: prefixCls, //样式前缀
    };
  },

  computed: {
  	classes: function(val) {
  		return [prefixCls];
  	}
  }
};
</script>

<style lang="less" scoped>
.date-picker-table-header {
  span {
    line-height: 24px;
    text-align: center;
    margin: 2px;
    color: #bbbec4;
  }
}
</style>