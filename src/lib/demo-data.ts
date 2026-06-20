export type DemoUser = {
  id: string;
  name: string;
  role: string;
  description: string;
  fineraEmployeeId?: string;
  organizations: string[];
  allowedModules: string[];
};

export const demoUsers: DemoUser[] = [
  {
    id: "manager",
    name: "Demo Manager",
    role: "Կառավարիչներ / Managers",
    description: "Տեսնում է ամբողջ համակարգի ընդհանուր վիճակը։",
    organizations: ["Արարատ ՍՊԸ", "Լոռի Թրեյդ ՍՊԸ", "Սյունիք Արտադրություն ՍՊԸ"],
    allowedModules: ["Բոլոր մոդուլները"],
  },
  {
    id: "chief-accountant",
    name: "Demo Chief Accountant",
    role: "Գլխավոր հաշվապահ",
    description: "Տեսնում է միայն իրեն վստահված կազմակերպությունները։",
    organizations: ["Արարատ ՍՊԸ", "Լոռի Թրեյդ ՍՊԸ"],
    allowedModules: ["Գլխավոր հաշվառում", "Հաշվետվություններ", "Փաստաթղթեր", "Հաշվետարների վերահսկում"],
  },
  {
    id: "bookkeeper",
    name: "Demo Bookkeeper",
    role: "Հաշվետար / Bookkeeper",
    description: "Տեսնում է միայն թույլատրված կազմակերպությունները և մոդուլները։",
    organizations: ["Արարատ ՍՊԸ"],
    allowedModules: ["Դրամարկղ", "Բանկ", "Փաստաթղթերի մուտքագրում"],
  },
  {
    id: "client",
    name: "Demo Client Organization",
    role: "Գործընկեր կազմակերպություն",
    description: "Տեսնում է միայն իր կազմակերպության dashboard/report վիճակը, ոչ ամբողջ հաշվապահական գրանցումները։",
    organizations: ["Արարատ ՍՊԸ"],
    allowedModules: ["Dashboard", "Հաշվետվության ամփոփում", "Հարցումներ"],
  },
  {
    id: "hr-legal",
    name: "Demo HR / Legal",
    role: "Կադրային / իրավաբանական բաժին",
    description: "Աշխատում է աշխատակիցների, պայմանագրերի, արձակուրդների և ազատումների հետ։",
    organizations: ["Արարատ ՍՊԸ", "Լոռի Թրեյդ ՍՊԸ"],
    allowedModules: ["Աշխատակիցներ", "Պայմանագրեր", "Արձակուրդներ", "Ազատումներ"],
  },
  {
    id: "support",
    name: "Demo Support",
    role: "Սպասարկող բաժին",
    description: "Ստանում և դասակարգում է գործընկերների հարցումները։",
    organizations: ["Արարատ ՍՊԸ", "Լոռի Թրեյդ ՍՊԸ", "Սյունիք Արտադրություն ՍՊԸ"],
    allowedModules: ["Հարցումներ", "Chat", "Սպասարկման կարգավիճակ"],
  },
  {
    id: "tech",
    name: "Demo Technical Team",
    role: "Ծրագրավորողներ / տեխնիկական թիմ",
    description: "Տեսնում է technical dashboard՝ uptime, logs, errors, deployments, backups։ Վտանգավոր գործողությունները միայն human approval-ով։",
    organizations: ["System / Infrastructure"],
    allowedModules: ["Uptime", "Logs", "Errors", "Backups", "Deployment status"],
  },
];
