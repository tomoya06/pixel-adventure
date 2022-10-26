import {
  ColliderComponent,
  ColliderContactHandler,
} from "../interfaces/colliders";
import PlayerControl from "./PlayerControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyControl
  extends cc.Component
  implements ColliderComponent
{
  isTouchedGround = false;
  anim: cc.Animation;
  rigidBody: cc.RigidBody;
  collider: cc.Collider;

  nocontrol = false;
  direction = -1;

  onLoad() {
    cc.director.getCollisionManager().enabled = true;
    this.anim = this.getComponent(cc.Animation);
    this.rigidBody = this.getComponent(cc.RigidBody);
    this.collider = this.getComponent(cc.Collider);
  }

  start() {}

  update(dt) {}

  getHurt() {
    this.nocontrol = true;
    this.rigidBody.linearVelocity = cc.v2(0, 0);
    const curPos = this.node.getPosition();

    const that = this;

    this.node.runAction(
      cc.sequence(
        cc.callFunc(() => {
          that.anim.play("hurt");
        }),
        cc
          .moveTo(0.2, curPos.x - this.direction * 4, curPos.y)
          .easing(cc.easeQuarticActionOut()),
        cc.callFunc(() => {
          that.anim.play("idle");
          that.nocontrol = false;
        })
      )
    );
  }

  die() {
    this.node.destroy();
  }

  move() {}

  onBeginContact: ColliderContactHandler = (contact, selfColli, otherColli) => {
    if (otherColli.node.group === "ground") {
      this.isTouchedGround = true;
    } else if (otherColli.node.group === "bullet") {
      this.getHurt();
    } else if (otherColli.node.group === "player") {
      otherColli.getComponent(PlayerControl).getHurt();
    }
  };
  onEndContact: ColliderContactHandler;
  onPreSolve: ColliderContactHandler;
  onPostSolve: ColliderContactHandler;
}
