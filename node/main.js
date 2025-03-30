const mongo_url = "mongodb://localhost:27017/game";
const express = require('express');
const mongoose = require('mongoose');
const math = require('mathjs');
const cors = require('cors');

const { CharacterModel } = require('./models/character');
const { EnemyModel } = require('./models/enemy');
const { QuestModel } = require('./models/quest');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(mongo_url).then(()=>{
  console.log("MongoDB connexion successful.");
}).catch((_)=>{
  console.log("MongoDB connexion failed.");
});

CharacterModel.countDocuments({}).then(count => console.log(count + " characters in database."));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/getArenaFight', async (req, res) => {

  const {charName, opponentName} = req.query;

  if(opponentName == "random") {

  }
  else {

  }
  const char = await CharacterModel.findOne({charName: charName});
  // colorId = Number(colorId);
  // titleId = Number(titleId);
  // equippedArmorId = Number(equippedArmorId);
  // equippedWeaponId = Number(equippedWeaponId);

  if(char){

    if(!(colorId<0 || colorId>3 || titleId<0 || titleId>3 || equippedArmorId<0 || equippedArmorId>3 || equippedWeaponId<0 || equippedWeaponId>3))
    {
      if(char.colorUnlocks[colorId]!=false)
      {
        char.colorId = colorId;
      }
      if(char.armorUnlocks[equippedArmorId]!=false)
      {
        char.equippedArmorId = equippedArmorId;
      }
      if(char.weaponUnlocks[equippedWeaponId]!=false)
      {
        char.equippedWeaponId = equippedWeaponId;
      }
      if(char.titleUnlocks[colorId]!=false)
      {
        char.titleId = titleId;
      }

    }else{
      return res.status(400).send();
    }
    await char.save();
    CharUdateDerived(charName);
    return res.status(200).send();

  }
  
  return res.status(404).send();

});



app.post('/characterUpdateEquip', async (req, res) => {

  const {charName, colorId, titleId, equippedArmorId, equippedWeaponId} = req.query;
  const char = await CharacterModel.findOne({charName: charName});
  // colorId = Number(colorId);
  // titleId = Number(titleId);
  // equippedArmorId = Number(equippedArmorId);
  // equippedWeaponId = Number(equippedWeaponId);

  if(char){

    if(!(colorId<0 || colorId>3 || titleId<0 || titleId>3 || equippedArmorId<0 || equippedArmorId>3 || equippedWeaponId<0 || equippedWeaponId>3))
    {
      if(char.colorUnlocks[colorId]!=false)
      {
        char.colorId = colorId;
      }
      if(char.armorUnlocks[equippedArmorId]!=false)
      {
        char.equippedArmorId = equippedArmorId;
      }
      if(char.weaponUnlocks[equippedWeaponId]!=false)
      {
        char.equippedWeaponId = equippedWeaponId;
      }
      if(char.titleUnlocks[colorId]!=false)
      {
        char.titleId = titleId;
      }

    }else{
      return res.status(400).send();
    }
    await char.save();
    CharUdateDerived(charName);
    return res.status(200).send();

  }
  
  return res.status(404).send();

});

function getRandom(min, max)
{
  return math.floor(math.random() * max) + min;
}

function calculateHit(attackerDex, defenderArmor){
  const roll = getRandom(1, 40) + attackerDex;
  if(roll > defenderArmor)
  {
    return true;
  }
  else return false;
}

function calculateDamage(attackerStr, attackerWeapon)
{
  return getRandom(1, attackerWeapon) + attackerStr;
}

app.get('/getQuestFight', async (req, res) => {


  const {charName} = req.query;
  const char = await CharacterModel.findOne({charName: charName});
  const quest = await QuestModel.findOne({questId: char.questId});
  var unlockedStuff = false;
  var xp = quest.xp;

  if (math.random() < 0.5)unlockedStuff = true;

  if(!char || !char.onQuest || (char.questEnd - Date.now())>0)
  {
    return res.status(400).send();
  }
  else {




  const enemy = await EnemyModel.findOne({questId: char.questId});


  var playerTurn = false;
  var turn = 0;
  var playerWin = false;
  var hit;
  const initiative = getRandom(1, char.att2 + enemy.att2);
  var turns = [];
  var unlock = false;

  if (initiative <= char.att2)
  {
    playerTurn = true;
  }

  var playerHp = char.healthPoints;
  var enemyHp = enemy.healthPoints;

  while(true)
  {
    hit = false;
    if(playerTurn)
    {
      if(calculateHit(char.att2, enemy.armorPoints))
      {
        var hit = true;
        enemyHp -= calculateDamage(char.att1, char.weaponDamage)
      }
    }
    else{
      if(calculateHit(enemy.att2, char.armorPoints))
        {
          var hit = true;
          playerHp -= calculateDamage(enemy.att1, enemy.damage)
        }
    }

    turns.push(
      {
        turn: turn,
        playerTurn: playerTurn,
        hit: hit,
        playerHp: playerHp,
        enemyHp: enemyHp
      }
    );
    turn += 1;
    playerTurn = !playerTurn

    if(enemyHp < 1)
    {
      playerWin = true;
      break;
    }
    else if(playerHp < 1)
    {
      playerWin = false;
      break;
    }


  }

  char.onQuest = false;
  if(playerWin)
  {
    char.totalQuests+=1;
    char.totalXP += quest.xp;
    if(char.questId%10 == 2){
      char.storyStage += 1;
    }

    







  }

  await char.save();
  CharUdateDerived(char.charName);

  return res.status(200).json(
    {
    avatar1: char.avatarSprite,
    color1: 1,
    name1: char.charName,
    title1: char.titleId,
    hp1: char.healthPoints,

    avatar2: enemy.avatarSprite,
    color2: 1,
    name2: enemy.enemyName,
    title2: "title2",
    hp2: enemy.healthPoints,
    playerWin: playerWin,
    xp: xp,
    turns: turns,
    unlockedStuff: unlockedStuff

    }




  );

}

});




