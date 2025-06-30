
# Cargar variables de entorno desde .env
set -a
source ./mcp-remote/.env
set +a

# Obtener el token de acceso
ACCESS_TOKEN=$(curl --request POST \
  --url "${ISSUER}oauth/token" \
  --header 'content-type: application/json' \
  --data '{
    "client_id":"'${AUTH0_CLIENT_ID}'",
    "client_secret":"'${AUTH0_CLIENT_SECRET}'",
    "audience":"'${ISSUER}api/v2/'",
    "grant_type":"client_credentials" 
  }' \
  | jq -r '.access_token')

# Listar conexiones
curl --request GET \
  --url "${ISSUER}api/v2/connections" \
  --header "authorization: Bearer ${ACCESS_TOKEN}" | jq .

# Actualizar una conexión (reemplaza <CONNECTION_ID> por el ID real)
curl --request PATCH \
  --url "${ISSUER}api/v2/connections/con_fs55Gnlp1kbTNukt" \
  --header "authorization: Bearer ${ACCESS_TOKEN}" \
  --header 'cache-control: no-cache' \
  --header 'content-type: application/json' \
  --data '{ "is_domain_connection": true }'