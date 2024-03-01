>
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded event fired.");

    var globalProfitInput = document.getElementById("global-profit");
    var businessStateSelect = document.getElementById("business-state");
    var businessTypeSelect = document.getElementById("business-type");
    var totalTaxStateOutput = document.getElementById("total-tax-state");
    var percentageTaxStateOutput = document.getElementById("percentage-tax-state");
    var totalEffectiveTaxRateOutput = document.getElementById("total-effective-tax-rate");
    var ownershipInput = document.getElementById("ownership");
    var partnerProfitOutput = document.getElementById("partner-profit");
    var federalTaxOutput = document.getElementById("federal-tax");
    var federalTaxPercentageOutput = document.getElementById("federal-tax-percentage");
    
    function calculateTaxRefund() {
        var withholdingTax = parseFloat(document.getElementById("withholding-tax").textContent.replace("$", ""));
        var federalTax = parseFloat(document.getElementById("federal-tax").textContent.replace("$", ""));

        if (!isNaN(withholdingTax) && !isNaN(federalTax)) {
            var taxRefund = withholdingTax - federalTax;
            document.getElementById("tax-refund-value").textContent = "$" + taxRefund.toFixed(2);
        } else {
            document.getElementById("tax-refund-value").textContent = "N/A";
        }
    }

    // Llama a las funciones de cálculo cuando los eventos relevantes ocurren
    globalProfitInput.addEventListener("input", function() {
        calculateTaxes();
        if (businessTypeSelect.value.toUpperCase() === "LLC-P") {
            calculateFederalTax(); // Recalcular el impuesto federal si el tipo de negocio es "LLC-P"
        }
        calculateTaxRefund(); // Agregado para actualizar el reembolso de impuestos cuando cambian los ingresos globales
    });
    businessStateSelect.addEventListener("change", function() {
        calculateTaxes();
        calculateTaxRefund(); // Agregado para actualizar el reembolso de impuestos cuando cambia el estado del negocio
    });
    businessTypeSelect.addEventListener("change", function() {
        calculateTaxes();
        if (businessTypeSelect.value.toUpperCase() === "LLC-P") {
            calculateFederalTax(); // Recalcular el impuesto federal si el tipo de negocio es "LLC-P"
        }
        calculateTaxRefund(); // Agregado para actualizar el reembolso de impuestos cuando cambia el tipo de negocio
    });
    ownershipInput.addEventListener("input", function() {
        calculatePartnerProfit();
        calculateStateTax();
        calculateFederalTax(); // Agrega esta línea para calcular los impuestos federales cuando cambie el ownership
        calculateTaxRefund(); // Agregado para actualizar el reembolso de impuestos cuando cambia el ownership
    });
    partnerProfitOutput.addEventListener("input", function() {
        if (businessTypeSelect.value.toUpperCase() === "LLC-P") {
            calculateTaxes();
            calculateFederalTax(); // Recalcular el impuesto federal cuando cambie el partner-profit y el tipo de negocio es "LLC-P"
            calculateTaxRefund(); // Agregado para actualizar el reembolso de impuestos cuando cambia el partner-profit
        }
    });



        // Definir los impuestos para cada estado y tipo de negocio
        var taxRates = 
        {
    "alabama": {
        "CORP": {"percentage": 6.50, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 5.00, "flat": 0}
    },
    "alaska": {
        "CORP": {"percentage": 4.70, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "arizona": {
        "CORP": {"percentage": 4.90, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 2.50, "flat": 0}
    },
    "arkansas": {
        "CORP": {"percentage": 3.00, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 3.00, "flat": 0}
    },
    "california": {
        "CORP": {"percentage": 8.84, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 6.65, "flat": 0}
    },
    "colorado": {
        "CORP": {"percentage": 4.55, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 4.55, "flat": 0}
    },
    "connecticut": {
        "CORP": {"percentage": 7.50, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 250},
        "LLC-P": {"percentage": 5.00, "flat": 0}
    },
    "delaware": {
        "CORP": {"percentage": 8.70, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 300},
        "LLC-P": {"percentage": 4.40, "flat": 0}
    },
    "florida": {
        "CORP": {"percentage": 5.50, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "georgia": {
        "CORP": {"percentage": 5.75, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "hawaii": {
        "CORP": {"percentage": 5.40, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 6.20, "flat": 0}
    },
    "idaho": {
        "CORP": {"percentage": 6.00, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 3.50, "flat": 0}
    },
    "illinois": {
        "CORP": {"percentage": 7.00, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "indiana": {
        "CORP": {"percentage": 4.90, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 3.15, "flat": 0}
    },
    "iowa": {
        "CORP": {"percentage": 7.00, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 5.00, "flat": 0}
    },
    "kansas": {
        "CORP": {"percentage": 5.50, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 5.40, "flat": 0}
    },
    "kentucky": {
        "CORP": {"percentage": 5.00, "flat": 0},
        "LLC-D": {"percentage": 5.00, "flat": 0},
        "LLC-P": {"percentage": 5.00, "flat": 0}
    },
    "louisiana": {
        "CORP": {"percentage": 5.50, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 3.00, "flat": 0}
    },
    "maine": {
        "CORP": {"percentage": 6.50, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 7.00, "flat": 0}
    },
    "maryland": {
        "CORP": {"percentage": 8.25, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "massachusetts": {
        "CORP": {"percentage": 6.50, "flat": 0},
        "LLC-D": {"percentage": 5.00, "flat": 0},
        "LLC-P": {"percentage": 5.00, "flat": 0}
    },
    "michigan": {
        "CORP": {"percentage": 6.00, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "minnesota": {
        "CORP": {"percentage": 9.80, "flat": 0},
        "LLC-D": {"percentage": 15.3, "flat": 0},
        "LLC-P": {"percentage": 7.60, "flat": 0}
    },
    "mississippi": {
        "CORP": {"percentage": 5.00, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 5.00, "flat": 0}
    },
    "missouri": {
        "CORP": {"percentage": 18.15, "flat": 0},
        "LLC-D": {"percentage": 3.40, "flat": 0},
        "LLC-P": {"percentage": 3.25, "flat": 0}
    },
    "montana": {
        "CORP": {"percentage": 6.75, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 3.87, "flat": 0}
    },
    "nebraska": {
        "CORP": {"percentage": 6.54, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 4.55, "flat": 0}
    },
    "nevada": {
        "CORP": {"percentage": 0, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "new hampshire": {
        "CORP": {"percentage": 7.50, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "new jersey": {
        "CORP": {"percentage": 8.25, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 6.00, "flat": 0}
    },
    "new york": {
        "CORP": {"percentage": 7.43, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 1395 },
        "LLC-P": {"percentage": 0, "flat": 2375}
    },
    "new mexico": {
        "CORP": {"percentage": 5.35, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 4.00, "flat": 0}
    },
    "north carolina": {
        "CORP": {"percentage": 2.50, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 4.75, "flat": 0}
    },
    "north dakota": {
        "CORP": {"percentage": 2.86, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 2.00, "flat": 0}
    },
    "ohio": {
        "CORP": {"percentage": 0, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 1130},
        "LLC-P": {"percentage": 4.00, "flat": 0}
    },
    "oklahoma": {
        "CORP": {"percentage": 4.00, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 3.00, "flat": 0}
    },
    "oregon": {
        "CORP": {"percentage": 7.10, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 7.80, "flat": 0}
    },
    "pennsylvania": {
        "CORP": {"percentage": 8.99, "flat": 0},
        "LLC-D": {"percentage": 3.07, "flat": 0},
        "LLC-P": {"percentage": 3.07, "flat": 0}
    },
    "rhode island": {
        "CORP": {"percentage": 7.00, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 400},
        "LLC-P": {"percentage": 5.00, "flat": 0}
    },
    "south carolina": {
        "CORP": {"percentage": 5.00, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 3.25, "flat": 0}
    },
    "south dakota": {
        "CORP": {"percentage": 0, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "tennessee": {
        "CORP": {"percentage": 0, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "texas": {
        "CORP": {"percentage": 0, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "utah": {
        "CORP": {"percentage": 4.85, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 4.65, "flat": 0}
    },
    "vermont": {
        "CORP": {"percentage": 7.00, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 7.00, "flat": 0}
    },
    "virginia": {
        "CORP": {"percentage": 6.00, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "west virginia": {
        "CORP": {"percentage": 6.50, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "washington": {
        "CORP": {"percentage": 0, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    },
    "wisconsin": {
        "CORP": {"percentage": 7.90, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 7.65, "flat": 0}
    },
    "wyoming": {
        "CORP": {"percentage": 0, "flat": 0},
        "LLC-D": {"percentage": 0, "flat": 0},
        "LLC-P": {"percentage": 0, "flat": 0}
    }
}

;


function calculateTaxes() {
        // Calcula los impuestos estatales y federales
        calculateStateTax();
        calculateFederalTax();
        calculateTotalEffectiveTaxRate();
        calculatePartnerProfit();
    }
    

   
    function calculateStateTax() {
    var globalProfit = parseFloat(globalProfitInput.value);
    var businessType = businessTypeSelect.value.toUpperCase();
    var state = businessStateSelect.value.toLowerCase();

    var stateTaxRate;

    stateTaxRate = getStateTaxRate(state, businessType);

    if (!isNaN(globalProfit) && stateTaxRate !== null) {
        var stateTax;

        if (stateTaxRate.flat !== 0) {
            stateTax = stateTaxRate.flat;
        } else {
            stateTax = globalProfit * (parseFloat(stateTaxRate.percentage) / 100);
        }

        totalTaxStateOutput.textContent = "$" + stateTax.toFixed(2);

        if (stateTaxRate.percentage !== 0) {
            percentageTaxStateOutput.textContent = stateTaxRate.percentage + "%";
        } else {
            percentageTaxStateOutput.textContent = ""; // Limpiar si no hay porcentaje
        }
        
        // Calculate withholding tax based on partner profit
        var partnerProfit = parseFloat(partnerProfitOutput.textContent.replace("$", ""));
        if (!isNaN(partnerProfit)) {
            var withholdingTax = partnerProfit * 0.37;
            document.getElementById("withholding-tax").textContent = "$" + withholdingTax.toFixed(2);
        } else {
            document.getElementById("withholding-tax").textContent = "N/A";
        }
    } else {
        totalTaxStateOutput.textContent = "N/A";
        percentageTaxStateOutput.textContent = ""; // Limpiar si no hay porcentaje
        document.getElementById("withholding-tax").textContent = "N/A"; // Limpiar el impuesto retenido
    }
}








function calculateFederalTax() {
    var globalProfit = parseFloat(globalProfitInput.value);
    var businessType = businessTypeSelect.value.toUpperCase();

    if (!isNaN(globalProfit)) {
        var federalTax;
        var federalTaxPercentage;

        if (businessType === "CORP") {
            // Si el tipo de negocio es "CORP", el impuesto federal siempre es el 21%
            federalTaxPercentage = 21;
            federalTax = globalProfit * (federalTaxPercentage / 100);
        } else {
            // Calcula el impuesto federal según las tasas escalonadas normales o el global profit para LLC-P
            federalTax = calculateFederalTaxAmount(globalProfit);
            federalTaxPercentage = calculateFederalTaxPercentage(globalProfit);
        }

        var federalTaxOutput = document.getElementById("federal-tax");
        var federalTaxPercentageOutput = document.getElementById("federal-tax-percentage");

        federalTaxOutput.textContent = "$" + federalTax.toFixed(2);
        federalTaxPercentageOutput.textContent = federalTaxPercentage + "%";

        // Calculate withholding tax based on partner profit
        var partnerProfit = parseFloat(partnerProfitOutput.textContent.replace("$", ""));
        if (!isNaN(partnerProfit)) {
            var withholdingTax = partnerProfit * 0.37;
            document.getElementById("withholding-tax").textContent = "$" + withholdingTax.toFixed(2);
        } else {
            document.getElementById("withholding-tax").textContent = "N/A";
        }
    } else {
        var federalTaxOutput = document.getElementById("federal-tax");
        var federalTaxPercentageOutput = document.getElementById("federal-tax-percentage");

        federalTaxOutput.textContent = "N/A";
        federalTaxPercentageOutput.textContent = "N/A";
        document.getElementById("withholding-tax").textContent = "N/A"; // Limpiar el impuesto retenido
    }
}





    function calculateTotalEffectiveTaxRate() {
        var stateTax = parseFloat(totalTaxStateOutput.textContent.replace("$", ""));
        var federalTax = parseFloat(document.getElementById("federal-tax").textContent.replace("$", ""));

        console.log("State Tax:", stateTax);
        console.log("Federal Tax:", federalTax);

        var totalTax = stateTax + federalTax;
        console.log("Total Tax:", totalTax);

        totalEffectiveTaxRateOutput.textContent = "$" + totalTax.toFixed(2);
        console.log("Total Effective Tax Rate:", totalTax.toFixed(2));

        calculateTotalEffectiveTaxPercentage();
    }





    function calculateTotalEffectiveTaxPercentage() {
    var globalProfit = parseFloat(globalProfitInput.value);
    var totalEffectiveTax = parseFloat(totalEffectiveTaxRateOutput.textContent.replace("$", ""));

    if (!isNaN(globalProfit) && !isNaN(totalEffectiveTax) && globalProfit > 0) {
        var totalEffectiveTaxPercentage = (totalEffectiveTax / globalProfit) * 100;
        document.getElementById("effective-tax-percentage").textContent = totalEffectiveTaxPercentage.toFixed(2) + "%";
    } else {
        document.getElementById("effective-tax-percentage").textContent = "N/A";
    }
}




    function calculatePartnerProfit() {
        var globalProfit = parseFloat(globalProfitInput.value);
        var ownershipPercentage = parseFloat(ownershipInput.value);
        
        if (!isNaN(globalProfit) && !isNaN(ownershipPercentage)) {
            var partnerProfit = (ownershipPercentage / 100) * globalProfit;
            partnerProfitOutput.textContent = "$" + partnerProfit.toFixed(2);
        } else {
            partnerProfitOutput.textContent = "N/A";
        }
    }

    function calculateFederalTaxAmount(profit) {
        var taxAmount = 0;
        var brackets = [
            { from: 0, to: 11000, rate: 0.10 },
            { from: 11000, to: 44725, rate: 0.12 },
            { from: 44725, to: 95375, rate: 0.22 },
            { from: 95375, to: 182100, rate: 0.24 },
            { from: 182100, to: 231250, rate: 0.32 },
            { from: 231250, to: 578125, rate: 0.35 },
            { from: 578125, to: Infinity, rate: 0.37 }
        ];

        for (var i = 0; i < brackets.length; i++) {
            var bracket = brackets[i];
            if (profit > bracket.from) {
                var taxableAmount = Math.min(profit, bracket.to) - bracket.from;
                taxAmount += taxableAmount * bracket.rate;
            } else {
                break;
            }
        }

        return taxAmount;
    }

    function calculateFederalTaxPercentage(profit) {
        var federalTax = calculateFederalTaxAmount(profit);
        var federalTaxPercentage = (federalTax / profit) * 100;
        return federalTaxPercentage.toFixed(2);
    }


    function getStateTaxRate(state, businessType) {
        var stateTaxRate = taxRates[state];
        if (stateTaxRate && stateTaxRate[businessType]) {
            return stateTaxRate[businessType];
        }
        return null;
    }

    });




    
    function updatePercentageDisplay() {
    var selectedBusinessType = businessTypeSelect.value.toUpperCase();
    var state = businessStateSelect.value.toLowerCase();

    var stateTaxRate;

    if (selectedBusinessType === "S-CORP") {
        // Obtener la tasa de impuestos correspondiente a "LLC-D" cuando el tipo de negocio sea "S-CORP"
        stateTaxRate = getStateTaxRate(state, "LLC-D");
    } else {
        stateTaxRate = getStateTaxRate(state, selectedBusinessType);
    }

    // Obtener o crear la línea del porcentaje
    var percentageLine = totalTaxStateOutput.parentNode.querySelector("output[name='percentage']");
    if (!percentageLine) {
        percentageLine = document.createElement("output");
        percentageLine.setAttribute("name", "percentage");
        totalTaxStateOutput.parentNode.appendChild(percentageLine);
    }

    // Mostrar u ocultar la línea del porcentaje y actualizar su contenido
    if (stateTaxRate && stateTaxRate.percentage !== 0) {
        percentageLine.textContent = stateTaxRate.percentage + "%";
    } else {
        percentageLine.textContent = ""; // Ocultar el porcentaje si no es relevante
    }
}
    
