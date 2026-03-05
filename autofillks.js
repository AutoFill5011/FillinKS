    (async function () {

    // 🔴 Replace with your sheet ID only
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

    // Convert d/m/yyyy → m/d/yyyy
    function convertFormat(input) {
        const [datePart, timePart] = input.split(" ");
        const [day, month, year] = datePart.split("/");
        return `${month}/${day}/${year} ${timePart}`;
    }

    const convertedTimestamp = convertFormat(timestampInput);

    try {

        // 3️⃣ Fetch sheet in background
        const response = await fetch(sheetURL);
        const csvText = await response.text();

        function parseCSV(text) {
            const rows = [];
            let row = [];
            let value = '';
            let insideQuotes = false;

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const nextChar = text[i + 1];

                if (char === '"' && insideQuotes && nextChar === '"') {
                    value += '"';
                    i++;
                } 
                else if (char === '"') {
                    insideQuotes = !insideQuotes;
                } 
                else if (char === ',' && !insideQuotes) {
                    row.push(value);
                    value = '';
                } 
                else if ((char === '\n' || char === '\r') && !insideQuotes) {
                    if (value !== '' || row.length > 0) {
                        row.push(value);
                        rows.push(row);
                        row = [];
                        value = '';
                    }
                } 
                else {
                    value += char;
                }
            }

            if (value !== '') {
                row.push(value);
                rows.push(row);
            }

        return rows;
        }
        const rows = parseCSV(csvText).slice(1);

        // 4️⃣ Find matching row
        const match = rows.find(row =>
            row[2] && row[2].trim().toLowerCase() === passport &&
            row[0] && row[0].trim() === convertedTimestamp
        );

        if (!match) {
            alert("No matching record found.");
            return;
        }

        // 5️⃣ Extract all data
        const data = match;

       // ===== TEST AUTO FILL 2 FIELDS =====

        // Get visible form elements in same order as your labeling script
        const elements = document.querySelectorAll("input, select, textarea");
        let visible = [];

        elements.forEach(el => {
            if (el.offsetParent !== null) {
                visible.push(el);
            }
        });

        // --------- FIELD 1: Họ và tên bé (input 9) ---------
        document.querySelectorAll("input")[9].value = data[7];

        // --------- FIELD 2: Giới tính (input 12) ---------

        function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

        const genderInput = document.querySelectorAll("input")[12];

        // Normalize gender from sheet
        let gender = data[11].toLowerCase().includes("nam") ? "Nam" : "Nữ";

        // Open dropdown
        genderInput.focus();
        genderInput.click();

        await sleep(500);

        // Find dropdown options
        let options = document.querySelectorAll(".vts-select-item-option");

        let target = null;

        options.forEach(o=>{
            if(o.innerText.trim() === gender){
                target = o;
            }
        });

        if(target){
            target.click();
        }else{
            alert("Gender option not found");
        }

    } catch (err) {
        alert("Error fetching sheet. Make sure it is shared publicly.");
        console.error(err);
    }

})();
