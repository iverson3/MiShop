<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<uni-swipe-action :options="options" @click="bindClick($event, index)">
				<uni-list-item>
					<view class="text-secondary">
						<view class="d-flex a-center">
							<text class="main-text-color">{{ item.name }}</text>
							{{ item.phone }}
							<text class="main-text-color" v-if="item.isdefault">[默认]</text>
						</view>
						<view class="">{{ item.path }}</view>
						<view class="">{{ item.detailPath }}</view>
					</view>
				</uni-list-item>
			</uni-swipe-action>
		</block>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action.vue'
	
	import {mapState, mapMutations} from 'vuex'
	export default {
		components: {
			uniListItem,
			uniSwipeAction
		},
		data() {
			return {
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
		onNavigationBarButtonTap: function(e) {
			if (e.index === 0) {
				uni.navigateTo({
					url: "/pages/user-path-edit/user-path-edit"
				})
			}
		},
		methods: {
			...mapMutations(['delPath']),
			
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
									this.delPath(index)
									uni.showToast({title: "删除成功"})
								}
							}
						})
						break;
					default:
						break;
				}
			},
		}
	}
</script>

<style>

</style>
