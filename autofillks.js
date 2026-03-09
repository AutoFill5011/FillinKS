javascript:(async function(){

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

// ========================
// LOAD GOOGLE SHEET
// ========================
const sheetID="1HJZH2nkqKu0O1Ocfwmk_feByovpOx_N0LqNl8IDf3nE";
const sheetURL=`https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv`;
    
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

// ========================
// BABY NAME SPLIT
// ========================

let fullNameRaw = match[7];   // column containing full name

alert("Full name from sheet: " + fullNameRaw);

// clean name
let fullName = fullNameRaw
    .replace(/"/g,"")
    .replace(/\r/g,"")
    .trim();

let nameParts = fullName.split(/\s+/);

if(nameParts.length < 2){
    alert("Name format error");
    return;
}

// assign parts
let surname = nameParts[0];
let firstName = nameParts[nameParts.length - 1];
let middleName = nameParts.slice(1, -1).join(" ");

alert(
"Parsed name:\n\n"+
"Surname: " + surname +
"\nMiddle: " + middleName +
"\nFirst: " + firstName
);

// ========================
// FILL FORM INPUTS
// ========================

let elements=document.querySelectorAll("input,select,textarea");
let visible=[];

elements.forEach(el=>{
if(el.offsetParent!==null) visible.push(el);
});

// surname
visible[9].value = surname;
visible[9].dispatchEvent(new Event("input",{bubbles:true}));

// middle name(s)
visible[10].value = middleName;
visible[10].dispatchEvent(new Event("input",{bubbles:true}));

// first name
visible[11].value = firstName;
visible[11].dispatchEvent(new Event("input",{bubbles:true}));

alert("Baby name filled successfully");

    
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

// ========================
// YOUR WORKING DROPDOWN METHOD
// ========================

let genderField=visible[12];

if(!genderField){
alert("Input 12 not found");
return;
}

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

// ========================
// BABY DATE OF BIRTH
// ========================

let dobRaw = match[8];

alert("DOB from sheet: " + dobRaw);

// clean
let dob = dobRaw
.replace(/"/g,"")
.replace(/\r/g,"")
.trim();

// split
let parts = dob.split("/");

let month = parseInt(parts[0]).toString();
let day = parseInt(parts[1]).toString();
let year = parts[2];

alert(
"DOB parsed:\n\n"+
"Day: "+day+
"\nMonth: "+month+
"\nYear: "+year
);

alert("Opening day dropdown");

visible[13].focus();
visible[13].click();

await sleep(500);

options=document.querySelectorAll(".vts-select-item-option");

target=null;

options.forEach(o=>{
if(o.innerText.trim()==day){
target=o;
}
});

if(target){
target.click();
alert("Day selected: "+day);
}else{
alert("Day option not found");
}

alert("Opening month dropdown");

visible[14].focus();
visible[14].click();

await sleep(500);

options=document.querySelectorAll(".vts-select-item-option");

target=null;

options.forEach(o=>{
if(o.innerText.trim()==month){
target=o;
}
});

if(target){
target.click();
alert("Month selected: "+month);
}else{
alert("Month option not found");
}

alert("Opening year dropdown");

visible[15].focus();
visible[15].click();

await sleep(500);

options=document.querySelectorAll(".vts-select-item-option");

target=null;

options.forEach(o=>{
if(o.innerText.trim()==year){
target=o;
}
});

if(target){
target.click();
alert("Year selected: "+year);
}else{
alert("Year option not found");
}

})();
