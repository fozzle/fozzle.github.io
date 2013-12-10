game.PlayerEntity = me.ObjectEntity.extend({
  /* ------
  constructor
  -------- */

  init: function(x, y, settings) {
    this.parent(x, y, settings);


    this.updateColRect(8, 16, 3, 22);

    this.setVelocity(3,3);
    this.gravity = 0;

    this.renderable.addAnimation('up', [12, 13, 14, 15]);
    this.renderable.addAnimation('down', [0, 1, 2, 3]);
    this.renderable.addAnimation('left', [4, 5, 6, 7]);
    this.renderable.addAnimation('right', [8, 9, 10, 11]);

    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);


  },

  update: function() {
    if (me.input.isKeyPressed('left')) {
      if (!this.renderable.isCurrentAnimation('left')) {
        this.renderable.setCurrentAnimation('left');
      }

      this.vel.x = -1.5;
    } else if (me.input.isKeyPressed('right')) {
      if (!this.renderable.isCurrentAnimation('right')) {
        this.renderable.setCurrentAnimation('right');
      }

      this.vel.x = 1.5;
    } else {
      this.vel.x = 0;
    }

    if (me.input.isKeyPressed('up')) {
      if (!this.renderable.isCurrentAnimation('up')) {
        this.renderable.setCurrentAnimation('up');
      }

      this.vel.y = -1.5;
    } else if (me.input.isKeyPressed('down')) {
      if (!this.renderable.isCurrentAnimation('down')) {
        this.renderable.setCurrentAnimation('down');
      }

      this.vel.y = 1.5;
    } else {

      this.vel.y = 0;
    }

    var res = this.updateMovement();

    res = me.game.collide(this);

    if (res) {
      console.log(res);
    }

    if (this.vel.x !=0 || this.vel.y != 0) {
      this.parent();
      return true;
    }

    return false;
  }
});

game.OctopusEntity = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    this.parent(x, y, settings);
    this.gravity = 0;

    this.collidable = true;
    this.renderable.addAnimation('normal', [0, 1], 500);
    this.renderable.setCurrentAnimation('normal');
  },

  update: function() {

    if (!this.inViewport) {
      return false;
    }

    this.parent();
    return true;
  }


});

game.RunnerEntity = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    this.parent(x, y, settings);

    this.gravity = 0;
    this.setVelocity(3,3);

    this.collidable = false;
    this.renderable.addAnimation('normal', [0, 1], 500);
    this.renderable.setCurrentAnimation('normal');
    console.log(settings);

    this.xrun = settings.xrun;
    this.yrun = settings.yrun;
  },

  update: function() {

    if (!this.inViewport) {
      return false;
    }


    if (game.data.runnerScared) {
      this.vel.x = this.xrun;
      this.vel.y = this.yrun;
    }

    this.updateMovement();

    if (this.vel.x !=0 || this.vel.y != 0) {
      this.parent();
      return true;
    }

    return false;
  }
});

game.StatueEntity = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    this.parent(x, y, settings);
    this.speaking = false;
    this.gravity = 0;
  },

  onCollision: function() {
    if (me.input.isKeyPressed("action") && !this.speaking) {
      game.data.dialogue.portrait = me.loader.getImage("mira");
      game.data.dialogue.text = ["Analyzing structure . . . ", " . . . ", "Captain . . ."]
      
      setTimeout(function() {
        me.state.change(me.state.USER + 1);
      }, 6000);
    }
  }
});

game.FriendlyOcto = game.OctopusEntity.extend({
  init: function(x, y, settings) {
    this.parent(x, y, settings);
    this.speaking = false;
    this.firstText = ["", "blblbubgublbublgl bglubb lbgublg", "bgbllububl"];
    this.translatedText = ["", "Rejoice! The Almighty <Iron> has sent a <fish> in it's own <vision>!", "Did you come from the <ocean>?", "Come, you must partake in <glbbgg> we are so <bubbly> you've arrived!"];
  },

  onCollision: function() {
    if (me.input.isKeyPressed("action") && !this.speaking) {
      game.data.dialogue.portrait = me.loader.getImage("octopus");

      if (game.data.sprockets < 10) {
        game.data.dialogue.text = this.firstText;
      } else {
        game.data.dialogue.text = this.translatedText;
      }

      this.speaking = true;
    }

    if (!me.input.isKeyPressed("action")) {
      this.speaking = false;
    }


  }
});

game.RunnerTrigger = me.CollectableEntity.extend({
  init: function(x, y, settings) {
    this.parent(x, y, settings);
    this.alpha = 0;
  },

  onCollision: function() {

    if (!game.data.seenOctopus) {
      me.audio.play("shock");

      setTimeout(function() {
        game.data.dialogue.portrait = me.loader.getImage("mira");
        game.data.dialogue.text = ["Did you see that?!", "Lifeform spotted with similar appearance to common octopus.", "Data extremely valuable. Be on the lookout for more."];
      }, 1000);

      game.data.seenOctopus = true;
    }
    

    game.data.runnerScared = true;
    this.collidable = false;
    me.game.remove(this);
  }
});

game.Sprocket = me.CollectableEntity.extend({
  init: function(x, y, settings) {
    this.parent(x, y, settings);
    this.renderable.addAnimation('normal', [0, 1], 400);
    this.renderable.setCurrentAnimation('normal');
  },

  onCollision: function() {
    console.log("collided");
    me.audio.play("drill");
    game.data.sprockets++;
    game.data.collected_sprockets.push(this.GUID);
    console.log(game);

    this.collidable = false;
    me.game.remove(this);
  }

});

game.ShipEntity = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    this.parent(x, y, settings);
    this.gravity = 0;

    this.renderable.addAnimation('normal', [0, 1, 2, 3], 400);
    this.renderable.setCurrentAnimation('normal');
  },

  update: function() {
    if (!this.inViewport) {
      return false;
    }

    this.parent();
    return true;
  }
});