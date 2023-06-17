//Classes Implementation
class Vehiculo {
    constructor(id, modelo, anoFab, velMax) {
        if (id != null && modelo != null && anoFab != null && velMax != null){
            this.id = parseInt(id);
            this.modelo = ToTitleCase(modelo);
            this.anoFab = parseInt(anoFab);
            this.velMax = parseInt(velMax);
        }
    }
  }
  
  class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
        if (altMax != null && autonomia != null){
            super(id, modelo, anoFab, velMax);
            this.altMax = parseInt(altMax);
            this.autonomia = parseInt(autonomia);
        }
    }
  }

  class Terrestre extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
        if (cantPue != null && cantRue != null){
          super(id, modelo, anoFab, velMax);
          this.cantPue = parseInt(cantPue);
          this.cantRue = parseInt(cantRue);
        }
    }
  }

//Global instances
const ENDPOINT = "http://localhost:8080/SPLaboratorio/vehiculoAereoTerrestre.php";
const BAD_ENDPOINT = "http://localhost:8080/SPLaboratorio/BadRequest.php";
let globalArray;
let lastHeader;
let lastOrder;
let currentSorter = GetSorter("th0", "ASC");


//REQUESTS
function APIRequest_GET(){
    $("btn_add").disabled = true;
    SwapLoadingScreen();

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    };

    fetch(ENDPOINT, options)
        .then(response => {
            if (response.status == 200){
                $("btn_add").disabled = false;
                return response.json();
            }else{
                alert("Hubo un error procesando la solicitud GET para cargar la lista, inténtelo nuevamente");
                SwapLoadingScreen();
            }
        })
        .then(data => {
            globalArray = ParseJson(data);
            DrawTable();
            AddTableSortEvents();
            SwapLoadingScreen();
        })
        .catch(e => {
            console.log("Ha ocurrido un error inesperado: " + e);
            alert("Hubo un error procesando la solicitud GET para cargar la lista, inténtelo nuevamente");
            SwapLoadingScreen();
        });
}

function APIRequest_PUT(e, element){
    SwapLoadingScreen();
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (xhttp.readyState == 4){
            if (xhttp.status == 200){
                alert("Alta exitosa.");
                let response = JSON.parse(xhttp.response);
                element.id = parseInt(response.id);
                globalArray.push(element);
                ReDrawTable();
            } else {
                alert("No se pudo realizar el alta.");
            }
            SwitchView(e);
            SwapLoadingScreen();
        }
    }
    xhttp.open("PUT", ENDPOINT, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(element));
}


async function APIRequest_POST(e, element){
    SwapLoadingScreen();
    let response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(element),
    });

    if (response.status == 200){
        alert("Modificación exitosa.");
        DeleteItem(element.id);
        globalArray.push(element);
    } else {
        alert("No se pudo realizar la modificación.");
    }
    ReDrawTable();
    SwapLoadingScreen();
    SwitchView(e);
}

function APIRequest_DELETE(e, id){
    SwapLoadingScreen();
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (xhttp.readyState == 4){
            if (xhttp.status == 200){
                alert("Eliminación exitosa.");
                DeleteItem(id);
                ReDrawTable();
            } else {
                alert("No se pudo eliminar el elemento.");
            }
            SwapLoadingScreen();
            SwitchView(e);
        }
    }
    xhttp.open("DELETE", ENDPOINT, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send('{"id":' + id + '}');
}

function ParseJson(json){
    let items = [];
    json.forEach(e => {
        if(e.id != undefined && e.modelo != undefined && e.anoFab != undefined && e.velMax != undefined){
            let item;
            if (e.altMax != undefined && e.autonomia != undefined){
                item = new Aereo(e.id, e.modelo, e.anoFab, e.velMax, e.altMax, e.autonomia);
            } else if (e.cantPue != undefined && e.cantRue != undefined) {
                item = new Terrestre(e.id, e.modelo, e.anoFab, e.velMax, e.cantPue, e.cantRue);
            }
            items.push(item);
        }
    });
    return items;
}


//EVENT LISTENERS
window.addEventListener("load", () => {
    APIRequest_GET();
    AddCheckboxesEvents();
    $("btn_add").addEventListener("click", (e) => {
        SwitchView(e);
        NewRow();
    });
    $("btn_cancel").addEventListener("click", (e) => {
        SwitchView(e);
        HideAllErrorsTags();
    });
    $("btn_accept").addEventListener("click", (e) => ValidateForm(e));
    $("btn_delete").addEventListener("click", (e) => DeleteEntry(e));
    $("cmbfilter").addEventListener("change", () => ReDrawTable());
    $("field_tipo").addEventListener("change", () => ChangeFormView());
});

