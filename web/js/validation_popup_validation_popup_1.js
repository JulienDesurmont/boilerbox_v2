;var xhr=null,tabRequete=JSON.parse($("#tabloRequete").val()),choixLocalisation=null,$chargementSelection=!0;function selection(e,t,a){attente();setTimeout(function(){ajaxGetChoixLocalisation();var r=document.getElementById("genres").value,l=document.getElementById("modules").value,n;if(choixLocalisation===null){n=document.getElementById("localisations").value}
else{document.getElementById("localisations").value=choixLocalisation;n=choixLocalisation};var f=!1;if(t==="reinitModule"){t="module";l="all";r="all"};if(a==!0){document.getElementById("codeModule").value=""};if(t==="genre"){xhr=getXHR();if(e==="graphique"){callPathAjax(xhr,"ipc_configSelect","genre0",!1)}
else if(e==="listing"){callPathAjax(xhr,"ipc_configSelect","genre1",!1)};xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");if(n=="every"){n="all"};var s="genres="+encodeURIComponent(r)+"&modules="+encodeURIComponent(l)+"&localisations="+n;xhr.send(s);var i=xhr.responseText,d="ListeSuivante",g=d.length,m=i.indexOf(d),p=i.slice(0,m),h=i.slice(m+g);document.getElementById("modules").innerHTML=p;var u=!1;for(var c=0;c<l.length;c++){for(var o=0;o<document.getElementById("modules").options.length;o++){if(document.getElementById("modules").options[o].value==l){document.getElementById("modules").options[o].selected=!0;u=!0}}};if(u==!1){t="reinitModule";selection(e,t,a);return};document.getElementById("messages").innerHTML=h;if(h.length!=0){document.getElementById("messages").options[0].selected=!0}};if(t==="module"){xhr=getXHR();if(e==="graphique"){callPathAjax(xhr,"ipc_configSelect","module0",!1)}
else if(e==="listing"){callPathAjax(xhr,"ipc_configSelect","module1",!1)};xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");if(n==="every"){n="all"};var s="genres="+encodeURIComponent(r)+"&modules="+encodeURIComponent(l)+"&localisations="+n;xhr.send(s);i=xhr.responseText;document.getElementById("messages").innerHTML=i;if(i.length!=0){document.getElementById("messages").value=document.getElementById("messages").options[0].value};if(f==!0){document.getElementById("modules").value=document.getElementById("modules").options[0].value;document.getElementById("genres").value=document.getElementById("genres").options[0].value;window.location.href=window.location.href}};if(e==="graphique"){selectionMessage("ipc_graphiques","graphique")}
else if(e==="listing"){selectionMessage("ipc_listing","listing")};fin_attente();return},300)};function reinitialise_codeMessage(e){selection(e,"genre",!0)};function choixCodeMessage(){var t=document.getElementById("codeModule").value.toUpperCase(),a=t.length;for(var e=0;e<document.getElementById("messages").options.length;e++){if(document.getElementById("messages").options[e].text.substr(0,a)==t){document.getElementById("messages").options[e].selected=!0;return}}};function searchMessage(e){var t=String.fromCharCode(e.which);alert(t)};function resetAjaxForm(e){attente();var t=verifNombreRequetes();if(t!=0){setTimeout(function(){xhr=getXHR();var a="AJAX=ajax&choixSubmit=RAZ";if(e=="graphique"){callPathAjax(xhr,"ipc_accueilGraphique",a,!1)}
else if(e=="listing"){callPathAjax(xhr,"ipc_accueilListing",a,!1)}
else if(e=="etat"){callPathAjax(xhr,"ipc_accueilEtat",a,!1)};xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");xhr.send(null);var t="<table><thead><tr><th class='localisation'>Localisation</th><th class='code'>Code message</th><th class='designation'>Désignation</th><th class='actions'>Actions</th></tr></thead>";t=t+"<tbody>";t=t+"<input type='hidden' id='nombre_requetes' name='nombre_requetes' value='0'>";t=t+"</tbody></table>";$("div.requetemessage").html(t);fin_attente();return},50)}
else{fin_attente();return}};function deleteAjaxForm(e,t){attente();setTimeout(function(){xhr=getXHR();var l="AJAX=ajax&choixSubmit=suppressionRequete&suppression_requete="+t;if(e=="graphique"){callPathAjax(xhr,"ipc_accueilGraphique",l,!1)}
else if(e=="listing"){callPathAjax(xhr,"ipc_accueilListing",l,!1)}
else if(e=="etat"){callPathAjax(xhr,"ipc_accueilEtat",l,!1)};xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");xhr.send(null);var n=JSON.parse(xhr.responseText);tabRequete=n;var a="<table><thead>";a=a+"<tr><th class='localisation'>Localisation</th><th class='code'>Code message</th><th class='designation'>Désignation</th><th class='actions'>Actions</th>";a=a+"</tr></thead>";a=a+"<tbody>";var i=0;for(liste in n){a=a+"<tr><td class='localisation'><div class='txtlocalisation'>"+n[liste]["localisation"]+"</div></td>";if(n[liste]["code"]!=null){a=a+"<td class='code'>"+n[liste]["code"]+"</td>"}
else{a=a+"<td class='code'>&nbsp;</td>"};a=a+"<td class='designation'>"+n[liste]["message"]+"</td>";a=a+"<td class='actions'>";if(e=="graphique"){a=a+"<a class='bouton' href='{{ path('ipc_graphiques') }}' target='_blank' name='modRequete_"+n[liste]["numrequete"]+"' onClick=\"declanchementUpdateAjaxForm(1,'ipc_graphiques','graphique',this.name,"+i+",'modificationRequete');return false;\" ><div class='bouton editer'></div><div class='boutonname'>"+traduire("bouton.editer_requete")+"</div></a>"}
else if(e=="listing"){a=a+"<a class='bouton' href='{{ path('ipc_listing') }}' target='_blank' name='modRequete_"+n[liste]["numrequete"]+"' onClick=\"declanchementUpdateAjaxForm(1,'ipc_listing','listing',this.name,"+i+",'modificationRequete');return false;\" ><div class='bouton editer'></div><div class='boutonname'>"+traduire("bouton.editer_requete")+"</div></a>"}
else if(e=="etat"){a=a+"<a class='bouton' href='{{ path('ipc_etat') }}' target='_blank' name='modRequete_"+n[liste]["numrequete"]+"' onClick=\"declanchementUpdateAjaxForm(1,'ipc_etat','etat',this.name,"+i+",'modificationRequete');return false;\" ><div class='bouton editer'></div><div class='boutonname'>"+traduire("bouton.editer_requete")+"</div></a>"};a=a+"<a class='bouton' href='#' target='_blank' name='suppRequete_"+n[liste]["numrequete"]+"' onClick=\"declanchementDeleteAjaxForm(1,'"+e+"',this.name,'suppressionRequete');return false;\"><div class='bouton supprimer'></div><div class='boutonname'>"+traduire("bouton.supprimer_requete")+"</div></a></td>";a=a+"</tr>";i++};a=a+"<input type='hidden' id='nombre_requetes' name='nombre_requetes' value='"+n.length+"'>";a=a+"</tbody></table>";$("div.requetemessage").html(a);fin_attente();return},50)};function sendAjaxForm(e){attente();setTimeout(function(){var g=document.getElementById("localisations").value;if(g==""){fin_attente();return};var p=document.getElementById("genres").value,f=document.getElementById("modules").value,d=document.getElementById("messages").value,m=$("input[type='radio'][name='codeVal1']").filter(":checked").val(),h=$("input[type='radio'][name='codeVal2']").filter(":checked").val(),i=null,o=null,n=null,l=null,v=document.getElementById("modificationRequete").value,x=document.getElementById("choixSubmit_add").value,y=$("input[type='radio'][name='suppression_requete']").filter(":checked").val(),b="ajax";switch(m){case undefined:break;case"Inf":var i=parseInt(document.getElementById("codeVal1Min").value);break;case"Sup":var i=parseInt(document.getElementById("codeVal1Max").value);break;case"Int":var i=parseInt(document.getElementById("codeVal1IntMin").value);var o=parseInt(document.getElementById("codeVal1IntMax").value);break};switch(h){case undefined:break;case"Inf":var n=parseInt(document.getElementById("codeVal2Min").value);break;case"Sup":var n=parseInt(document.getElementById("codeVal2Max").value);break;case"Int":var n=parseInt(document.getElementById("codeVal2IntMin").value);var l=parseInt(document.getElementById("codeVal2IntMax").value);break};var r=!0,c="";if(o!=null){if(o<i){c="Erreur : valeur1 max < valeur1 min ("+o+" < "+i+")";r=!1}};if(l!=null){if(l<n){c="Erreur : valeur2 max < valeur2 min ("+l+" < "+n+")";r=!1}};if(d==""){c="Erreur : Aucun message sélectionné";r=!1};if(r==!1){$("#messageboxInfos").text(c);$("#messagebox").removeClass("cacher");fin_attente();return};xhr=getXHR();var u="AJAX="+b+"&choixSubmit="+x+"&listeLocalisations="+g+"&listeGenres="+p+"&listeModules="+f+"&listeIdModules="+d+"&codeVal1="+m+"&codeVal2="+h+"&codeVal1Min="+i+"&codeVal1Max="+o+"&codeVal2Min="+n+"&codeVal2Max="+l+"&modificationRequete="+v;if(e==="graphique"){callPathAjax(xhr,"ipc_accueilGraphique",u,!1)}
else if(e==="listing"){callPathAjax(xhr,"ipc_accueilListing",u,!1)}
else if(e==="etat"){callPathAjax(xhr,"ipc_accueilEtat",u,!1)};xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");xhr.send(null);try{var a=JSON.parse(xhr.responseText)}catch(q){alert("error : "+q);alert(xhr.responseText);window.location.href=window.location.href;return};tabRequete=a;var t="<table><thead><tr><th class='localisation'>"+traduire("label.localisation")+"</th><th class='code'>"+traduire("label.code_message")+"</th><th class='designation'>"+traduire("label.designation")+"</th><th class='actions'>"+traduire("label.action")+"</th></tr></thead>";t=t+"<tbody>";var s=0;for(liste in a){t=t+"<tr><td class='localisation'><div class='txtlocalisation'>"+a[liste]["localisation"]+"</div></td>";if(a[liste]["code"]!=null){t=t+"<td class='code'>"+a[liste]["code"]+"</td>"}
else{t=t+"<td class='code'>&nbsp;</td>"};t=t+"<td class='designation'>"+a[liste]["message"]+"</td>";t=t+"<td class='actions'>";if(e==="graphique"){t=t+"<a class='bouton' href='{{ path('ipc_graphiques') }}' target='_blank' name='modRequete_"+a[liste]["numrequete"]+"' onClick=\"declanchementUpdateAjaxForm(1,'ipc_graphiques','graphique',this.name,"+s+",'modificationRequete');return false;\" ><div class='bouton editer'></div><div class='boutonname'>"+traduire("bouton.editer_requete")+"</div></a>"}
else if(e==="listing"){t=t+"<a class='bouton' href='{{ path('ipc_listing') }}' target='_blank' name='modRequete_"+a[liste]["numrequete"]+"' onClick=\"declanchementUpdateAjaxForm(1,'ipc_listing','listing',this.name,"+s+",'modificationRequete');return false;\" ><div class='bouton editer'></div><div class='boutonname'>"+traduire("bouton.editer_requete")+"</div></a>"}
else if(e==="etat"){t=t+"<a class='bouton' href='{{ path('ipc_etat') }}' target='_blank' name='modRequete_"+a[liste]["numrequete"]+"' onClick=\"declanchementUpdateAjaxForm(1,'ipc_etat','etat',this.name,"+s+",'modificationRequete');return false;\" ><div class='bouton editer'></div><div class='boutonname'>"+traduire("bouton.editer_requete")+"</div></a>"};t=t+"<a class='bouton' href='#' target='_blank' name='suppRequete_"+a[liste]["numrequete"]+"' onClick=\"declanchementDeleteAjaxForm(1,'"+e+"',this.name,'suppressionRequete');return false;\" ><div class='bouton supprimer'></div><div class='boutonname'>"+traduire("bouton.supprimer_requete")+"</div></a></td>";t=t+"</tr>";s+=1};t=t+"<input type='hidden' id='nombre_requetes' name='nombre_requetes' value='"+a.length+"'>";t=t+"</tbody></table>";$("div.requetemessage").html(t);fin_attente();return},50)};function razUpdate(){document.getElementById("modificationRequete").value="";razCodeModule()};function razCodeModule(){document.getElementById("codeModule").value=""};function ajaxSetChoixLocalisation(){var e=document.getElementById("localisations").value,t=$("#localisations").attr("data-url");$.ajax({type:"get",async:!1,timeout:5000,url:t,data:"localisation="+e})};function ajaxGetChoixLocalisation(){var e=$("#localisations").attr("data-url");$.ajax({type:"get",url:e,data:"localisation=get",async:!1,timeout:5000,success:function(e,t,a){choixLocalisation=e},error:function(e,t,a){choixLocalisation=null}})};