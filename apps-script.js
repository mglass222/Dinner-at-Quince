// ==========================================================
// Google Apps Script — Dinner at Quince Lakehouse Backend
// ==========================================================
//
// SETUP:
//   1. Open your existing Google Sheet (linked to your Google Form)
//   2. Go to Extensions > Apps Script
//   3. Replace the default code with this file's contents
//   4. Deploy > New deployment > Web app
//      - Execute as: Me
//      - Who has access: Anyone
//   5. Copy the web app URL and paste it into script.js (API_URL)
//
// Sheet columns (from Google Form):
//   A: Timestamp | B: Names of those attending | C: Number in party | D: Dietary restrictions
//

/**
 * Handle GET requests — return list of attendees (name + party size).
 */
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var attendees = [];

    // Skip header row (index 0)
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[1]) { // Only include rows with a name (Column B)
        attendees.push({
          name: row[1],       // Column B: Names of those attending
          partySize: row[2]   // Column C: Number in party
        });
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify(attendees))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle POST requests — append a new attendee row.
 */
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var name = payload.name;
    var partySize = payload.partySize;
    var dietary = payload.dietary || '';
    var timestamp = new Date().toISOString();

    if (!name || !partySize) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Missing required fields.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Append new row: Timestamp | Name | Number in party | Dietary restrictions
    sheet.appendRow([timestamp, name, partySize, dietary]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', action: 'created' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
