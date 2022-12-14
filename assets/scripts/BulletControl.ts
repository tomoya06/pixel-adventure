import {
  ColliderComponent,
  ColliderContactHandler,
} from "../interfaces/colliders";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BulletControl
  extends cc.Component
  implements ColliderComponent
{
  private _direction: number = 1;
  public get direction(): number {
    return this._direction;
  }
  public set direction(value: number) {
    this._direction = value;
  }

  speed: number = 100;

  onLoad() {
    cc.director.getCollisionManager().enabled = true;
  }

  start() {}

  update(dt) {
    this.node.x += this.direction * this.speed * dt;

    if (this.node.x < 0 || this.node.x > this.node.parent.width) {
      this.node.destroy();
    }

    // console.log(`bullet: ${this.node.x}`);
  }

  onBeginContact: ColliderContactHandler = (contact, selfColli, otherCollo) => {
    this.node.destroy();
  };
  onEndContact: ColliderContactHandler;
  onPreSolve: ColliderContactHandler;
  onPostSolve: ColliderContactHandler;
}
