<?php
/**
 * Preview class represents an endpoint for fetching a limited number of random content previews.
 * It extends the Endpoint class and allows users to specify the number of previews they want to retrieve.
 *
 * @author Antonio Gorgan
 * 
 */

class Preview extends Endpoint {

    protected $allowP = ["limit"]; 

    private $sql = "SELECT title, preview_video FROM content
        WHERE preview_video IS NOT NULL
        ORDER BY RANDOM()"; 

    private $sqlParameters = [];


    public function __construct(){
        switch(Request::method()){
            case 'GET': 
                $this->checkParameters();
                $this -> buildSQL();
                $dbConn = new Database("db/chi2023.sqlite");
                $data = $dbConn->executeSQL($this->sql, $this->sqlParameters);
                break; 
            default: 
                throw new ClientError(405); 
        } 
        parent::__construct($data); 
    } 

    private function buildSQL() {
        if (isset(Request::params()['limit'])) {
            if (!is_numeric(REQUEST::params()['limit'])) {
                if (is_numeric(REQUEST::params()) >1){
                    throw new ClientError(403);
                }
                throw new ClientError(422);
            }
        
            
            $this->sql .= " LIMIT :limit";
            $this->sqlParameters[":limit"] = Request::params()['limit'];
        }
    }
   


}