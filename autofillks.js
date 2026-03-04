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

        // 5️⃣ Extract B, C, D, E
        const name = match[1];
        const passportNumber = match[2];
        const placeOfIssue = match[3];
        const dateOfIssue = match[4];

        alert(
            "MATCH FOUND:\n\n" +
            "Họ và tên: " + name + "\n" +
            "Số hộ chiếu: " + passportNumber + "\n" +
            "Nơi cấp: " + placeOfIssue + "\n" +
            "Ngày cấp: " + dateOfIssue
        );

    } catch (err) {
        alert("Error fetching sheet. Make sure it is shared publicly.");
        console.error(err);
    }

})();
