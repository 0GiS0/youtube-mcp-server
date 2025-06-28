source mcp-remote/.env

ACCESS_TOKEN=$(curl --request POST \
  --url ${ISSUER}/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "client_id":"${AUTH0_CLIENT_ID}",
    "client_secret":"${AUTH0_CLIENT_SECRET}",
    "audience":"${ISSUER}/api/v2/",
    "grant_type":"client_credentials"
  }' \
  | jq -r '.access_token')


curl --request GET \
  --url '${ISSUER}/api/v2/connections' \
   --header 'authorization: Bearer '$ACCESS_TOKEN | jq .

curl --request PATCH \
  --url '${ISSUER}/api/v2/connections/<CONNECTION_ID>' \
  --header 'authorization: Bearer '$ACCESS_TOKEN \
  --header 'cache-control: no-cache' \
  --header 'content-type: application/json' \
  --data '{ "is_domain_connection": true }'