<?php
/**
 * 
 * Content class represents an endpoint for retrieving content information, it extends the Endpoint class 
 * and handles GET requests to fetch content data based on provided parameters such as page number and content type.
 *
 * @author Antonio Gorgan
 */

class Content extends Endpoint{

    protected $allowP = ["page", "type"]; 

    private $sql = "SELECT content.id as contentID, title, abstract, type.name as contentType, award.name as award
    FROM content  JOIN type ON  (type.id = content.type)
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
                break; 
            default: 
                throw new ClientError(405); 
        } 
        parent::__construct($data); 
    } 

    private function buildSQL() {

        $where = false; 
        $sum;        
        if (isset(Request::params()['type'])){
            $this->sql .= ($where) ? " AND" : " WHERE"; 
            $where = true; 
            $this->sql .= " contentType LIKE :type";
            $this->sqlParameters[':type'] = REQUEST::params()['type']; 
        }

        if (isset(Request::params()['page'])) {
            $where = true; 

            if (!is_numeric(REQUEST::params()['page'])) {
                throw new ClientError(422);
            }
            if (count(Request::params())>2){
                throw new ClientError(403); 
            }
            $sum = Request::params()['page']; 
            $limit = ($sum - 1) * 20; 
            $this->sql .= " LIMIT 20  OFFSET :limit";
            $this->sqlParameters[":limit"] = $limit;
        }

    }

}