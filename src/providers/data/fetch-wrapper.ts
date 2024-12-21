import { GraphQLFormattedError } from "graphql";

type Error = {
  message: string;
  statusCode: string
}

export const customFetch = async (url: string, options: RequestInit) => {
  const accessToken = localStorage.getItem("access_token");
  const headers = options.headers as Record<string, string>;

  return await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: headers?.authorization || `Bearer ${accessToken}`,
      "Content.Type": "application/json",
      "Apollo-Require-Preflight": "true",
    },
  });
};

export const getGraphQLErrors = (
  body: Record<"errors", GraphQLFormattedError[] | undefined>
): Error | null | undefined => {
  if (!body) {
    return {
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    };
  }

  if ("errors" in body && body.errors) {
    const errors = body.errors;
    const messages = errors.map((error) => error.message).join("");
    const code = errors.[0].extensions.code;

    return {
      message: messages || JSON.stringify(errors),
      statusCode: code || 500
    }
  }

  return null
};
