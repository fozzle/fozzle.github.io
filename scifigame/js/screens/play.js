game.PlayScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		// Load level
		me.levelDirector.loadLevel("start");
		
		// add our HUD to the game world	
    this.HUD = new game.HUD.Container();
		me.game.add(this.HUD);

		me.audio.playTrack("zones");

    me.game.onLevelLoaded = this.levelChange.bind(this);

	},

	levelChange: function(levelid) {
    // Remove collected sprockets
    console.log(levelid);
    var collected = game.data.collected_sprockets;
    var sprocket;
    for (var i = 0; i < collected.length; i++) {
      sprocket = me.game.getEntityByGUID(collected[i]);

      if (sprocket) {
        me.game.remove(sprocket);
      }
    }

    var player = me.game.world.getEntityByProp('name', 'mainPlayer')[0];

    // Place player in appropriate position
    switch(levelid) {
      case "jungle":
      	// If coming from start don't need to do anyting.
      	if (game.data.prev_level === "start" || !game.data.prev_level) {
      	} else if (game.data.prev_level === "wasteland") {
      		player.pos.x = 1056;
      		player.pos.y = 90;
      	}
      	break;
      case "start":
      	if (game.data.prev_level === "jungle") {
      		player.pos.x = 1056;
      		player.pos.y = 90;
      	}
      	break;
    }

    if (levelid === "wasteland") {
      me.audio.stopTrack();
      me.audio.playTrack("chant");
    } else {
      if (me.audio.getCurrentTrack() != "zones") {
        me.audio.stopTrack();
        me.audio.playTrack("zones");
      }
    }

    // Reset scare
    game.data.runnerScared = false;

    game.data.prev_level = levelid;
  },


	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
		// me.audio.stopTrack();
	}
});
