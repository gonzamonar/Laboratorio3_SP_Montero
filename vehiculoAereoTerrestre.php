<?php


header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

sleep(3);

if($method == "GET") {
    echo '[{"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},{"id":51, "modelo":"Dodge Viper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},{"id":67, "modelo":"Boeing CH-47 Chinook", "anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},{"id":666, "modelo":"Aprilia RSV 1000 R", "anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},{"id":872, "modelo":"Boeing 747-400", "anoFab":1989, "velMax":988, "altMax":13, "autonomia":13450},{"id":742, "modelo":"Cessna CH-1 SkyhookR", "anoFab":1953, "velMax":174, "altMax":3, "autonomia":870}]';
    die();
}




if($method == "DELETE") {
    $objeto = json_decode(file_get_contents('php://input'), true);

    if (isset($objeto['id'])==false || $objeto['id'] == 666 || $objeto['id'] == "666") {
        http_response_code(400);
        echo "Error No se pudo procesar";
        die();
    }
    
    echo "Exito";
    die();
}


if($method == "POST") {
    $objeto = json_decode(file_get_contents('php://input'), true);

    $estTerrestre=1;
    $estAereo=1;

    if (isset($objeto['id'])==false || isset($objeto['anoFab'])==false || isset($objeto['velMax'])==false || isset($objeto['cantRue'])==false || isset($objeto['cantPue'])==false)   {
        $estTerrestre=0;
    }

    if (isset($objeto['id'])==false || isset($objeto['anoFab'])==false || isset($objeto['velMax'])==false || isset($objeto['altMax'])==false || isset($objeto['autonomia'])==false)   {
        $estAereo=0;
    }

    if ($estAereo==0 && $estTerrestre==0){
        http_response_code(400);
        echo "Estructura Incorrecta";
        die();
    }
    
    
    if ($objeto['id']==666) {
        http_response_code(400);
        echo "Error No se pudo procesar";
        die();
    }
    
    echo "Exito";
    die();
}


if($method == "PUT") {
    $objeto = json_decode(file_get_contents('php://input'), true);
    $estTerrestre=1;
    $estAereo=1;

    if (isset($objeto['modelo'])==false || isset($objeto['anoFab'])==false || isset($objeto['velMax'])==false || isset($objeto['cantRue'])==false || isset($objeto['cantPue'])==false)   {
        $estTerrestre=0;
    }

    if (isset($objeto['modelo'])==false || isset($objeto['anoFab'])==false || isset($objeto['velMax'])==false || isset($objeto['altMax'])==false || isset($objeto['autonomia'])==false)   {
        $estAereo=0;
    }
   
    if ($estAereo==0 && $estTerrestre==0){
        http_response_code(400);
    //    $s=$objeto['nombre']. $objeto['apellido'].$objeto['edad'].$objeto['titulo'].$objeto['facultad'].$objeto['anoGraduacion']; 
        echo "Estructura Incorrecta";
        die();
    }

    $s = (string)time();
    echo '{"id":' . $s . "}";
    die();
}

?>