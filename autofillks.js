(async function () {

    const sheetURL = "https://docs.google.com/spreadsheets/d/1HJZH2nkqKu0O1Ocfwmk_feByovpOx_N0LqNl8IDf3nE/export?format=csv";

    // 1️⃣ Ask passport manually
    const passportInput = prompt("Enter passport number:");

    if (!passportInput) {
        alert("No passport entered.");
        return;
    }

    const passport = passportInput.trim().toLowerCase();

    // 2️⃣ Fetch sheet CSV
    const response = await fetch(sheetURL);
    const csvText = await response.text();

    // Remove header row
    const rows = csvText
        .split("\n")
        .slice(1)
        .map(r => r.split(","));

    // 3️⃣ Filter rows by passport (Column C = index 2)
    const passportMatches = rows.filter(row =>
        row[2] && row[2].trim().toLowerCase() === passport
    );

    if (passportMatches.length === 0) {
        alert("No record found for this passport.");
        return;
    }

    // 4️⃣ Ask timestamp
    const userInput = prompt("Enter timestamp (d/m/yyyy hh:mm:ss)");

    if (!userInput) {
        alert("No timestamp entered.");
        return;
    }

    // Convert d/m/yyyy → m/d/yyyy
    function convertFormat(input) {
        const [datePart, timePart] = input.split(" ");
        const [day, month, year] = datePart.split("/");
        return `${month}/${day}/${year} ${timePart}`;
    }

    const convertedTimestamp = convertFormat(userInput);

    // 5️⃣ Find exact match (Column A = index 0)
    const exactMatch = passportMatches.find(row =>
        row[0] && row[0].trim() === convertedTimestamp
    );

    if (!exactMatch) {
        alert("Timestamp not matched.");
        return;
    }

    // 6️⃣ Extract columns B, C, D, E
    const name = exactMatch[1];
    const passportNumber = exactMatch[2];
    const placeOfIssue = exactMatch[3];
    const dateOfIssue = exactMatch[4];

    // 7️⃣ Show result
    alert(
        "MATCH FOUND:\n\n" +
        "Họ và tên: " + name + "\n" +
        "Số hộ chiếu: " + passportNumber + "\n" +
        "Nơi cấp: " + placeOfIssue + "\n" +
        "Ngày cấp: " + dateOfIssue
    );

})();
