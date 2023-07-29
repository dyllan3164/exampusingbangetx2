import Phaser from "phaser";

import FallingObject from "../ui/FallingObject.js";
import Bomb from "../ui/Bomb.js";
import ScoreLabel from "../ui/ScoreLabel.js";
export default class GhostBusterScene extends Phaser.Scene {
  constructor() {
    super("ghost-buster-scene");
  }
  init() {
    this.listBomb = undefined;
    this.ground = undefined;
    this.player = undefined;
    this.playerSpeed = 150;
    this.cursors = undefined;
    this.listGhost = undefined;
    this.ghostSpeed = 60;
    this.lastFired = 0;
    this.scoreLabel = undefined;
  }

  preload() {
    this.load.image("background", "images/background.png");
    this.load.image("ghost", "images/ghost.png");
    this.load.image("ground", "images/ground.png");
    this.load.spritesheet("player", "images/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("bomb", "images/bomb.png");
  }

  create() {
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameWidth, gameHeight, "background");

    this.ground = this.physics.add.staticGroup();
    this.ground.create(590, 600, "ground").setScale(3).refreshBody();

    this.createPlayer();
    this.player = this.createPlayer();
    this.cursors = this.input.keyboard.createCursorKeys();

    this.listGhost = this.physics.add.group({
      classType: FallingObject,
      maxSize: 10000,
      runChildUpdate: true,
    });

    this.time.addEvent({
      delay: 2000,
      callback: this.spawnGhost,
      callbackScope: this,
      loop: true,
    });

    this.bomb = this.physics.add.group({
      classType: Bomb,
      maxSize: 1000000,
      runChildUpdate: true,
    });

    this.physics.add.overlap(
      this.bomb,
      this.ghost,
      this.hitGhost,
      undefined,
      this
    );

    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.physics.add.collider(this.player, this.ground);

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;
  }

  die() {
    this.destroy();
  }

  update(time) {
    this.movePlayer(this.player, time);
  }

  createPlayer() {
    const player = this.physics.add.sprite(200, 450, "player");
    player.setCollideWorldBounds(true);
    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 0 }],
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 2 }),
      frameRate: 10,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 2 }),
      frameRate: 10,
    });
    return player;
  }

  movePlayer(player, time) {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(this.speed * -1);
      this.player.anims.play("left", true);
      this.player.setFlipX(false);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.speed);
      this.player.anims.play("right", true);
      this.player.setFlipX(true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(this.speed * -1);
      this.player.anims.play("turn", true);
      this.player.setFlipY(false);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.speed);
      this.player.anims.play("turn", true);
      this.player.setFlipY(false);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if ((this.cursors.space.isDown || this.shoot) && time > this.lastFired) {
      const bomb = this.listBomb.get(0, 0, "bomb", config);
      if (this.Bomb) {
        this.Bomb.fire(this.player.x, this.player.y);
        this.lastFired = time + 1;
      }
    }
  }

  spawnGhost() {
    const config = {
      speed: this.ghostSpeed,
      rotation: 0,
    };
    const ghost = this.listGhost.get(0, 0, "ghost", config);
    const ghostWidth = ghost.displayWidth;
    const positionX = Phaser.Math.Between(
      ghostWidth,
      this.scale.width - ghostWidth
    );
    if (ghost) {
      ghost.spawn(positionX);
    }
  }

  hitGhost(bomb, ghost) {
    bomb.erase();
    ghost.die();

    this.scoreLabel.add(100);
    if (this.scoreLabel.getScore() % 100 == 0) {
      this.enemySpeed += 10;
    } else if (this.scoreLabel.getScore() > 200) {
      this.enemySpeed += 0;
    }
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new ScoreLabel(this, x, y, score, style).setDepth(1);
    this.add.existing(label);
    return label;
  }

  hitPlayer(player, ghost) {}
}
