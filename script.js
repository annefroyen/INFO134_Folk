
const befolkningUrl = "http://wildboy.uib.no/~tpe056/folk/104857.json";
const sysselsatteUrl = "http://wildboy.uib.no/~tpe056/folk/100145.json";
const utdanningUrl = "http://wildboy.uib.no/~tpe056/folk/85432.json"

var befolkningsData;
var sysselsettingsData;
var utdanningsData;
var utdanningsDatasett;

var gyldigeKommuneNr = [];
var data;


window.onload = start

function start(){

   data = new Data(utdanningUrl);

   data.onLoad = function(){

     gyldigeKommuneNr = finnFelles("kommunenummer");
     //skrivOversiktstabell();

    var lasteSkjerm = document.getElementById("lasteSkjerm")
    lasteSkjerm.style.display = "none"
  }

  data.load(befolkningUrl, function() {data.load(utdanningUrl, function() {data.load(sysselsatteUrl, 'onLoad')}) });

}

function Data(url){

  this.url = url;
  this.getNames = function(){

    if(url === befolkningUrl){
          return hentDataliste(befolkningsData, "navn");
    }else if( url === sysselsatteUrl){
          return hentDataliste(sysselsettingsData, "navn");
    }else if( url === utdanningUrl){
          return hentDataliste(utdanningsData, "navn");
    }else{
      return "Fant ingen gyldig data";
    }

  };
  this.getIDs = function(){
    if(url === befolkningUrl){
          return hentDataliste(befolkningsData, "nr");
    }else if( url === sysselsatteUrl){
          return hentDataliste(sysselsettingsData, "nr");
    }else if( url === utdanningUrl){
          return hentDataliste(utdanningsData, "nr");
    }else{
      return "Fant ingen gyldig data";
    }
  };
  this.getInfo = function(nr){

    if(url === befolkningUrl){
          return hentDataBefolkning(nr, "info");
    }else if( url === sysselsatteUrl){
          return hentDataSysselsetting(nr, "info");
    }else if( url === utdanningUrl){
          return hentDataUtdanning(nr, "info");
    }else{
      return "Fant ingen gyldig data";
    }
  };
  this.load = function(url, callBack){

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function(){

      if( xhr.readyState === 4 && xhr.status === 200){

       var dataResponse = JSON.parse(xhr.responseText);

       if(url === befolkningUrl){
            befolkningsData = dataResponse.elementer;
       }else if(url === utdanningUrl){
            utdanningsDatasett = dataResponse;
            utdanningsData = dataResponse.elementer;
       }else if(url === sysselsatteUrl){
         sysselsettingsData = dataResponse.elementer;
       }

        if(callBack === 'onLoad'){
          data.onLoad();
        }else if(callBack !== 'onLoad' && callBack !== null){
          callBack(dataResponse);
        }

     }
    };
   xhr.send();
  };
  this.onLoad = null;
}

 function sjekkInput(input) {
    if (input === "") {
      alert("Skriv inn noe i input feltet")
      throw "Ugyldig input"
    }else if(!gyldigeKommuneNr.includes(input)){
      alert("Skriv inn et gyldig kommunenummer")
      throw "Ugyldig kommunenummer"
    }
  }


