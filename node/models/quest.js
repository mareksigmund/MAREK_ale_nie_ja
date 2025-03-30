const mongoose = require("mongoose");

const questSchema = new mongoose.Schema(
  {
    questId: {type:Number},
    name: {type:String, required:true},
    desc: {type:String, required:true},
    background: {type:String, required:true},
    time: {type:Number},
    xp: {type:Number},
    tier1gearchance: {type:Number},
    tier2gearchance: {type:Number},
    tier3gearchance: {type:Number}
  },
  {
    versionKey: false
  }
);

const QuestModel = mongoose.model('quests', questSchema);

module.exports = { QuestModel };