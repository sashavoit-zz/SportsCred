package queries

import (
	"github.com/neo4j/neo4j-go-driver/neo4j"
)

func GetDailyPicks(driver neo4j.Driver, email string) (interface{}, error){
	//today:= time.Now().Format("2006-01-01")
	today := "2020-07-30"

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH(u:User {email: $email})\n" +
				   "CALL{\n" +
				   "    WITH u\n" +
				   "	MATCH(g: Game)\n" +
				   "	WHERE g.date > date($today) AND NOT (u)-[:PREDICTED]->(g)\n" +
				   "    RETURN g as closestGame LIMIT 1\n" +
				   "}\n" +
				   "WITH closestGame\n" +
				   "MATCH(g: Game) WHERE g.date = closestGame.date\n" +
				   "RETURN COLLECT({game_id: ID(g), team1_name: g.team1_name, team2_name: g.team2_name, team1_init: g.team1_init, team2_init: g.team2_init, date: toString(g.date), winner: g.winner}) AS games\n",
			map[string]interface{}{"today": today, "email": email})
		if err != nil {
			panic(err)
			return nil, err
		}
		if result.Next() {
			value, _ := result.Record().Get("games")
			return value, nil
		}
		return nil, nil
	})

	return result, err
}

func AddNewPrediction(driver neo4j.Driver, email string, gameId int, prediction string) (interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH(u:User {email: $email})\n" +
				"MATCH(g:Game)\n"+
			    "WHERE ID(g) = $game_id\n"+
				"CREATE (u)-[:PREDICTED {winner: $prediction, seen: false}]->(g)\n",
			map[string]interface{}{"game_id": gameId, "email": email, "prediction": prediction})
		if err != nil {
			panic(err)
			return nil, err
		}
		return result, nil
	})

	return result, err
}

func IfMadePrediction(driver neo4j.Driver, email string, date string) (interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return false, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH(u:User {email: $email})\n" +
				"MATCH(g:Game {date: date($date)})\n"+
				"WHERE NOT (u)-[:PREDICTED]->(g)\n"+
				"RETURN g\n",
			map[string]interface{}{"email": email, "date": date})
		if err != nil {
			panic(err)
			return nil, err
		}

		return !result.Next(), nil
	})

	return result, err
}
