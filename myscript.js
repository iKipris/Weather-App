"user strict ";
const key='bf23ca530aa846b29ff100557200610';
var sendit='DefaultValue';
        function initialize() {
            /*var options = {
    componentRestrictions: {
    country: "gr"
    }
  };*/
            
          window.onload = getLocation();
          var input = document.getElementById('searchTextField');
          var autocomplete = new google.maps.places.Autocomplete(input);

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                document.getElementById('mylocation').innerHTML = place.name;
                //document.getElementById('city2').value = place.name;
                document.getElementById('cityLat').value = place.geometry.location.lat();
                document.getElementById('cityLng').value = place.geometry.location.lng();
                lat1=document.getElementById('cityLat').value;
                lng1=document.getElementById('cityLng').value;
                sendit=lat1 + ',' + lng1;
                getWeather(sendit);
            });
        }
        google.maps.event.addDomListener(window, 'load', initialize);



        function getWeather(sendit)
{
    //console.log(sendit);
    fetch( `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${sendit}&days=7`,{method:'GET'})
    .then(response =>response.json() )
    .then(json => {
        document.getElementById('mynum').innerHTML = json.current.temp_c +"<sup >o</sup>C";
        document.getElementById("myImg").src = json.current.condition.icon;
        document.getElementById("mycurrentdate").innerHTML=json.forecast.forecastday[0].date;
        document.getElementById("mycurrentwind").textContent=json.current.wind_kph + "km/h"  ;
        document.getElementById("mycurrenthum").textContent=json.forecast.forecastday[0].day.daily_chance_of_rain + "%";
        
        document.getElementById("mycurrentdir").innerText=json.current.wind_dir;
        document.getElementById("castnum1").innerHTML=json.forecast.forecastday[1].day.maxtemp_c + `<sup >o</sup>C`;
        document.getElementById("castnum1small").innerHTML=json.forecast.forecastday[1].day.mintemp_c + `<sup >o</sup>C`;
        document.getElementById("castnum2").innerHTML=json.forecast.forecastday[2].day.maxtemp_c + `<sup >o</sup>C`;
        document.getElementById("castnum2small").innerHTML=json.forecast.forecastday[2].day.mintemp_c + `<sup >o</sup>C`;
        document.getElementById("myImg1").src= json.forecast.forecastday[1].day.condition.icon;
        document.getElementById("myImg2").src= json.forecast.forecastday[2].day.condition.icon;
        var checker=json.current.condition.text.includes("rain")
        var xel = document.getElementById("mymaindiv");
        if (checker)
        {
            
            xel.classList.add("rain");
        }
        else 
        {
             
             xel.classList.remove("rain");
        }
        
        
        

        
    }) 
    //.then(json => document.getElementById('mynum').innerHTML = 'kota')
    .catch(error => console.log('error :', error))
}

//----------------------------------------
/*Gets any date and outputs every day name 
and date for the next days + the current also refresh the day class*/
//----------------------------------------

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
var dateStr=`${mm}/${dd}/${yyyy}`
//var dateStr =  '10/18/2020'
var daynum=dateStr.split('/');
var daynumint=parseInt(daynum[1]);

var mydaynames=[];
//console.log(typeof daynumint,daynum);

for (var i=0; i< 7; ++i)
{
	
  var temp=daynumint.toString();
  dateStr=`${daynum[0]}/${temp}/${daynum[2]}`
  //console.log(dateStr);
  var day = getDayName(dateStr, "gr-GR");
  mydaynames.push(day);
  ++daynumint;
}


function getDayName(dateStr, locale)
{
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

//console.log(mydaynames);


var elements = document.getElementsByClassName("day");
for (var i = 0, len = elements.length; i < len; i++) {
    elements[i].innerHTML=mydaynames[i];
}




var x=document.getElementById("mylocation");
function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    }
    else{
        x.innerHTML="Geolocation is not supported by this browser.";
    }
}

function showPosition(position){
    lat=position.coords.latitude;
    lon=position.coords.longitude;
    sendit=lat + ',' + lon ;
    getWeather(sendit);
    
    displayLocation(lat,lon);
}

function showError(error){
    switch(error.code){
        case error.PERMISSION_DENIED:
            x.innerHTML="User denied the request for Geolocation."
        break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML="Location information is unavailable."
        break;
        case error.TIMEOUT:
            x.innerHTML="The request to get user location timed out."
        break;
        case error.UNKNOWN_ERROR:
            x.innerHTML="An unknown error occurred."
        break;
    }
}

function displayLocation(latitude,longitude){
    var geocoder;
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(latitude, longitude);

    geocoder.geocode(
        {'latLng': latlng}, 
        function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var add= results[0].formatted_address ;
                    var  value=add.split(",");
                    
                    count=value.length;
                    country=value[count-1];
                    state=value[count-2];
                    city=value[count-3];
                    x.innerHTML =  state;
                }
                else  {
                    x.innerHTML = "address not found";
                }
            }
            else {
                x.innerHTML = "Geocoder failed due to: " + status;
            }
        }
    );
}

//---------------------------------------------------------------------------------

