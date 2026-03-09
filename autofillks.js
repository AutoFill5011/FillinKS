javascript:(async function(){

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

// ========================
// LOAD GOOGLE SHEET
// ========================
const sheetID="1HJZH2nkqKu0O1Ocfwmk_feByovpOx_N0LqNl8IDf3nE";
const sheetURL=`https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv`;

alert("Loading Google Sheet....");
    
let response=await fetch(sheetURL);
let csv=await response.text();

function parseCSV(text){

const rows=[];
let row=[];
let value='';
let insideQuotes=false;

for(let i=0;i<text.length;i++){

const char=text[i];
const next=text[i+1];

if(char=='"' && insideQuotes && next=='"'){
value+='"';
i++;
}

else if(char=='"'){
insideQuotes=!insideQuotes;
}

else if(char==',' && !insideQuotes){
row.push(value);
value='';
}

else if((char=='\n'||char=='\r') && !insideQuotes){
if(value!==''||row.length){
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

let rows=parseCSV(csv).slice(1);

let passport=prompt("Enter passport number");
let timestamp=prompt("Enter timestamp (d/m/yyyy hh:mm:ss)");

if(!passport||!timestamp){
alert("Missing input");
return;
}

// convert timestamp
function convertFormat(input){
const [datePart,timePart]=input.split(" ");
const [day,month,year]=datePart.split("/");
return `${month}/${day}/${year} ${timePart}`;
}

let convertedTimestamp=convertFormat(timestamp);

// find matching row
let match=rows.find(r=>
r[2] && r[2].trim().toLowerCase()==passport.toLowerCase() &&
r[0] && r[0].trim()==convertedTimestamp
);

if(!match){
alert("No matching record found");
return;
}

alert("Record found");

// ========================
// GET GENDER FROM SHEET
// ========================
let genderRaw = match[11];

alert("Gender from sheet (raw): " + genderRaw);

// CLEAN the value
let cleanedGender = genderRaw
    .replace(/"/g,"")
    .replace(/\r/g,"")
    .trim()
    .toLowerCase();

alert("Gender cleaned: " + cleanedGender);

let gender = "Nữ";

if(cleanedGender.includes("nam")){
gender = "Nam";
}

alert("Normalized gender: " + gender);

// ========================
// YOUR WORKING DROPDOWN METHOD
// ========================
let elements=document.querySelectorAll("input,select,textarea");
let visible=[];

elements.forEach(el=>{
if(el.offsetParent!==null) visible.push(el);
});

let genderField=visible[12];

if(!genderField){
alert("Input 12 not found");
return;
}

alert("Opening gender dropdown");

genderField.focus();
genderField.click();

await sleep(500);

let options=document.querySelectorAll(".vts-select-item-option");

if(options.length==0){
alert("No dropdown options detected");
return;
}

let target=null;

options.forEach(o=>{
if(o.innerText.trim()==gender){
target=o;
}
});

if(!target){
alert("Option '"+gender+"' not found");
return;
}

target.click();

alert("Gender selected: "+gender);

})();
