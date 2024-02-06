<?php
/**
 * Autoloader function for dynamically loading PHP class files based on the class name.
 * It follows the PSR-4 naming convention for class and file naming.
 *
 * @autor Antonio Gorgan
 */

function autoloader($className){
    $filename = "src\\" . $className . ".php";
    $filename = str_replace('\\', DIRECTORY_SEPARATOR, $filename);
   if (!is_readable($filename)){
    throw new Exception("File '$filename' does not exists"); 
   }
   require $filename;

}



