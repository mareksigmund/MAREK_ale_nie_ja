const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema(
  {
    charName: {type:String, required:true},
    charPassword: {type:String, required:true},
    charClass: {type:String, required:true},
    avatarId: {type:Number, default: 0},
    colorId: {type:Number, default: 0},
    titleId: {type: Number, default: 0},

    level: {type:Number, default: 1},
    totalXP: {type:Number, default: 0},
    toLevelUp: {type:Number, default: 12},

    att1: {type:Number, default: 1},
    att2: {type:Number, default: 1},
    att3: {type:Number, default: 1},

    equippedWeaponId: {type:Number, default: 0},
    equippedArmorId: {type:Number, default: 0},

    avatarSprite: {type:Number, default: 0},            //derived
    weaponSprite: {type:Number, default: 0},          //derived
    weaponDamage: {type:Number, default: 0},        //derived
    healthPoints: {type:Number, default: 0},        //derived
    armorPoints: {type:Number, default: 0},       //derived

    weaponUnlocks: {type:[Boolean], default:[true,false,false,false]},
    armorUnlocks: {type:[Boolean], default:[true,false,false,false]},
    colorUnlocks: {type:[Boolean], default:[true,false,false,false]},
    titleUnlocks: {type:[Boolean], default:[true,false,false,false]},

    storyStage: {type:Number, default: 0},  //max 5
    totalQuests: {type:Number, default: 0},
    onQuest: {type:Boolean, default: false},
    questId: {type:Number, default:0},
    questBegin: {type:Number, default:0},
    questEnd: {type:Number, default:0},

    arenaWins:{type:Number, default:0},
    arenaWinstreak:{type:Number, default:0}
  },
  {
    versionKey: false
  }
);

const CharacterModel = mongoose.model('characters', characterSchema);

module.exports = { CharacterModel };