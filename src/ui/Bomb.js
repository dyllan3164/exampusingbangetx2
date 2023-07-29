import Phaser from "phaser";

export default class Laser extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.setScale(1);
    this.speed = 200;
  }

  fire(x, y) {
    this.setPosition(x, y - 50);
    this.setActive(true);
    this.setVisible(true);
  }

  erase() {
    this.destroy();
  }

  update(time) {
    this.setVelocityY(this.speed * -15);
    if (this.y < -10) {
      this.erase();
    }
  }
}
