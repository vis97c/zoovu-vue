<!-- @format -->
<template>
	<button
		class="c-avatar m__size-lg gm__grab"
		draggable="true"
		ondragstart="event.dataTransfer.setData('text/plain',null)"
		:data-symbol="symbol"
	>
		<img :src="`/images/${icon}.svg`" :alt="`${icon} letter`" loading="lazy" class="m__bgColor-none" />
	</button>
</template>

<script>
	export default {
		name: "Draggable",
		props: {
			icon: { type: String, default: "zoovu-z" },
		},
		computed: {
			symbol() {
				return this.icon.split("-")[1];
			},
		},
	};
</script>
<style lang="scss">
	// @import "~_scss/00-utils/module.scss";
</style>
