<template>
	<view @click.stop="$emit('click')" 
	class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" 
	hover-class="bg-light-secondary">
		<slot></slot>
	</view>
</template>

<script>
</script>

<style>
</style>
