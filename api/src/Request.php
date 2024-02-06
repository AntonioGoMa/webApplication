<?php
/**
 * Request class provides static methods for handling HTTP requests and accessing request data.
 * It includes methods for retrieving the HTTP request method, access point, request parameters,
 * and extracting authorization tokens from headers.
 *
 * @author Antonio Gorgan
 * 
 */

abstract class Request 
{
    public static function method() {
        return $_SERVER['REQUEST_METHOD'];
    }
 
    
    public static function accessPoint(){
        $url = $_SERVER["REQUEST_URI"]; 
        $path = parse_url($url)['path']; 
        return str_replace("/coursework/api", "", $path);
    }
 
    public static function params(){
        return $_REQUEST;
    } 


    public static function getToken()
    {
        $allHeaders = getallheaders();
        $authorizationHeader = "";
                
        if (array_key_exists('Authorization', $allHeaders)) {
            $authorizationHeader = $allHeaders['Authorization'];
        } elseif (array_key_exists('authorization', $allHeaders)) {
            $authorizationHeader = $allHeaders['authorization'];
        }
                
        if (substr($authorizationHeader, 0, 7) != 'Bearer ') {
            throw new ClientError(401);
        }
        
        return trim(substr($authorizationHeader, 7));  
    }

    
}