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

  onLoad() {
    cc.director.getCollisionManager().enabled = true;
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
    }
    console.log("EnemyControl onBeginContact");
  };
  onEndContact: ColliderContactHandler;
  onPreSolve: ColliderContactHandler;
  onPostSolve: ColliderContactHandler;
}
