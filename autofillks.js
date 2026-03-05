(async function () {

const sheetID = "1HJZH2nkqKu0O1Ocfwmk_feByovpOx_N0LqNl8IDf3nE";
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv`;

// 1️⃣ Ask passport
const passportInput = prompt("Enter passport number:");
if (!passportInput) {
    alert("No passport entered.");
    return;
}

const passport = passportInput.trim().toLowerCase();

// 2️⃣ Ask timestamp
const timestampInput = prompt("Enter timestamp (d/m/yyyy hh:mm:ss)");
if (!timestampInput) {
    alert("No timestamp entered.");
    return;
}

function convertFormat(input){
    const [datePart,timePart] = input.split(" ");
    const [day,month,year] = datePart.split("/");
    return `${month}/${day}/${year} ${timePart}`;
}

const convertedTimestamp = convertFormat(timestampInput);

try{

// 3️⃣ Fetch sheet
const response = await fetch(sheetURL);
const csvText = await response.text();

// CSV parser (handles commas in addresses)
function parseCSV(text){

    const rows=[];
    let row=[];
    let value='';
    let insideQuotes=false;

    for(let i=0;i<text.length;i++){

        const char=text[i];
        const nextChar=text[i+1];

        if(char === '"' && insideQuotes && nextChar === '"'){
            value+='"';
            i++;
        }

        else if(char === '"'){
            insideQuotes=!insideQuotes;
        }

        else if(char === ',' && !insideQuotes){
            row.push(value);
            value='';
        }

        else if((char === '\n' || char === '\r') && !insideQuotes){
            if(value!=='' || row.length>0){
                row.push(value);
                rows.push(row);
                row=[];
                value='';
            }
        }

        else{
            value+=char;
        }
    }

    if(value!==''){
        row.push(value);
        rows.push(row);
    }

    return rows;
}

const rows=parseCSV(csvText).slice(1);

// 4️⃣ Find row
const match=rows.find(row =>
    row[2] && row[2].trim().toLowerCase()===passport &&
    row[0] && row[0].trim()===convertedTimestamp
);

if(!match){
    alert("No matching record found.");
    return;
}

const data=match;

// ===== GET VISIBLE INPUTS (same logic as your labeling script) =====

let elements=document.querySelectorAll("input, select, textarea");
let visible=[];

elements.forEach(el=>{
    if(el.offsetParent!==null){
        visible.push(el);
    }
});

alert("Visible form fields detected: "+visible.length);

// ===== FIELD 1: BABY NAME =====

visible[9].value=data[7];
visible[9].dispatchEvent(new Event("input",{bubbles:true}));

alert("STEP A: Baby name filled -> "+data[7]);

(async function () {

const sheetID = "1HJZH2nkqKu0O1Ocfwmk_feByovpOx_N0LqNl8IDf3nE";
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv`;

// 1️⃣ Ask passport
const passportInput = prompt("Enter passport number:");
if (!passportInput) {
    alert("No passport entered.");
    return;
}

const passport = passportInput.trim().toLowerCase();

// 2️⃣ Ask timestamp
const timestampInput = prompt("Enter timestamp (d/m/yyyy hh:mm:ss)");
if (!timestampInput) {
    alert("No timestamp entered.");
    return;
}

function convertFormat(input){
    const [datePart,timePart] = input.split(" ");
    const [day,month,year] = datePart.split("/");
    return `${month}/${day}/${year} ${timePart}`;
}

const convertedTimestamp = convertFormat(timestampInput);

try{

// 3️⃣ Fetch sheet
const response = await fetch(sheetURL);
const csvText = await response.text();

// CSV parser (handles commas in addresses)
function parseCSV(text){

    const rows=[];
    let row=[];
    let value='';
    let insideQuotes=false;

    for(let i=0;i<text.length;i++){

        const char=text[i];
        const nextChar=text[i+1];

        if(char === '"' && insideQuotes && nextChar === '"'){
            value+='"';
            i++;
        }

        else if(char === '"'){
            insideQuotes=!insideQuotes;
        }

        else if(char === ',' && !insideQuotes){
            row.push(value);
            value='';
        }

        else if((char === '\n' || char === '\r') && !insideQuotes){
            if(value!=='' || row.length>0){
                row.push(value);
                rows.push(row);
                row=[];
                value='';
            }
        }

        else{
            value+=char;
        }
    }

    if(value!==''){
        row.push(value);
        rows.push(row);
    }

    return rows;
}

const rows=parseCSV(csvText).slice(1);

// 4️⃣ Find row
const match=rows.find(row =>
    row[2] && row[2].trim().toLowerCase()===passport &&
    row[0] && row[0].trim()===convertedTimestamp
);

if(!match){
    alert("No matching record found.");
    return;
}

const data=match;

// ===== GET VISIBLE INPUTS (same logic as your labeling script) =====

let elements=document.querySelectorAll("input, select, textarea");
let visible=[];

elements.forEach(el=>{
    if(el.offsetParent!==null){
        visible.push(el);
    }
});

alert("Visible form fields detected: "+visible.length);

// ===== FIELD 1: BABY NAME =====

visible[9].value=data[7];
visible[9].dispatchEvent(new Event("input",{bubbles:true}));

alert("STEP A: Baby name filled -> "+data[7]);

// ===== FIELD 2: GENDER DEBUG =====

function sleep(ms){
    return new Promise(r=>setTimeout(r,ms));
}

let genderRaw=data[11];
alert("STEP 1: Gender from sheet = "+genderRaw);

let gender = genderRaw && genderRaw.toLowerCase().includes("nam") ? "Nam" : "Nữ";
alert("STEP 2: Normalized gender = "+gender);

alert("STEP 3: visible count = "+visible.length);

let genderField=visible[12];

if(!genderField){
    alert("STEP 4: Gender field NOT found");
    return;
}

alert("STEP 4: Gender field found");

genderField.focus();
alert("STEP 5: Focused gender field");

genderField.click();
alert("STEP 6: Clicked gender field");

await sleep(700);
alert("STEP 7: waited for dropdown");

// find dropdown options
let options=document.querySelectorAll(".vts-select-item-option");

alert("STEP 8: Found "+options.length+" dropdown options");

if(options.length===0){
    alert("ERROR: dropdown options not detected");
    return;
}

// show detected options
let names=[];
options.forEach(o=>{
    names.push(o.innerText.trim());
});

alert("STEP 9 options detected:\n\n"+names.join("\n"));

let target=null;

options.forEach(o=>{
    if(o.innerText.trim()===gender){
        target=o;
    }
});

if(!target){
    alert("STEP 10: Target gender NOT found");
    return;
}

alert("STEP 10: Target found -> "+gender);

target.click();

alert("STEP 11: Gender selected successfully");

}
catch(err){

alert("SCRIPT ERROR:\n"+err.message);
console.error(err);

}

})();