app.get('/getArenaFight', async (req, res) => {


  const {charName, opponentame} = req.query;
  const char = await CharacterModel.findOne({charName: charName});
  const quest = await QuestModel.findOne({questId: 11});
  var unlockedStuff = false;
  var xp = quest.xp;

  if (math.random() < 0.5)unlockedStuff = true;







  const enemy = await EnemyModel.findOne({questId: char.questId});


  var playerTurn = false;
  var turn = 0;
  var playerWin = false;
  var hit;
  const initiative = getRandom(1, char.att2 + enemy.att2);
  var turns = [];
  var unlock = false;

  if (initiative <= char.att2)
  {
    playerTurn = true;
  }

  var playerHp = char.healthPoints;
  var enemyHp = enemy.healthPoints;

  while(true)
  {
    hit = false;
    if(playerTurn)
    {
      if(calculateHit(char.att2, enemy.armorPoints))
      {
        var hit = true;
        enemyHp -= calculateDamage(char.att1, char.weaponDamage)
      }
    }
    else{
      if(calculateHit(enemy.att2, char.armorPoints))
        {
          var hit = true;
          playerHp -= calculateDamage(enemy.att1, enemy.damage)
        }
    }

    turns.push(
      {
        turn: turn,
        playerTurn: playerTurn,
        hit: hit,
        playerHp: playerHp,
        enemyHp: enemyHp
      }
    );
    turn += 1;
    playerTurn = !playerTurn

    if(enemyHp < 1)
    {
      playerWin = true;
      break;
    }
    else if(playerHp < 1)
    {
      playerWin = false;
      break;
    }


  }






  return res.status(200).json(
    {
    avatar1: char.avatarSprite,
    color1: 1,
    name1: char.charName,
    title1: char.titleId,
    hp1: char.healthPoints,

    avatar2: enemy.avatarSprite,
    color2: 1,
    name2: enemy.enemyName,
    title2: 0,
    hp2: enemy.healthPoints,
    playerWin: playerWin,
    xp: xp,
    turns: turns,
    unlockedStuff: unlockedStuff

    }




  );



});

app.post('/characterBeginQuest', async (req, res) => {

  const {charName, questId} = req.query;
  const char = await CharacterModel.findOne({charName: charName});
  const quest = await QuestModel.findOne({questId: questId});


  // colorId = Number(colorId);
  // titleId = Number(titleId);
  // equippedArmorId = Number(equippedArmorId);
  // equippedWeaponId = Number(equippedWeaponId);

  // console.log("ColorID:" + char.colorUnlocks[colorId]);
  // console.log("titleId:" + titleId);
  // console.log("equippedArmorId:" + equippedArmorId);
  // console.log("equippedWeaponId: " + equippedWeaponId);

  if(char && quest){
    const timestamp = Date.now();
    char.questId = quest.questId;
    char.onQuest = true;
    char.questBegin = timestamp;
    char.questEnd = timestamp + MinutesToMiliseconds(quest.time);
    await char.save();

    return res.status(200).send();

  }
  
  return res.status(404).send();

});

function MinutesToMiliseconds(number) {
  return number * 60000;
}

function MilisecondsToMinutes(number) {
  return number / 60000;
}

