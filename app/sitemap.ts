import type { MetadataRoute } from "next";

const baseUrl = "https://rlemor.com";

const routes = ["/", "/projects", "/about", "/contact", "/projects/mypepprotocol"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route, baseUrl).toString(),
  }));
}
