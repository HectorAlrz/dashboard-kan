import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query";
import { createClient } from "graphql-ws";
import { customFetch, getGraphQLErrors } from "./fetch-wrapper";

export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = `${API_BASE_URL}/graphql`
export const WS_URL = "wss://api.crm.refine.dev/graphql";

export const client = new GraphQLClient(API_URL, {
  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});

const fetchWrapper = async (url: string, options: RequestInit) => {
  const response = await customFetch(url, options);
  /* clone() help us to consume the response more than once time */
  const responseClone = response.clone();
  const body = await responseClone.json();
  const error = getGraphQLErrors(body);

  if (error) {
    throw error;
  }

  return response;
};

export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
          const accessToken = localStorage.getItem("access_token");

          return {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      })
    : undefined;

export const dataProvider = graphqlDataProvider(client);
export const liveProvider = wsClient ? graphqlLiveProvider(wsClient) : undefined;
