import Block from "../Block.js";

export default class BlockIronOre extends Block {
    constructor(id, textureIndex) {
        super(id, textureIndex);
        this.name = "Demir Cevheri";
        this.textureTop = "assets/terrain/new_blocks/iron_ore_top.png";
        this.textureBottom = "assets/terrain/new_blocks/iron_ore_bottom.png";
        this.textureSide = "assets/terrain/new_blocks/iron_ore_side.png";
    }
}