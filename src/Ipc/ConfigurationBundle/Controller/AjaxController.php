<?php
//src/Ipc/ConfigurationBundle/Controller/AjaxController.php

namespace Ipc\ConfigurationBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request; 
use Symfony\Component\Form\FormBuilder;
use Ipc\ProgBundle\Entity\Site;
use Ipc\ProgBundle\Entity\Localisation;

class AjaxController extends Controller {
private $liste_localisations;
private $last_loc_graph_id;
private $session;
private $connexion;
private $dbh;
private $em;

public function constructeur(){
    if (empty($this->session)) {
        $service_session = $this->container->get('ipc_prog.session');
        $this->session = $service_session;
    }
	$this->em = $this->getDoctrine()->getManager();
}


public function initialisationListe() {
	$this->connexion = $this->get('ipc_prog.connectbd');
	$this->dbh = $this->connexion->getDbh();
	// Initialisation des listes de localisation
	if (count($this->session->get('tablocalisations')) == 0) {
		$tmp_site = new Site();
		$tmp_localisation = new Localisation();
		$site_id = $tmp_site->SqlGetIdCourant($this->dbh);
		$this->liste_localisations = $this->getDoctrine()->getManager()->getRepository('IpcProgBundle:Localisation')->SqlGetLocalisation($this->dbh, $site_id);
		$this->session->set('tablocalisations', $this->liste_localisations);
	} else {
		$this->liste_localisations = $this->session->get('tablocalisations');
	}
	if ($this->liste_localisations == null) {
		$this->get('session')->getFlashBag()->add('info', "AAA Aucune Localisation définie pour le site courant");
		return false;
	}
	// Récupération de la dernière localisation entrée pour la réafficher par défaut dans la popup
	$this->last_loc_graph_id = $this->session->get('last_loc_graph_id');
	// Si il n'y a pas eu de requête enregistrée, la localisation par défaut est la première de la liste
	if (empty($this->last_loc_graph_id)) {
		$this->last_loc_graph_id = $this->liste_localisations[0]['id'];
	}
	//$this->dbh = $connexion->disconnect();
	return(0);
}


//	Fonction Ajax qui retourne la liste des modules d'en-tête live en fonction du type de générateur de la localisation selectionnée dans la page ["addDonneeLive.html.twig"]
public function getTypeGenerateurAction() {
	$this->constructeur();
	$em = $this->getDoctrine()->getManager();
	$idLocalisation = $_GET['idLocalisation'];
	$localisation = $em->getRepository('IpcProgBundle:Localisation')->find($idLocalisation);
	// Définition de la variable de session Localisation
	$this->session->set('last_loc_graph_id', $idLocalisation);
	// Récupération de la liste des En-tête de module associés à la localisation courante
	$tabDesEnteteLive = array();
	$entities_moduleEnTeteAssocies = $localisation->getTypeGenerateur()->getModulesEnteteLive();
	foreach ($entities_moduleEnTeteAssocies as $entity_moduleEnTeteAssocies) {
		$tabDesEnteteLive[$entity_moduleEnTeteAssocies->getDesignation()] = $entity_moduleEnTeteAssocies->getDescription();
	}
	$entitiesTuile = $em->getRepository('IpcProgBundle:donneeLive')->findBy(array('localisation' => $localisation), array('categorie'=>'ASC', 'label' => 'ASC'));
	$tabEntitiesTuile = array();
	foreach ($entitiesTuile as $entityTuile) {
		$tabEntitiesTuile[$entityTuile->getId()] = array();
        if ($entityTuile->getPlacement() != 'enTete') {
        	$tabEntitiesTuile[$entityTuile->getId()]['label'] = $entityTuile->getLabel();
            $tabEntitiesTuile[$entityTuile->getId()]['placement'] = '['.$entityTuile->getCategorie()->getDesignation().']';
        } else {
            $tabEntitiesTuile[$entityTuile->getId()]['label'] = substr($entityTuile->getFamille(), 6);
            $tabEntitiesTuile[$entityTuile->getId()]['placement'] = 'En-tête';
        }
	}
	$tabRetour = array();
	$tabRetour[0] = $tabDesEnteteLive;
	$tabRetour[1] = $tabEntitiesTuile;
	echo json_encode($tabRetour);
	return(new Response());
}

//	Fonction Ajax qui modifie la crontab du script passé en paramètre
public function setScriptAction() {
    $this->constructeur();
	$document_root = getenv("DOCUMENT_ROOT");
	echo "set";
	$action = $_GET['action'];
	switch ($action) {
	case 'activation':
		// Start script
		$script = 's'.strtolower($_GET['script']);
		$commande = $document_root."/web/sh/GestionSystem/gestionScripts.sh $script";
		exec($commande);
		break;
	case 'desactivation':
		// Arrêt du script
		$script = 'a'.strtolower($_GET['script']);
		$commande = $document_root."/web/sh/GestionSystem/gestionScripts.sh $script";
		exec($commande);
		echo "Desactivation : $commande";
		break;
	}
	return new Response();
}

//	Fonction ajax qui réinitialise les couleurs par défauts
public function reinitColorGenresAction() {
    $this->constructeur();
	//	Lit de fichier des couleurs : Structure du fichier NuméroDeGenre=>Couleur
	$chemin_fichier_couleur = __DIR__.'/../../../../web/docs/couleursGenres.txt';
	$fichier_couleur = fopen($chemin_fichier_couleur, 'r');
	$em	= $this->getDoctrine()->getManager();
	while ($ligne = fgets($fichier_couleur)) {
		$pattern_couleur = '/^(.+?);(.+?)$/';
		// Récupération du numéro du genre et de sa couleur associée.
		if (preg_match($pattern_couleur, $ligne, $tab_couleur)) {
			$numero_genre = $tab_couleur[1];
			$couleur = $tab_couleur[2];
			// Mise à jour de la couleur si elle exise en base de donnée
			$entity_genre = $em->getRepository('IpcProgBundle:Genre')->findOneByNumeroGenre($numero_genre);
			if (isset($entity_genre)) {
				$entity_genre->setCouleur($couleur);
			}
		}
	}
	$em->flush();
	fclose($fichier_couleur);
	return new Response();
}

public function setSiteCourantAction() {
    $this->constructeur();
	$this->initialisationListe();
	$service_configuration = $this->get('ipc_prog.configuration');
	$site = new Site();
	// Modification du site courant
	$id = intval(htmlspecialchars($_GET['idconf']));
	$site->setId($id);
	$siteCourant = true;
	// Le précédent Site courant passe à false et sa date de fin d'exploitation est mise à jour
	$id_site = $site->SqlGetIdCourant($this->dbh);
	if ($id_site) {
		$site->SqlUncheck($this->dbh, $id_site, $site->getDebutExploitationStr());
	}
	$site->SqlActive($this->dbh);
	// Modification du titre indiquant le site courant
	$site = $this->getDoctrine()->getManager()->getRepository('IpcProgBundle:Site')->find($id);
	$new_session_pageTitle['title'] = $site->getAffaire().' : '.$site->getintitule();
	$this->session->set('pageTitle', $new_session_pageTitle);
	$service_configuration->setInfoLimitePeriode();
	$this->session->remove('session_date');
	$this->session->remove('tabModules');
	$this->session->remove('liste_req');
	$this->session->remove('liste_req_pour_listing');
	$this->session->remove('liste_req_pour_graphique');
	$this->session->remove('tablocalisations');
	$this->deconnexionDbh();
	return $this->container->get('templating')->renderResponse('IpcProgBundle:Prog:enTete.html.twig');
}

private function deconnexionDbh() {
	$this->dbh = $this->connexion->disconnect();
}

//	Définie la variable de session indiquant la localisation choisie pour l'ajout de nouvelles requêtes
//	Utilisée par les pages Listing et Graphique
//	Modification de la variable de session choixLocalisationPopup avec l'identifiant de la localisation choisie dans les popups
public function setAndGetChoixLocalisationAction() {
    $this->constructeur();
	$choixLocalisation = $_GET['localisation'];
	if ($choixLocalisation === 'get') {
		$idLocalisation = $this->session->get('choixLocalisationPopup');
		echo $idLocalisation;
	} else {
		$this->session->set('choixLocalisationPopup', $choixLocalisation);
	}
	return new Response();
}

// Fonction qui permet de modifier la variable listing_requete_selected (ou graphique_requete_selected) avec l'id de la requête à afficher
public function selectRequestAction($page) {
	$this->constructeur();
	$this->session->set($page.'_requete_selected', $_GET['id_requete']);
	return new Response();
}

public function deleteRequestAction($page) {
    $this->constructeur();
    $nomUtilisateur = $_GET['compte'];
    if (empty($nomUtilisateur)) {
        if (! $this->get('security.context')->isGranted('ROLE_TECHNICIEN')){
            $nomUtilisateur = 'Client';
        } else {
            if ($this->session->get('label') == null) {
                $nomUtilisateur = str_replace(' ', '_nbsp_', $this->get('security.context')->getToken()->getUser());
            } else {
                $nomUtilisateur = str_replace(' ', '_nbsp_', $this->session->get('label'));
            }
        }
    }
    $nomRequetes = str_replace(' ', '_nbsp_', $_GET['nom']);
    // Suppression du fichier 
    $nomFichier =  __DIR__.'/../../../../web/uploads/requetes/'.$page.'/'.$nomUtilisateur.'/'.$nomRequetes;
	unlink($nomFichier);
    return new Response();
}

public function saveSessionDateAction() {
    $this->constructeur();
	$test_session = $this->session->get('session_date');
	if (! empty($test_session)) {
    	$this->session->set('old_session_date', $this->session->get('session_date'));
	}
    return new Response();
}

//  Fonction qui redéfini l'ancienne variable de session de date comme variable courante.
public function restoreSessionDateAction() {
    $this->constructeur();
	$test_session = $this->session->get('old_session_date');
	if (! empty($test_session)) {
    	$this->session->set('session_date', $this->session->get('old_session_date'));
		$date_session = $this->session->get('session_date');
		echo $date_session['messagePeriode'];
	}
    return new Response();
}

public function traductionAction(){
    $this->constructeur();
	$label = $_GET['label'];
	switch($label){
		case 'label.rapport.titre_vue':
			$auteur = $_GET['auteur'];
    		$horodatage = $_GET['horodatage'];
    		$messageTraduit = $this->get('translator')->trans('label.rapport.titre_vue', array('%auteur%' => $auteur, '%horodatage%' => $horodatage));
			break;
		case 'label.rapport.titre_vue_equipement':
			$equipement = $_GET['equipement'];
			$messageTraduit = $this->get('translator')->trans('label.rapport.titre_vue_equipement', array('%equipement%' => $equipement));
			break;
		case 'label.rapport.titre_vue_tousEquipements':
			$messageTraduit = $this->get('translator')->trans('label.rapport.titre_vue_tousEquipements');
			break;
	}
	echo $messageTraduit;
    return new Response();
}


// Fonction qui va rechercher les requêtes personnelles du compte désigné
// Sauvegarde des type de requêtes affichées pour les réafficher par défaut lors des prochains retour sur les pages
public function getRequetesPersoAction() {
    $this->constructeur();
	$nomUtilisateur = $_GET['nomUtilisateur'];
	$page = $_GET['page'];
	$this->session->set('compte_requete_perso', $nomUtilisateur);
	if ($page == 'listing') 
	{
		$this->session->remove('listing_requete_selected');
		$this->session->remove('liste_req');
	} else {
		$this->session->remove('graphique_requete_selected');
		$this->session->remove('liste_req_pour_graphique');
	}
    return new Response();
}


private function getIdSiteCourant($dbh) {
    $site = new Site();
    $idSiteCourant = $site->SqlGetIdCourant($dbh);
    return ($idSiteCourant);
}

public function changeSessionAction(){
	$this->constructeur();
    $nom_de_session = $_GET['nomSession'];
	// Si une nouvelle session est créé; récupération du nom de la dernière session et incrémentation de 1
	if ($nom_de_session == 'newSession'){
		$last_sessions_name = array_pop($this->session->getTabSessions());
		$pattern_session = '/^.+?_(.+?)$/';
		if(preg_match($pattern_session, $last_sessions_name, $tab_retour_session)){
			$numero_nouvelle_session = $tab_retour_session[1] + 1;
			$nom_nouvelle_session = 'session_'.$numero_nouvelle_session;
			$this->session->nouvelleSession($nom_nouvelle_session);
		}
	} else {
		$this->session->changeSession($nom_de_session);
	}
	return new Response();
}

//Fonction appelée lors du clic sur la checkbox de la popup.
//Permet de passer de la liste complete à la liste simplifiée des messages
public function changeListePopupAction(Request $request){
		if ($request->isXmlHttpRequest()){
			$liste_complete = $_POST['liste_complete'];
			$this->constructeur();
			// On vérifie que la requête est bien une requête AJAX
			// Modification du paramètre de configuration
			$ent_popup_simplifiee = $this->getDoctrine()->getManager()->getRepository('IpcProgBundle:Configuration')->findOneByParametre('popup_simplifiee');
			$ent_popup_simplifiee->setValeur($liste_complete);
			$this->getDoctrine()->getManager()->flush();	
			// Réinitialisation des variables de session
			$this->session->reinitialisationSession('localisations_modules');
			// Rechargement des variable de session avec la nouvelle valeur du parametre 'popup_simplifiee'
			$this->session->definirListeLocalisationsCourantes();
			$this->session->definirTabModuleL();
		}
		return new Response();
}
	

// Fonction qui permet de traduire un mot donné en paramètre
public function traduireAction() {
	$mot_a_traduire = $_GET['message'];
    $service_traduction = $this->container->get('ipc_prog.traduction');
	echo $service_traduction->getTraduction($mot_a_traduire);
	return new Response();
}

// Fonction appelée en ajax : Qui retourne la date de la dernière donnée enregistrée en base dans un format texte
public function ajaxGetLastDataAction() {
    $service_config = $this->container->get('ipc_prog.configuration');
    $message_last_data = $service_config->getLastDataTime();
    echo $message_last_data;
    return new Response();
}


}
