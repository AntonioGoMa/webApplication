<?php
/**
 * Response class provides methods for setting HTTP response headers and outputting JSON data.
 * It helps in formatting and sending responses to client requests, including handling CORS headers.
 *
 * @author Antonio Gorgan
 * 
 */
 
class Response
{
    public function __construct()
    {
        $this->outputHeaders();
 
        if (Request::method() == "OPTIONS") {
            exit();
        }
    }
    
    public function outputHeaders()
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization');
    }
    public function outputJSON($data)
    {
        if (empty($data)) {
            
            http_response_code(204);
        }
        echo json_encode($data);
    }

    public static function params(){
        return $_REQUEST;
    }

}
    
