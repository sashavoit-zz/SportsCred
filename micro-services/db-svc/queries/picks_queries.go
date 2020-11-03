package queries

import (
	"encoding/json"
	"fmt"
	"github.com/neo4j/neo4j-go-driver/neo4j"
	"reflect"
	"time"
)

func GetDailyPicks(driver neo4j.Driver, email string) (interface{}, error){
	today:= time.Now().Format("2006-01-02")
	//today := "2020-07-30"

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
				   "WITH closestGame, u\n" +
				   "MATCH(g: Game)\n" +
				   "WHERE g.date = closestGame.date AND NOT (u)-[:PREDICTED]->(g)\n" +
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

func AddNewPrediction(driver neo4j.Driver, email string, gameId int, winner string) (interface{}, error){
	today:= time.Now().Format("2006-01-02")
	//today := "2020-07-30"

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return nil, err
	}
	defer session.Close()

	_, err = session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		_, err := transaction.Run(
			"MATCH(u:User {email: $email})\n" +
				"MATCH(g:Game)\n"+
			    "WHERE ID(g) = $game_id\n"+
				"CREATE (u)-[:PREDICTED {winner: $winner, date: date($today), seen: false}]->(g)\n",
			map[string]interface{}{"game_id": gameId, "email": email, "winner": winner, "today": today})
		if err != nil {
			return nil, err
		}
		return nil, nil
	})

	return nil, err
}

func IfMadePrediction(driver neo4j.Driver, email string) (interface{}, error){
	today:= time.Now().Format("2006-01-02")
	//today := "2020-07-30"

	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return false, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
				"MATCH(u:User {email: $email})-[:PREDICTED {date: date($today), seen: false}]->(g:Game)\n"+
					"MATCH(game:Game)\n" +
					"WHERE g.date = game.date AND NOT (u)-[:PREDICTED]->(game)\n"+
					"RETURN game\n",
			map[string]interface{}{"email": email, "today": today})
		if err != nil {
			panic(err)
			return nil, err
		}

		return !result.Next(), nil
	})

	return result, err
}

func GetNewResults(driver neo4j.Driver, email string) (interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (u:User {email: $email})-[p:PREDICTED {seen: false}]->(g:Game)\n"+
				"WHERE EXISTS (g.winner)\n"+
				"SET p.seen = true\n"+
				"WITH g, (p.winner = g.winner) AS ifCorrect\n" +
				"RETURN COLLECT({game_id: ID(g), team1_name: g.team1_name, team2_name: g.team2_name, team1_init: g.team1_init, team2_init: g.team2_init, date: toString(g.date), winner: g.winner, correct: ifCorrect}) as results, COUNT(g) as counter",
			map[string]interface{}{"email": email})
		if err != nil {
			fmt.Print(err)
			return nil, err
		}

		if result.Next() {
			value, _ := result.Record().Get("results")
			counter, _ := result.Record().Get("counter")

			if reflect.ValueOf(counter).IsZero(){
				return nil, nil
			}

			return value, nil
		} else {
			return nil, nil
		}
	})

	return result, err
}

func AddGameOutcome(driver neo4j.Driver, gameId int, winner string) (interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return nil, err
	}
	defer session.Close()

	result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		_, err = transaction.Run(
			"MATCH (g:Game)\n"+
				"WHERE ID(g) = $game_id\n" +
				"SET g.winner = $winner\n",
			map[string]interface{}{"game_id": gameId, "winner": winner})
		if err != nil {
			return nil, err
		}

		return nil, nil
	})

	return result, err
}

func GetUsersThatPredicted(driver neo4j.Driver, gameId int) ([]string, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return nil, err
	}
	defer session.Close()

	var emails []string

	_, err = session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"MATCH (u:User)-[:PREDICTED]->(g:Game)\n" +
				"WHERE ID(g) = $game_id\n" +
				"WITH u\n" +
				"RETURN COLLECT(u.email) as emails\n",
			map[string]interface{}{"game_id": gameId})
		if err != nil {
			return nil, err
		}

		if result.Next(){
			value, _ := result.Record().Get("emails")
			bytes, _ := json.Marshal(value)
			json.Unmarshal(bytes, &emails)
			return nil, nil
		}

		return nil, nil
	})

	return emails, err
}

func AddGame(driver neo4j.Driver, team1Init string, team1Name string, team2Init string, team2Name string, date string, winner string) (interface{}, error){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
		return nil, err
	}
	defer session.Close()
	if winner == "" {
		result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
			result, err := transaction.Run(
				"CREATE (g: Game {team1_init: $team1_init, team2_init: $team2_init, team1_name: $team1_name, team2_name: $team2_name, date: date($date)})\n" +
					"RETURN ID(g) as id",
				map[string]interface{}{"team1_init": team1Init, "team2_init": team2Init, "team1_name": team1Name,"team2_name": team2Name, "date": date})
			if err != nil {
				return nil, err
			}

			if result.Next(){
				value, _ := result.Record().Get("id")
				return value, nil
			}

			return nil, nil
		})
		return result, err
	}else{
		result, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
			result, err := transaction.Run(
				"CREATE (g: Game {team1_init: $team1_init, team2_init: $team2_init, team1_name: $team1_name, team2_name: $team2_name, date: date($date), winner: $winner})\n" +
					"RETURN ID(g) as id",
				map[string]interface{}{"team1_init": team1Init, "team2_init": team2Init, "team1_name": team1Name,"team2_name": team2Name, "date": date, "winner": winner})
			if err != nil {
				return nil, err
			}

			if result.Next(){
				value, _ := result.Record().Get("id")
				return value, nil
			}

			return nil, nil
		})
		return result, err
	}
}

func ClearGamesInDB(driver neo4j.Driver){
	session, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		panic(err)
	}
	defer session.Close()

	_, err = session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		_, err := transaction.Run(
			"MATCH (g:Game)\n" +
				"DETACH DELETE(g)",
			map[string]interface{}{})
		if err != nil {
			return nil, err
		}

		return nil, nil
	})
}