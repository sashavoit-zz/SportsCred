package ca.utoronto.utm.mcs.APIs;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import org.json.*;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import ca.utoronto.utm.mcs.Utils;
import ca.utoronto.utm.mcs.Queries.TriviaQuestionsQueries;

public class TriviaQuestions implements HttpHandler {
	
	private TriviaQuestionsQueries db;
	private String type;
	
	public TriviaQuestions(String requestType) {
		db = new TriviaQuestionsQueries();
		type = requestType;
	}
	
	public void handle(HttpExchange r) throws IOException {
		try {
			if (r.getRequestMethod().equals("PUT") && type.equals("addQuestionToDb")) {
				handleAddQuestion(r);
			}
			else if (r.getRequestMethod().equals("GET") && type.equals("getQuestion")) {
				handleGetQuestion(r);
			}
			else {
				r.sendResponseHeaders(400, -1);
			}
		} catch (Exception e) {
			e.printStackTrace();
			r.sendResponseHeaders(400, -1);
		}
	}
	
	public void handleAddQuestion(HttpExchange r) throws IOException, JSONException {
		String body = Utils.convert(r.getRequestBody());
		JSONObject deserialized = new JSONObject(body);
		
		String question = "";
		String option1 = "";
		String option2 = "";
		String option3 = "";
		String answer = "";
		
		if (deserialized.has("question")) {
			question = deserialized.getString("question");
		}
		
		if (deserialized.has("option1")) {
			option1 = deserialized.getString("option1");
		}
		
		if (deserialized.has("option2")) {
			option2 = deserialized.getString("option2");
		}
		
		if (deserialized.has("option3")) {
			option3 = deserialized.getString("option3");
		}
		
		if (deserialized.has("answer")) {
			answer = deserialized.getString("answer");
		}
		
		try {
			List<String> responseBodyParams;
			responseBodyParams = db.retrieveQuestion(question);
			r.sendResponseHeaders(400, -1);
		} catch (Exception e) {
			try {
				if (question != "" && option1 != "" && option2 != "" && option3 != "" && answer != "") {
					db.insertQuestion(question, option1, option2, option3, answer);
					r.sendResponseHeaders(200, -1);
				}
				else {
					r.sendResponseHeaders(400, -1);
				}
			} catch (Exception f) {
				r.sendResponseHeaders(500, -1);
			}
		}
	}
	
	public void handleGetQuestion(HttpExchange r) throws IOException, JSONException {
		String body = Utils.convert(r.getRequestBody());
		JSONObject deserialized = new JSONObject(body);
		
		List<String> responseBodyParams;
		String question;
		
		if (deserialized.has("question")) {
			question = deserialized.getString("question");
			
			try {
				try {
					responseBodyParams = db.retrieveQuestion(question);
				} catch (Exception f) {
					r.sendResponseHeaders(404, -1);
					return;
				}
				
				JSONObject json = new JSONObject();
				json.put("question", responseBodyParams.get(0));
				json.put("option1", responseBodyParams.get(1).substring(1, responseBodyParams.get(1).length() - 1));
				json.put("option2", responseBodyParams.get(2).substring(1, responseBodyParams.get(2).length() - 1));
				json.put("option3", responseBodyParams.get(3).substring(1, responseBodyParams.get(3).length() - 1));
				json.put("answer", responseBodyParams.get(4).substring(1, responseBodyParams.get(4).length() - 1));
				
				r.getResponseHeaders().set("Content-Type", "application/json");
				r.sendResponseHeaders(200, json.toString().length());
				OutputStream os = r.getResponseBody();
				os.write(json.toString().getBytes());
				os.close();
				
			} catch (Exception e) {
				r.sendResponseHeaders(500, -1);
			}
		}
		else {
			r.sendResponseHeaders(400, -1);
		}
	}
}