function AddCheckboxesEvents(){
    $("chk0").addEventListener("click", () => { ToggleClass($("col0"), "collapsed"); } );
    $("chk1").addEventListener("click", () => { ToggleClass($("col1"), "collapsed"); } );
    $("chk2").addEventListener("click", () => { ToggleClass($("col2"), "collapsed"); } );
    $("chk3").addEventListener("click", () => { ToggleClass($("col3"), "collapsed"); } );
    $("chk4").addEventListener("click", () => { ToggleClass($("col4"), "collapsed"); } );
    $("chk5").addEventListener("click", () => { ToggleClass($("col5"), "collapsed"); } );
    $("chk6").addEventListener("click", () => { ToggleClass($("col6"), "collapsed"); } );
    $("chk7").addEventListener("click", () => { ToggleClass($("col7"), "collapsed"); } );
}

function AddTableSortEvents(){
    let headers = Array.from($("table_header").getElementsByTagName("th"));
    headers.forEach(th => {
        th.addEventListener("click", (e) => {
            UpdateSorter(e.target.id);
            ReDrawTable();
        })
    });
}

///////////////////////////////////////Functions/////////////////////////////////////
//// General Functions ////
function $(id){
    return document.getElementById(id);
}

function ToggleClass(element, classname){
    if(element != null) {
        element.classList.toggle(classname);
    }
}

function SwitchView(event){
    event.preventDefault();
    ToggleClass($("table-container"), "hidden");
    ToggleClass($("form-container"), "hidden");
}

function SetValue(element, value){
    element.value = value;
}

function SetInnerText(element, text){
    element.firstChild.nodeValue = text;
}

function ToTitleCase(str){
    casedStr = str.toLowerCase()
                  .split(' ')
                  .map((word) => word.replace(word[0], word[0].toUpperCase()));

    return casedStr.join(' ');
}

function DisableElement(element, value){
    element.disabled = value;
}

//Spinner Filter Functions
function SwapLoadingScreen() {
    ToggleClass($("loading-screen"), "hidden");
    ToggleClass($("loading-screen"), "flex");
}

//// Global Array functions ////
function DeleteItem(id){
    globalArray = globalArray.filter((e) => e.id != id);
}

function GetArrayItemById(id){
    let len = globalArray.length;
    let element = null;

    for (let i = 0; i<len ; i++){
        if(id == globalArray[i].id){
            element = globalArray[i];
            break;
        }
    }
    return element;
}



//// LIST VIEW Functions ////
function DrawTable(filter=DefaultFilter){
    let table = $("main_table");
    const filtered = Array.from(globalArray.filter(filter));
    const sorted_array = filtered.sort(currentSorter);
    
    sorted_array.forEach(element => {
        let row = document.createElement('tr');
        let cells = [];
        let len = table.rows[0].cells.length;
        
        for (let i = 0; i < len; i++){
            cells.push(document.createElement('td'));
        }
        
        cells[0].appendChild(document.createTextNode(element.id));
        cells[1].appendChild(document.createTextNode(element.modelo));
        cells[2].appendChild(document.createTextNode(element.anoFab));
        cells[3].appendChild(document.createTextNode(element.velMax));
        if (element instanceof Aereo){
            cells[4].appendChild(document.createTextNode(element.altMax));
            cells[5].appendChild(document.createTextNode(element.autonomia));
        } else {
            cells[4].appendChild(document.createTextNode('-'));
            cells[5].appendChild(document.createTextNode('-'));
        }
        if (element instanceof Terrestre){
            cells[6].appendChild(document.createTextNode(element.cantPue));
            cells[7].appendChild(document.createTextNode(element.cantRue));
        } else {
            cells[6].appendChild(document.createTextNode('-'));
            cells[7].appendChild(document.createTextNode('-'));
        }
        let edit_btn = document.createElement("button");
        let delete_btn = document.createElement("button");
        edit_btn.textContent = "Modificar";
        delete_btn.textContent = "Eliminar";
        delete_btn.classList.add("dangerzone");

        cells[8].appendChild(edit_btn);
        cells[9].appendChild(delete_btn);
        
        cells.forEach(cell => {
            row.appendChild(cell);
        });
        table.appendChild(row);

        edit_btn.addEventListener("click", (e) => {
            let id = e.target.parentNode.parentNode.firstChild.innerText;
            EditRow(id);
            SwitchView(e);
        })

        delete_btn.addEventListener("click", (e) => {
            let id = e.target.parentNode.parentNode.firstChild.innerText;
            DeleteRow(id);
            SwitchView(e);
        })
    });
}

