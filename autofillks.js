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

        const rows = csvText
            .split("\n")
            .slice(1) // remove header
            .map(r => r.split(","));

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
        const babyNameField = visible[9];
        babyNameField.focus();
        babyNameField.value = data[7];
        babyNameField.dispatchEvent(new Event('input', { bubbles: true }));


        // --------- FIELD 2: Giới tính (input 12) ---------
        const genderField = visible[12];

        genderField.focus();
        genderField.value = ""; // clear first
        genderField.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Type value
        genderField.value = data[11];
        genderField.dispatchEvent(new Event('input', { bubbles: true }));

        // Simulate Enter key
        genderField.dispatchEvent(new KeyboardEvent('keydown', {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true
        }));

        genderField.dispatchEvent(new KeyboardEvent('keyup', {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true
        }));

        alert("Test autofill completed for 2 fields.");

    } catch (err) {
        alert("Error fetching sheet. Make sure it is shared publicly.");
        console.error(err);
    }

})();
