<?php
//src/Ipc/ProgBundle/Services/Connexion/Connexion.php
namespace Ipc\ProgBundle\Services\Connexion;

use \PDO;
use \PDOException;

class ServiceConnexion {
private $dbh;
private $base;
private $chemin_socket;

public function __construct($nom_de_base, $chemin_socket) {
	try {
		$this->base = $nom_de_base;
		$this->chemin_socket = $chemin_socket;

        $base = $this->base;
		$chemin_socket = $this->chemin_socket;
		
		//$this->dbh = new PDO('mysql:host=127.0.0.1;dbname=ipc', 'cargo', 'adm5667');
		$this->dbh = new PDO("mysql:dbname=$base;unix_socket=$chemin_socket", 'cargo', 'adm5667');
		$this->dbh->exec('SET CHARACTER SET UTF-8');
		$this->dbh->exec('SET NAMES utf8');
	} catch (PDOException $e) {
		echo $e->getMessage();
		$this->dbh = null;
	}
}

public function getDbh() {
	return $this->dbh;
}

public function connect() {
	try {
		$base = $this->base;
		$chemin_socket = $this->chemin_socket;

		//$this->dbh = new PDO('mysql:host=127.0.0.1;dbname=ipc', 'cargo', 'adm5667');
		$this->dbh = new PDO("mysql:dbname=$base;unix_socket=$chemin_socket", 'cargo', 'adm5667');
		$this->dbh->exec('SET CHARACTER SET UTF-8');
        $this->dbh->exec('SET NAMES utf8');
	} catch (PDOException $e) {
		echo $e->getMessage();
		$this->dbh = null;
	}
	return($this->dbh);
}

public function disconnect() {
	$this->dbh = null;
	return(null);
}

}
