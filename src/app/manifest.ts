import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LuckyStar Garages",
    short_name: "LuckyStar",
    description: "Garage WhatsApp bot and mobile-first admin dashboard",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e8",
    theme_color: "#d86d29",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
