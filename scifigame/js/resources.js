game.resources = [

	/* Graphics. 
	 * @example
	 * {name: "example", type:"image", src: "data/img/example.png"},
	 */

 	{name: "tileset-stony", type:"image", src:"data/img/tileset-stony.png"},
 	{name: "tileset-jungle", type:"image", src:"data/img/tileset-jungle.png"},
	{name: "player-sprite", type:"image", src:"data/img/player.png"},
	{name: "octopus-sprite", type:"image", src:"data/img/octopus.png"},
	{name: "ship-sprite", type:"image", src:"data/img/ship.png"},
	{name: "sprocket", type:"image", src:"data/img/sprocket.png"},
	{name: "mira", type:"image", src:"data/img/mira.png"},
	{name: "octopus", type:"image", src:"data/img/octopus-portrait.png"},
	{name: "statue", type: "image", src:"data/img/statue.png"},
	{name: "newearth", type:"image", src:"data/img/newearth.png"},


	/* Atlases 
	 * @example
	 * {name: "example_tps", type: "tps", src: "data/img/example_tps.json"},
	 */
		
	/* Maps. 
	 * @example
	 * {name: "example01", type: "tmx", src: "data/map/example01.tmx"},
	 * {name: "example01", type: "tmx", src: "data/map/example01.json"},
 	 */

	{name: "wasteland", type: "tmx", src: "data/map/wasteland.tmx"},
	{name: "start", type: "tmx", src: "data/map/start.tmx"},
	{name: "jungle", type: "tmx", src: "data/map/jungle.tmx"},

	/* Background music. 
	 * @example
	 * {name: "example_bgm", type: "audio", src: "data/bgm/", channel : 1},
	 */	
	{name: "zones", type: "audio", src: "data/bgm/", channel: 1},
	{name: "chant", type: "audio", src: "data/bgm/", channel: 1},

	/* Sound effects. 
	 * @example*/

	{name: "drill", type: "audio", src: "data/sfx/", channel : 2},
	{name: "startup", type: "audio", src: "data/sfx/", channel: 2},
	{name: "shock", type: "audio", src: "data/sfx/", channel: 2}
];