function ReDrawTable(){
    ClearTable($("main_table"));
    let filter = GetFilter($("cmbfilter"));
    DrawTable(filter);
}

function ClearTable(table){
    while (table.rows.length > 1){
        table.deleteRow(1);
    }
}


//Sort
function NumberComparer(attr1, attr2, order){
    val1 = (attr1 == undefined) ? Infinity : attr1 ;
    val2 = (attr2 == undefined) ? Infinity : attr2 ;
    return (order == "ASC") ? val1 - val2 : val2 - val1 ;
}

function StringComparer(attr1, attr2, order){
    val1 = (attr1 == undefined) ? "" : attr1 ;
    val2 = (attr2 == undefined) ? "" : attr2 ;
    return (order == "ASC") ? val1.localeCompare(val2) : val2.localeCompare(val1) ;
}

function UpdateSorter(id){
    let order = "ASC";
    if(lastHeader == id){
        order = (lastOrder == "ASC") ? "DESC" : "ASC" ;
    }
    currentSorter = GetSorter(id, order);
}

function GetSorter(id, order){
    let delegate;
    lastHeader = id;
    lastOrder = order;

    switch(id){
        case "th1":
            delegate = (e1, e2) => StringComparer(e1.modelo, e2.modelo, order);
            break;
        case "th2":
            delegate = (e1, e2) => NumberComparer(e1.anoFab, e2.anoFab, order);
            break;
        case "th3":
            delegate = (e1, e2) => NumberComparer(e1.velMax, e2.velMax, order);
            break;
        case "th4":
            delegate = (e1, e2) => NumberComparer(e1.altMax, e2.altMax, order);
            break;
        case "th5":
            delegate = (e1, e2) => NumberComparer(e1.autonomia, e2.autonomia, order);
            break;
        case "th6":
            delegate = (e1, e2) => NumberComparer(e1.cantPue, e2.cantPue, order);
            break;
        case "th7":
            delegate = (e1, e2) => NumberComparer(e1.cantRue, e2.cantRue, order);
            break;
        default:
            delegate = (e1, e2) => NumberComparer(e1.id, e2.id, order);
            break;
    }
    return delegate;
}

function DefaultSorter(e1, e2){
    return e1.id - e2.id;
}


//Filter
function GetFilter(cmb){
    let delegate;
    switch(cmb.value){
        case "aereos":
            delegate = FilterAereos;
            break;
        case "terrestres":
            delegate = FilterTerrestres;
            break;
        default:
            delegate = DefaultFilter;
            break;
    }
    return delegate;
}

function DefaultFilter(element){
    return element instanceof Vehiculo || element instanceof Aereo || element instanceof Terrestre;
}

function FilterAereos(element){
    return element instanceof Aereo;
}

function FilterTerrestres(element){
    return element instanceof Terrestre;
}


//// FORM VIEW Functions ////
async function ValidateForm(e){
    const tipo = $("field_tipo");
    let noError = 0;
    let mode = ($("field_id").value == "") ? "CREATE" : "EDIT" ;

    noError += showError($("field_modelo"),   $("error_modelo"));
    noError += showError($("field_anoFab"), $("error_anoFab"), 1884);
    noError += showError($("field_velMax"),     $("error_velMax"));
    if (tipo.value == "tipo1") {
        noError += showError($("field_altMax"),  $("error_altMax"));
        noError += showError($("field_autonomia"),    $("error_autonomia"));
    }else {
        noError += showError($("field_cantPue"),    $("error_cantPue"));
        noError += showError($("field_cantRue"),      $("error_cantRue"));
    }

    if (noError == 0){
        ProcessEntry(e, mode);
    }
}

function NewRow(){
    $("form-header").textContent = "Formulario de Alta";
    DisableFormFields(false);
    $("btn_accept").className = "";
    $("btn_delete").className = "dangerzone hidden";
    LoadDataForm("", "", "", "", 1, "", "", "", "");
}

function EditRow(id){
    $("form-header").textContent = "Formulario de Modificación";
    DisableFormFields(false);
    DisableElement($("field_tipo"), true);
    $("btn_accept").className = "";
    $("btn_delete").className = "dangerzone hidden";
    SetFormFields(id);
}

function DeleteRow(id){
    $("form-header").textContent = "Formulario de Eliminación";
    DisableFormFields();
    $("btn_accept").className = "hidden";
    $("btn_delete").className = "dangerzone";
    SetFormFields(id);
}

