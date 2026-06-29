import { Icon, iconRegistry, type IconName } from "../../components/Icon";

const names = (Object.keys(iconRegistry) as IconName[]).sort();

export function IconGallery() {
  return (
    <div>
      <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)" }}>
        {names.length} registered icons
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(116px, 1fr))",
          gap: "8px",
        }}
      >
        {names.map((name) => (
          <div
            key={name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              padding: "16px 8px",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Icon icon={name} size="lg" />
            <code
              style={{
                fontSize: "11px",
                color: "var(--color-muted-foreground)",
                wordBreak: "break-word",
              }}
            >
              {name}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