//hjelpefunksjoner som henter ut data fra datasettene
function hentDataliste(datasett, datatype){

  var returnArray =[];

  for (var key in datasett) {

    switch(datatype) {
      case "navn":
        returnArray.push(key);
        break;
      case "nr":
        returnArray.push(datasett[key].kommunenummer);
        break;
      case "befolkning":
         returnArray.push(finnBefolkning(datasett[key].Menn, datasett[key].Kvinner));
        break;
      case "vekst":
        returnArray.push(finnBefolkningsvekst(datasett[key].Menn, datasett[key].Kvinner));
        break;
      default:
        returnArray.push("ingen data funnet");
    }

  }
  return returnArray;
}
function hentDataBefolkning(kommunenr, datatype){

  for (var key in befolkningsData) {
if(kommunenr === befolkningsData[key].kommunenummer){
    switch(datatype) {
      case "navn":
        return key;
        break;
      case "befolkning":
         return finnBefolkning(befolkningsData[key].Menn, befolkningsData[key].Kvinner);
        break;
      case "vekst":
        return finnBefolkningsvekst(befolkningsData[key].Menn, befolkningsData[key].Kvinner);
        break;
      case "sysselsetting":
        return befolkningsData[key]["Begge kjønn"];
        break;
      case "element":
        return befolkningsData[key];
        break;
      case "info":
        return  key + " " + JSON.stringify(befolkningsData[key]);
        break;
      default:
        return "ingen data funnet";
    }
}
  }
}
function hentDataSysselsetting(kommunenr, datatype){

  for (var key in sysselsettingsData) {

if(kommunenr === sysselsettingsData[key].kommunenummer){

    switch(datatype) {
      case "navn":
        return key;
        break;
      case "sysselsetting":
        return sysselsattesData[key]["Begge kjønn"];
        break;
      case "element":
        return sysselsettingsData[key];
        break;
      case "info":
        return  key + " " + JSON.stringify(sysselsettingsData[key]);
        break;
      default:
        return "ingen data funnet";
    }
}
  }
}
function hentDataUtdanning(kommunenr, datatype){

  for (var key in utdanningsData) {

if(kommunenr === utdanningsData[key].kommunenummer){

    switch(datatype) {
      case "navn":
        return key;
        break;
      case "element":
        return utdanningsData[key];
        break;
      case "info":
        return  key + " " + JSON.stringify(utdanningsData[key]);
        break;
      default:
        return "ingen data funnet";
    }
}
  }
}

//skriver oversikt innhold
function skrivOversiktstabell() {

  var tabell = document.getElementById("oversiktsTabell")

  for (var key in befolkningsData) {

    var rad = tabell.insertRow(1);

    var kommune = rad.insertCell(0);
    var nr = rad.insertCell(1);
    var befolkning = rad.insertCell(2);
    var vekst = rad.insertCell(3);

    kommune.innerText = key;
    nr.innerText = befolkningsData[key].kommunenummer;
//   console.log("TEST" + Object.values(befolkningsData[key].Menn));
    befolkning.innerText = finnBefolkning(befolkningsData[key].Menn, befolkningsData[key].Kvinner);
    let ve = finnBefolkningsvekst(befolkningsData[key].Menn, befolkningsData[key].Kvinner);
    if ( ve > 0) {
      vekst.className += "positivVekst";
    }else if(ve < 0){
      vekst.className += "negativVekst";
    }else{
      vekst.className += "noytralVekst";
    }
    vekst.innerText = ve + " %";


  }
}
function skrivDetaljTabell(input, datasett, data){

console.log(data);
var tabell = document.getElementById(data);
tabell.innerHTML = '';
console.log(tabell);
tabell.setAttribute('class', 'detaljTabell');

//document.getElementById('detaljer').appendChild(tabell);

 var header = tabell.createTHead();
 var rad = header.insertRow(0);
 var celle = rad.insertCell(0);
 celle.innerText = "kategori";
 var n = 0;

//finner felles årstall
/*
var aarstallBefolkning = Object.keys(befolkningsData.Halden.Menn);
var aarstallUtdanning = Object.keys(utdanningsData.Halden['01'].Menn);
var aarstallSysselsetting = Object.keys(sysselsettingsData.Halden.Menn);

var fellesAarstall = [];

for (var i = 0; i < aarstallBefolkning.length && i < aarstallSysselsetting.length; i++) {
  for (var j = 0; j < aarstallSysselsetting.length; j++) {
   for (var k = 0; k < aarstallUtdanning.length; k++) {
      if(aarstallBefolkning[i] === aarstallSysselsetting[j] && aarstallBefolkning[i] == aarstallUtdanning[k]){
       fellesAarstall.push(aarstallBefolkning[i]);
       n++;
       celle = rad.insertCell(n);
       celle.innerText = aarstallBefolkning[i];

      }
    }
  }
}
*/

//test

var fellesAarstall = finnFelles('aarstall');

for(aar in fellesAarstall){
  n++;
  celle = rad.insertCell(n);
  celle.innerText = fellesAarstall[aar];
}



if(datasett === befolkningsData){
  var kommuneElement = hentDataBefolkning(input, "element");
  printTabell(kommuneElement, tabell, fellesAarstall);
}else if(datasett === sysselsettingsData){
  var kommuneElement = hentDataSysselsetting(input, "element");
    printTabell(kommuneElement, tabell, fellesAarstall);
}else if( datasett === utdanningsData){
  var kommuneElement = hentDataUtdanning(input, "element");
  printTabellUtdanning(kommuneElement, tabell, fellesAarstall);
}else {
  var kommuneElement = "error";
}


}
function printTabell(kommuneElement, tabell, fellesAarstall){


  var kjonn = Object.keys(kommuneElement)
   for (var i = 0; i < kjonn.length; i++) {
     if(kjonn[i] !== 'kommunenummer'){


          var rad = tabell.insertRow(1);
          var k = rad.insertCell(0);
          k.innerText = kjonn[i];

          for (var p = 0; p < fellesAarstall.length; p++) {


          celle = rad.insertCell(0);
          celle.innerText = kommuneElement[kjonn[i]][fellesAarstall[p]];
      }

    }
  }
}

