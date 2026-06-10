import { AIAssistantPanel } from "../../components/AIAssistantPanel";
import { NewPartnerRegistrationWizardFields } from "../../components/NewPartnerRegistrationWizardFields";

export default function NewPartnerRegistrationPreviewPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f1e8",
        padding: "32px 28px",
        color: "#102033",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ marginBottom: 22 }}>
          <p
            style={{
              margin: 0,
              color: "#8a6a3e",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Finera / Sose SAFE DEV
          </p>
          <h1
            style={{
              margin: "8px 0 8px",
              color: "#102033",
              fontSize: 38,
              lineHeight: 1.1,
              fontWeight: 900,
            }}
          >
            Նոր գործընկեր գրանցել
          </h1>
          <p style={{ margin: 0, maxWidth: 900, color: "#334155", fontSize: 15, lineHeight: 1.7 }}>
            Սա նոր wizard-ի preview տարբերակն է՝ առանց իրական DB պահպանման։ Այստեղ մաքրում ենք
            աշխատանքի ընթացքը, դաշտերի հերթականությունը և AI օգնականի տեղը։
          </p>
        </div>

        <NewPartnerRegistrationWizardFields />
        <AIAssistantPanel />
      </div>
    </main>
  );
}
