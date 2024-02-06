<?php
/**
 * Token class is an endpoint for user authentication and token generation.
 * It extends the Endpoint class and provides functionality for authenticating users based on
 * provided credentials (email and password) and generating JSON Web Tokens (JWTs) for authentication.
 *
 * @version Antonio Gorgan
 * 
 */

use Firebase\JWT\JWT;

class Token extends Endpoint { 

    private $sql = "SELECT id, password FROM account WHERE email = :email";
    private $sqlParameters = [];

    private function generateJWT($id) { 
        
        $secretKey = SECRET;
        $time = time();
        $payload = [
          'id' => $id,
          'exp'=>strtotime('+ 30 minutes', $time),
        ];
        
        $jwt = JWT::encode($payload, $secretKey, 'HS256');
        
        return $jwt;
      }
    
    public function __construct() {

        switch(Request::method()){
        case 'GET':
        case 'POST':
            $this->checkParameters();
            $dbConn = new Database("db/users.sqlite");

            if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])) {
                throw new ClientError(401);
            }

            if (empty(trim($_SERVER['PHP_AUTH_USER'])) || empty(trim($_SERVER['PHP_AUTH_PW']))) {
                throw new ClientError(401);
            }

            $this->sqlParameters[":email"] = $_SERVER['PHP_AUTH_USER'];
            $data = $dbConn->executeSQL($this->sql, $this->sqlParameters);

            if (count($data) != 1) {
                throw new ClientError(401);
              }

              if (!password_verify($_SERVER['PHP_AUTH_PW'], $data[0]['password'])) {
                throw new ClientError(401);
              }

              $token = $this->generateJWT($data[0]['id']);        
              $data = ['token' => $token];

            parent::__construct($data);
            break;
        default:
            throw new ClientError(405);
            break;
        }
    }
}

