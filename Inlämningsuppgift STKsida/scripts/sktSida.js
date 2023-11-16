document.addEventListener("DOMContentLoaded", function () { /* ser till att all den andra koden körs bara när all html element är helt redo och åtkombara*/
    var NyInformationKnapp = document.getElementById("NyInformationKnapp");
    var SökbarInskrift = document.getElementById("SökbarInskrift");
    var SökResultatHållare = document.getElementById("SökResultat");
    var PopupFönster = document.getElementById("MittPopup");
    var PopupInnehåll = document.getElementById("PopupInnehåll");
    var StängPopup = document.getElementById("StängPopup");  /*variablar som plockar upp referenser till olika HTML element genom att andvända getElementById*/

    NyInformationKnapp.addEventListener("click", function () {/*när knappen med id NyInformationKnapp klickas så ropar den på dessa 2 functioner*/ 
        RensaFormulärFält();
        ÖppnaNyttFormulär(); 
    });

    SökbarInskrift.addEventListener("input", function () {   /* denna bit kod lyssnar av för när texten i sökfältet ändras och sedan tittar igenom sparad formulär och sedan uppdaterar sökresultaten */

        var SökText = SökbarInskrift.value.toLowerCase();
        var SparadeFormulär = JSON.parse(localStorage.getItem("Formulär")) || [];

        var SökResultat = SparadeFormulär.filter(function (form) {
            return form.filmnamn.toLowerCase().includes(SökText);
        });

        UppdateraSökResultat(SökResultat); 
    });

    function UppdateraSökResultat(Resultater) { /*denna fuction tar en lista med SökResultat och andvänder den för att uppdatera HTML SökResultatHållare */
        SökResultatHållare.innerHTML = "";

        Resultater.forEach(function (Resultat) {
            var ResultatObject = document.createElement("div");
            ResultatObject.textContent = Resultat.filmnamn;
            ResultatObject.addEventListener("click", function () {
                ÖppnaPopup(Resultat);
            });

            SökResultatHållare.appendChild(ResultatObject);
        });
    }

    function ÖppnaPopup(form) { /*den här koden skapar innehållet för popupfönstret baserat på vilket formulär som valts */
        var content = document.createElement("div");
        content.innerHTML = `<h2>${form.filmnamn}</h2>
          <p><strong>Beskrivning:</strong> ${form.beskrivning}</p>
          <p>Denna film är menad för personer <strong>${form.åldersgräns.replace(/\D/g, '')}</strong> år gamla eller äldre</p>`; /*i denna del så har vi lagt till .replace(/\D/g, '' denna kod tar bara och ersätter allt som inte är bokstäver till ingenting*/

        PopupInnehåll.innerHTML = "";
        PopupInnehåll.appendChild(content);
        PopupFönster.style.display = "block";
    }

    StängPopup.addEventListener("click", function () { /*den här functionen lyssnar efter att x knappen på popupfönstret klickas och när den klickas så gömmer den popupfönstret */
        PopupFönster.style.display = "none";
    });

    function RensaFormulärFält() { /*den här functionen tar bara bort allt inskrivet i HTML-elementet som har id PopupInnehåll */
        PopupInnehåll.innerHTML = "";
    }

    function ÖppnaNyttFormulär() { /*denna kod är den som faktiskt hanterar skapandet och visandet av nya formulär dessutom så lyssnar det på om formuläret skickas in och sparar informationen då i localstorage*/
        var content = document.createElement("div");
        content.innerHTML = `<h2>Lägg in ny information</h2>
          <form id="formulär" name="formulär" method="post" action="#"> 
            <h3>Film namn:</h3>
            <input type="text" name="filmnamn" id="filmnamn"/><br>
            <h4>Beskrivning: </h4><br>
            <small>(max 200 tecken)</small><br>
            <textarea name="beskrivning" id="beskrivning" cols="45" rows="5" maxlength="200"></textarea><br>
            <div>
              <h1>Åldersgräns: <br></h1>
              <input type="radio" id="0+" class="Åldersgräns" value="0" name="åldersgräns">
              <label>0+</label>
              <input type="radio" id="7+" class="Åldersgräns" value="7" name="åldersgräns">
              <label>7+</label>
              <input type="radio" id="11+" class="Åldersgräns" value="11" name="åldersgräns">
              <label>11+</label>
              <input type="radio" id="15+" class="Åldersgräns" value="15" name="åldersgräns">
              <label>15+</label><br>
              <input type="submit" value="Skicka in">
            </div>
          </form>`;

        PopupInnehåll.appendChild(content);
        PopupFönster.style.display = "block";

        var form = document.getElementById("formulär");

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            var formData = { /*combinerar de 3 olika elementens värden till ett värde som är lättare att spara och andvända */
                filmnamn: document.getElementById("filmnamn").value,
                beskrivning: document.getElementById("beskrivning").value,
                åldersgräns: getSelectedÅldersgräns(),
            };

            var SparadeFormulär = JSON.parse(localStorage.getItem("Formulär")) || [];
            SparadeFormulär.push(formData);
            localStorage.setItem("Formulär", JSON.stringify(SparadeFormulär));

            RensaFormulärFält();
            UppdateraSökResultat([]);
            PopupFönster.style.display = "none";
        });
    }

    function getSelectedÅldersgräns() { /*denna kod är ansvarig att för att ge informationen om vilken av radioknapparna som klickats i formuläret för att sedan sparas */
        var åldersgränsRadios = document.getElementsByName("åldersgräns");
        for (var i = 0; i < åldersgränsRadios.length; i++) {
            if (åldersgränsRadios[i].checked) {
                return åldersgränsRadios[i].value.replace(/\D/g, '');
            }
        }
        return null;
    }
});
