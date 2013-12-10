game.IntroScreen = me.ScreenObject.extend({
  /** 
   *  action to perform on state change
   */
  init: function() {
    this.parent(true);


    this.title = null;

    this.keyDown = false;

    this.font = new me.Font('Helvetica', 16, 'white');
    me.audio.play("startup");
    this.strings = ["<MIRA rebooting...system online>\n . . . <running diagnostics> . . . \n . . . <condition: critical> . . . \n . . . <action: wake pilot> . . .", "Captain . . . ", "Captain wake up!"];
    this.index = 0;
  },

  onResetEvent: function() {
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
