<?php 
//src/Ipc/ProgBundle/Services/Session/ServiceSession.php
//Service permettant la gestion de sessions différentes en fonction de l'affaire du site analysé
namespace Ipc\ProgBundle\Services\Session;

use Ipc\ProgBundle\Entity\Site;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Attribute\AttributeBag;

use Ipc\ProgBundle\Entity\Genre;
use Ipc\ProgBundle\Entity\Module;
use Ipc\ProgBundle\Entity\Localisation;


class ServiceSession {
protected $dbh;
protected $session;
protected $nom_de_session;
protected $tab_sessions;
protected $securityContext;
protected $service_fill_numbers;
protected $doctrine;
protected $service_traduction;

protected $liste_genre_en_base;
protected $liste_genre;


public function __construct($connexion, $securityContext, $doctrine, Session $session, $service_fill_numbers, $service_traduction) {
	$this->dbh = $connexion->getDbh();
	$this->session = $session;
	$this->securityContext = $securityContext;
	$this->service_fill_numbers = $service_fill_numbers;
	$this->doctrine = $doctrine;
	$this->service_traduction = $service_traduction;

	// Création du bag de session courante si il n'existe pas déjà
    $this->nom_de_session = $this->session->get('nom_session_courante', array());
	if ($this->nom_de_session == null) {
		$this->nom_de_session = $this->nouvelleSession();
	}
    if (! $this->session->has($this->nom_de_session)) {
        $bag_session_courante = new AttributeBag();
        $bag_session_courante->setName($this->nom_de_session);
		$this->saveSession($bag_session_courante);
    }
}

public function getSessionName(){
	return $this->session->get('nom_session_courante', array());
}

// Récupération du bag de la session courante
public function getSessionCourante(){
	$bag_session_courante = $this->session->get($this->nom_de_session);
	return $bag_session_courante;
}

// Enregistrement du bag de la session courante
public function saveSession($bagSession){
	$this->session->set($this->nom_de_session, $bagSession);	
}

// Définition d'une variable dans le bag de la session courante
public function __set($variable, $valeur_variable) {
	$bag_session_courante = $this->getSessionCourante();
	$bag_session_courante->set($variable, $valeur_variable);
	$this->saveSession($bag_session_courante);
}

// Récupération d'une variable depuis le bag de la session courante
public function __get($variable){
    $bag_session_courante = $this->getSessionCourante();
    if ($bag_session_courante->get($variable) == null) {
        return array();
    } else {
        return $bag_session_courante->get($variable);
    }
}

// Récupération d'une variable depuis le bag de la session courante
public function get($variable){
    $bag_session_courante = $this->getSessionCourante();
	if ($bag_session_courante->get($variable) == null) {
		if ($variable == 'label'){
			$label = $this->securityContext->getToken()->getUser();
			$this->set($variable, $label);
			return $label;
		} else {
			return array();
		}
	} else {
		return $bag_session_courante->get($variable);
	}
}


public function getStr($variable){
    $bag_session_courante = $this->getSessionCourante();
        if ($bag_session_courante->get($variable) == null) {
                if ($variable == 'label'){
                        $label = $this->securityContext->getToken()->getUser();
                        $this->set($variable, $label);
                        return $label;
                } else {
                        return '';
                }
        } else {
                return $bag_session_courante->get($variable);
        }
}


// Définition d'une variable dans le bag de la session courante
public function set($variable, $valeur_variable) {
    $bag_session_courante = $this->getSessionCourante();
    $bag_session_courante->set($variable, $valeur_variable);
    $this->saveSession($bag_session_courante);
}


public function remove($variable){
    $bag_session_courante = $this->getSessionCourante();
    $bag_session_courante->remove($variable);
	$this->saveSession($bag_session_courante);
}

// Création d'une nouvelle session
public function nouvelleSession($nom_de_session = 'session_1'){
	// Récupération du tableau des sessions
	$tab_sessions = $this->session->get('tab_sessions_ipc', array());
	// Vérification que le bag de session n'existe pas déjà : Si il n'existe pas création du bag et ajout du nom au tableau des sessions
	$this->nom_de_session = $nom_de_session;
    if (! $this->session->has($this->nom_de_session)) {
        $bag_session_courante = new AttributeBag();
        $bag_session_courante->setName($this->nom_de_session);
        $this->saveSession($bag_session_courante);
		array_push($tab_sessions, $this->nom_de_session);
		$this->session->set('tab_sessions_ipc', $tab_sessions);
    }
	$this->changeSession($this->nom_de_session);
}

// Changement de session
public function changeSession($nom_de_session){
	$this->session->set('nom_session_courante', $nom_de_session);
}

// Retourne la liste des sessions existantes
public function getTabSessions(){
	$tab_sessions = $this->session->get('tab_sessions_ipc', array());
	return $tab_sessions;
}




public function definirTabModuleL() {
    // Initialisation de la liste des modules
    //      Pour un compte Client, Si tous les genres ne sont pas autorisés : Récupération des modules dont le genre est autorisé
    //      Recupération de la liste des modules sous la forme :        IdModule => 'intitule'  -> intitulé de la famille de module
    //                                                                           => 'message'   -> message du module
    //                                                                           => 'genre'     -> id du genre du module
    //      Parcours de la liste des modules : pour chaque localisation on vérifie qu'un lien module/localisation existe :
    //                                          Pour prendre en compte le module
    //                                          Pour incrémenter la variable $tabModulesL[$module['id']]['tabLocalisations'][]
	$this->definirListeDesGenres();
	$correspondance_message_code = array();
	$tabModulesL = array();
	$param_popup_simplifiee = $this->doctrine->getManager()->getRepository('IpcProgBundle:Configuration')->getValueOf('popup_simplifiee');
    if (count($this->__get('tabModules')) == 0) {
        $tmp_module = new Module();
        // Récupération de tous les modules de la base de donnée
        $tmp_liste_modules = $tmp_module->SqlGetModulesGenreAndUnit($this->dbh);
        foreach ($tmp_liste_modules as $module) {
			/*
            //  Pour le compte client : Récupération des modules dont le genres fait partis de la liste des genres autorisés
            if (! $this->securityContext->isGranted('ROLE_TECHNICIEN')) {
                // Pour chaque localisation du site courant, vérification qu'un lien module/localisation existe en base
                foreach ($this->liste_localisations as $localisation) {
                    $tmpNbLien = $tmp_module->sqlGetNbLien($this->dbh, $module['id'], $localisation['id']);
                    if ($tmpNbLien != 0) {
                        // Si pour le client tous les genres sont autorisés : Récupération de tous les modules
                        if (count($this->liste_genres_en_base) == count($this->liste_genres)) {
                            if (! array_key_exists($module['id'], $tabModulesL)) {
								if ($this->ajoutModuleAuTableau($module['hasDonnees'], $param_popup_simplifiee) === true) {
                                	$correspondance_message_code[$module['id']] = $module['categorie'].$this->service_fill_numbers->fillNumber($module['numeroModule'],2).$this->service_fill_numbers->fillNumber($module['numeroMessage'],2);
                                	$tabModulesL[$module['id']]['intitule'] = $this->service_traduction->getTraduction($module['intituleModule']);
                                	$tabModulesL[$module['id']]['message'] = $this->service_traduction->getTraduction($module['message']);
                                	$tabModulesL[$module['id']]['genre'] = $module['idGenre'];
                                	$tabModulesL[$module['id']]['unite'] = $module['unite'];
                                	$tabModulesL[$module['id']]['localisation'][] = $localisation['id'];
								}
                            } else {
                                $tabModulesL[$module['id']]['localisation'][] = $localisation['id'];
                            }
                        } else {
                            // Si pour le client quelques genres sont autorisés : Recupération des modules ayants les genres autorisés
                            foreach ($this->liste_genres as $key2 => $genre) {
                                if ($module['idGenre'] == $genre['id']) {
                                    if (! array_key_exists($module['id'],$tabModulesL)) {
										if ($this->ajoutModuleAuTableau($module['hasDonnees'], $param_popup_simplifiee) === true) {
                                        	$correspondance_message_code[$module['id']] = $module['categorie'].$this->service_fill_numbers->fillNumber($module['numeroModule'],2).$this->service_fill_numbers->fillNumber($module['numeroMessage'], 2);
                                        	$tabModulesL[$module['id']]['intitule'] = $this->service_traduction->getTraduction($module['intituleModule']);
                                        	$tabModulesL[$module['id']]['message'] = $this->service_traduction->getTraduction($module['message']);
                                        	$tabModulesL[$module['id']]['genre'] = $module['idGenre'];
                                        	$tabModulesL[$module['id']]['unite'] = $module['unite'];
                                        	$tabModulesL[$module['id']]['localisation'][] = $localisation['id'];
										}
                                    } else {
                                        $tabModulesL[$module['id']]['localisation'][] = $localisation['id'];
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
			*/
                // Pour les techniciens et les administrateurs : Récupération de tous les modules ayant un lien avec les localisations du site courant
                //   Ajout 1.29.0 : En fonction d'un parametre de configuration : Recherche des modules liés à la localisation ET qui ont au moins une donnée enregistrée en base
                foreach ($this->liste_localisations as $localisation) {
                    $tmpNbLien = $tmp_module->sqlGetNbLien($this->dbh, $module['id'], $localisation['id']);
                    if ($tmpNbLien != 0) {
                        if (! array_key_exists($module['id'], $tabModulesL)) {
							if ($this->ajoutModuleAuTableau($module['hasDonnees'], $param_popup_simplifiee) === true) {
                                $correspondance_message_code[$module['id']] = $module['categorie'].$this->service_fill_numbers->fillNumber($module['numeroModule'], 2).$this->service_fill_numbers->fillNumber($module['numeroMessage'], 2);
                                $tabModulesL[$module['id']]['intitule'] = $this->service_traduction->getTraduction($module['intituleModule']);
                                $tabModulesL[$module['id']]['message'] = $this->service_traduction->getTraduction($module['message']);
                                $tabModulesL[$module['id']]['genre'] = $module['idGenre'];
                                $tabModulesL[$module['id']]['unite'] = $module['unite'];
                                $tabModulesL[$module['id']]['localisation'][] = $localisation['id'];
                            }
                        } else {
                            $tabModulesL[$module['id']]['localisation'][] = $localisation['id'];
                        }
                    }
                }
            /*
			}
			*/
        }
    } else {
        $tabModulesL = $this->__get('tabModules');
        //      Tableau de clé IDModule et de valeurs : CATEGORIE.NumMODULE.NumMESSAGE
        $correspondance_message_code = $this->__get('correspondance_Message_Code');
    }
	$this->__set('tabModules', $tabModulesL);
	$this->__set('correspondance_Message_Code', $correspondance_message_code);
	return(0);
}


// Initialisation de la liste des genres
//      Récupération de la liste des genres présents en base de données
//      Retour sous forme d'un tableau de tableau       array(id => X,intitule_genre => X)
//      Création de la variable de session 'tabgenres' si elle n'existe pas
//
//      Récupération de la liste des genres autorisés au client (Par défaut la liste correspond à l'ensemble des genres présent en base)
//      Parmis tous les genres présents en base de donnée : Suppression des genres dont l'id ne fait pas partie de la liste des id des genres autorisés
//      Le compte client est défini par l'absence d'autorisation Technicien
//      Création de la variable de session 'session_genrel_autorise' si elle n'existe pas
public function definirListeDesGenres() {
	if (count($this->__get('tabgenres')) == 0) {
		$tmp_genre = new Genre();
        $this->liste_genres_en_base = $tmp_genre->SqlGetAllGenre($this->dbh);
        $this->__set('tabgenres', $this->liste_genres_en_base);
	} else {
        $this->liste_genres_en_base = $this->__get('tabgenres');
    }

	if (count($this->__get('session_genrel_autorise')) == 0) {
        $liste_genres = $this->liste_genres_en_base;
		if (! $this->securityContext->isGranted('ROLE_TECHNICIEN')) {
            // Compte CLIENT : Genres autorisés pour la partie listing
            $configuration = $this->doctrine->getManager()->getRepository('IpcProgBundle:Configuration')->findOneByParametre('autorisation_genres_listing');
            if (! $configuration) {
                $this->get('session')->getFlashBag()->add('info',"Paramètre de configuration [autorisation_genres_listing] non trouvé");
                return(false);
            }
            $tmp_valeur_conf = $configuration->getValeur();
            // Création du tableau des genres autorisés
            $tmp_tab_genres_autorises = explode(',', $tmp_valeur_conf);
            // Suppression des genres ne faisant pas partie des genres autorisés du tableau des genres de la base
            foreach ($liste_genres as $key => $genre) {
                if (! in_array($genre['id'], $tmp_tab_genres_autorises)) {
                    unset($liste_genres[$key]);
                }
            }
        }
        $this->__set('session_genrel_autorise', $liste_genres);
		$this->liste_genres = $liste_genres;
    }

    if (count($this->__get('session_genreg_autorise')) == 0) {
        $liste_genres = $this->liste_genres_en_base;
        if (! $this->securityContext->isGranted('ROLE_TECHNICIEN')) {
            // Compte CLIENT : Genres autorisés pour la partie listing
            $configuration = $this->doctrine->getManager()->getRepository('IpcProgBundle:Configuration')->findOneByParametre('autorisation_genres_graphique');
            if (! $configuration) {
                $this->get('session')->getFlashBag()->add('info',"Paramètre de configuration [autorisation_genres_graphique] non trouvé");
                return(false);
            }
            $tmp_valeur_conf = $configuration->getValeur();
            // Création du tableau des genres autorisés
            $tmp_tab_genres_autorises = explode(',', $tmp_valeur_conf);
            // Suppression des genres ne faisant pas partie des genres autorisés du tableau des genres de la base
            foreach ($liste_genres as $key => $genre) {
                if (! in_array($genre['id'], $tmp_tab_genres_autorises)) {
                    unset($liste_genres[$key]);
                }
            }
        }
        $this->__set('session_genreg_autorise', $this->liste_genres);
		$this->liste_genres = $liste_genres;
    }

}



// Initialisation des listes de localisation : Récupération des localisations associées au site courant
public function definirListeLocalisationsCourantes() {
    if (count($this->__get('tablocalisations')) == 0) {
        $tmp_site = new Site();
        $tmp_localisation = new Localisation();
        $site_id = $tmp_site->SqlGetIdCourant($this->dbh);
        $this->liste_localisations = $this->doctrine->getManager()->getRepository('IpcProgBundle:Localisation')->SqlGetLocalisation($this->dbh, $site_id);
    } else {
        $this->liste_localisations = $this->__get('tablocalisations');
    }
	$this->__set('tablocalisations', $this->liste_localisations);
	return(0);
}

private function ajoutModuleAuTableau($hasDonnee, $popupSimplifiee) {
	// Si la popup ne doit pas être simplifiée, enregistrement du module dans le tableau
	if ($popupSimplifiee == false) {
		return true;
	}
	// Si la popup doit être simplifié et que le module à au moins une donnée rnregistrée en base : enregistrement du module
	if ($hasDonnee == true) {
		return true;
	}
	// Sinon pas d'enregistrement
	return false;
}

public function reinitialisationSession($type) {
	$bag_session_courante = $this->getSessionCourante();
    if ($type == 'localisations_modules') {
        // Réinitialisation des variables de session
		$bag_session_courante->remove('tablocalisations');
		$bag_session_courante->remove('tabModules');
		$bag_session_courante->remove('correspondance_Message_Code');
    }
    if ($type == 'liste_des_requetes') {
		$bag_session_courante->remove('tabModules');
		$bag_session_courante->remove('liste_req');
		$bag_session_courante->remove('liste_req_pour_listing');
		$bag_session_courante->remove('liste_req_pour_graphique');
    }
	$this->saveSession($bag_session_courante);
	return 0;
}


}

