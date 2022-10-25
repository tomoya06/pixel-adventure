const { ccclass, property } = cc._decorator;

@ccclass
export default class GameControl extends cc.Component {
  @property({ type: cc.TiledMap })
  tilemap: cc.Node = null;

  get TileMap() {
    return this.tilemap as unknown as cc.TiledMap;
  }

  onLoad() {
    const p = cc.director.getPhysicsManager();
    p.enabled = true;
    // p.debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;

    this.bindCollideToGround();
  }

  start() {}

  bindCollideToGround() {
    const tileSize = this.TileMap.getTileSize();
    const layer = this.TileMap.getLayer("ground");
    const layerSize = layer.getLayerSize();

    for (let i = 0; i < layerSize.width; i++) {
      for (let j = 0; j < layerSize.height; j++) {
        const tile = layer.getTiledTileAt(i, j, true);
        if (!tile.gid) {
          continue;
        }

        tile.node.group = "ground";
        const body = tile.node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        const collider = tile.node.addComponent(cc.PhysicsBoxCollider);
        collider.offset = cc.v2(tileSize.width / 2, tileSize.height / 2);
        collider.size = cc.size(tileSize.width, tileSize.height);
        collider.apply();
      }
    }
  }

  // update (dt) {}
}
