var STATE_INTRO = me.state.USER + 0;
var STATE_END = me.state.USER + 1;

/* Game namespace */
var game = {


	// an object where to store game information
	data : {
		// score
		score : 0
	},
	
	
	// Run on page load.
	"onload" : function () {
		// Initialize the video.
		if (!me.video.init("screen", 640, 420, true, 1)) {
			alert("Your browser does not support HTML5 canvas.");
			return;
		}

		// add "#debug" to the URL to enable the debug Panel
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				me.plugin.register.defer(debugPanel, "debug");
			});
		}

		// Initialize the audio.
		me.audio.init("mp3,ogg");

		// Set a callback to run when loading is complete.
		me.loader.onload = this.loaded.bind(this);

		// Load the resources.
		me.loader.preload(game.resources);

		// Fade in

		// debug mode

		// Initialize melonJS and display a loading screen.
		me.state.change(me.state.LOADING);
	},

	// Run on game resources loaded.
	"loaded" : function () {
		me.state.set(me.state.PLAY, new game.PlayScreen());
		me.state.set(STATE_INTRO, new game.IntroScreen());
		me.state.set(STATE_END, new game.EndScreen());

		me.debug.renderHitBox = true;

		me.state.transition("fade", "#000000", 500);

		console.log(this);
		this.data.sprockets = 0;
		this.data.collected_sprockets = [];

		me.entityPool.add("mainPlayer", game.PlayerEntity);
		me.entityPool.add("OctopusEntity", game.OctopusEntity);
		me.entityPool.add("Ship", game.ShipEntity);
		me.entityPool.add("Sprocket", game.Sprocket);
		me.entityPool.add("RunnerEntity", game.RunnerEntity);
		me.entityPool.add("RunnerTrigger", game.RunnerTrigger);
		me.entityPool.add("StatueEntity", game.StatueEntity);
		me.entityPool.add("FriendlyOcto", game.FriendlyOcto);
		me.entityPool.add("BreakableCrystal", game.BreakableCrystal);

		// keyboard
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.UP, "up");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.DOWN, "down");
		me.input.bindKey(me.input.KEY.ENTER, "action");


		// Start the game.
		me.state.change(STATE_INTRO);
	}
};
