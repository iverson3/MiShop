<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<uni-swipe-action :options="options" @click="bindClick($event, index)">
				<uni-list-item @click="choose(item)">
					<view class="text-secondary">
						<view class="d-flex a-center line-h-md font-md">
							<text class="main-text-color mr-2">{{ item.name }}</text>
							{{ item.phone }}
							<text class="main-text-color ml-2" v-if="item.isdefault">[默认]</text>
						</view>
						<view class="line-h-sm font">{{ item.province +' '+ item.city +' '+ item.district }}</view>
						<view class="line-h-sm font">{{ item.address }}</view>
					</view>
				</uni-list-item>
			</uni-swipe-action>
		</block>
		
		<template v-if="list.length === 0">
			<view class="w-100 j-center a-center text-center" style="padding-top: 300upx;">
				<view class="font-md text-light-muted">
					暂无收货地址,<text class="main-text-color" @tap="reloadPath">点击刷新</text>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action.vue'
	
	import {mapState, mapMutations, mapActions} from 'vuex'
	export default {
		components: {
			uniListItem,
			uniSwipeAction
		},
		data() {
			return {
				isChoose: false,
				
				options: [{
					text: '修改',
					style: {
						backgroundColor: '#007aff'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
			}
		},
		computed: {
			...mapState({
				list: state => state.path.list
			})
		},
		onLoad: function(e) {
			if (e.type === 'choose') {
				this.isChoose = true
			}
		},
		onNavigationBarButtonTap: function(e) {
			if (e.index === 0) {
				uni.navigateTo({
					url: "/pages/user-path-edit/user-path-edit"
				})
			}
		},
		onPullDownRefresh: function() {
			this.reloadPath()
		},
		methods: {
			...mapMutations(['delPath']),
			...mapActions(['fetchPathData']),
			
			reloadPath: function() {
				this.fetchPathData((res) => {
					if (res) {
						uni.showToast({title: '刷新成功', icon: 'none'});
					} else {
						uni.showToast({title: '刷新失败', icon: 'none'});
					}
				})
			},
			bindClick(e, index) {
				switch (e.index){
					case 0:  // 修改
						let data = JSON.stringify({
							index: index,
							item: this.list[index]
						})
						setTimeout(() => {
							uni.navigateTo({
								url: "/pages/user-path-edit/user-path-edit?data=" + data
							})
						}, 50)
						break;
					case 1:  // 删除
						uni.showModal({
							content: "确定要删除吗？",
							success: (res) => {
								if (res.confirm) {
									let id = this.list[index].id
									
									console.log(id);
									// return
									this.$api.del("/useraddresses/" + id, {}, {token: true, toast: false}).then(res => {
										this.delPath(index)
										uni.showToast({title: "删除成功"})
									}).catch(err => {
										uni.showToast({title: '删除失败，请重试', icon: 'none'});
									})
								}
							}
						})
						break;
					default:
						break;
				}
			},
			
			// 选择收货地址
			choose: function(item) {
				if (this.isChoose) {
					// 通知订单提交页面修改收货地址
					uni.$emit('choosePath', item)
					// 关闭当前页面
					uni.navigateBack({delta: 1})
				}
			}
		}
	}
</script>

<style>

</style>
