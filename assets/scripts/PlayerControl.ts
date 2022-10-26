import BulletControl from "./BulletControl";

const { ccclass, property } = cc._decorator;

const defaultKeydownMap = () => {
  return {
    [cc.macro.KEY.d]: 0,
    [cc.macro.KEY.a]: 0,
    [cc.macro.KEY.w]: 0,
    [cc.macro.KEY.s]: 0,
    [cc.macro.KEY.space]: 0,
  };
};

@ccclass
export default class PlayerControl extends cc.Component {
  keydownMap = defaultKeydownMap();

  runspeed: number = 60;
  jumpspeed: number = 100;
  recoilAmount: number = 30;

  state = "";
  direction = 1;
  nodeScale = 1;
  recoil = 0;

  nocontrol = false;

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

  start() {}

  update(dt: number) {
    if (this.nocontrol) {
      return;
    }

    // 移动
    const velocity = this.rigidBody.linearVelocity;

    let dir = 0;
    if (this.keydownMap[cc.macro.KEY.d]) {
      dir = 1;
    } else if (this.keydownMap[cc.macro.KEY.a]) {
      dir = -1;
    }
    velocity.x = dir * this.runspeed;

    this.consumeKeydown(cc.macro.KEY.w, () => {
      velocity.y = this.jumpspeed;
    });

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

    // 射击
    this.consumeKeydown(cc.macro.KEY.space, () => {
      this.shoot();
    });
  }

  onkeydown(e: KeyboardEvent) {
    if (this.nocontrol) {
      return;
    }
    this.keydownMap[e.keyCode] += 1;
  }

  onkeyup(e: KeyboardEvent) {
    this.keydownMap[e.keyCode] = 0;
  }

  consumeKeydown(code: number, handler: () => void) {
    if (this.keydownMap[code] === 1) {
      handler();
      this.keydownMap[code] += 1;
    }
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

    this.recoil = this.direction * this.recoilAmount;
  }

  stopControl() {
    this.nocontrol = true;
    this.keydownMap = defaultKeydownMap();
  }

  getHurt() {
    this.stopControl();
    this.rigidBody.linearVelocity = cc.v2(0, 0);
    const curPos = this.node.getPosition();
    const that = this;
    const duration = 1;
    const wakeupDelay = 0.8;

    this.node.runAction(
      cc.sequence(
        cc.callFunc(() => {
          that.anim.play("player_hurt");
          that.node.angle = this.direction * this.recoilAmount * 0.8;
        }),
        cc.spawn(
          cc
            .moveTo(duration, curPos.x - this.direction * 30, curPos.y)
            .easing(cc.easeQuarticActionOut()),
          cc.sequence(
            cc.delayTime(wakeupDelay),
            cc.rotateTo(duration - wakeupDelay, 0)
          )
        ),
        cc.callFunc(() => {
          that.nocontrol = false;
          that.anim.play("player_idle");
        })
      )
    );
  }
}
