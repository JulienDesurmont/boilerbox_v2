<?php
// src/Ipc/OutilBundle/Services/ServiceVerificationDB.php

namespace Ipc\OutilsBundle\Services;

use Ipc\ProgBundle\Entity\Donnee;
use Ipc\ProgBundle\Entity\Configuration;

// Service qui vérifie le nombre de données dans la BD indiquée sur les X derniers jours
class ServiceVerificationDB {

private $srv_doctrine;
private $dbh;
private $em;
private $database_name;
private $srv_logs;
private $nb_jours;


	public function __construct($doctrine, $connexion, $database_name, $srv_logs) {
		$this->doctrine 	 = $doctrine;
		$this->em 			 = $doctrine->getManager(); 
		$this->dbh 			 = $connexion->getDbh();
		$this->database_name = $database_name; 
		$this->srv_logs 	 = $srv_logs;
	}


	
	// retourne l'entité du paramètre nombre de jours pour la recherche du nombre de données en DB
	// Créée l'entité si elle n'existe pas avec comme valeur par défaut : 3 
	public function getEntityParamNbJours() {
		$ent_configuration = $this->em->getRepository('IpcProgBundle:Configuration')->findOneByParametre('nb_jours_nb_db_donnees');
		if (! $ent_configuration) {
            $ent_configuration = new configuration();
            $ent_configuration->setParametre('nb_jours_nb_db_donnees');
            $ent_configuration->setDesignation('Nombre de jours pour la recherche du nombre de données dans la table t_donnee');
            $ent_configuration->setValeur('3');
            $ent_configuration->setParametreAdmin(true);
            $ent_configuration->SqlInsert($this->dbh);
        }
		return($ent_configuration);
	}



    // Inscrit le  nombre de données (de la table t_donnee) des X derniers jours de la DB en cours d'utilisation dans la table t_configuration dans le paramètre de configuration 'Nb_DB_Donnees'
    public function setSqlNbDBDonnees($nb_jours=null) {
		$date_du_jour = date('d/m/Y');
        $nb_db_donnees = $this->getSqlNbDBDonnees($nb_jours, $this->database_name);
        $ent_configuration = $this->em->getRepository('IpcProgBundle:Configuration')->findOneByParametre('nb_db_donnees');
        if ($ent_configuration) {
            $ent_configuration->setValeur($date_du_jour.';'.$nb_db_donnees);
            $ent_configuration->SqlUpdateValue($this->dbh);
        } else {
            $ent_configuration = new configuration();
            $ent_configuration->setParametre('nb_db_donnees');
            $ent_configuration->setDesignation('Nombre de données en table t_donnee sur les X derniers jours');
            $ent_configuration->setValeur($date_du_jour.';'.$nb_db_donnees);
            $ent_configuration->setParametreAdmin(true);
            $ent_configuration->SqlInsert($this->dbh);
        }
		$fichier_log = 'parametresIpc.log';
		$message_log = "Recherche du $date_du_jour;Base de donnée [".$this->database_name."];Sur les ".$this->nb_jours." derniers jours;Nombre de données dans la table t_donnee=$nb_db_donnees";
		$this->srv_logs->setLog($message_log, $fichier_log);
    }


	// Compte le nombre de données (de la table t_donnee) des X derniers jours de la DB en cours d'utilisation
	// Le X est donnée par la variable de configuration [nb_jours_nb_db_donnees]
	public function getSqlNbDBDonnees($nb_jours=null, $database=null) {
		if ($nb_jours == null) {
			$ent_configuration = $this->getEntityParamNbJours();
			$nb_jours = $ent_configuration->getValeur();
		}		
		$this->nb_jours = $nb_jours;
		if ($database == null) {
            $database = $this->database_name;
        }
		$rep_nb_db_donnees = null;
		$rep_nb_db_donnees = $this->em->getRepository('IpcProgBundle:Donnee')->myCountDonneesFromDB($this->dbh, $database, $nb_jours);
        return($rep_nb_db_donnees);
    }






	// Compare le nombre de données des 2 bases passées en paramètres. Retourne le numéro de la base ayant le plus de données.
	// Retourne 0 si le nombre de données est identique entre les deux bases
	// Retourne -1 si une erreur non prévue est levéé	
	public function compareNbDBDonnees($database1, $database2) {
		$message_retour = null;

		$ent_configuration = $this->getEntityParamNbJours();
		$nb_jours = $ent_configuration->getValeur();

		$valeur_DB1 = $this->getSqlNbDBDonnees($nb_jours, $database1);
		$valeur_DB2 = $this->getSqlNbDBDonnees($nb_jours, $database2);
		if ($valeur_DB1 == $valeur_DB2) {
			return(0);
		} else if ($valeur_DB1 > $valeur_DB2) {
			return(1);
		} else if ($valeur_DB1 < $valeur_DB2) {
			return(2);
		} else {
			// Erreur 
			return(-1);
		}
	}

}
