import BulletControl from "./BulletControl";

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
  recoil = 0;

  anim: cc.Animation;
  rigidBody: cc.RigidBody;

  @property(cc.Prefab)
  bulletPrefab: cc.Prefab;

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onkeydown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onkeyup, this);

    this.anim = this.getComponent(cc.Animation);
    this.rigidBody = this.getComponent(cc.RigidBody);

    this.nodeScale = Math.abs(this.node.scaleX);

    cc.director.getCollisionManager().enabled = true;

    this.setDirection(1);
  }

  start() {
    this.schedule(
      () => {
        this.shoot();
      },
      1,
      undefined,
      2
    );
  }

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

    this.setRotation();
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

  setRotation() {
    if (!this.recoil) {
      return;
    }
    this.node.angle = this.recoil;
    this.recoil /= 2;
    if (Math.abs(this.recoil) < 1) {
      this.recoil = 0;
    }
  }

  shoot() {
    const bullet = cc.instantiate(this.bulletPrefab);

    bullet.x = this.node.x + 6 * this.direction;
    bullet.y = this.node.y - 0.4;
    bullet.scaleX *= this.direction;
    bullet.getComponent(BulletControl).direction = this.direction;

    bullet.setParent(this.node.parent);

    this.recoil = this.direction * 30;
  }
}
