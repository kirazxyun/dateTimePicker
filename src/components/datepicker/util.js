import moment from 'moment';
var unit = {
	createDate(...time) {
		if(!time.length || !time[0]) return null;
		if(time.length === 1) {
			return this.turnToDate(moment(...time));
		} 
		return new Date(...time);
	},

	turnToDate(momentDate) {
		return momentDate ? (new Date(momentDate.get('year'), momentDate.get('month'), momentDate.get('date'))) : null;
	},

	format(time, format) {
		return time ? moment(time).format(format) : null;
	},
	cloneDate(date) {
		return date ? new Date(date) : null;
	}
};
export default unit;