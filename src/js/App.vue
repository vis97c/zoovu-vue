<!-- @format -->
<template>
	<div id="appex">
		<div class="c-back" aria-hidden>
			<img src="/images/shapes.png" alt="" class="m__bgColor-none" />
		</div>

		<div class="c-holder gm__txtAlign-center gm__hidden:md-inv">
			<div v-if="landing" class="c-flxInline m__flxColumn gu__flx-center">
				<!-- landing -->
				<div v-if="!submited" class="c-flxInline m__flxColumn gu__flx-center">
					<div class="x-txt xm__txtAlign-center">
						<p>
							<b>Hello friend, tell me your name...</b>
						</p>
					</div>
					<input v-model="name" type="text" class="c-inTxt" placeholder="Your name here" />
				</div>
				<!-- score -->
				<div v-if="timeLeft == 25 || timeLeft == null" class="c-flx m__flxRow gu__flx-center">
					<Trigger @click="toGame" />
				</div>
				<div v-if="timeLeft <= 0 && timeLeft != null" class="c-flx m__flxColumn gu__flx-center">
					<div class="c-flx m__flxRow gu__flx-center">
						<p class="gm__txtColor-primary">
							<b>You ran out of time</b>
						</p>
						<Trigger msg="Start over" @click="toGame" />
					</div>
					<p class="gm__txtSize-xs gm__txtColor-dark4">Restarting in a few seconds...</p>
				</div>
				<div v-if="timeLeft > 0 && full == 5" class="c-flx m__flxColumn gu__flx-center">
					<div class="c-flx m__flxRow gu__flx-center">
						<p class="gm__txtColor-secondary">
							<b>Congratulations, you won!</b>
						</p>
						<Trigger msg="Play again" @click="toGame" />
					</div>
					<p class="gm__txtSize-xs gm__txtColor-dark4">
						<b class="gm__txtColor-dark9">Your score: {{ timeLeft }}</b>
						, restarting in a few seconds...
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
								<b class="gm__txtColor-primary">
									Your score: {{ timeLeft != null ? timeLeft : 25 }} seconds
								</b>
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
		<div class="c-holder gm__txtAlign-center gm__hidden:md">
			<div class="c-flxInline m__flxColumn gu__flx-center">
				<div class="x-txt xm__txtAlign-center">
					<p>
						<b>Your device is not compatible with this game</b>
					</p>
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
				landing: true,
				playing: false,
				name: "",
				submited: false,
				full: 0,
				timeLeft: null,
				extraTime: false,
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
				let _this = this;
				setTimeout(function() {
					if (_this.playing && _this.full < 5) {
						if (_this.timeLeft > 0) {
							// active game
							_this.timeLeft = newTime - 1;
							if (_this.extraTime) {
								_this.extraTime = false;
								_this.timeLeft = newTime + 9;
							} else {
								_this.timeLeft = newTime - 1;
							}
						} else {
							// game finished
							_this.landing = true;
							_this.playing = false;
							setTimeout(function() {
								//wait for mount, view change
								alert("Time out, you've lost");
							}, 100);
							setTimeout(() => {
								//restart automatically after 10s
								_this.toGame();
							}, 10000);
						}
					}
				}, 1000);
			},
			full(newAmount) {
				let _this = this;
				if (newAmount == 5 && this.playing) {
					// You won
					this.setListeners(false);
					this.playing = false;
					this.landing = true;
					setTimeout(() => {
						//restart automatically after 10s
						_this.toGame();
					}, 10000);
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
			toGame: function() {
				if (this.name) {
					this.submited = true;
					this.timeLeft = null;
					this.landing = false;
					let _this = this;
					setTimeout(() => {
						//wait for mount
						_this.setListeners();
					}, 100);
					return;
				}
				return alert("Please provide a name before proceeding.");
			},
			start: function() {
				// star game if name available
				if (!this.playing) {
					this.playing = true;
					this.full = 0;
					this.timeLeft = 25; //25 by default
				}
				return;
			},
			keyUp(e) {
				if (e.key == "Enter" && !this.playing) {
					//launch game on enter press
					this.toGame();
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
				if (!this.playing) {
					// start game
					this.start();
				}
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
					let old = this.dragged.parentNode;
					old.removeChild(this.dragged);
					old.classList.remove("is__full");
					// add to new element
					e.target.appendChild(this.dragged);
					e.target.classList.add("is__full");
					if (e.target.dataset.symbol && e.target.dataset.symbol == this.dragged.dataset.symbol) {
						// is correct
						e.target.setAttribute("disabled", "");
						this.full = this.full + 1;
						if (old.dataset.base) {
							old.setAttribute("disabled", "");
						}
					} else {
						// is incorrect, add more time
						if (!e.target.dataset.base) {
							this.extraTime = true;
						}
					}
				}
			},
			isAdvancedApi() {
				// check support for drag and drop
				var div = document.createElement("div");
				return "draggable" in div || ("ondragstart" in div && "ondrop" in div);
			},
		},
		// TERMINA LIFEHOOKS
	};
</script>
