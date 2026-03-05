(async function () {

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

// =============================
// STEP 1 — LOAD GOOGLE SHEET
// =============================
const sheetID = "1HJZH2nkqKu0O1Ocfwmk_feByovpOx_N0LqNl8IDf3nE";
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv`;

alert("Loading Google Sheet...");
let response = await fetch(url);
let text = await response.text();

// =============================
// STEP 2 — PARSE CSV
// =============================
let rows = text.split("\n").map(r => r.split(","));

let applicationID = prompt("Enter Application ID to load:");
let match = rows.find(r => r[0] == applicationID);

if(!match){
    alert("Application ID not found.");
    return;
}

alert("Application found!");

// =============================
// STEP 3 — DETECT VISIBLE FORM FIELDS
// =============================
let elements = document.querySelectorAll("input, select, textarea");
let visible = [];

elements.forEach(el=>{
    if(el.offsetParent !== null){
        visible.push(el);
    }
});

alert("Visible form fields detected: " + visible.length);

// =============================
// STEP 4 — FILL BABY NAME
// =============================
let babyName = match[7];  // adjust column if needed

visible[9].focus();
visible[9].value = babyName;
visible[9].dispatchEvent(new Event("input",{bubbles:true}));

alert("STEP A: Baby name filled -> " + babyName);

// =============================
// STEP 5 — SELECT GENDER
// =============================
let genderRaw = match[11];

alert("STEP 1: Gender from sheet = " + genderRaw);

let gender = genderRaw && genderRaw.toLowerCase().includes("nam") ? "Nam" : "Nữ";

alert("STEP 2: Normalized gender = " + gender);

let genderField = visible[12];

genderField.focus();
genderField.click();

await sleep(700);

// =============================
// STEP 6 — FIND DROPDOWN OPTIONS
// =============================
let options = document.querySelectorAll(".vts-select-item-option");

alert("STEP 3: options detected = " + options.length);

// =============================
// STEP 7 — CLICK CORRECT OPTION
// =============================
for(let opt of options){

    let txt = opt.innerText.trim();

    if(txt.includes(gender)){
        opt.click();
        alert("Gender selected: " + txt);
        break;
    }
}

})();

}

})();
