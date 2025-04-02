import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let UpdatedAtText = "Carregendo ...";

  if (!isLoading && data) {
    UpdatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {UpdatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let DatabaseStatusIformation = "Carregendo ...";

  if (!isLoading && data) {
    DatabaseStatusIformation = (
      <>
        <div> Versão: {data.dependencies.database.version}</div>
        <div>Conexões abertas: {data.dependencies.database.opened_connections}</div>
        <div>Conexões maximas: {data.dependencies.database.max_connections}</div>
      </>
    );
  }
  return (
    <>
      <h2>Database</h2>
      <div>{DatabaseStatusIformation}</div>
    </>
  );
}
