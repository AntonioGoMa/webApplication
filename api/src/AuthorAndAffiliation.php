<?php

/**
 * AuthorAndAffiliation class represents an endpoint for retrieving author information
 * along with their affiliations and related content.
 *
 * Furthermore the class extends the Endpoint class and handles GET requests to fetch author
 * data based on provided parameters such as content and country.
 * 
 * @author Antonio Gorgan
 * 
 *  */

class AuthorAndAffiliation extends Endpoint{ 

    protected $allowP = ["content", "country"]; 

    private $sql = "SELECT author.id as authorID, name as authorName,city,country, institution,content as contentID, content.title
    FROM affiliation  JOIN author 
    ON  (author.id = affiliation.author)
    JOIN content 
    ON (affiliation.content = content.id)"; 

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

        $where = false;         
        if (isset(Request::params()['content'])) {
            if (!is_numeric(REQUEST::params()['content'])) {
                throw new ClientError(422);
            }
            if (count(Request::params())>1){
                throw new ClientError(403); 
            }
            $this->sql .= " WHERE contentID = :content";
            $this->sqlParameters[":content"] = Request::params()['content'];
        }
        if (isset(Request::params()['country'])){
            $this -> sql .= ($where) ? " AND" : " WHERE"; 
            $where = true; 
            $this ->sql .= " country LIKE :country";
            $this-> sqlParameters[':country'] = REQUEST::params()['country'] . "%"; 
        }
    }
}

