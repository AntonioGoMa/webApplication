
<?php

/**
 * Custom exception handler function for handling uncaught exceptions in the application.
 * It formats and outputs error details in JSON format.
 *
 * @author Antonio Gorgan
 */
 
function exceptionHandler($e) {
   $output['message'] = "Internal Server Error";
   $output['details']['exception'] = $e->getMessage();
   $output['details']['file'] = $e->getFile();
   $output['details']['line'] = $e->getLine();
   echo json_encode($output);
   exit();
}