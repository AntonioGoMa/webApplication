<?php

/**
 * This PHP script is used as the entry point for handling API requests and routing them to the appropriate endpoints.
 * It includes autoloading of classes, exception handling, and response handling logic.
 *
 * @author Antonio Gorgan
 * 
 */

ini_set('display_errors', 1); 
    ini_set('display_startup_errors',1); 
    error_reporting(E_ALL); 

include("config/autoloader.php");
spl_autoload_register("autoloader"); 

include ("vendor/autoload.php");


include ("config/exceptionHandler.php");
set_exception_handler("exceptionHandler");

include ("config/settings.php");
include ("src/Response.php");

$response = new Response();

$response -> outputHeaders(); 

$requestAccessPoint = strtolower(Request::accessPoint());

 switch ($requestAccessPoint) {

        case '/':
        case '/developer':
        case '/developer/':
            $endpoint = new Developer();
            break;
        
        case '/country':
        case '/country/':
            $endpoint = new Country();
            break;
        
        case '/preview':
        case '/preview/':
            $endpoint = new Preview();
            break;
        
        case '/author':
        case '/author/':
            $endpoint = new AuthorAndAffiliation();
            break;
        case '/content':
        case '/content/':
            $endpoint = new Content();
            break;
        case '/token':
        case '/token/':
            $endpoint = new Token();
            break;
        case '/note':
        case '/note/':
            $endpoint = new Note(); 
            break;
        case '/search':
        case '/search/':
            $endpoint = new Search(); 
            break;
        case '/rate':
        case '/rate/':
            $endpoint = new Rating(); 
            break;
                
        
        default:
        throw new ClientError(404);
        
 } 
 
 //catch (ClientError $e) {
 //   $data = ['message' => $e->getMessage()];
 //   $endpoint = new Endpoint($data);
 //}




$data = $endpoint->getData();  

$response -> outputJSON($data);
