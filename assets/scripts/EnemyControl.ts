import {
  ColliderComponent,
  ColliderContactHandler,
} from "../interfaces/colliders";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyControl
  extends cc.Component
  implements ColliderComponent
{
  isTouchedGround = false;
  anim: cc.Animation;

  onLoad() {
    cc.director.getCollisionManager().enabled = true;
    this.anim = this.getComponent(cc.Animation);
  }

  start() {}

  update(dt) {}

  die() {
    this.node.destroy();
  }

  move() {}

  onBeginContact: ColliderContactHandler = (contact, selfColli, otherColli) => {
    if (otherColli.node.group === "ground") {
      this.isTouchedGround = true;
    } else if (otherColli.node.group === "bullet") {
      this.anim.play("hurt");
    }
    console.log("EnemyControl onBeginContact", contact, selfColli, otherColli);
  };
  onEndContact: ColliderContactHandler;
  onPreSolve: ColliderContactHandler;
  onPostSolve: ColliderContactHandler;
}
