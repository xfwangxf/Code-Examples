// Import MongoDB module
const { MongoClient } = require('mongodb');


// URL of db on the cloud
const url = 'mongodb+srv://cis557_test:cis557+mongodb@cluster0.udybw.mongodb.net/game?retryWrites=true&w=majority';

// Connect to our db on the cloud
const connect = async () => {
  try {
    const tmp = (await MongoClient.connect(url, 
      { useNewUrlParser: true, useUnifiedTopology: true })).db();
    // Connected to db
    console.log(`Connected to database: ${tmp.databaseName}`);
    return tmp;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// add a player
const addPlayer = (db, newPlayer) => {
    db.collection('players').insertOne(newPlayer, (err, result) => {
        if (err) {
          console.log(`error: ${err.message}`);
          return;
        }
        console.log(`Created player with id: ${result.insertedId}`);
      });


}

// get all players
const getPlayers = async (db) => {
    try{
        const results = await db.collection('players').find({}).toArray();
        console.log(`Players: ${JSON.stringify(results)}`);
    }
    catch(err){
        console.log(`error: ${err.message}`);
    }
}

// delete player by name
const deletePlayer = async (db, name) => {
    try{
        const record = await db.collection('players').findOne({player:name});
        console.log(`record: ${JSON.stringify(record)}`);
        // delete record by id
        const deleted = await db.collection('players').deleteOne( { _id : record._id } );
        console.log(`Deleted: ${JSON.stringify(deleted)}`);
    }
    catch(err){
        console.log(`error: ${err.message}`);
    }
}

// update a player - lecture activity
const updatePlayer = async (db, player) => {
  try {
    const record = await db.collection('players').findOne({player:player.player});
    const updated = await db.collection('players').updateOne({_id: record._id},{$set: {player: player.player, points: player.points}})
    console.log(`Updated: ${JSON.stringify(updated)}`);
  }
  catch(err){
    console.log(`error: ${err.message}`);
  }
}


const operations = async () => {
    const db = await connect();
    //await getPlayers(db);
    //addPlayer(db, {player: 'testuser1', points: 0});
    await getPlayers(db); 
    await updatePlayer(db, {player:'testuser', points:1})
    await deletePlayer(db, 'testuser1');  
    await getPlayers(db);

}

operations();