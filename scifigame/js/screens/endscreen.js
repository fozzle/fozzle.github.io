game.EndScreen = me.ScreenObject.extend({
  /** 
   *  action to perform on state change
   */
  init: function() {
    this.parent(true);


    this.title = null;

    this.keyDown = false;

    this.font = new me.Font('Helvetica', 16, 'white');
    this.strings = [". . . We're already home . . ."];
    this.index = 0;
  },

  onResetEvent: function() {
    console.log("reset event for EndScreen");
    me.game.add(new game.HUD.Dialogue(20, me.video.getHeight() - 150, "mira", this.strings));
  },


  update: function() {
    if (me.input.isKeyPressed("action") && !this.keyDown) {
      this.keyDown = true;
      if (this.index + 1 == this.strings.length) {
        me.state.change(me.state.PLAY);
      } else {
        this.index++;
      }
    }

    if (!me.input.isKeyPressed("action")) {
      this.keyDown = false;
    }

    return true;
  },

  draw: function(context) {
    // me.video.clearSurface(context, "black");
  },


  /** 
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent: function() {
    // remove the HUD from the game world
  }
});
