<?php
/**
 * Developer class represents an endpoint providing information about the developer.
 * It extends the Endpoint class and returns the student's name and ID.
 *
 * @author Antonio Gorgan
 *
 */
class Developer extends Endpoint{ 

    public function __construct()
    {
        $data['studentName'] = "Antonio Gorgan"; 
        $data['studentID'] = "W20021570";
        parent::__construct($data);
    }
  }


