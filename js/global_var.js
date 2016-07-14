var userInfo; //info utente (prese da JSON)
var confs  = []; //array conferences (prese da JSON)
var confN; //conferenza N selezionata
var articleN; //articolo N selezionato
var annotationN; //annotazione N dell'articolo selezionata
var selectedRange; //indica il range di selezione corrente
var mantainLock; //timer di refresh
var locked = 1; //se sei in modalità annotator (locked = 0)