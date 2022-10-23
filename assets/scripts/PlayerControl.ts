const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  velocity: cc.Vec2 = cc.v2(0, 0);

  speed: number = 100;

  anim: cc.Animation;

  protected onLoad(): void {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onkeydown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onkeyup, this);

    this.anim = this.getComponent(cc.Animation);
  }

  start() {}

  protected update(dt: number): void {
    this.node.x += this.velocity.x * this.speed * dt;
  }

  onkeydown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case cc.macro.KEY.a:
        this.velocity.x = -1;
        break;
      case cc.macro.KEY.d:
        this.velocity.x = 1;
        break;
      default:
        break;
    }

    if (this.velocity.x !== 0) {
      this.anim.play("player_run");

      if (this.velocity.x > 0) {
        this.node.scaleX = Math.abs(this.node.scaleX);
      } else {
        this.node.scaleX = -1 * Math.abs(this.node.scaleX);
      }
    }
  }

  onkeyup() {
    this.velocity.x = 0;
    this.velocity.y = 0;

    console.log("idle animate");
    this.anim.stop();
    this.anim.play("player_idle");
  }
}
