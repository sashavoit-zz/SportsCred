package ca.utoronto.utm.mcs;

import java.io.IOException;
import java.net.InetSocketAddress;
import com.sun.net.httpserver.HttpServer;

import ca.utoronto.utm.mcs.APIs.TriviaQuestions;

public class App 
{
    static int PORT = 8080;
    public static void main(String[] args) throws IOException
    {
        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", PORT), 0);
        
        // All rest API handling goes here
        
        // Trivia API calls
        server.createContext("/api/v1/addQuestion", new TriviaQuestions("addQuestionToDb"));
        server.createContext("/api/v1/getQuestion", new TriviaQuestions("getQuestion"));
        
        // other API calls...
        
        server.start();
        System.out.printf("Server started on port %d...\n", PORT);
    }
}