function SetFormFields(id){
    let element = GetArrayItemById(id);
    let tipo = 0;
    let altMax = "";
    let autonomia = "";
    let cantPue = "";
    let cantRue = "";

    if (element instanceof Aereo){
        tipo = 1;
        altMax = element.altMax;
        autonomia = element.autonomia;
    } else if (element instanceof Terrestre) {
        tipo = 2;
        cantPue = element.cantPue;
        cantRue = element.cantRue;
    }
    
    LoadDataForm(id, element.modelo, element.anoFab, element.velMax, tipo, altMax, autonomia, cantPue, cantRue);
}

function DisableFormFields(disabled=true){
    DisableElement($("field_modelo"), disabled);
    DisableElement($("field_anoFab"), disabled);
    DisableElement($("field_velMax"), disabled);
    DisableElement($("field_tipo"), disabled);
    DisableElement($("field_altMax"), disabled);
    DisableElement($("field_autonomia"), disabled);
    DisableElement($("field_cantPue"), disabled);
    DisableElement($("field_cantRue"), disabled);
}

function ProcessEntry(e, mode){
    let id = (mode == "CREATE") ? 0 : $("field_id").value ;
    let modelo = $("field_modelo").value;
    let anoFab = $("field_anoFab").value;
    let velMax = $("field_velMax").value;
    let tipo = ($("field_tipo").value == "tipo1") ? 1 : 2 ;
    let altMax = $("field_altMax").value;
    let autonomia = $("field_autonomia").value;
    let cantPue = $("field_cantPue").value;
    let cantRue = $("field_cantRue").value;
    
    let element = null;
    if (tipo == 1){
        element = new Aereo(id, modelo, anoFab, velMax, altMax, autonomia);
    } else if (tipo == 2){
        element = new Terrestre(id, modelo, anoFab, velMax, cantPue, cantRue);
    }

    if (mode == "CREATE") {
        APIRequest_PUT(e, element);
    } else if (mode == "EDIT") {
        APIRequest_POST(e, element);
    }
}

function DeleteEntry(e){
    let confirmation = confirm("¿Está seguro/a que desea eliminar esta entrada?\nEsta acción NO se puede deshacer.");

    if (confirmation){
        let id = $("field_id").value;
        APIRequest_DELETE(e, id);
    }
}

function LoadDataForm(id, modelo, anoFab, velMax, tipo, altMax, autonomia, cantPue, cantRue){
    const field_tipo = $("field_tipo");
    if ((field_tipo.value == "tipo1" && tipo == 2) || (field_tipo.value == "tipo2" && tipo == 1)) {
        ChangeFormView();
    }
    field_tipo.value = (tipo == 1) ? "tipo1" : "tipo2" ;

    SetValue($("field_id"), id);
    SetValue($("field_modelo"), modelo);
    SetValue($("field_anoFab"), anoFab);
    SetValue($("field_velMax"), velMax);
    SetValue($("field_altMax"), altMax);
    SetValue($("field_autonomia"), autonomia);
    SetValue($("field_cantPue"), cantPue);
    SetValue($("field_cantRue"), cantRue);
}

function ChangeFormView(){
    ToggleClass($("input_altMax"), "hidden");
    ToggleClass($("input_autonomia"), "hidden");
    ToggleClass($("input_cantPue"), "hidden");
    ToggleClass($("input_cantRue"), "hidden");
}

function showError(field, fieldError, min=0, max=100) {
    let error = 0;
    if (field.validity.valid){
        SetInnerText(fieldError, ".");
        fieldError.className = "error unactive";
    } else {
        fieldError.className = "error active";
        error++;
        if (field.validity.valueMissing) {
            SetInnerText(fieldError, "Campo obligatorio.");
        } else if (field.validity.typeMismatch) {
            SetInnerText(fieldError, "Debe ingresar sólo números.");
        } else if (field.validity.tooShort) {
            SetInnerText(fieldError, "El campo debe tener como mínimo 2 caracteres.");
        } else if (field.validity.rangeUnderflow) {
            SetInnerText(fieldError, "El valor mínimo es " + min + ".");
        } else if (field.validity.rangeOverflow) {
            SetInnerText(fieldError, "El valor mínimo es " + max + ".");
        } else if (field.validity.patternMismatch) {
            SetInnerText(fieldError, "Sólo se aceptan caracteres alfanuméricos, espacios y guiones.");
        }
    }
    return error;
}

function HideAllErrorsTags(){
    ResetErrorTag($("error_modelo"));
    ResetErrorTag($("error_anoFab"));
    ResetErrorTag($("error_velMax"));
    ResetErrorTag($("error_altMax"));
    ResetErrorTag($("error_autonomia"));
    ResetErrorTag($("error_cantPue"));
    ResetErrorTag($("error_cantRue"));
}

function ResetErrorTag(fieldError){
    fieldError.className = "error unactive";
}
