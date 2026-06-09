import { NewPartnerRegistrationWizardFields } from "../../components/NewPartnerRegistrationWizardFields";

export default function NewPartnerRegistrationPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">
            Finera / Sose SAFE DEV
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Նոր գործընկեր գրանցել
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Սա նոր wizard-ի preview տարբերակն է՝ առանց իրական DB պահպանման։
            Հաստատելուց հետո նույն կառուցվածքը կմիացնենք հիմնական էջին։
          </p>
        </div>

        <NewPartnerRegistrationWizardFields />
      </div>
    </main>
  );
}