function printTabellUtdanning(kommuneElement, tabell, fellesAarstall){

  var kategorier = Object.keys(kommuneElement)

   for (var i = 0; i < kategorier.length; i++) {
     if(kategorier[i] !== 'kommunenummer'){

       var kjonn = Object.keys(kommuneElement[kategorier[i]])

        for (var j = 0; j < kjonn.length; j++) {

          var rad = tabell.insertRow(1);
          var kategori = rad.insertCell(0);
          kategori.innerText = kjonn[j] + " " + kategorier[i];

          for (var p = 0; p < fellesAarstall.length; p++) {

            celle = rad.insertCell(0);
            celle.innerText = kommuneElement[kategorier[i]][kjonn[j]][fellesAarstall[p]];

          }

      }

    }
}
}

//Sørger for at navbar viser rett side
function visSide(side){


  var divs = document.getElementsByClassName("innhold");

      for (let d = 0; d < divs.length; d++) {
          if (divs[d].classList.contains("synligSide")) {
             divs[d].classList.remove("synligSide");
         }
      }
    var divid = document.getElementById(side).classList.add("synligSide");
}

function visDetaljer(input){


  //sjekk inputFelt
  sjekkInput(input);

  //skriv detlajer
  visKommuneInfo(input);

  //skriv befolkningstabell
  var tittel = document.getElementById('befolkningsvekst');
  tittel.innerHTML = '';
  var tekst = document.createTextNode("Befolkningsvekst");

  tittel.appendChild(tekst);
  document.getElementById('detaljer').appendChild(tittel);

  skrivDetaljTabell(input, befolkningsData, "befolkningsData");

  //skriv sysselsettingstabell
  var tittel = document.getElementById('sysselsettingsvekst');
  var tekst = document.createTextNode("Sysselsettingsvekst");
  tittel.appendChild(tekst);
  document.getElementById('detaljer').appendChild(tittel);

  skrivDetaljTabell(input, sysselsettingsData, "sysselsettingsData");

  //skriv utdanningstabell
  var tittel = document.getElementById('utdanningsvekst');
  var tekst = document.createTextNode("Utdanningsvekst");
  tittel.appendChild(tekst);
  document.getElementById('detaljer').appendChild(tittel);

  skrivDetaljTabell(input, utdanningsData, "utdanningsData");

}

