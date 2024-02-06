
<?php 
/**
 * ClientError class represents custom exceptions for handling client-side errors, it extends the Exception class and provides specific
 * error messages and HTTP response codes for different client errors. 
 *
 * @author Antonio Gorgan
 */
 
class ClientError extends Exception
{
    public function __construct($code)
    {
        parent::__construct($this->errorResponses($code));
    }
 
    public function errorResponses($code)
    {
        switch ($code) {
            case 401:
                $message = 'Token error';
                http_response_code(401);
                break;
            case 404:
                $message = 'Endpoint Not Found';
                http_response_code(404);
                break;
            case 405:
                $message = 'Method Not Allowed';
                http_response_code(405);
                break;
            case 422:
                $message = 'Unprocessable Entity';
                http_response_code(422);
                break;
            case 403:
                $message = 'Cannot use those parameters together';
                http_response_code(403);
                break;
            case 402:
                $message = 'Note is exceeding 255 characters';
                http_response_code(402);
                break;
            case 204:
                $message = 'Word not in content';
                http_response_code(204);
                break;
                
            default:
                throw new Exception('Internal Server Error');
        }
        return $message;
    }
}