<!-- @format -->
<template>
	<div id="appex">
		<div class="c-back" aria-hidden>
			<img src="/images/shapes.png" alt="" class="m__bgColor-none" />
		</div>

		<div class="c-holder gm__txtAlign-center">
			<div v-if="!playing" class="c-flxInline m__flxColumn gu__flx-center">
				<div class="x-txt xm__txtAlign-center">
					<p>
						<b>Hello friend, tell me your name...</b>
					</p>
				</div>
				<input v-model="name" type="text" class="c-inTxt" placeholder="Your name here" />
				<div v-if="timeLeft == 25 || timeLeft == null" class="c-flx m__flxRow gu__flx-center">
					<Trigger @click="start" />
				</div>

				<div v-if="timeLeft == 0" class="c-flx m__flxRow gu__flx-center">
					<p class="gm__txtColor-primary">
						<b>You ran out of time</b>
					</p>
					<Trigger msg="Start over" @click="start" />
				</div>
				<div v-if="timeLeft > 0 && victory" class="c-flx m__flxColumn gu__flx-center">
					<div class="c-flx m__flxRow gu__flx-center">
						<p class="gm__txtColor-secondary">
							<b>Congratulations, you won!</b>
						</p>
						<Trigger msg="Play again" @click="start" />
					</div>
					<p class="gm__txtSize-xs gm__txtColor-dark3">
						<b>Your score: {{ timeLeft }}</b>
					</p>
				</div>
			</div>
			<div v-else class="c-flx m__flxColumn gu__flx-center gm__gapingY-100">
				<div class="c-flx m__flxColumn gu__flx-center-stretch gm__gapingY-30">
					<div class="c-flx m__flxColumn gu__flx-center-stretch">
						<div class="c-flx m__flxRow gu__flx-between-center">
							<p>
								<b>Good luck, {{ capitalName }}!</b>
							</p>
							<p>
								<i class="far fa-clock c-icon m__size-20 gm__txtColor-secondary"></i>
								&nbsp;
								<b class="gm__txtColor-primary">Your score: {{ timeLeft }} seconds</b>
							</p>
						</div>
						<div class="c-flx m__flxRow gu__flx-between-center">
							<p class="gm__txtSize-xs gm__txtColor-dark3">
								<b>Pick up the right cards</b>
							</p>
							<p class="gm__txtSize-xs gm__txtColor-dark3">
								<b>The faster the better!</b>
							</p>
						</div>
					</div>
					<div class="c-flxInline m__flxRow gu__flx-center">
						<div class="c-avatar m__size-lg gm__dropArea is__full">
							<Draggable icon="zoovu-o" />
						</div>
						<div class="c-avatar m__size-lg gm__dropArea is__full">
							<Draggable icon="zoovu-z" />
						</div>
						<div class="c-avatar m__size-lg gm__dropArea is__full">
							<Draggable icon="zoovu-v" />
						</div>
						<div class="c-avatar m__size-lg gm__dropArea is__full">
							<Draggable icon="zoovu-u" />
						</div>
						<div class="c-avatar m__size-lg gm__dropArea is__full">
							<Draggable icon="zoovu-o" />
						</div>
					</div>
				</div>

				<div class="c-flx m__flxColumn gu__flx-center-start">
					<p class="gm__txtSize-xs gm__txtColor-dark3">
						<b>
							...and drop them here to make the logo great again!
						</b>
					</p>
					<div class="c-flxInline m__flxRow gu__flx-center">
						<button class="c-avatar m__size-lg gm__dropArea"></button>
						<button class="c-avatar m__size-lg gm__dropArea"></button>
						<button class="c-avatar m__size-lg gm__dropArea"></button>
						<button class="c-avatar m__size-lg gm__dropArea"></button>
						<button class="c-avatar m__size-lg gm__dropArea"></button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Draggable from "_components/Draggable.vue";
	import Trigger from "_components/Trigger.vue";

	export default {
		name: "App",
		components: {
			Draggable,
			Trigger,
		},
		data() {
			return {
				playing: false,
				name: "",
				victory: false,
				timeLeft: null,
			};
		},
		computed: {
			capitalName() {
				return this.name.charAt(0).toUpperCase() + this.name.slice(1);
			},
		},
		watch: {
			timeLeft(newTime) {
				if (this.playing) {
					if (this.timeLeft > 0) {
						// active game
						let _this = this;
						setTimeout(function() {
							_this.timeLeft = newTime - 1;
						}, 1000);
					} else {
						// game finished
						this.playing = false;
						setTimeout(function() {
							alert("Time out, you've lost");
						}, 100);
					}
				}
				return;
			},
		},
		methods: {
			start: function() {
				// star game if name available
				// console.log("test");
				if (this.name) {
					this.playing = true;
					this.victory = false;
					this.timeLeft = 25;
					return;
				}
				return alert("Please provide a name before proceeding.");
			},
		},
		// TERMINA LIFEHOOKS
	};
</script>

<style lang="scss">
	@import "_scss/00-utils/module.scss";
</style>
