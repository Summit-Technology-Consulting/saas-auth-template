import axios, { AxiosError, AxiosHeaders } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const api = axios.create({
  baseURL: process.env.API_URL,
});

const getJwt = async (req: NextApiRequest) => {
  return await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jwt = await getJwt(req);

  const { path, ...queryParams } = req.query;
  const method = req.method;
  const contentType = req.headers["content-type"] as string;
  const headers = new AxiosHeaders({
    "Content-Type": contentType,
  });
  const body = req.body;
  const forwardPath = Array.isArray(path) ? path.join("/") : `/${path}`;

  const queryString = new URLSearchParams(
    Object.entries(queryParams).flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .filter((v): v is string => typeof v === "string")
          .map((v) => [key, v]);
      } else if (typeof value === "string") {
        return [[key, value]];
      }
      return [];
    })
  );

  const urlWithParams = queryString
    ? `${forwardPath}?${queryString}`
    : forwardPath;

  try {
    let forwardedBody = body;

    if (method !== "GET" && method !== "DELETE") {
      if (contentType?.includes("application/json") && body) {
        forwardedBody = JSON.stringify(body);
      }
    }

    if (method === "GET") {
      forwardedBody = undefined;
    }

    if (jwt?.access_token) {
      headers.set("Authorization", `Bearer ${jwt.access_token}`);
    }

    let response;

    try {
      response = await api.request({
        method: method,
        url: urlWithParams,
        headers: headers,
        data: forwardedBody,
      });
    } catch (error: unknown) {
      console.log(
        `An unexpected error occurred at ${urlWithParams} with data: ${forwardedBody}`,
        error
      );

      if (error instanceof AxiosError) {
        if (
          error.response?.status === 401 &&
          jwt &&
          error.response?.headers["expired"]
        ) {
          res.status(307).json({ url: "/auth/signout" });
          return;
        }

        if (error.response?.status && error.response?.status >= 400) {
          console.error(error.response?.data.detail);
          res
            .status(error.response?.status)
            .send({ error: error.response?.data.detail });
          return;
        }
      }
    }

    if (!response) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "application/json"
    );
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error forwarding request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
