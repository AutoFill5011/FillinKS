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

        alert(
        "===== MATCH FOUND =====\n\n" +

        "Timestamp: " + data[0] + "\n\n" +

        "--- Người yêu cầu ---\n" +
        "Họ và tên: " + data[1] + "\n" +
        "Số hộ chiếu: " + data[2] + "\n" +
        "Nơi cấp hộ chiếu: " + data[3] + "\n" +
        "Ngày cấp hộ chiếu: " + data[4] + "\n" +
        "Nơi cư trú: " + data[5] + "\n" +
        "Quan hệ: " + data[6] + "\n\n" +
        
        "--- Thông tin bé ---\n" +
        "Họ tên: " + data[7] + "\n" +
        "Ngày sinh: " + data[8] + "\n" +
        "Ghi bằng chữ: " + data[9] + "\n" +
        "Nơi sinh: " + data[10] + "\n" +
        "Giới tính: " + data[11] + "\n" +
        "Dân tộc: " + data[12] + "\n" +
        "Quốc tịch: " + data[13] + "\n" +
        "Quê quán: " + data[14] + "\n\n" +

        "--- Thông tin cha ---\n" +
        "Họ tên: " + data[15] + "\n" +
        "Năm sinh: " + data[16] + "\n" +
        "Dân tộc: " + data[17] + "\n" +
        "Quốc tịch: " + data[18] + "\n" +
        "Địa chỉ 1: " + data[19] + "\n" +
        "Địa chỉ 2: " + data[20] + "\n\n" +

        "--- Thông tin mẹ ---\n" +
        "Họ tên: " + data[21] + "\n" +
        "Năm sinh: " + data[22] + "\n" +
        "Dân tộc: " + data[23] + "\n" +
        "Quốc tịch: " + data[24] + "\n" +
        "Địa chỉ 1: " + data[25] + "\n" +
        "Địa chỉ 2: " + data[26]
        );

    } catch (err) {
        alert("Error fetching sheet. Make sure it is shared publicly.");
        console.error(err);
    }

})();
