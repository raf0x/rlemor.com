import { ImageResponse } from "next/og";

export const alt =
  "Rafael Lemor. Customer Success, global events, independent products.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "70px 76px 62px",
          backgroundColor: "#fffcf7",
          color: "#29312d",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 23,
            letterSpacing: 1.3,
            color: "#23675a",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 10,
              backgroundColor: "#23675a",
            }}
          />
          RAFAEL LEMOR
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "serif",
              fontSize: 100,
              fontWeight: 500,
              letterSpacing: -4,
              lineHeight: 1.05,
            }}
          >
            Rafael Lemor.
          </div>
          <div
            style={{
              display: "flex",
              width: 88,
              height: 5,
              backgroundColor: "#315bc6",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 31,
              lineHeight: 1.5,
              fontWeight: 400,
              color: "#29312d",
            }}
          >
            Customer Success · Global Events · Independent Products
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingTop: 20,
            borderTop: "1px solid #dcded2",
            fontSize: 23,
            color: "#315bc6",
          }}
        >
          <div>rlemor.com</div>
          <div style={{ color: "#29312d" }}>Miami, Florida</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
