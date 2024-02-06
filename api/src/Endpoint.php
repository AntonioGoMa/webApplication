<?php
/**
 * Endpoint class serves as a base class for handling API endpoints.
 * It provides basic functionality for setting and retrieving data, as well as
 * checking for allowed parameters.
 *
 * @author Antonio Gorgan
 *
 */

class Endpoint{
    public $data; 

    protected $allowP = [];

    public function __construct($data = ["message" => []]){
        $this->setData($data); 
    }

    protected function setData($data){
        $this->data = $data; 
    }

    public function getData(){
        return $this->data; 
    }

    protected function checkParameters()
    {
        foreach (REQUEST::params() as $key => $value)
        {
            if (!in_array($key, $this->allowP)){
                throw new ClientError(422);
            }
        }
    }
    
}

