var qtd = 0;

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
  getInfo("acessointernet","2.0.cov.Int", combo, "%");
  getInfo("acessocelular","2.0.cov.Cel", combo, "%");
  getInfo("coberturaeletricidade","1.1_ACCESS.ELECTRICITY.TOT", combo, "%");
  getInfo("taxaalfabetizacao","1.1_YOUTH.LITERACY.RATE", combo, "%");
  getInfo("consumototalenergia","1.1_TOTAL.FINAL.ENERGY.CONSUM", combo, "KW");
  getInfo("consumoenergiarenovavel","2.1_SHARE.TOTAL.RE.IN.TFEC", combo, "%");
  getInfo("gnicapita","6.0.GNIpc", combo, "US$");
  getInfo("censo","3.11.01.01.popcen", combo, "Bool");
  getInfo("igualdadegenero","5.51.01.07.gender", combo, "dec%");
  getInfo("creditoprivado","DT.TDS.PRVT.CD", combo, "US$");
  getInfo("investimentoexterno","BM.KLT.DINV.WD.GD.ZS", combo, "dec%");
  getInfo("forcadetrabalho","ccx_lf_pop_you", combo, "dec%");
}

function formatResult(data, unit){
  if(unit == "%")
    return +data.toFixed(2)+"%";
  if(unit == "KW")
    return +data.toFixed(2)+"KW";
  if(unit == "US$")
    return +data.toFixed(2)+"US$";
  if(unit == "dec%")
    return +(data*100).toFixed(2)+"%";
  if(unit == "Bool"){
    if(data == 1)
      return "True";
    return "False";
  }
}

function getInfo(idcampo, indicador, combo, unit){
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
          campo.innerHTML = formatResult(getFirstNotNull(data), unit);
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
