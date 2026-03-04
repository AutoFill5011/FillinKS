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

        function fillDropdownInput(inputEl, value) {
            inputEl.focus();

            // Clear existing text
            inputEl.value = "";
            inputEl.dispatchEvent(new Event("input", { bubbles: true }));

            // Type value character by character
            for (let char of value) {
                inputEl.value += char;
                inputEl.dispatchEvent(new Event("input", { bubbles: true }));
            }

            // Press Enter
            inputEl.dispatchEvent(new KeyboardEvent("keydown", {
                bubbles: true,
                cancelable: true,
                key: "Enter",
                code: "Enter"
            }));

            inputEl.dispatchEvent(new KeyboardEvent("keyup", {
                bubbles: true,
                cancelable: true,
                key: "Enter",
                code: "Enter"
            }));
        }
        // --------- FIELD 2: Giới tính (input 12) ---------
        const genderInput = document.querySelectorAll("input")[12];

        // Normalize gender from sheet
        let gender = data[11].toLowerCase().includes("nam") ? "Nam" : "Nữ";

        fillDropdownInput(genderInput, gender);

        alert("Test autofill completed for 2 fields.");

    } catch (err) {
        alert("Error fetching sheet. Make sure it is shared publicly.");
        console.error(err);
    }

})();
