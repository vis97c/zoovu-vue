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
				<div v-if="timeLeft > 0 && full == 5" class="c-flx m__flxColumn gu__flx-center">
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
						<div class="c-avatar m__size-lg gm__dropArea is__full" data-symbol="o">
							<Draggable icon="zoovu-o" />
						</div>
						<div class="c-avatar m__size-lg gm__dropArea is__full" data-symbol="z">
							<Draggable icon="zoovu-z" />
						</div>
						<div class="c-avatar m__size-lg gm__dropArea is__full" data-symbol="v">
							<Draggable icon="zoovu-v" />
						</div>
						<div class="c-avatar m__size-lg gm__dropArea is__full" data-symbol="u">
							<Draggable icon="zoovu-u" />
						</div>
						<div class="c-avatar m__size-lg gm__dropArea is__full" data-symbol="o">
							<Draggable icon="zoovu-o" />
						</div>
					</div>
				</div>

				<div class="c-flx m__flxColumn gu__flx-center-start">
					<p class="gm__txtSize-xs gm__txtColor-dark3">
						<b>...and drop them here to make the logo great again!</b>
					</p>
					<div class="c-flxInline m__flxRow gu__flx-center">
						<button class="c-avatar m__size-lg gm__dropArea" data-symbol="z"></button>
						<button class="c-avatar m__size-lg gm__dropArea" data-symbol="o"></button>
						<button class="c-avatar m__size-lg gm__dropArea" data-symbol="o"></button>
						<button class="c-avatar m__size-lg gm__dropArea" data-symbol="v"></button>
						<button class="c-avatar m__size-lg gm__dropArea" data-symbol="u"></button>
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
				full: 0,
				timeLeft: null,
				dragged: null,
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
			full(newAmount) {
				if (newAmount == 5 && this.playing) {
					// You won
					this.playing = false;
				}
			},
		},
		mounted() {
			document.addEventListener("keyup", this.keyUp, false);
		},
		beforeDestroy() {
			// clear out listeners
			this.setListeners(false);
			document.removeEventListener("keyup", this.keyUp, false);
		},
		methods: {
			start: function() {
				// star game if name available
				if (this.name) {
					this.playing = true;
					this.full = 0;
					this.timeLeft = 25; //25 by default
					this.setListeners();
					return;
				}
				return alert("Please provide a name before proceeding.");
			},
			keyUp(e) {
				if (e.key == "Enter" && !this.playing) {
					//launch game on enter press
					this.start();
				}
			},
			setListeners(set = true) {
				let _this = this,
					status = (set ? "add" : "remove") + "EventListener";

				setTimeout(() => {
					if (_this.isAdvancedApi()) {
						// Add our drag & drop listeners
						let areas = document.getElementsByClassName("gm__dropArea");
						areas.forEach(area => {
							area[status]("dragover", _this.prevent, false);
							area[status]("dragstart", _this.isStart, false);
							area[status]("dragleave", _this.isOverToggle, false);
							area[status]("dragenter", _this.isOverToggle, false);
							area[status]("drop", _this.isDrop, false);
						});
					}
				}, 100);
			},
			prevent(e) {
				// just a prevent
				e.preventDefault();
				e.stopPropagation();
			},
			isStart(e) {
				//drag start
				this.dragged = e.target;
			},
			isOverToggle(e) {
				//cursor is over
				this.prevent(e);
				e.target.classList.toggle("is__over");
			},
			isDrop(e) {
				//file droped
				this.prevent(e);
				this.isOverToggle(e);
				if (e.target.classList.contains("gm__dropArea") && !e.target.classList.contains("is__full")) {
					// remove from old element
					if (e.target.dataset.symbol == this.dragged.dataset.symbol) {
						let old = this.dragged.parentNode;
						old.removeChild(this.dragged);
						old.classList.remove("is__full");
						old.setAttribute("disabled", true);
						// add to new element
						e.target.appendChild(this.dragged);
						e.target.classList.add("is__full");
						// check letter
						this.full = this.full + 1;
					}
				}
			},
			isAdvancedApi() {
				// check support for drag and drop
				var div = document.createElement("div");
				return (
					("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
					"FormData" in window &&
					"FileReader" in window
				);
			},
		},
		// TERMINA LIFEHOOKS
	};
</script>

<style lang="scss">
	@import "_scss/00-utils/module.scss";
</style>
