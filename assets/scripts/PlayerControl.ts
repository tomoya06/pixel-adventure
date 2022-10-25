const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {
  keydownMap = {
    [cc.macro.KEY.d]: 0,
    [cc.macro.KEY.a]: 0,
    [cc.macro.KEY.w]: 0,
    [cc.macro.KEY.s]: 0,
  };

  runspeed: number = 60;
  jumpspeed: number = 100;

  state = "";
  direction = 1;
  nodeScale = 1;

  anim: cc.Animation;
  rigidBody: cc.RigidBody;

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onkeydown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onkeyup, this);

    this.anim = this.getComponent(cc.Animation);
    this.rigidBody = this.getComponent(cc.RigidBody);

    this.nodeScale = Math.abs(this.node.scaleX);

    this.setDirection(1);
  }

  start() {}

  update(dt: number) {
    const velocity = this.rigidBody.linearVelocity;

    let dir = 0;

    if (this.keydownMap[cc.macro.KEY.d]) {
      dir = 1;
    } else if (this.keydownMap[cc.macro.KEY.a]) {
      dir = -1;
    }
    velocity.x = dir * this.runspeed;

    if (this.keydownMap[cc.macro.KEY.w] === 1) {
      velocity.y = this.jumpspeed;
      this.keydownMap[cc.macro.KEY.w] += 1;
    }

    this.rigidBody.linearVelocity = cc.v2(velocity.x, velocity.y);
    if (dir) {
      this.setState("player_run");
      this.setDirection(dir);
    } else if (velocity.y) {
      this.setState("player_jump");
    } else {
      this.setState("player_idle");
    }
  }

  onkeydown(e: KeyboardEvent) {
    this.keydownMap[e.keyCode] += 1;
  }

  onkeyup(e: KeyboardEvent) {
    this.keydownMap[e.keyCode] = 0;
  }

  setState(state: string) {
    if (this.state === state) {
      return;
    }

    this.state = state;
    this.anim.play(state);
  }

  setDirection(dir: number) {
    if (this.direction === dir) {
      return;
    }
    this.direction = dir;
    this.node.scaleX = this.nodeScale * dir;
  }

  // setKeymap(code: number, flag: boolean) {
  //   const oldFlag = this.keydownMap[code];
  //   this.keydownMap[code] = flag;

  //   if (oldFlag === flag) {
  //     return;
  //   }

  //   console.log("setKeymap", code);

  //   if (this.keydownMap[cc.macro.KEY.a] || this.keydownMap[cc.macro.KEY.d]) {
  //     this.anim.play("player_run");

  //     if (this.keydownMap[cc.macro.KEY.a]) {
  //       this.node.scaleX = Math.abs(this.node.scaleX) * -1;
  //     } else {
  //       this.node.scaleX = Math.abs(this.node.scaleX) * 1;
  //     }
  //   } else {
  //     this.anim.play("player_idle");
  //   }

  //   if (this.keydownMap[cc.macro.KEY.w]) {
  //     // if (Math.abs(this.rigidBody.linearVelocity.y) < 0.001) {
  //     // }
  //     this.rigidBody.applyForceToCenter(cc.v2(0, 800), true);
  //   }
  // }
}
