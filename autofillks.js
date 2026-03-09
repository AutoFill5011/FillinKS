javascript:(async function(){

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

// ========================
// LOAD GOOGLE SHEET
// ========================
const sheetID="1HJZH2nkqKu0O1Ocfwmk_feByovpOx_N0LqNl8IDf3nE";
const sheetURL=`https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv`;

alert("Loading.......");
    
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
//Working dropdown select
// ========================
async function selectDropdown(index,value,exact=true){

let field = visible[index];

if(!field){
alert("Input "+index+" not found");
return;
}

field.focus();
field.click();

// type value to trigger dropdown filtering
field.value = value;
field.dispatchEvent(new Event("input",{bubbles:true}));

await sleep(700); // give Angular more time

let options = document.querySelectorAll(".vts-select-item-option");

if(options.length===0){
alert("No dropdown options detected for input "+index);
return;
}

let target=null;

for(let o of options){

let text = o.innerText
.replace(/\s+/g," ")
.trim();

// exact match
if(exact && text===value){
target=o;
break;
}

// numeric match
if(!exact && !isNaN(value) && parseInt(text)==parseInt(value)){
target=o;
break;
}

// partial text match
if(!exact && isNaN(value) && text.includes(value)){
target=o;
break;
}

}

if(!target){
alert("Dropdown value '"+value+"' not found at input "+index);
return;
}

target.click();
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

await selectDropdown(12,gender,true);

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
await selectDropdown(13,babyDay,false);

// ========================
//Baby's Month
await selectDropdown(14,babyMonth,false);

// ========================
//Baby's Year
visible[15].value = babyYear;
visible[15].dispatchEvent(new Event("input",{bubbles:true}));

// ========================
//Baby's Birth place
// ========================
await selectDropdown(17,"nhật",false);

// ========================
//Baby's Hometown
// ========================
let rawPlace = match[10];

// clean
let cleanedPlace = rawPlace
.replace(/"/g,"")
.replace(/\r/g,"")
.trim();

// cut at first separator
let firstWord = cleanedPlace.split(/[ \-_,.]/)[0];

// capitalize
firstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();

visible[20].value = firstWord;
visible[20].dispatchEvent(new Event("input",{bubbles:true}));

// ========================
//Baby's Ethnicity
// ========================
let ethnicityRaw = match[12];

let ethnicity = ethnicityRaw
.replace(/"/g,"")
.replace(/\r/g,"")
.trim();

// special conversion
if(ethnicity === "Tày"){
ethnicity = "Tay";
}

// type to filter
await selectDropdown(25,ethnicity,true);


    
})();
