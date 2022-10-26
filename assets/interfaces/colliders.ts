export type ColliderContactHandler = (
  contact: cc.PhysicsContact,
  selfCollider: cc.Collider,
  otherCollider: cc.Collider
) => void;

export interface ColliderComponent {
  // 只在两个碰撞体开始接触时被调用一次
  onBeginContact: ColliderContactHandler;

  // 只在两个碰撞体结束接触时被调用一次
  onEndContact: ColliderContactHandler;

  // 每次将要处理碰撞体接触逻辑时被调用
  onPreSolve: ColliderContactHandler;

  // 每次处理完碰撞体接触逻辑时被调用
  onPostSolve: ColliderContactHandler;
}
