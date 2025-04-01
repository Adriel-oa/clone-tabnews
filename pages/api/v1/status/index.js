import database from "infra/database.js";
import { InternalServerError } from "infra/errors.js";

async function status(request, response) {
  try {
    const updateAt = new Date().toISOString();

    const databaseVersionResult = await database.query("SHOW server_version;");
    const databaseVersionValue = databaseVersionResult.rows[0].server_version;

    const databaseMaxConnevtionsResult = await database.query(
      "SHOW max_connections;",
    );
    const databaseMaxConnectionsValue =
      databaseMaxConnevtionsResult.rows[0].max_connections;
    const databaseName = process.env.POSTGRES_DB;
    const databaseOpenedConnectionsResults = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });
    const databaseOpenedConnectionsValue =
      databaseOpenedConnectionsResults.rows[0].count;

    response.status(200).json({
      updated_at: updateAt,
      dependencies: {
        database: {
          version: databaseVersionValue,
          max_connections: parseInt(databaseMaxConnectionsValue),
          opened_connections: databaseOpenedConnectionsValue,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.log("\n Erro dentro do catch do controller:");
    console.error(publicErrorObject);
    response.status(500).json(publicErrorObject);
  }
}

export default status;
