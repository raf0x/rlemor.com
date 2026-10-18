import type { MetadataRoute } from "next";

const baseUrl = "https://rlemor.com";

const routes = ["/", "/work", "/projects", "/about", "/contact", "/projects/mypepprotocol", "/projects/lighthouse"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route, baseUrl).toString(),
  }));
}
