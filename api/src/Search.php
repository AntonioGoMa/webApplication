<?php
/**
 * Search class is an endpoint for searching content based on a provided search query.
 * It extends the Endpoint class and allows users to search for content by title or abstract.
 *
 * @author Antonio Gorgan
 * 
 */

class Search extends Endpoint{

    protected $allowP = ["search"]; 

    private $sql = "SELECT content.id as contentID, title, abstract, type.name as contentType, award.name as award
    FROM type LEFT JOIN content ON  (content.type = type.id)
    LEFT JOIN content_has_award ON (content_has_award.content = content.id)
    LEFT JOIN award ON (award.id = content_has_award.award)"; 
   

    private $sqlParameters = [];


    public function __construct(){
        switch(Request::method()){
            case 'GET': 
                $this->checkParameters();
                $this -> buildSQL();
                $dbConn = new Database("db/chi2023.sqlite");
                $data = $dbConn->executeSQL($this->sql, $this->sqlParameters);
                if (empty($data)) {
                    throw new ClientError(204); 
                    http_response_code(204);
                    exit(); 
                }
                break; 
            default: 
                throw new ClientError(405); 
        } 
        parent::__construct($data); 
    } 

    private function buildSQL() {

        $where = false;         
        if (isset(Request::params()['search'])){
            if (is_null(REQUEST::params())){
                throw new ClientError(422);
            }
            $this->sql .= ($where) ? " AND" : " WHERE"; 
            $where = true; 
            $this->sql .= " title LIKE :search OR abstract LIKE :search GROUP by contentID";
            $this->sqlParameters[':search'] = REQUEST::params()['search'] . "%"; 
        } else {
            throw new ClientError(405);
        }


    }

}