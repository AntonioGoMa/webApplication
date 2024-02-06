<?php
/**
 * Database class provides a simple database connection and SQL execution functionality.
 * It uses PDO database connection and allows for executing SQL queries with optional parameters.
 *
 * @author Antonio Gorgan
 */

class Database{ 
    
    private $dbConnection; 

    public function __construct($dbName){
        $this->setDbConnection($dbName);
    }

    private function setDbConnection($dbName){
        try{
            $this->dbConnection = new PDO('sqlite:'.$dbName); 
            $this->dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
        } catch (PDOException $e) {
            $error['message'] =  "Db connection error";
            $error['details'] =  $e-> getMessage();
            echo json_encode($error);
            exit(); 
        }
    }

    public function executeSQL($sql, $params=[]){
        $stmt = $this->dbConnection ->prepare($sql);
        $stmt->execute($params); 
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}