function visSammenligning(input1, input2){
    sjekkInput(input1);
    sjekkInput(input2);
    skrivSammenligningsTabell(input1, input2);
}




function skrivSammenligningsTabell(kommunenr1, kommunenr2) {


  var tabell = document.getElementById("sammenligningsTabell");
  tabell.innerHTML = '';
  var kommune1;
  var kommune1Navn;
  var kommune2;
  var kommune2Navn;

  for (var key in utdanningsData) {
    if(kommunenr1 === utdanningsData[key].kommunenummer){
      kommune1 = utdanningsData[key];
      kommune1Navn = key;
    }else if(kommunenr2 === utdanningsData[key].kommunenummer ){
      kommune2 = utdanningsData[key];
      kommune2Navn = key;
    }
  }


  var header = tabell.insertRow(0);

  var kategorier = header.insertCell(0);
  var kommuneEn = header.insertCell(1);
  var kommuneTo = header.insertCell(2);
  var vinner = header.insertCell(3);

  kategorier.innerText = "Kategorier";
  kommuneEn.innerText = kommune1Navn;
  kommuneTo.innerText = kommune2Navn;
  vinner.innerText = "Vinner"



    //kommuneEn.innerText = Object.values(kommune1['01'].Menn).pop();
//   console.log("TEST" + Object.values(befolkningsData[key].Menn));
    //kommuneTo.innerText = Object.values(kommune2['01'].Menn).pop();


  // gammel kategorier var kategorier = Object.keys(kommune1)
  //ny Kategorier
  var kategorier = Object.keys(utdanningsDatasett.datasett.kategorier);
  var kategorierNavn = Object.values(utdanningsDatasett.datasett.kategorier);

  console.log(kategorier);
   for (var i = 0; i < kategorier.length; i++) {


       var kjonn = Object.keys(kommune1[kategorier[i]])
        //console.log(kjonn.length);
        for (var j = 0; j < kjonn.length; j++) {

        // console.log(kjonn[j]);
         printRad(tabell, kjonn[j], kategorier[i], kommune1, kommune2, kategorierNavn[i])
        }
//går gjennom kver kategori

  //  console.log(kategorier[i]);
    //console.log(kommune1[kategorier[i]].Menn);

/*
    kommuneTo.innerText = Object.values(kommune1[kategorier[i]].Menn).pop();
*/
    //printRad(tabell, "Kvinner", kategorier[i], kommune1)
    //printRad(tabell, "Menn", kategorier[i], kommune1)




}
var rad = tabell.insertRow(1);

var kat = rad.insertCell(0);
var kommuneEn = rad.insertCell(1);
var kommuneTo = rad.insertCell(2);
var vinner = rad.insertCell(3);

kat.innerText = "Sammenlagt: ";
kommuneEn.innerText = "-";
kommuneTo.innerText = "-";
vinner.innterText = "den med flest seiere";


}

function printRad(tabell, kjonn, kategorier, kommune1, kommune2, kategorierNavn){

  var rad = tabell.insertRow(1);

  var kat = rad.insertCell(0);
  var kommuneEn = rad.insertCell(1);
  var kommuneTo = rad.insertCell(2);
  var vinner = rad.insertCell(3);

  kat.innerText = kjonn + ": " + kategorierNavn;
  kommuneEn.innerText = Object.values(kommune1[kategorier][kjonn]).pop();
  kommuneTo.innerText = Object.values(kommune2[kategorier][kjonn]).pop();
  vinner.innerText = finnVinner(kommune1, kommune2, kategorier, kjonn);
  console.log(finnVinner(kommune1, kommune2, kategorier, kjonn));
}

