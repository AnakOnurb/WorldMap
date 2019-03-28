var qtd = 0;

function mudarTamanho(){
  if(screen.width < 800){
    document.getElementById("headImage").src = "src/back.png";
  }
  else{
    document.getElementById("headImage").src = "src/head.png";
  }
}

function getQtd(){
  url = "https://api.worldbank.org/v2/country/all?format=json";
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('Success!', JSON.parse(xhr.responseText));
      countries = JSON.parse(xhr.responseText);
      qtd = countries[0].pages;
    }
    else {
      let error_message= "Error <br>" + xhr.statusText;
      console.log(error_message);
    }
    console.log("Pages Retrieved");
  };
  xhr.open('GET', url, false);
  xhr.send();
}

function getCountries(region){
  //"Latin America & Caribbean ", "South Asia", "Aggregates", "Sub-Saharan Africa ", "Europe & Central Asia", "Middle East & North Africa", "East Asia & Pacific", "North America"
  getQtd();
  for(var page = 1; page <= qtd; page++){
    url = "https://api.worldbank.org/v2/country/all?format=json";
    url = url+"&page="+page;
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Success!', JSON.parse(xhr.responseText));
        countries = JSON.parse(xhr.responseText);

        for(var item of countries[1]){
          if(item.region.value.toLowerCase().includes(region)){
            console.log(item);
            var x = document.getElementById("countrySelect");
            var option = document.createElement("option");
            option.value = item.iso2Code;
            option.text = item.name;
            x.add(option);

            var x = document.getElementById("countrySelect2");
            var option = document.createElement("option");
            option.value = item.iso2Code;
            option.text = item.name;
            x.add(option);
          }
        }

      }
      else {
        let error_message= "Error <br>" + xhr.statusText;
        console.log(error_message);
      }
      console.log("Pages Retrieved");
    };
    xhr.open('GET', url, false);
    xhr.send();
  }
}

function loadInfo(combo){
  getInfo("acessointernet","2.0.cov.Int", combo);
  getInfo("acessocelular","2.0.cov.Cel", combo);
  getInfo("coberturaeletricidade","1.1_ACCESS.ELECTRICITY.TOT", combo);
  getInfo("taxaalfabetizacao","1.1_YOUTH.LITERACY.RATE", combo);
  getInfo("consumototalenergia","1.1_TOTAL.FINAL.ENERGY.CONSUM", combo);
  getInfo("consumoenergiarenovavel","2.1_SHARE.TOTAL.RE.IN.TFEC", combo);
  getInfo("gnicapita","6.0.GNIpc", combo);
  getInfo("censo","3.11.01.01.popcen", combo);
  getInfo("igualdadegenero","5.51.01.07.gender", combo);
  getInfo("creditoprivado","DT.TDS.PRVT.CD", combo);
  getInfo("investimentoexterno","BM.KLT.DINV.WD.GD.ZS", combo);
  getInfo("forcadetrabalho","ccx_lf_pop_you", combo);
}

function getInfo(idcampo, indicador, combo){
  var country = document.getElementById(combo).value.toLowerCase();
  if(country != "none"){
    var url = "https://api.worldbank.org/v2/country/"+country+"/indicator/"+indicador+"?format=json";
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log("entrei aqui");
        console.log('Success!', JSON.parse(xhr.responseText));
        var campo = document.getElementById(idcampo);
        var data = JSON.parse(xhr.responseText)[1];
        campo.innerHTML = "Not Found";
        if(data != null){
          campo.innerHTML = getFirstNotNull(data);
          //+getFirstNotNull(data).toFixed(2)+"%"
        }
      }
      else {
        let error_message= "Error <br>" + xhr.statusText;
        console.log(error_message);
      }
      console.log("Pages Retrieved");
    };
    xhr.open('GET', url, true);
    xhr.send();
  }
}

function getFirstNotNull(data){
  for(var value of data){
    if(value.value != null){
      return value.value;
    }
  }
}
