/////////////////////////
//CODIGO EXISTENTE EN LA PAGINA DE CALCULADORA SE MOVIO ACA PARA TENER TODO EN UN MISMO ARCHIVO
/////////////////////////

//OCULTAR ELEMENTOS NO NECESARIOS PARA LA VISTA DEFAULT DE LAS CALCULADORAS

document.addEventListener("DOMContentLoaded", function () {
  var selectBusinessType = document.getElementById("business-type");
  var hiddenElements = [
    "container-ownership",
    "ownership-results-1",
    "ownership-results-2",
  ];

  function toggleElementsOwnership(type) {
    hiddenElements.forEach(function (elementId) {
      document.getElementById(elementId).style.display = type;
    });
  }

  function toggleElementsVisibility(value) {
    //Funcion para nueva calculadora
    if (value === "LLC-P") {
      //Mostrar elementos ocultos
      toggleElementsOwnership("flex");

      // Ocultar resultados simples
      document.getElementById("no-ownership-results").style.display = "none";
    } else {
      //Ocultar elementos
      toggleElementsOwnership("none");

      // Mostrar resultados simples
      document.getElementById("no-ownership-results").style.display = "flex";
    }
  }

  selectBusinessType.addEventListener("change", function () {
    toggleElementsVisibility(this.value);
  });

  // Ocultar elementos por defecto
  toggleElementsOwnership("none");
});

/////////////////////////
//EVITAR CAMPOS LLENOS AL CARGAR LA PAGINA
/////////////////////////

$(
  "#global-profit-sales, #global-profit, #ownership, #business-state, #business-type, #sales-states-price"
).val("");

/////////////////////////
//PERMITIR SOLO NUMEROS
/////////////////////////

$("#global-profit-sales, #global-profit")
  .keydown(function (event) {
    //Salir del campo al presionar enter
    if (event.which == 13) {
      $(this).blur();
    }
  })
  .keypress(function (event) {
    if (event.which < 48 || event.which > 57) {
      event.preventDefault();
    }
  })
  .on("paste", function (event) {
    event.preventDefault();
  });

/////////////////////////
//CAMPOS SOLO CON 7 DIGITOS
/////////////////////////

$("#global-profit-sales, #global-profit")
  .unbind("keyup change input paste")
  .bind("keyup change input paste", function (e) {
    var maxCount = 7;
    if ($(this).val().length > maxCount) {
      $(this).val($(this).val().substring(0, maxCount));
    }
  });

/////////////////////////
//PERMITIR SOLO NUMEROS Y PUNTO
/////////////////////////

$("#ownership")
  .keydown(function (event) {
    //Salir del campo al presionar enter
    if (event.which == 13) {
      $(this).blur();
    }
    //No permitir que el valor sea mayor a 100
    var key = event.key;
    if (key >= "0" && key <= "9") {
      var newValue = parseFloat($(this).val() + key);
      //console.log(newValue);
      if (newValue > 100) {
        event.preventDefault();
      }
    }
  })
  .keypress(function (event) {
    if (
      (event.which != 46 ||
        (event.which == 46 && $(this).val() == "") ||
        $(this).val().indexOf(".") != -1) &&
      (event.which < 48 || event.which > 57)
    ) {
      event.preventDefault();
    }
  })
  .on("paste", function (event) {
    event.preventDefault();
  });

/////////////////////////
//CAMPOS SOLO CON 5 DIGITOS
/////////////////////////

$("#ownership")
  .unbind("keyup change input paste")
  .bind("keyup change input paste", function (e) {
    var maxCount = 5;
    if ($(this).val().length > maxCount) {
      $(this).val($(this).val().substring(0, maxCount));
    }
  });

