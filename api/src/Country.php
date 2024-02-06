<?php
 /**
 * Country class represents an endpoint for retrieving distinct country information
 * from the 'affiliation' table. 
 * This class extends the Endpoint class and handles the retrieval of unique country names.
 *
 * @author Antonio Gorgan
 *
 */
class Country extends Endpoint
{
    public function __construct()
    {
        $sql = "SELECT  a.country, GROUP_CONCAT(a.authorName, ', ') AS authorName,
                    GROUP_CONCAT(a.city, ', ') AS city
                FROM (SELECT DISTINCT 
                    affiliation.country,
                    author.name AS authorName,
                    affiliation.city
                FROM  affiliation
                LEFT JOIN author ON author.id = affiliation.author) a 
                GROUP BY a.country;";
        $dbConn = new Database("db/chi2023.sqlite");
        $data = $dbConn->executeSQL($sql);
        parent::__construct($data);
    }
}