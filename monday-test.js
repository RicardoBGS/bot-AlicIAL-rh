require('dotenv').config();
const mondaySdk = require('monday-sdk-js');

const monday = mondaySdk();
monday.setToken(process.env.MONDAY_API_TOKEN);

async function verVacaciones() {
  const query = `
    query ($boardId: [ID!]) {
      boards(ids: $boardId) {
        items_page(limit: 50) {
          items {
            id
            name
            column_values(ids: ["n_meros3__1"]) {
              id
              text
              type
            }
          }
        }
      }
    }
  `;

  const variables = { boardId: 6884101599 };
  const res = await monday.api(query, { variables });

  console.log("📋 Respuesta completa de Monday:");
  console.dir(res, { depth: null });

  const items = res.data.boards[0].items_page.items;

  console.log("\n📋 Lista de empleados y días pendientes:\n");
  items.forEach(item => {
    console.log(`👤 ${item.name} | 📅 Días pendientes: ${item.column_values[0]?.text || "—"}`);
  });
}

verVacaciones().catch(err => {
  console.error("❌ Error consultando Monday:", err);
});
