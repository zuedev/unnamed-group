const fs = require("fs");
const path = require("path");

// Read the JSON file
const jsonPath = path.join(__dirname, "squad.xml.json");
const xmlPath = path.join(__dirname, "squad.xml");

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

// Build XML string
let xml = `<squad nick="${data.nick}">\n`;
xml += `    <name>${data.name}</name>\n`;
xml += `    <email>${data.email}</email>\n`;
xml += `    <web>${data.web}</web>\n`;
xml += `    <picture>${data.picture}</picture>\n`;
xml += `    <title>${data.title}</title>\n`;

// Add members
for (const member of data.members) {
  xml += `    <member id="${member.id}" nick="${member.nick}">\n`;
  xml += `        <name>${member.name}</name>\n`;
  xml += `        <email>${member.email}</email>\n`;
  xml += `        <icq>${member.icq}</icq>\n`;
  xml += `        <remark>${member.remark}</remark>\n`;
  xml += `    </member>\n`;
}

xml += `</squad>\n`;

// Write the XML file
fs.writeFileSync(xmlPath, xml);

console.log("Successfully converted squad.xml.json to squad.xml");
