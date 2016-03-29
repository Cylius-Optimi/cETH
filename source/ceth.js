/*======================================\\
|| ETH Ticker                           ||
|| Created by Cylius Optimi             ||
|| Displays the mɃ, $, or € ETH prices. ||
|| http://github.com/Cylius-Optimi/cETH ||
\\======================================*/

var ceth = {
	updatePrice: function() {
		
		chrome.browserAction.setBadgeText({text:"..."});
		
		//Get the BTC-ETH price from the Bittrex Public API.
		ceth.req.open("GET", "https://bittrex.com/api/v1.1/public/getticker?market=btc-eth", true);
		ceth.req.responseType = "json";
		ceth.req.onload = function() {
			
			//Calculate the change in price.
			ceth.price.btc.last = ceth.price.btc.current,
			ceth.price.btc.current = ceth.req.response.result.Last,
			ceth.price.change = ceth.price.btc.current - ceth.price.btc.last;
			
			//Get the USDT-BTC price from the Bittrex Public API.
			ceth.req.open("GET", "https://bittrex.com/api/v1.1/public/getticker?market=usdt-btc", true);
			ceth.req.responseType = "json";
			ceth.req.onload = function() {
				
				ceth.price.usd = ceth.price.btc.current * ceth.req.response.result.Last;
				
				//Get information about other currencies from the fixer.io Public API.
				ceth.req.open("GET", "http://api.fixer.io/latest?base=usd", true);
				ceth.req.responseType = "json";
				ceth.req.onload = function() {
					
					//For every other supported currency, define a value from these numbers.
					//Provides a simple structure for adding any currency.
					for (var currency in ceth.price) {
						switch (currency) {
							case "change": case "btc": case "usd": continue;
							default: {
								ceth.price[currency] = ceth.price.usd * ceth.req.response.rates[currency.toUpperCase()];
								
								//Debug.
								console.log("Currency: " + currency + "\nValue: " + ceth.price[currency]);
							};
						}
					}
					
					//Update the UI with the new definitions.
					ceth.updateUI();
					
				};
				ceth.req.onerror = function() { ceth.updateError(); };
				
				ceth.req.send();
				
			};
			ceth.req.onerror = function() { ceth.updateError(); };
			
			ceth.req.send();
			
		};
		ceth.req.onerror = function () { ceth.updateError(); };
		
		ceth.req.send();
		
	},
	updateUI: function() {
		
		//Set badge text based on price.
		var text = "";
		if (ceth.shownPrice === "btc") {
			text += ceth.truncBtc(ceth.price.btc.current);
		} else {
			text += ceth.truncFiat(ceth.price[ceth.shownPrice]);
		}
		chrome.browserAction.setBadgeText({text});
		
		//Set background color based on change.
		var color;
		if (ceth.price.change > 0) {
			color = "#0F0";
		} else if (ceth.price.change < 0) {
			color = "#F00";
		} else {
			color = "#00F";
		}
		chrome.browserAction.setBadgeBackgroundColor({color});
		
		//Set subtext.
		var title = "cETH (by Cylius Optimi)\nCurrent Unit: ";
		switch (ceth.shownPrice) {
			case ("btc"): {
				title += "mɃ (Ƀ0.001)";
				break;
			}
			case ("usd"): {
				title += "$ (U.S. Dollars)";
				break;
			}
			case ("eur"): {
				title += "€ (E.U. Euros)";
				break;
			}
		}
		chrome.browserAction.setTitle({title});
		
	},
	updateError: function() {
		
		//Output the current XMLHttpRequest status.
		console.error(ceth.req.statusText);
		
		//Update the icon accordingly.
		chrome.browserAction.setBadgeBackgroundColor("#AA0");
		chrome.browserAction.setBadgeText({text:"?" + chrome.browserAction.getBadgeText()});
		
	},
	
	truncBtc: function(btc) {
		return (Math.floor(btc * 10000) / 10.0);
	},
	truncFiat: function(fiat) {
		return (Math.floor(fiat * 10) / 10.0);
	},
	
	req: new XMLHttpRequest(),
	
	//Update the prices every minute.
	timer: setInterval(function() { ceth.updatePrice() }, 60000),
	
	price: {
		btc: {
			current: 0,
			last: undefined
		},
		usd: 0,
		eur: 0,
		change: 0
	},
	
	shownPrice: "btc"
};

chrome.browserAction.setBadgeBackgroundColor({color:"#999"});
chrome.browserAction.onClicked.addListener(function() {
		
	//Cycle through available options.
	//This will eventually be replaced by a dropdown box.
	switch (ceth.shownPrice) {
		case "btc": {
			ceth.shownPrice = "usd";
			ceth.updateUI();
			break;
		}
		case "usd": {
			ceth.shownPrice = "eur";
			ceth.updateUI();
			break;
		}
		case "eur": {
			ceth.shownPrice = "btc";
			ceth.updateUI();
			break;
		}
	}
	
});

//Update cETH on first load.
ceth.updatePrice();
