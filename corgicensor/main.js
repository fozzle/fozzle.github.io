


var CorgiCensor = (function($) {

  var canvas,
      ctx,
      coords = {
        start: {},
        end: {}
      },
      mousedown = false,
      CORGI_URL = "http://placecorgi.com/",
      corgis = [],
      corgiClick = false,
      corgiIndex,
      baseImage = new Image();

  var Corgi = function(x, y, w, h) {
    this.x = x;
    this.y = y;

    this.img = new Image;
    this.img.onload = this.draw.bind(this);
    this.img.width = w;
    this.img.height = h;
    this.img.src = CORGI_URL + w + "/" + h;
  };

  Corgi.prototype.draw = function() {
    if (this.active) {
      console.log("active", this.x, this.img.width);
      ctx.strokeRect(this.x - 1, this.y - 1, this.img.width + 2, this.img.height + 2);
    }
    ctx.drawImage(this.img, this.x, this.y);
  };

  Corgi.prototype.checkInBounds = function(coords) {
    if (coords.x > this.x && coords.x < this.x + this.img.width) {
      if (coords.y > this.y && coords.y < this.y + this.img.height) {
        return true;
      }
    }

    return false;
  };


  // Wipe and redraw all existing obj
  var redraw = function() {
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);

    // draw base image
    ctx.drawImage(baseImage, ctx.canvas.width/2 - baseImage.width/2, 0);

    // draw corgis
    for (var i = 0; i < corgis.length; i++) {
      corgis[i].draw();
    }
  };

  var init = function(selector) {
    canvas = $("#canvas");
    ctx = canvas[0].getContext('2d');
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    ctx.font = "30pt Arial";
    ctx.fillText("Drag and Drop an Image", window.innerWidth/3, 100);

    // Bind events
    bindEvents();
  };

  var getMousePosition = function(e) {
    var rect = canvas[0].getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  var bindEvents = function() {
    // Bind click listeners on canvas to draw corgi.
    canvas.on("mousedown", handleMouseDown);
    canvas.on("mouseup", handleMouseUp);
    canvas.on("mousemove", handleMouseMove);

    canvas.on("dragover", handleDragOver);
    canvas.on("drop", handleDrop);

    $("#controls").on("click", "#save", saveImage);

    $(window).on("keydown", handleKeydown);

  };

  var handleKeydown = function(e) {
    if (e.which === 8) {
      e.preventDefault();
      corgis.splice(corgiClick.index, 1);
      corgiClick = false;
      redraw();
    }
  };

  var handleDragOver = function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.originalEvent.dataTransfer.dropEffect = 'copy';
  };

  var handleDrop = function(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.originalEvent.dataTransfer.files;

    baseImage.src = URL.createObjectURL(files[0]);
    baseImage.onload = function() {
      console.log("canvas size", ctx.canvas.height, ctx.canvas.width);
      if (ctx.canvas.height < baseImage.height) {
        ctx.canvas.height = baseImage.height;
      }

      if (ctx.canvas.width < baseImage.width) {
        ctx.canvas.width = baseImage.width;
      }

      redraw();
    };
  };

  var handleMouseDown = function(e) {
    // Store start
    coords.start = getMousePosition(e);

    if (corgiClick.corgi) corgiClick.corgi.active = false;
    corgiClick = selectCorgi(coords.start);
    redraw();

    mousedown = true;
  };

  var selectCorgi = function(coords) {
    for (var i = 0; i < corgis.length; i++) {
      if (corgis[i].checkInBounds(coords)) {
        corgis[i].active = true;
        return {corgi: corgis[i], index: i};
      }
    }

    return false;
  };

  var handleMouseUp = function(e) {
    // Store end
    coords.end = getMousePosition(e);
    
    mousedown = false;
    if (!corgiClick) {
      makeCorgi();
      redraw();
    }
  };

  var handleMouseMove = function(e) {
    // draw bounds
    if (mousedown) {
      var currentCoords = getMousePosition(e);
      redraw();
      ctx.strokeStyle = "red";
      ctx.strokeRect(coords.start.x, coords.start.y, currentCoords.x - coords.start.x, currentCoords.y - coords.start.y);
    }
  };

  var makeCorgi = function() {
    // Calculate dimensions
    var width = Math.abs(coords.start.x - coords.end.x);
    var height = Math.abs(coords.start.y - coords.end.y);

    // Figure out which to use as the starting point
    var startCoords = {};
    startCoords.x = coords.start.x < coords.end.x ? coords.start.x : coords.end.x;
    startCoords.y = coords.start.y < coords.end.y ? coords.start.y : coords.end.y;

    corgis.push(new Corgi(startCoords.x, startCoords.y, width, height));
  };

  var saveImage = function() {
    var dataUrl = canvas[0].toDataURL();
    window.open(dataUrl);
  };

  return {
    init: init
  };
})($);

$(document).ready(function() {
  console.log($("#canvas"));
  CorgiCensor.init();
});