// ==UserScript==
// @name         ChitChatsCurrencyConverter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://chitchats.com/clients/*
// @grant        none
// ==/UserScript==
const url = 'https://free.currconv.com/api/v7/convert?q=USD_CAD&compact=ultra&apiKey='
const api_key = '<your api key>'
const currencyUrl = url+api_key;

var USDtoCAD = 0
async function fetchUSDtoCAD() {
    const response = await fetch(currencyUrl, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json()
}
async function convertCurrencies() {
    const tableContainer = document.getElementsByClassName("js-shipments-table");
    const rowContainers = tableContainer[0].getElementsByTagName("tr")
    for(const row of rowContainers) {

        const currencyDataCellInUSD = row.querySelectorAll('.text-right')[0];
        const cellValue = currencyDataCellInUSD.textContent
        if(cellValue != NaN) {
            const convertedValue = cellValue.replace('$','')
            console.log("numbers", convertedValue, USDtoCAD)
            const CADValue = (convertedValue / USDtoCAD ).toFixed(2)
            var CADValueComponent = document.createElement('div');
            CADValueComponent.textContent = '$CAD ' + CADValue;
            currencyDataCellInUSD.appendChild(CADValueComponent)
        }
    }
}

function scriptEntry(selectors, time) {
    let ready = true;
    for (const selector of selectors) {
        ready &= (document.querySelector(selector) !== null);
    }

    if (ready) {
        fetchUSDtoCAD().then( (data) => {
            USDtoCAD = data.USD_CAD;
            convertCurrencies().catch(error => console.error("error", error))
        });
    }
}

scriptEntry(['.js-shipments-table'], 250);