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
    
// ========================
// GET GENDER FROM SHEET
// ========================
let genderRaw = match[11];

// CLEAN the value
let cleanedGender = genderRaw
    .replace(/"/g,"")
    .replace(/\r/g,"")
    .trim()
    .toLowerCase();

let gender = "Nữ";

if(cleanedGender.includes("nam")){
gender = "Nam";
}

// ========================
// WORKING DROPDOWN METHOD
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

// clean
let dob = dobRaw
.replace(/"/g,"")
.replace(/\r/g,"")
.trim();

// split
let parts = dob.split("/");

let babyMonth = parseInt(parts[0]).toString();
let babyDay = parseInt(parts[1]).toString();
let babyYear = parts[2];

// ========================
//Baby's Day
visible[13].focus();
visible[13].click();

// type the value to filter dropdown
visible[13].value = babyDay;
visible[13].dispatchEvent(new Event("input",{bubbles:true}));

await sleep(500);

options=document.querySelectorAll(".vts-select-item-option");

target=null;

options.forEach(o=>{
let text=o.innerText.trim();

// normalize leading zero
if(parseInt(text)==parseInt(babyDay)){
target=o;
}
});

if(target){
target.click();
}else{
alert("Day option not found");
}

// ========================
//Baby's Month
visible[14].focus();
visible[14].click();

visible[14].value = babyMonth;
visible[14].dispatchEvent(new Event("input",{bubbles:true}));

await sleep(500);

options=document.querySelectorAll(".vts-select-item-option");

target=null;

options.forEach(o=>{
let text=o.innerText.trim();

if(parseInt(text)==parseInt(babyMonth)){
target=o;
}
});

if(target){
target.click();
}else{
alert("Month option not found");
}

// ========================
//Baby's Year
visible[15].value = babyYear;
visible[15].dispatchEvent(new Event("input",{bubbles:true}));

// ========================
//Baby's Birth place
// ========================
visible[17].focus();
visible[17].click();

// type to filter
visible[17].value = "nhật";
visible[17].dispatchEvent(new Event("input",{bubbles:true}));

await sleep(500);

options=document.querySelectorAll(".vts-select-item-option");

target=null;

options.forEach(o=>{
if(o.innerText.trim()=="Nhật Bản (Japanese)"){
target=o;
}
});

if(target){
target.click();
}else{
alert("Nhật Bản option not found");
}

// ========================
//Baby's Hometown
// ========================
let rawPlace = match[10];

alert("Place raw: " + rawPlace);

// clean
let cleanedPlace = rawPlace
.replace(/"/g,"")
.replace(/\r/g,"")
.trim();

// cut at first separator
let firstWord = cleanedPlace.split(/[ \-_,.]/)[0];

// capitalize
firstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();

alert("Place processed: " + firstWord);

visible[20].value = firstWord;
visible[20].dispatchEvent(new Event("input",{bubbles:true}));

alert("Input 20 filled: " + firstWord);

visible[20].value = firstWord;
visible[20].dispatchEvent(new Event("input",{bubbles:true}));

alert("Input 20 filled: " + firstWord);

// ========================
//Baby's Ethnicity
// ========================
let ethnicityRaw = match[12];

alert("Ethnicity raw: " + ethnicityRaw);

let ethnicity = ethnicityRaw
.replace(/"/g,"")
.replace(/\r/g,"")
.trim();

// special conversion
if(ethnicity === "Tày"){
ethnicity = "Tay";
}

alert("Ethnicity processed: " + ethnicity);

alert("Opening ethnicity dropdown");

visible[25].focus();
visible[25].click();

// type to filter
visible[25].value = ethnicity;
visible[25].dispatchEvent(new Event("input",{bubbles:true}));

await sleep(500);

options=document.querySelectorAll(".vts-select-item-option");

target=null;

options.forEach(o=>{
if(o.innerText.trim()==ethnicity){
target=o;
}
});

if(target){
target.click();
alert("Ethnicity selected: "+ethnicity);
}else{
alert("Ethnicity option not found");
}


    
})();
