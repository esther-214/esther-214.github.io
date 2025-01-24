class TinyTown extends Phaser.Scene {
  constructor() {
    super("randomMapScene");
    this.mapWidth = 20;
    this.mapHeight = 15;
    this.tileSize = 64;
    this.noiseSeed = Math.random();
    this.noise_window = 2;
    noise.seed(this.noiseSeed);
  }
  preload() {
    this.load.path = "./assets/";
    this.load.image("tiles", "Tilesheet/mapPack_tilesheet.png");
  }
  create() {
    const array = this.generateRandomMap();
    const map = this.make.tilemap({
      data: array,
      tileWidth: this.tileSize,
      tileHeight: this.tileSize,
    });
    map.addTilesetImage("tiles");
    const layer = map.createLayer(0, "tiles", 0, 0);
    this.reload = this.input.keyboard.addKey("R");
    this.shrink = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.COMMA);
    this.expand = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PERIOD);
  }
  update() {
    if (Phaser.Input.Keyboard.JustDown(this.reload)) {
      this.noiseSeed = Math.random();
      noise.seed(this.noiseSeed);
      this.scene.restart();
    }
    if (Phaser.Input.Keyboard.JustDown(this.shrink)) {
      this.noise_window = this.noise_window * 1.1;
      this.regenerateMap();
    }
    if (Phaser.Input.Keyboard.JustDown(this.expand)) {
      this.noise_window = this.noise_window * 0.9;
      this.regenerateMap();
    }
  }
  /*
  original = 10/20
  if shrink = (10/20)*size of 
  */
  generateRandomMap() {
    const width = this.mapWidth;
    const height = this.mapHeight;
    const noise_window = this.noise_window;
    let mapArray = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const value = Math.abs(noise.perlin2((x / width) * noise_window, (y / height) * noise_window));
        console.log("noise: " + value);
        console.log("x: " + (x / 20.0) * 0.5);
        console.log("y: " + (y / 15.0) * 0.5);
        if (value < 0.15) {
          row.push(23); // Grass
        } else if (value < 0.25) {
          row.push(18); // Sand
        } else {
          row.push(86); // Ice
        }
      }
      mapArray.push(row);
    }

    return mapArray;
  }
  regenerateMap() {
    const array = this.generateRandomMap(); // Generate new map data
    const map = this.make.tilemap({
      data: array,
      tileWidth: this.tileSize,
      tileHeight: this.tileSize,
    });
    map.addTilesetImage("tiles"); // Add the tileset to the map
    const layer = map.createLayer(0, "tiles", 0, 0); // Create the tile layer
  }
}
/*
sand = 18
grass = 23
stone = 28
ice = 86
*/
