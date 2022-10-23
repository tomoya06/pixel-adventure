const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {
  velocity: cc.Vec2 = cc.v2(0, 0);

  keydownMap: { [key: number]: boolean } = {};

  speed: number = 100;

  anim: cc.Animation;
  rigidBody: cc.RigidBody;

  protected onLoad(): void {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onkeydown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onkeyup, this);

    this.anim = this.getComponent(cc.Animation);
    this.rigidBody = this.getComponent(cc.RigidBody);
  }

  start() {}

  protected update(dt: number): void {
    if (this.keydownMap[cc.macro.KEY.a] || this.keydownMap[cc.macro.KEY.d]) {
      if (this.keydownMap[cc.macro.KEY.a]) {
        this.node.x += this.speed * -1 * dt;
      } else {
        this.node.x += this.speed * 1 * dt;
      }
    }
  }

  onkeydown(e: KeyboardEvent) {
    console.log("keydown", e.keyCode);
    this.setKeymap(e.keyCode, true);
  }

  onkeyup(e: KeyboardEvent) {
    this.setKeymap(e.keyCode, false);
  }

  setKeymap(code: number, flag: boolean) {
    const oldFlag = this.keydownMap[code];
    this.keydownMap[code] = flag;

    if (oldFlag === flag) {
      return;
    }

    console.log("setKeymap", this.rigidBody.linearVelocity.y);

    if (this.keydownMap[cc.macro.KEY.a] || this.keydownMap[cc.macro.KEY.d]) {
      this.anim.play("player_run");

      if (this.keydownMap[cc.macro.KEY.a]) {
        this.node.scaleX = Math.abs(this.node.scaleX) * -1;
      } else {
        this.node.scaleX = Math.abs(this.node.scaleX) * 1;
      }
    } else {
      this.rigidBody.linearVelocity.x = 0;
      this.anim.play("player_idle");
    }

    if (this.keydownMap[cc.macro.KEY.space]) {
      if (this.rigidBody.linearVelocity.y < 0.001) {
        this.rigidBody.applyForceToCenter(cc.v2(0, 800), true);
      }
    }
  }
}
