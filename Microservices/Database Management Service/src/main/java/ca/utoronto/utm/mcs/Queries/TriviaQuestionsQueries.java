package ca.utoronto.utm.mcs.Queries;

import static org.neo4j.driver.Values.parameters;

import java.util.ArrayList;
import java.util.List;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.neo4j.driver.Transaction;
import org.neo4j.driver.Value;


public class TriviaQuestionsQueries {
	
	private Driver driver;
	private String uriDb;
	
	public TriviaQuestionsQueries() {
		uriDb = "bolt://localhost:7687";
		driver = GraphDatabase.driver(uriDb, AuthTokens.basic("neo4j", "1234"));
	}
	
	public void insertQuestion(String question, String option1, String option2, String option3, String answer) {
		try (Session session = driver.session()){
			session.writeTransaction(tx -> tx.run("MERGE (a:Question {question: $a,option1: $b,option2: $c,option3: $d,answer: $e})", 
					parameters("a", question, "b", option1, "c", option2, "d", option3, "e", answer)));
			session.close();
		}
	}
	
	
	public List<String> retrieveQuestion(String question) {
		List<String> responseBodyParams = new ArrayList<String>();
		
		try (Session session = driver.session()) {
			try (Transaction tx = session.beginTransaction()) {
				responseBodyParams.add(question);
				Result questionNodes = tx.run("MATCH (n:Question {question:$x})\n"
						+ "RETURN n", parameters("x", question));
				
				Value record = questionNodes.next().get(0);
				
				//System.out.println(record.get("option1").toString());
				//System.out.println(record.get("option2").toString());
				//System.out.println(record.get("option3").toString());
				//System.out.println(record.get("answer").toString());
				
				responseBodyParams.add(record.get("option1").toString());
				responseBodyParams.add(record.get("option2").toString());
				responseBodyParams.add(record.get("option3").toString());
				responseBodyParams.add(record.get("answer").toString());
				
				return responseBodyParams;
			}
		}
	}
	
	public void close() {
		driver.close();
	}
}
