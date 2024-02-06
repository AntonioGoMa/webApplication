<?php

/**
 * Rating class represents an endpoint for managing user ratings for content.
 * It extends the Endpoint class and allows users to get, create, and delete ratings.
 *
 * @author Antonio Gorgan
 * 
 */

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Rating extends Endpoint {
    
    public function __construct(){
        $id = $this->validateToken();
        $this->checkUserExists($id);
        switch(Request::method()) 
        {
            case 'GET':
                $data = $this->getRatings($id);
                break;
            case 'POST':
                $data = $this->giveRarting($id);
                break;
            case 'DELETE':
                $data = $this->deleteRating($id);
                break;
            default:
                throw new ClientError(405);
                break;
        }
        parent::__construct($data);
    }

    private function validateToken() {
        $secretkey = SECRET;
                
        $jwt = REQUEST::getToken();
 
        try {
            $decodedJWT = JWT::decode($jwt, new Key($secretkey, 'HS256'));
        } catch (Exception $e) {
            error_log('Error decoding token: ' . $e->getMessage());
            error_log('Received token: ' . $jwt);
            throw new ClientError(401);
        }
 
        if (!isset($decodedJWT->exp) || !isset($decodedJWT->id)) { 
            throw new ClientError(401);
        }
 
        return $decodedJWT->id;
    }

    private function rate() 
    {
        if (!isset(REQUEST::params()['rate']))
        {
            throw new ClientError(422);
        }
 
        if (!is_numeric(REQUEST::params()['rate']))
        {
            throw new ClientError(422);
        }
 
       $rate = REQUEST::params()['rate'];
       return htmlspecialchars($rate);
    }

    private function checkUserExists($id)
    {
        $dbConn = new Database("db/users.sqlite");
        $sql = "SELECT id FROM account WHERE id = :id";
        $sqlParameters = [':id' => $id];
        $data = $dbConn->executeSQL($sql, $sqlParameters);
        if (count($data) != 1) {
            throw new ClientError(401);
        }
    }
    

    private function getRatings($id) { 
        $where = false; 
        $sql = "SELECT * FROM ratings WHERE userID = :id";   
        $sqlParameters = [':id' => $id];    
        
        if (isset(Request::params()['contentID'])){
            $sql = "SELECT * FROM ratings WHERE userID = :id AND " ; 
            $sql .= " contentID LIKE :contentID";
            $sqlParameters[':contentID'] = REQUEST::params()['contentID'] . "%"; 
        }

        $dbConn = new Database("db/users.sqlite");

        $data = $dbConn->executeSQL($sql, $sqlParameters);
        return $data;
    }

    private function giveRarting($id) {

        $contentID = REQUEST::params()['contentID'];
        $rate = $this->rate();
 
        $dbConn = new Database("db/users.sqlite");
 
        $sqlParameters = [':id' => $id, 'contentID' => $contentID];
        $sql = "SELECT * FROM ratings WHERE userID = :id AND contentID = :contentID";
        $data = $dbConn->executeSQL($sql, $sqlParameters);
 
        // If there is no note for this film, create one. 
        // Otherwise update the existing note.
        if (count($data) === 0) {
            $sql = "INSERT INTO ratings (userID, contentID, rate) VALUES (:id, :contentID, :rate)";
        } else {
            $sql = "UPDATE ratings SET rate = :rate WHERE userID = :id AND contentID = :contentID";
        }
 
        $sqlParameters = [':id' => $id, 'contentID' => $contentID, 'rate' => $rate];
        $data = $dbConn->executeSQL($sql, $sqlParameters);
     
        return [];
    }

    private function deleteRating($id) {
        if (!isset(REQUEST::params()['contentID']))
        {
            throw new ClientError(422);
        }
 
        $contentID = REQUEST::params()['contentID'];
        
        if (!is_numeric($contentID))
        {
            throw new ClientError(422);
        }
 
        $dbConn = new Database("db/users.sqlite");
        $sql = "DELETE FROM ratings WHERE userID = :id AND contentID = :contentID";
        $sqlParameters = [':id' => $id, 'contentID' => $contentID];
        $data = $dbConn->executeSQL($sql, $sqlParameters);
        return $data;
    }
}
