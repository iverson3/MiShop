<template>
	<view>
		<block v-if="list.length > 0" v-for="(item,index) in list" :key="index">
			<search-list :item="item" :index="index"></search-list>
		</block>
		
		<view class="d-flex j-center a-center my-5" @click="getData()">
			<text class="font-lg pb-5">{{ loadtext }}{{ loadtext }}{{ loadtext }}</text>
		</view>
	</view>
</template>

<script>
	import searchList from '@/components/search-list/search-list.vue'
	
	export default {
		components: {
			searchList
		},
		data() {
			return {
				list: [],
				page: 1,
				index: 0,
				
				loadtext: "加载更多"
			}
		},
		onLoad() {
			this.getData()
		},
		methods: {
			getData() {
				if (this.loadtext !== '加载更多') {
					return
				}
				this.loadtext = "加载中..."
				let data = []
				for (let i = this.index + 1; i <= this.index + 50; i++) {
					data.push({
						id: i,
						title: "title title title  " + i,
						titlepic: "https://yanxuan-item.nosdn.127.net/4c536c4ea486f8d5c8a172bfaaf5b680.png",
						desc: "天鹅绒面，丝绒时髦高级感 " + i,
						pprice: "200.00",
						comment_num: i + 1,
						good_num: i + "%"
					})
				}
				this.index = this.index + 50
				this.list = [...this.list, ...data]
				this.page = this.page + 1
				this.loadtext = "加载更多"
				
				console.log('-------------');
				// console.log(this.list);
				console.log(this.list.length);
				
				// wx.getLocation()
				// wx.authorize()
			}
		}
	}
</script>

<style>

</style>
