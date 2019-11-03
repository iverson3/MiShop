export default {
	data() {
		return {
			beforeReady: true,
		}
	},
	onReady: function() {
		this.$nextTick(() => {
			setTimeout(() => {
				this.beforeReady = false
			}, 500)
		})
	}
}