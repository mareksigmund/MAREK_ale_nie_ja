const mongoose = require("mongoose");

const enemySchema = new mongoose.Schema(
  {
    enemyName: {type:String, required:true},
    isPlayer: {type:Boolean, default: false},
    questId: {type:Number, required:false},
    
    titleId: {type:Number, required:false},
    colorId: {type:Number, required:false},
    
    att1: {type:Number, default: 1},
    att2: {type:Number, default: 1},
    avatarSprite: {type:Number, required:false},
    weaponSprite: {type:Number, default: 31},
    damage: {type:Number, default: 8},

    healthPoints: {type:Number, default: 16},
    armorPoints: {type:Number, default: 20}

  },
  {
    versionKey: false
  }
);

const EnemyModel = mongoose.model('enemies', enemySchema);

module.exports = { EnemyModel };