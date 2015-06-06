<?php

/*
 * Copyright (C) 2015 JCore Engineering
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

require_once '../libraries/utilities.php';

if(isset($_GET["geoId"]))
{
    $geoId = $_GET["geoId"];
    
    $i = strpos($geoId, "US");
    if($i !== FALSE)
    {
        $geoId = substr($geoId, $i+2);
    }
    $geoId = ltrim($geoId, '0');
}

/**
 * Description of getEnviroData
 *
 * @author Corey
 */
/*
class EnviroData {
//    public $util = null;
//    
//    public function __construct() {
//        $util = new utilities();
//    }
//    
//            
    public function get()
    {
        $util = new utilities();
        $calenviro = $util->csv_to_array("data/calenvirofinal.csv");
        return $calenviro;
    }
}
*/

if (file_exists('../data/calenvirofinal.csv')) 
{

    $util = new utilities();
    $calenviro = $util->csv_to_array("../data/calenvirofinal.csv");
    
    header('Content-Type: application/json');
    
    if(isset($geoId))
    {
        echo json_encode(array_filter($calenviro, "filterData"));
    }
    else
    {
        echo json_encode($calenviro);
    }

}
else
{
    http_response_code(500);
}

function filterData($row)
{
    global $geoId;
    return($row["Census Tract"] == $geoId);
}
?>