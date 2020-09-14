<!-- @format -->
<template>
	<button id="trigger" class="c-btn" @click="$emit('click', $event)">
		<span class="gm__txtSize-sm">
			{{ msg }}
		</span>
		<i class="fas fa-long-arrow-alt-right c-icon"></i>
	</button>
</template>

<script>
	export default {
		name: "Trigger",
		props: {
			msg: { type: String, default: "Let's go" },
		},
	};
</script>
<style lang="scss">
	// @import "~_scss/00-utils/module.scss";
</style>
