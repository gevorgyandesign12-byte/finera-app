export type DemoMenuItem = {
  label: string;
  note: string;
  children?: DemoMenuItem[];
};

export const demoMenuByRole: Record<string, DemoMenuItem[]> = {
  manager: [
    { label: "Գլխավոր", note: "Ամբողջ համակարգի ընդհանուր պատկեր" },
    { label: "Կազմակերպություններ", note: "Բոլոր client organization-ները" },
    {
  label: "Հաշվապահական տարածք",
  note: "Բոլոր հաշվապահական մոդուլները",
  children: [
    { label: "Գլխավոր հաշվառում", note: "Հաշվապահական ընդհանուր տարածք" },
    { label: "Փաստաթղթեր", note: "Մուտքագրվող փաստաթղթեր" },
  ],
},
    { label: "Հարցումներ", note: "Բոլոր գործընկերների հարցումները" },
    { label: "Կարգավորումներ", note: "System-level կարգավորումներ" },
  ],

  "chief-accountant": [
    { label: "Գլխավոր", note: "Իրեն վստահված կազմակերպությունների dashboard" },
    { label: "Կազմակերպություններ", note: "Միայն իրեն վստահված կազմակերպությունները" },
    { label: "Հաշվապահական տարածք", note: "Հաշվառում և վերահսկում" },
    { label: "Հաշվետարների վերահսկում", note: "Թիմի աշխատանքի վերահսկում" },
    { label: "Հաշվետվություններ", note: "Ֆինանսական և հարկային ամփոփումներ" },
  ],

  bookkeeper: [
    { label: "Գլխավոր", note: "Իր թույլատրված աշխատանքի dashboard" },
    { label: "Փաստաթղթեր", note: "Մուտքագրում և ընթացիկ աշխատանք" },
    { label: "Դրամարկղ", note: "Թույլատրված cash operations" },
    { label: "Բանկ", note: "Թույլատրված bank operations" },
  ],

  client: [
    { label: "Գլխավոր", note: "Իր կազմակերպության ամփոփ վիճակ" },
    { label: "Հաշվետվության ամփոփում", note: "Միայն dashboard/report մակարդակ" },
    { label: "Հարցումներ", note: "Հարց ուղարկել Finera թիմին" },
  ],

  "hr-legal": [
    { label: "Գլխավոր", note: "HR/legal աշխատանքների dashboard" },
    { label: "Աշխատակիցներ", note: "Գրանցում, տեղափոխում, ազատում" },
    { label: "Պայմանագրեր", note: "Աշխատանքային և այլ պայմանագրեր" },
    { label: "Արձակուրդներ", note: "Արձակուրդային գործընթացներ" },
  ],

  support: [
    { label: "Գլխավոր", note: "Սպասարկման dashboard" },
    { label: "Հարցումներ", note: "Գործընկերների հարցումների հոսք" },
    { label: "Chat", note: "Հաղորդակցություն գործընկերների հետ" },
    { label: "Կարգավիճակներ", note: "Հարցումների ընթացքի վերահսկում" },
  ],

  tech: [
    { label: "Գլխավոր", note: "Technical overview" },
    { label: "Uptime", note: "Հասանելիության դիտարկում" },
    { label: "Logs", note: "Սխալների և համակարգային գրանցումների դիտում" },
    { label: "Backups", note: "Պահուստավորման վիճակ" },
    { label: "Deployments", note: "Deploy status, միայն human approval-ով" },
  ],
};