/////////////////////////
//INCOME TAX CALCULATOR
/////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  //console.log("DOMContentLoaded event fired.");
  var globalProfitInput = document.getElementById("global-profit");
  var businessStateSelect = document.getElementById("business-state");
  var businessTypeSelect = document.getElementById("business-type");
  var totalTaxStateOutput = document.getElementById("total-tax-state");
  var percentageTaxStateOutput = document.getElementById(
    "percentage-tax-state"
  );
  var totalEffectiveTaxRateOutput = document.getElementById(
    "total-effective-tax-rate"
  );
  var totalOwnershipOutput = document.getElementById(
    "total-effective-tax-rate-ownership-calc"
  );
  var OwnershipFederalTaxOutput = document.getElementById(
    "federal-tax-ownership-calc"
  );
  var OwnershipFederalTaxPercentageOutput = document.getElementById(
    "federal-tax-percentage-ownership-calc"
  );
  var OwnershipStateTaxOutput = document.getElementById(
    "state-tax-ownership-calc"
  );
  var OwnershipStateTaxPercentageOutput = document.getElementById(
    "state-tax-percentage-ownership-calc"
  );
  var ownershipInput = document.getElementById("ownership");
  var partnerProfitOutput = document.getElementById("partner-profit");
  var federalTaxOutput = document.getElementById("federal-tax");
  var federalTaxPercentageOutput = document.getElementById(
    "federal-tax-percentage"
  );

  function calculateTaxRefund() {
    var withholdingTax = parseFloat(
      document
        .getElementById("withholding-tax")
        .textContent.replace(/[$,]/g, "")
    );
    var federalTax = parseFloat(
      document
        .getElementById("federal-tax")
        .textContent.replace(/[$,]/g, "")
    );

    if (!isNaN(withholdingTax) && !isNaN(federalTax)) {
      var taxRefund = withholdingTax - federalTax;
      document.getElementById("tax-refund-value").textContent =
        moneyFormat(taxRefund);
    } else {
      document.getElementById("tax-refund-value").textContent = "$0";
    }
  }

  // Llama a las funciones de cálculo cuando los eventos relevantes ocurren
  globalProfitInput.addEventListener("input", function () {
    //Funciones a ejecutar si es un LLC-P
    if (businessTypeSelect.value.toUpperCase() === "LLC-P") {
      calculatePartnerProfit();
      calculateStateTax();
      calculateFederalTax(); // Agrega esta línea para calcular los impuestos federales cuando cambie el ownership
      calculateTaxRefund(); // Agregado para actualizar el reembolso de impuestos cuando cambia el ownership
      calculateTotalEffectiveTaxRate();
    } else {
      //Si se trata de otro negocio solo realizar calculo de taxes
      calculateTaxes();
      calculateTaxRefund(); // Agregado para actualizar el reembolso de impuestos cuando cambian los ingresos globales
    }
  });
  businessStateSelect.addEventListener("change", function () {
    calculateTaxes();
    calculateTaxRefund(); // Agregado para actualizar el reembolso de impuestos cuando cambia el estado del negocio
  });
  businessTypeSelect.addEventListener("change", function () {
    calculateTaxes();
    if (businessTypeSelect.value.toUpperCase() === "LLC-P") {
      calculateFederalTax(); // Recalcular el impuesto federal si el tipo de negocio es "LLC-P"
    }
    calculateTaxRefund(); // Agregado para actualizar el reembolso de impuestos cuando cambia el tipo de negocio
  });
  ownershipInput.addEventListener("input", function () {
    calculatePartnerProfit();
    calculateStateTax();
    calculateFederalTax(); // Agrega esta línea para calcular los impuestos federales cuando cambie el ownership
    calculateTaxRefund(); // Agregado para actualizar el reembolso de impuestos cuando cambia el ownership
    calculateTotalEffectiveTaxRate();
  });
  partnerProfitOutput.addEventListener("input", function () {
    if (businessTypeSelect.value.toUpperCase() === "LLC-P") {
      calculateTaxes();
      calculateFederalTax(); // Recalcular el impuesto federal cuando cambie el partner-profit y el tipo de negocio es "LLC-P"
      calculateTaxRefund(); // Agregado para actualizar el reembolso de impuestos cuando cambia el partner-profit
    }
  });

  // Definir los impuestos para cada estado y tipo de negocio
  var taxRates = {
    "alabama": {
        "CORP": { "percentage": 6.5, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "alaska": {
        "CORP": { "percentage": 4.7, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "arizona": {
        "CORP": { "percentage": 4.9, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "arkansas": {
        "CORP": { "percentage": 3.0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "california": {
        "CORP": { "percentage": 8.84, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "colorado": {
        "CORP": { "percentage": 4.55, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "connecticut": {
        "CORP": { "percentage": 7.5, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 250 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "delaware": {
        "CORP": { "percentage": 8.7, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "florida": {
        "CORP": { "percentage": 5.5, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "georgia": {
        "CORP": { "percentage": 5.75, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "hawaii": {
        "CORP": { "percentage": 5.4, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "idaho": {
        "CORP": { "percentage": 6.0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "illinois": {
        "CORP": { "percentage": 7.0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "indiana": {
        "CORP": { "percentage": 4.9, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "iowa": {
        "CORP": { "percentage": 7.0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "kansas": {
        "CORP": { "percentage": 5.5, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "kentucky": {
        "CORP": { "percentage": 5.0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "louisiana": {
        "CORP": { "percentage": 5.5, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "maine": {
        "CORP": { "percentage": 6.5, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "maryland": {
        "CORP": { "percentage": 8.25, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "massachusetts": {
        "CORP": { "percentage": 6.5, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "michigan": {
        "CORP": { "percentage": 6.0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "minnesota": {
        "CORP": { "percentage": 9.8, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "mississippi": {
        "CORP": { "percentage": 5.0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "missouri": {
        "CORP": { "percentage": 18.15, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "montana": {
        "CORP": { "percentage": 6.75, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "nebraska": {
        "CORP": { "percentage": 6.54, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "nevada": {
        "CORP": { "percentage": 0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "new hampshire": {
        "CORP": { "percentage": 7.5, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "new jersey": {
        "CORP": { "percentage": 8.25, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "new mexico": {
        "CORP": { "percentage": 5.35, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "new york": {
        "CORP": { "percentage": 7.43, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 1395 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "north carolina": {
        "CORP": { "percentage": 2.5, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "north dakota": {
        "CORP": { "percentage": 2.86, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "ohio": {
        "CORP": { "percentage": 0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 1130 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "oklahoma": {
        "CORP": { "percentage": 4.0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "oregon": {
        "CORP": { "percentage": 7.1, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "pennsylvania": {
        "CORP": { "percentage": 8.99, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "rhode island": {
        "CORP": { "percentage": 7.0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 400 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "south carolina": {
        "CORP": { "percentage": 5.0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "south dakota": {
        "CORP": { "percentage": 0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "tennessee": {
        "CORP": { "percentage": 0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "texas": {
        "CORP": { "percentage": 0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "utah": {
        "CORP": { "percentage": 4.85, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "vermont": {
        "CORP": { "percentage": 7.0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "virginia": {
        "CORP": { "percentage": 6.0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "washington": {
        "CORP": { "percentage": 0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "west virginia": {
        "CORP": { "percentage": 6.5, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "wisconsin": {
        "CORP": { "percentage": 7.9, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    },
    "wyoming": {
        "CORP": { "percentage": 0, "flat": 0 },
        "LLC-D": { "percentage": 0, "flat": 0 },
        "LLC-P": { "percentage": 0, "flat": 0 }
    }
  };

  function calculateTaxes() {
    // Calcula los impuestos estatales y federales
    calculateStateTax();
    calculateFederalTax();
    calculateTotalEffectiveTaxRate();
    calculatePartnerProfit();
  }

  function calculateStateTax() {
    var businessType = businessTypeSelect.value.toUpperCase();
    var state = businessStateSelect.value.toLowerCase();

    var stateTaxRate = getStateTaxRate(state, businessType);

    if (stateTaxRate !== null) {
      var stateTax;
      var partnerProfit = parseFloat(partnerProfitOutput.textContent.replace(/[$,]/g, ""));

      if (businessType === "LLC-P" && !isNaN(partnerProfit)) {
        // Calcula el impuesto estatal basado en las ganancias del socio para LLC-P
        if (stateTaxRate.flat !== 0) {
          stateTax = stateTaxRate.flat;
        } else {
          stateTax =
            partnerProfit * (parseFloat(stateTaxRate.percentage) / 100);
        }
      } else {
        // Calcula el impuesto estatal basado en el global profit para otros tipos de negocio
        var globalProfit = parseFloat(globalProfitInput.value);

        //Modificaciones 2025
        //Si es el tipo es CORP y el monto es mayor a 50,000 en el estado seleccionado de florida se modifica el valor global
        if (
          businessType === "CORP" &&
          globalProfit > 50000 &&
          state === "florida"
        ) {
          globalProfit = globalProfit - 50000;
          //console.log("Restante de valor florida: " + globalProfit);
        }

        if (!isNaN(globalProfit)) {
          if (stateTaxRate.flat !== 0) {
            stateTax = stateTaxRate.flat;
          } else {
            stateTax =
              globalProfit * (parseFloat(stateTaxRate.percentage) / 100);
          }
        } else {
          stateTax = NaN;
        }
      }

      if (!isNaN(stateTax)) {
        totalTaxStateOutput.textContent = moneyFormat(stateTax);
        OwnershipStateTaxOutput.textContent = moneyFormat(stateTax);
        if (stateTaxRate.percentage !== 0) {
          percentageTaxStateOutput.textContent = stateTaxRate.percentage + "%";
          OwnershipStateTaxPercentageOutput.textContent =
            stateTaxRate.percentage + "%";

          // Agrega el signo de igual solo si ambos tienen contenido
          if (
            totalTaxStateOutput.textContent !== "" &&
            percentageTaxStateOutput.textContent !== ""
          ) {
            //percentageTaxStateOutput.textContent += " = ";
            //percentageTaxStateOutput.textContent += " = ";
          }
        } else {
          percentageTaxStateOutput.textContent = "0%"; // Limpiar si no hay porcentaje
          OwnershipStateTaxPercentageOutput.textContent = "0%"; // Limpiar si no hay porcentaje

          //Si es tipo LLC-D y se trata de un estado por impuesto Flat mostrar la palabra Flat en lugar de porcentaje
          if (businessType === "LLC-D" && stateTaxRate.flat !== 0) {
            //percentageTaxStateOutput.textContent = "Flat"; // Limpiar si no hay porcentaje
          }
        }
      } else {
        totalTaxStateOutput.textContent = "$0";
        percentageTaxStateOutput.textContent = "0%"; // Limpiar si no hay porcentaje
        OwnershipStateTaxPercentageOutput.textContent = "0%"; // Limpiar si no hay porcentaje
      }

      // Calculate withholding tax based on partner profit
      if (!isNaN(partnerProfit)) {
        var withholdingTax = partnerProfit * 0.37;
        document.getElementById("withholding-tax").textContent =
          moneyFormat(withholdingTax);
      } else {
        document.getElementById("withholding-tax").textContent = "$0";
      }
    } else {
      totalTaxStateOutput.textContent = "$0";
      percentageTaxStateOutput.textContent = "0%"; // Limpiar si no hay porcentaje
      document.getElementById("withholding-tax").textContent = "$0"; // Limpiar el impuesto retenido
    }
  }

  function calculateFederalTax() {
    var businessType = businessTypeSelect.value.toUpperCase();

    var federalTax;
    var federalTaxPercentage;

    if (businessType === "CORP") {
      // Si el tipo de negocio es "CORP", el impuesto federal siempre es el 26.5%
      federalTaxPercentage = 26.5;
      federalTax = parseFloat(globalProfitInput.value) * 0.265; // Calcula el impuesto federal directamente como el 26.5% del global profit

      //Modificaciones 2025
      //Si el monto es mayor a 50,000 en el estado seleccionado de florida se modifica el tax federal
      /*if (
        parseFloat(globalProfitInput.value) > 50000 &&
        businessStateSelect.value.toLowerCase() === "florida"
      ) {
        federalTax = (parseFloat(globalProfitInput.value) - 50000) * 0.265; // Calcula el impuesto federal directamente como el 26.5% del global profit
        console.log("Restante de valor florida: " + federalTax);
      }*/
    } else {
      var partnerProfit = parseFloat(partnerProfitOutput.textContent.replace(/[$,]/g, ""));
	  
      if (!isNaN(partnerProfit) && businessType === "LLC-P") {
        // Calcula el impuesto federal basado en las ganancias del socio para LLC-P
        federalTax = calculateFederalTaxAmount(partnerProfit);
        federalTaxPercentage = calculateFederalTaxPercentage(partnerProfit);
      } else {
        // Calcula el impuesto federal basado en el global profit para otros tipos de negocio
        federalTax = calculateFederalTaxAmount(
          parseFloat(globalProfitInput.value)
        );
        federalTaxPercentage = calculateFederalTaxPercentage(
          parseFloat(globalProfitInput.value)
        );
      }
    }

    var federalTaxOutput = document.getElementById("federal-tax");
    var federalTaxPercentageOutput = document.getElementById(
      "federal-tax-percentage"
    );

    var OwnershipFederalTaxOutput = document.getElementById(
      "federal-tax-ownership-calc"
    );
    var OwnershipFederalTaxPercentageOutput = document.getElementById(
      "federal-tax-percentage-ownership-calc"
    );

    if (!isNaN(federalTax)) {
      federalTaxOutput.textContent = moneyFormat(federalTax);
      OwnershipFederalTaxOutput.textContent = moneyFormat(federalTax);
    } else {
      federalTaxOutput.textContent = "$0";
      OwnershipFederalTaxOutput.textContent = "$0";
    }

    if (!isNaN(federalTaxPercentage)) {
      federalTaxPercentageOutput.textContent =
        federalTaxPercentage + "%" /*+ " ="*/;

      OwnershipFederalTaxPercentageOutput.textContent =
        federalTaxPercentage + "%" /*+ " ="*/;
    } else {
      federalTaxPercentageOutput.textContent = "0%"; // Cambio aquí, si es NaN, establecer en 0%

      OwnershipFederalTaxPercentageOutput.textContent = "0%"; // Cambio aquí, si es NaN, establecer en 0%
    }

    // Calculate withholding tax based on partner profit
    var partnerProfit = parseFloat(partnerProfitOutput.textContent.replace(/[$,]/g, ""));
    if (!isNaN(partnerProfit)) {
      var withholdingTax = partnerProfit * 0.37;
      document.getElementById("withholding-tax").textContent =
        moneyFormat(withholdingTax);
    } else {
      document.getElementById("withholding-tax").textContent = "$0";
    }
  }

  function calculateTotalEffectiveTaxRate() {
    var stateTax = parseFloat(
      totalTaxStateOutput.textContent.replace(/[$,]/g, "")
    );
    var federalTax = parseFloat(
      document
        .getElementById("federal-tax")
        .textContent.replace(/[$,]/g, "")
    );

    console.log("State Tax:", stateTax);
    console.log("Federal Tax:", federalTax);

    var totalTax = stateTax + federalTax;
    console.log("Total Tax:", totalTax);

    totalEffectiveTaxRateOutput.textContent = moneyFormat(totalTax);
    totalOwnershipOutput.textContent = moneyFormat(totalTax);
    console.log("Total Effective Tax Rate:", totalTax.toFixed(0));

    calculateTotalEffectiveTaxPercentage();
  }

  function calculateTotalEffectiveTaxPercentage() {
    var totalEffectiveTax = parseFloat(
      totalEffectiveTaxRateOutput.textContent.replace(/[$,]/g, "")
    );

    if (!isNaN(totalEffectiveTax) && totalEffectiveTax > 0) {
      var totalEffectiveTaxPercentage;

      // Verificar si el tipo de negocio es LLC-P antes de calcular el porcentaje
      if (businessTypeSelect.value.toUpperCase() === "LLC-P") {
        var partnerProfit = parseFloat(partnerProfitOutput.textContent.replace(/[$,]/g, ""));
        if (!isNaN(partnerProfit) && partnerProfit > 0) {
          // Calcular el porcentaje efectivo basado en el beneficio del socio para LLC-P
          totalEffectiveTaxPercentage =
            (totalEffectiveTax / partnerProfit) * 100;
        } else {
          totalEffectiveTaxPercentage = "0"; // Indicar que no se puede calcular el porcentaje si no se proporciona el beneficio del socio
        }
      } else {
        // Para otros tipos de negocio, el porcentaje efectivo se mantiene como está
        totalEffectiveTaxPercentage = totalEffectiveTax;
      }

      // Mostrar el porcentaje efectivo de impuestos
      document.getElementById("effective-tax-percentage").textContent =
        totalEffectiveTaxPercentage.toFixed(1) + "%";
    } else {
      document.getElementById("effective-tax-percentage").textContent = "0%";
    }
  }

  function calculatePartnerProfit() {
    var globalProfit = parseFloat(globalProfitInput.value);
    var ownershipPercentage = parseFloat(ownershipInput.value);

    if (!isNaN(globalProfit) && !isNaN(ownershipPercentage)) {
      var partnerProfit = (ownershipPercentage / 100) * globalProfit;
      partnerProfitOutput.textContent = moneyFormat(partnerProfit);
    } else {
      partnerProfitOutput.textContent = "$0";
    }
  }

  function calculateFederalTaxAmount(profit) {
    var taxAmount = 0;
    var brackets = [
        { from: 0, to: 12400.00, rate: 0.10 },
        { from: 12400.00, to: 50400.00, rate: 0.12 },
        { from: 50400.00, to: 105700.00, rate: 0.22 },
        { from: 105700.00, to: 201775.00, rate: 0.24 },
        { from: 201775.00, to: 256225.00, rate: 0.32 },
        { from: 256225.00, to: 640600.00, rate: 0.35 },
        { from: 640600.00, to: Infinity, rate: 0.37 },
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
    return federalTaxPercentage.toFixed(1);
  }

  function getStateTaxRate(state, businessType) {
    var stateTaxRate = taxRates[state];
    if (stateTaxRate && stateTaxRate[businessType]) {
      //Modificaciones 2025
      //Si es el tipo es CORP y el monto es igual o menor a 50,000 en el estado seleccionado de florida el impuesto estatal es 0
      var globalProfit = parseFloat(globalProfitInput.value);

      if (
        businessType === "CORP" &&
        globalProfit <= 50000 &&
        state === "florida"
      ) {
        return null;
      } else {
        return stateTaxRate[businessType];
      }
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
  var percentageLine = totalTaxStateOutput.parentNode.querySelector(
    "output[name='percentage']"
  );
  if (!percentageLine) {
    percentageLine = document.createElement("output");
    percentageLine.setAttribute("name", "percentage");
    totalTaxStateOutput.parentNode.appendChild(percentageLine);
  }

  // Mostrar u ocultar la línea del porcentaje y actualizar su contenido
  if (stateTaxRate && stateTaxRate.percentage !== 0) {
    percentageLine.textContent = stateTaxRate.percentage + "%";
  } else {
    percentageLine.textContent = "0%"; // Ocultar el porcentaje si no es relevante
  }
}

/////////////////////////
//SALES TAX CALCULATOR
/////////////////////////

//Cuando cambia el selector de estado
$("#sales-states-price").on("change", function () {
  salesTaxFunction();
});

//Cuando cambia el monto
$("#global-profit-sales").on("input", function () {
  salesTaxFunction();
});

function salesTaxFunction() {
  var state_tax_val = $("#sales-states-price").val();
  var state_budget_val = $("#global-profit-sales").val();
  var state_tax_total = (state_tax_val * state_budget_val) / 100;

  $("#sales-price-text").text(moneyFormat(state_tax_total));
  $("#sales-tax-text").text(state_tax_val);
}

function moneyFormat(the_value_to_format) {
  //Money Format
  var money_formated =
    "$" +
    parseFloat(the_value_to_format, 10)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
      .toString();

  return money_formated;
}

/////////////////////////
//CODIGO PREGUNTAS FRECUENTES DE ARCHIVO ELIMINADO EN WEB
/////////////////////////

var variable;

$(".why-box")
  .eq(1 - 1)
  .addClass("active");

$(".home-faq-item")
  .eq(1 - 1)
  .addClass("active");

$(".why-trigger-box").on("click", function () {
  if ($(this).parents(".why-box").prev(".why-box").hasClass("no-border")) {
    variable = false;
  } else {
    variable = true;
  }
  $(".why-box").removeClass("no-border");
  if (variable) {
    $(this).parents(".why-box").prev(".why-box").addClass("no-border");
  } else {
    $(this).parents(".why-box").prev(".why-box").removeClass("no-border");
  }
  $(this).parents(".why-box").siblings(".why-box").removeClass("active");
  $(this).parents(".why-box").toggleClass("active");
});

$(".home-faq-trigger").on("click", function () {
  if (
    $(this)
      .parents(".home-faq-item")
      .prev(".home-faq-item")
      .hasClass("no-border")
  ) {
    variable = false;
  } else {
    variable = true;
  }
  $(".home-faq-item").removeClass("no-border");
  if (variable) {
    $(this)
      .parents(".home-faq-item")
      .prev(".home-faq-item")
      .addClass("no-border");
  } else {
    $(this)
      .parents(".home-faq-item")
      .prev(".home-faq-item")
      .removeClass("no-border");
  }
  $(this)
    .parents(".home-faq-item")
    .siblings(".home-faq-item")
    .removeClass("active");
  $(this).parents(".home-faq-item").toggleClass("active");
});

$(".home-faq-images-item")
  .eq(1 - 1)
  .addClass("active");
$(".home-faq-item").on("click", function () {
  $(".home-faq-images-item").removeClass("active");
  $(".home-faq-images-item")
    .eq($(this).index() + 1 - 1)
    .addClass("active");
});
