<?php
/**
 * Note class represents an endpoint for managing user notes related to content.
 * It extends the Endpoint class and handles various CROS operations for user notes such as 
 * getting, posting, updating and deleting a note.
 *
 * @author Antonio Gorgan
 * 
 */

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Note extends Endpoint { 

    public function __construct(){
        $id = $this->validateToken();
        
        $this->checkUserExists($id);
 
        switch(Request::method()) 
        {
            case 'GET':
                $data = $this->getNote($id);
                break;
            case 'POST':
                $data = $this->createNote($id);
                break;
            case 'DELETE':
                $data = $this->deleteNote($id);
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

    private function note() 
    {
        if (!isset(REQUEST::params()['note']))
        {
            throw new ClientError(422);
        }
 
        if (mb_strlen(REQUEST::params()['note']) > 255)
        {
            throw new ClientError(402);
        }
 
       $note = REQUEST::params()['note'];
       return htmlspecialchars($note);
    }

    private function getNote($id) { 

        
        $where = false; 
        $sql = "SELECT * FROM notes WHERE userID = :id";   
        $sqlParameters = [':id' => $id];    
        
        if (isset(Request::params()['contentID'])){
            $sql = "SELECT * FROM notes WHERE userID = :id AND " ; 
            $sql .= " contentID LIKE :contentID";
            $sqlParameters[':contentID'] = REQUEST::params()['contentID'] . "%"; 
        }

        $dbConn = new Database("db/users.sqlite");

        $data = $dbConn->executeSQL($sql, $sqlParameters);
        return $data;
    }

    private function createNote($id) {

        $contentID = REQUEST::params()['contentID'];
        $note = $this->note();
 
        $dbConn = new Database("db/users.sqlite");
 
        $sqlParameters = [':id' => $id, 'contentID' => $contentID];
        $sql = "SELECT * FROM notes WHERE userID = :id AND contentID = :contentID";
        $data = $dbConn->executeSQL($sql, $sqlParameters);

        if (count($data) === 0) {
            $sql = "INSERT INTO notes (userID, contentID, note) VALUES (:id, :contentID, :note)";
        } else {
            $sql = "UPDATE notes SET note = :note WHERE userID = :id AND contentID = :contentID";
        }
 
        $sqlParameters = [':id' => $id, 'contentID' => $contentID, 'note' => $note];
        $data = $dbConn->executeSQL($sql, $sqlParameters);
     
        return [];
    }

    private function deleteNote($id) {
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
        $sql = "DELETE FROM notes WHERE userID = :id AND contentID = :contentID";
        $sqlParameters = [':id' => $id, 'contentID' => $contentID];
        $data = $dbConn->executeSQL($sql, $sqlParameters);
        return $data;
    }
 


}