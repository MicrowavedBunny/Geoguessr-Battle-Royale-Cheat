// ==UserScript==
// @name		Geoguessr Battle Royale Cheat
// @version		1.0.0
// @description	
// @author		MicrowavedBunny
// @require https://code.jquery.com/jquery-3.1.1.min.js
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/3.3.2/jquery-migrate.js
// @require     https://cdn.jsdelivr.net/gh/bigdatacloudapi/js-reverse-geocode-client@latest/bigdatacloud_reverse_geocode.min.js
// @match		https://www.geoguessr.com/*
// @grant       GM_xmlhttpRequest
// ==/UserScript==

var locationInfo;
var lat;
var lng;
var currentRound;

function getToken() {
	const raw = document.querySelectorAll("#__NEXT_DATA__")[0].text;
	const json = JSON.parse(raw);
	const token = json.query.token;

	return token;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(function() {
	'use strict';
    var roundn = 0;
		var guessr = function () {
			let done = Array.from(document.getElementsByClassName("popup-view__header")).find(e => e.innerText.includes('qualified'));
			if (done){
				console.log("done here");
			}
			if (!done){
				function $(d) { return document.getElementById(d); }
				roundn += 1;


                GM_xmlhttpRequest({
					method: "post",
					url: "https://game-server.geoguessr.com/api/battle-royale/"+getToken()+"/guess",
					headers: { "Content-type" : "application/json" },
					data: "{\"countryCode\":\"in\",\"roundNumber\":"+roundn+"}",
					onload: function(e) { //console.log(e)

                        const json = JSON.parse(e.responseText);
                        currentRound = json.currentRoundNumber;
                        const rounds = json.rounds;

                        //console.log(json);
                        //console.log(rounds);
                        //console.log(currentRound);

                        lat = (rounds[currentRound - 1].lat);
                        lng = (rounds[currentRound - 1].lng);

						console.log("Send india guess for round "+currentRound);
                        console.log(json);




// 							await sleep(3000);
					}
				});}
		};


    var restarter = function () {
			let but = Array.from(document.getElementsByClassName("button button--medium button--ghost")).find(e => e.textContent === 'Play again');
		if(but){
			but.click();
		}
	};


	window.setInterval(guessr, 10000);
 	window.setInterval(restarter, 30000);


    document.onkeydown = evt => {
        evt = evt || window.event;
        if(lat != null){

        if(evt.shiftKey && evt.altKey && evt.keyCode == 72){
            GM_xmlhttpRequest({
					method: "post",
					url: "https://game-server.geoguessr.com/api/battle-royale/"+getToken()+"/guess",
					headers: { "Content-type" : "application/json" },
					data: "{\"countryCode\":\""+locationInfo.results[0].components.country_code+"\",\"roundNumber\":"+currentRound+"}",
            onload: function(e) {
            }
            });
            //
        }

        if(evt.shiftKey && evt.altKey && evt.keyCode == 71){
                        GM_xmlhttpRequest({
                                method: "get",
                                url: "https://api.opencagedata.com/geocode/v1/json?q="+lat+","+lng+"&key=7d5b74fc2db041ccbe74ee3d2039d785",
                                onload: function(response) {
                                locationInfo = JSON.parse(response.responseText);
                                    console.log(locationInfo);
                                alert(locationInfo.results[0].components.country);
                            }
                        });
        }}
    };
})();

