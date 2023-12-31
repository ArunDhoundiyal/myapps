const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const app = express();
let db = null;
const dbPath = path.join(__dirname, "cricketTeam.db");
const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Hello sever is going on right now");
    });
  } catch (error) {
    console.log(`DataBase Error ${error.message}`);
    process.exit(1);
  }
};

initializeDBandServer();

//GET List of All Players
app.get("/players/", async (request, response) => {
  const getCricketTeamInfo = `SELECT * FROM cricket_team ORDER BY player_id;`;
  const CricketTeamInfo = await db.all(getCricketTeamInfo);
  response.send(CricketTeamInfo);
});

//POST Create List of Player
app.use(express.json());
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO
      cricket_team (player_name, jersey_number, role)
    VALUES
      (
        '${playerName}',
         
       '${jerseyNumber}',
         
       '${role}'
      );`;
  const db_Create_Response = await db.run(addPlayerQuery);
  const last_Id = db_Create_Response.lastID;
  response.send("Player Added to Team");
});

//GET List of Player
app.get("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const getCricketPlayerInfo = `SELECT * FROM cricket_team WHERE player_id = ${player_id};`;
  const CricketPlayerInfo = await db.get(getCricketPlayerInfo);
  response.send(CricketPlayerInfo);
});

//PUT Update List of Player
app.put("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerInfo = `
  UPDATE cricket_team 
  SET 
    player_name='${playerName}', 
    jersey_number='${jerseyNumber}',
    role='${role}'
  WHERE player_id = ${player_id};
`;
  await db.run(updatePlayerInfo);
  response.send("Player Details Updated");
});

//DELETE List of Player
app.delete("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const deletePlayerDetail = `DELETE from cricket_team WHERE player_id = ${player_id};`;
  await db.run(deletePlayerDetail);
  response.send("Player Removed");
});
