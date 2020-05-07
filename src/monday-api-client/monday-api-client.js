const { MONDAY_API_URL, MONDAY_OAUTH_TOKEN_URL } = require("./../constants.js");
const fetch = require("./fetch");

const COULD_NOT_PARSE_JSON_RESPONSE_ERROR = "Could not parse JSON from monday.com's GraphQL API response";
const TOKEN_IS_REQUIRED_ERROR = "Token is required";

function apiRequest(url, data, token, options = {}) {
  return fetch.nodeFetch(url, {
    method: options.method || "POST",
    body: JSON.stringify(data || {}),
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    }
  });
}

async function execute(data, token, options = {}) {
  if (!token && options.url !== MONDAY_OAUTH_TOKEN_URL) throw new Error(TOKEN_IS_REQUIRED_ERROR);

  const url = options.url || MONDAY_API_URL;
  const path = options.path || "";
  const fullUrl = `${url}${path}`;
  let response = await apiRequest(fullUrl, data, token, options);

  try {
    return await response.json();
  } catch (err) {
    throw new Error(COULD_NOT_PARSE_JSON_RESPONSE_ERROR);
  }
}

module.exports = { execute, COULD_NOT_PARSE_JSON_RESPONSE_ERROR };