async function CharUdateDerived(charName) {
  const char = await CharacterModel.findOne({charName: charName});

  switch(char.level){
    
    case 1:

    
      char.toLevelUp= math.abs(math.max(0,12-char.totalXP));
      break;
    
    case 2:
      char.toLevelUp=math.abs(math.max(0,60-char.totalXP));
      break;

    case 3:
    
      char.toLevelUp=math.abs(math.max(0,180-char.totalXP));
      break;

    case 4:
    
      char.toLevelUp=math.abs(math.max(0,420-char.totalXP));
      break;

    case 5:
    
      char.toLevelUp=math.abs(math.max(0,980-char.totalXP));
      break;

    case 6:
    
      char.toLevelUp=math.abs(math.max(0,1940-char.totalXP));
      break;

    case 7:
    
      char.toLevelU=math.abs(math.max(0,3540-char.totalXP));
      break;

    case 8:
    
      char.toLevelUp=math.abs(math.max(0,6340-char.totalXP));
      break;

    case 9:
    
      char.toLevelUp=math.abs(math.max(0,10540-char.totalXP));
      break;

    default:
    
      char.toLevelUp=0;
      
      break;
    }
  
    char.healthPoints = 20 + char.att3 + ((char.level-1)*(12+char.att3));
  

    switch(char.equippedWeaponId) {
      case 0:
        //console.log("crap works");
        char.weaponDamage = 8;
        break;
      case 1:
        //console.log("crap works");
        char.weaponDamage = 12;
        break;
      case 2:
        //console.log("crap works");
        char.weaponDamage = 16;
        break;
      case 3:
        //console.log("crap works");
        char.weaponDamage = 24;
        break;
    }



    switch(char.equippedArmorId) {
      case 0:
        //console.log("crap works");
        char.armorPoints = 12;
        break;
      case 1:
        //console.log("crap works");
        char.armorPoints = 14;
        break;
      case 2:
        //console.log("crap works");
        char.armorPoints = 16;
        break;
      case 3:
        //console.log("crap works");
        char.armorPoints = 18;
        break;
    }

    if(char.charClass == "Warrior") {
      char.weaponSprite = 10 + char.equippedWeaponId;
    }
    else{
      char.weaponSprite = 20 + char.equippedWeaponId;
    }
    
    if(char.charClass == "Warrior") {
      char.avatarSprite = 100 + char.avatarId*10 + char.colorId;
    }
    else{
      char.avatarSprite = 200 + char.avatarId*10 + char.colorId;
    }



    await char.save();

    return true;
}

app.get('/characterCheckQuest', async (req, res) => {

  const {charName} = req.query;
  const char = await CharacterModel.findOne({charName: charName});
  const quest = await QuestModel.findOne({questId: char.questId});


  if(char.onQuest == false)
  {
    return res.status(400).send();
  }

  else{
   

    if(quest){

      const time = MilisecondsToMinutes(char.questEnd - Date.now());
      return res.status(200).json({
        questName: quest.name,
        questDesc: quest.desc,
        background: quest.background,
        questBegin: char.questBegin,
        questEnd: char.questEnd,
        timeLeft: MilisecondsToMinutes(char.questEnd - Date.now())
      });

    }
    else return res.status(404).send(String(char.questId));

   
  }
  
});

app.post('/characterLevelUp', async (req, res) => {

  const {charName, first, second, third} = req.query;

  const char = await CharacterModel.findOne({charName: charName});


  if(char){

    if(char.toLevelUp == 0 && char.level != 10 &&  Number(first)+Number(second)+Number(third)==3)
    {
  
      switch (Number(first))
      {
        case 0:
          char.att1+=0;
          break;
        case 1:
          char.att1+=1;
          break;
        case 2:
          char.att1+=2;
          break;
      }
      switch (Number(second))
      {
        case 0:
          char.att2+=0;
          break;
        case 1:
          char.att2+=1;
          break;
        case 2:
          char.att2+=2;
          break;
      }
      switch (Number(third))
      {
        case 0:
          char.att3+=0;
          break;
        case 1:
          char.att3+=1;
          break;
        case 2:
          char.att3+=2;
          break;
      }

      if(char.att1>10 || char.att2>10 || char.att3>10)
      {
        return res.status(500).send();
      }
      char.level +=1;
      await char.save();
      CharUdateDerived(charName);
      return res.status(200).send();
    }else return res.status(500).send();
  }
  return res.status(404).send();
});

app.get('/getCharacterByName', async (req, res) => {
  try {
    const {charName} = req.query;
    const char = await CharacterModel.findOne({charName: charName});

    if(!char){
      return res.status(404).send();
    }
    else{
      CharUdateDerived(charName);
      await char.save();
      const dispchar = await CharacterModel.findOne({charName: charName});
      return res.status(200).json(
        dispchar
      );
    }} catch (error) {
      console.error('Something went wrong in /getCharacterByName: ', error);
      return res.status(500).send();
    }
});

app.post('/createCharacter', async (req, res) => {
  try {
    const {charName, charPassword, charClass} = req.query;
    const newCharacter = new CharacterModel({charName:charName,charPassword:charPassword,charClass:charClass});
    await newCharacter.save();
    CharUdateDerived(charName);
    return res.status(200).send();
    } catch (error) {
      console.error('Something went wrong in /createCharacter: ', error);
      return res.status(500).send();
    }
});

app.listen(8080, () => {
    console.log('Server is running with nodemon on port 8080.');
});