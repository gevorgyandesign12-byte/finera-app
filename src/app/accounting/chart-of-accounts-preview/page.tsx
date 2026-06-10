import { ChartOfAccountsPreview } from "../../../components/ChartOfAccountsPreview";

export default function ChartOfAccountsPreviewPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f1e8",
        padding: "28px",
        color: "#102033",
      }}
    >
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <ChartOfAccountsPreview />
      </div>
    </main>
  );
}