function finnVinner(kommune1, kommune2, kategorier, kjonn){

  if(Object.values(kommune1[kategorier][kjonn]).pop() < Object.values(kommune2[kategorier][kjonn]).pop() ){
  return hentDataUtdanning(kommune2.kommunenummer, "navn");
}else if(Object.values(kommune2[kategorier][kjonn]).pop() < Object.values(kommune1[kategorier][kjonn]).pop() ){
  return hentDataUtdanning(kommune1.kommunenummer, "navn");
}else{
  return "uavgjort"
}

}


function finnBefolkning(menn, kvinner){

  return Object.values(menn).pop() + Object.values(kvinner).pop();

}

function finnBefolkningsvekst(menn, kvinner){

var current = Object.values(menn).reverse()[0] + Object.values(kvinner).reverse()[0];
var last = Object.values(menn).reverse()[1] + Object.values(kvinner).reverse()[1];

if(last === 0){
  return "Ingen data";
}

let sum = (current-last)/last*100+""

return sum.substr(0,4)
}

function finnUtdanningsvekst(nr, aar){


  var current = Object.values(utdanningsdata[key].Menn[aar]).reverse()[0] + Object.values(kvinner).reverse()[0];
  var last = Object.values(menn).reverse()[1] + Object.values(kvinner).reverse()[1];

  if(last === 0){
    return "Ingen data";
  }

  let sum = (current-last)/last*100+""

  return sum.substr(0,4)
}


function visKommuneInfo(input){

  var kommune = hentDataBefolkning(input, "navn");
  var befolkning = hentDataBefolkning(input, "befolkning")
  var sysselsatte = hentDataSysselsetting(input, "sysselsatte")
  var utdanning = hentDataUtdanning(input, "utdanning");


  var ul = document.getElementById("liste")

  //oppretter et <li></li>-element
  var li1 = document.createElement("li");
  var li2 = document.createElement("li");
  var li3 = document.createElement("li");
  var li4 = document.createElement("li");
  var li5 = document.createElement("li");

  //oppretter en tekst-node
  li1.innerText = kommune;
  li2.innerText = "Kommune nr: " + input;
  li3.innerText = "Befolkning: " + befolkning;
  li4.innerText = "Sysselsetting: " + sysselsatte;
  li5.innerText = "Utdanning: "


  //fester <li></li>-elementet til <ul></ul>-elementet som blir hentet fra html-siden på linje 54
  ul.appendChild(li1)
  ul.appendChild(li2)
  ul.appendChild(li3)
  ul.appendChild(li4)
  ul.appendChild(li5)

}

function finnFelles(data){

  var felles = [];
  var befolkning;
  var utdanning;
  var sysselsetting;

  if(data === "kommunenummer"){
    befolkning = hentDataliste(befolkningsData, "nr");
    utdanning = hentDataliste(utdanningsData, "nr");
    sysselsetting = hentDataliste(sysselsettingsData, "nr");

  }else if(data === "aarstall"){
    befolkning = Object.keys(befolkningsData.Halden.Menn);
    utdanning = Object.keys(utdanningsData.Halden['01'].Menn);
    sysselsetting = Object.keys(befolkningsData.Halden.Menn);
  }

  for (var i = 0; i < befolkning.length && i < sysselsetting.length; i++) {
    for (var j = 0; j < sysselsetting.length; j++) {
     for (var k = 0; k < utdanning.length; k++) {
        if(befolkning[i] === sysselsetting[j] && befolkning[i] === utdanning[k]){
         felles.push(befolkning[i]);
        }
      }
    }
  }

  return felles;
}

//test the content of the json-files
function sjekkAntallKommuner(){
  console.log("Felles kommunenummer: " + finnFelles("kommunenummer").length);
  console.log("Kommuner i befolkningsData: " + Object.keys(befolkningsData).length);
  console.log("Kommuner i sysselsettingsData: " + Object.keys(sysselsettingsData).length);
  console.log("Kommuner i utdanningsData: " + Object.keys(utdanningsData).length);
  console.log("Her kan vi sjå at utdannings API har fleire kommuner enn dei andre og at befolkning og sysselsetting har en kommune som ikkje er felles.");
}
