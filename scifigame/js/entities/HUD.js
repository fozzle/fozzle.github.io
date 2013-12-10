

/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.ObjectContainer.extend({

	init: function() {
		// call the constructor
		this.parent();
		
		// persistent across level change
		this.isPersistent = true;
		
		// non collidable
		this.collidable = false;
		
		// make sure our object is always draw first
		this.z = Infinity;

		// give a name
		this.name = "HUD";

		game.data.dialogue = new game.HUD.Dialogue(20, me.video.getHeight() - 150, "mira", ["<Cryo wakeup sequence complete> \n Good morning Captain. \n You have been asleep for @/~ERROR#~) days.", "We have not yet reached our destination, Earth, but you've been woken due to critical ship status.", "Commencing situation report . . .", "Sub-light drive offline . . . ", "Crystallic memory stores fractured . . .", "Sensor strength at 14% . . .", "If you can retrieve wreckage, we may be able to get home.", "Good luck, and stay alert."]);
		
		this.addChild(game.data.dialogue);
		this.addChild(new game.HUD.ScoreItem(20, 20))
	}
});

/** 
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend( {    
  /** 
   * constructor
   */
  init: function(x, y) {
       
    // call the parent constructor 
    // (size does not matter here)
    this.parent(new me.Vector2d(x, y), 10, 10); 
     
    // create a font
    this.font = new me.Font("Courier New", 16, "white");
     
    // local copy of the global score
    this.sprockets = -1;

    // make sure we use screen coordinates
    this.floating = true;
  },
   
  /**
   * update function
   */
  update : function () {
    // we don't draw anything fancy here, so just
    // return true if the score has been updated
    if (this.sprockets !== game.data.sprockets) {
        this.sprockets = game.data.sprockets;
        return true;
    }
    return false;
  },

  /**
   * draw the score
   */
  draw : function (context) {
  	var fontSize = this.font.measureText(context, "Pieces: " + game.data.sprockets);
  	context.fillStyle = "black";
  	context.fillRect(this.pos.x - 2, this.pos.y - 2, fontSize.width + 4, fontSize.height + 4);
    this.font.draw (context, "Pieces: " + game.data.sprockets, this.pos.x, this.pos.y);
  }
});


/** 
 * a basic HUD item to display score
 */
game.HUD.Dialogue = me.Renderable.extend({	
	/** 
	 * constructor
	 */
	init: function(x, y, speaker, text) {
		
		// call the parent constructor 
		// (size does not matter here)
		this.parent(new me.Vector2d(x, y), 10, 10); 

		this.font = new me.Font("Courier New", 20, "white");
		this.font.alignText = "left";

		this.maxWidth = 500;

		this.keyDown = false;

		this.text = text;

		this.index = 0;
		this.charindex = 0;

		// make sure we use screen coordinates
		this.floating = true;

		this.portrait = me.loader.getImage(speaker);
	},

	/**
	 * update function
	 */
	update : function () {
		// we don't do anything fancy here, so just
		// return true if the score has been updated
		if (me.input.isKeyPressed("action") && !this.keyDown && this.text) {
			this.keyDown = true;

      if (this.index + 1 == this.text.length) {
        this.index = 0;
        this.text = null;
      } else {
        this.index++;
        this.charindex = 0;
      }

      return true;
    }

    if (!me.input.isKeyPressed("action")) {
    	this.keyDown = false;
    }

		return false;
	},

	/**
	 * draw the dialogue and appropriate image.
	 */
	draw : function (context) {
		if (!this.text) {
			return;
		}

		// Draw portrait
		context.drawImage(this.portrait, this.pos.x, this.pos.y);

		// Make sure text is wrap
		var text = this.wrapText(context, this.text[this.index]);

		// draw dialogue
		context.fillStyle = "white";
		context.fillRect(this.pos.x + 90, this.pos.y, 500, 100);
		context.fillStyle = "black";
		context.fillRect(this.pos.x + 95, this.pos.y + 5, 490, 90);
    this.font.draw(context, text.substr(0, this.charindex), this.pos.x + 110, this.pos.y + 10);

    if (this.charindex < text.length) {
    	this.charindex++;
    }
	},

	wrapText : function(context, text) {
		var substrings = [];
		var words = text.split(" ");
		var substringIndex = 0;
		for (var i = 0; i < words.length; i++) {
			
			// Build words
			if(this.font.measureText(context, substrings[substringIndex] + words[i] + " ").width > 450) {
				substringIndex++;
			}

			substrings[substringIndex] = substrings[substringIndex] ? substrings[substringIndex] + words[i] + " " : words[i] + " ";	
		}; 

		text = substrings[0];
		for (i = 1; i < substrings.length; i++) {
			text += "\n" + substrings[i];
		}

		return text;
	}

});
