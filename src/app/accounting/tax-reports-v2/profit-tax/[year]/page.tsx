"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const profitTaxTabs = [
  {
    title: "1. Համախառն եկամուտներ",
    section: "Բաժին 1",
    rows: "տողեր 6–41",
    description:
      "Այստեղ կարտացոլվեն շահութահարկի հաշվարկի բոլոր եկամուտները՝ ապրանքների, արտադրանքի, աշխատանքների, ծառայությունների և այլ եկամուտների մասով։ 41-րդ տողը կլինի համախառն եկամտի ամփոփումը։",
  },
  {
    title: "2. Ծախսեր և նվազեցումներ",
    section: "Բաժին 1",
    rows: "տողեր 42–84",
    description:
      "Այստեղ կարտացոլվեն ծախսերը, կորուստները և այլ նվազեցումները։ 84-րդ տողը կլինի ընդհանուր նվազեցումների ամփոփումը։",
  },
  {
    title: "3. Հարկվող շահույթ և շահութահարկ",
    section: "Բաժին 1",
    rows: "տողեր 85–107",
    description:
      "Այստեղ կձևավորվի հարկվող շահույթը կամ հարկային վնասը, հաշվարկված շահութահարկը, կանխավճարները և վճարման կամ փոխհատուցման ենթակա վերջնական արդյունքը։",
  },
  {
    title: "4. Բաժին 2․ Ոչ ռեզիդենտի եկամուտներ",
    section: "Բաժին 2",
    rows: "ոչ ռեզիդենտի հատուկ եկամուտներ",
    description:
      "Այստեղ կլրացվեն մշտական հաստատության միջոցով ՀՀ-ում գործունեություն իրականացնող ոչ ռեզիդենտ շահութահարկ վճարողի՝ մշտական հաստատությանը չվերագրվող եկամուտները և դրանց գծով հաշվարկված շահութահարկը։",
  },
  {
    title: "5. Բաժին 3․ Դեբիտորական/կրեդիտորական պարտքեր",
    section: "Բաժին 3",
    rows: "պարտքերի ամփոփում",
    description:
      "Այստեղ կերևան դեբիտորական և կրեդիտորական պարտքերի պահուստների, պահուստաֆոնդի և դուրսգրված անհուսալի պարտքերի ամփոփ ցուցանիշները։",
  },
  {
    title: "6. Բաժին 4․ Անհուսալի պարտքեր",
    section: "Բաժին 4",
    rows: "անհուսալի ճանաչված պարտքերի բացվածք",
    description:
      "Այստեղ կլինի տողային աղյուսակ՝ անհուսալի դեբիտորական և կրեդիտորական պարտքերի համար՝ գումար, դուրսգրման ամսաթիվ, դատարանի վճիռ և մյուս անձի տվյալներ։",
  },
  {
    title: "7. Բաժին 5․ ՀՄ ամորտիզացիոն ժամկետներ",
    section: "Բաժին 5",
    rows: "հիմնական միջոցների հարկային ամորտիզացիա",
    description:
      "Այստեղ կլրացվեն հարկման նպատակով հիմնական միջոցների ամորտիզացիոն ժամկետները՝ նախորդ և հաշվետու տարվա տվյալներով։",
  },
  {
    title: "8. Բաժին 6․ ՈՆԱ ամորտիզացիոն ժամկետներ",
    section: "Բաժին 6",
    rows: "ոչ նյութական ակտիվների հարկային ամորտիզացիա",
    description:
      "Այստեղ կլրացվեն հարկման նպատակով ոչ նյութական ակտիվների ամորտիզացիոն ժամկետները։",
  },
  {
    title: "9. Բաժին 7․ Հաշվապահական քաղաքականություն",
    section: "Բաժին 7",
    rows: "հաշվապահական քաղաքականության բացահայտումներ",
    description:
      "Այստեղ կտեղադրվեն հաշվապահական հաշվառման քաղաքականությանը վերաբերող բացահայտումները։ Սա երկրորդային բաժին է, բայց պահում ենք պաշտոնական ձևի տրամաբանությամբ։",
  },
  {
    title: "10. Բաժին 8․ Հաշվեկշռային արժեքներ և հարկային բազա",
    section: "Բաժին 8",
    rows: "ակտիվներ, պարտավորություններ, հաշվապահական արժեքներ և հարկային բազաներ",
    description:
      "Սա շատ կարևոր և լայն բաժին է։ Այստեղ պետք է լինեն ակտիվների և պարտավորությունների հաշվապահական հաշվեկշռային արժեքները և հարկային բազաները։ Հետագայում այս բաժնի համար կկառուցենք wide-table viewer։",
  },
  {
    title: "11. Բաժին 9․ Եկամուտներ ըստ գործունեության տեսակների",
    section: "Բաժին 9",
    rows: "գործունեության կոդեր և տեսակարար կշիռներ",
    description:
      "Այստեղ կերևան եկամուտները ըստ գործունեության տեսակների՝ բաժին, հատված, խումբ, դաս, ենթադաս և տեսակարար կշիռ տոկոսով։",
  },
  {
    title: "12. Բաժին 10․ Հատուկ ծրագրեր",
    section: "Բաժին 10",
    rows: "կառավարության հավանությանն արժանացած ծրագրեր",
    description:
      "Այստեղ կլրացվեն կառավարության հավանությանն արժանացած ծրագրեր իրականացնող ռեզիդենտ հարկ վճարողների վերաբերյալ տեղեկությունները։",
  },
  {
    title: "13. Բաժին 11․ Շինարարության/շինմոնտաժային հատուկ ծրագիր",
    section: "Բաժին 11",
    rows: "ՀՀ տարածքից դուրս շինարարության կամ շինմոնտաժային գործունեություն",
    description:
      "Այստեղ կլրացվեն հատուկ տվյալները այն դեպքերի համար, երբ ծրագիրը վերաբերում է բացառապես ՀՀ տարածքից դուրս շինարարության կամ շինմոնտաժային ոլորտում գործունեությանը։",
  },
];

const grossIncomeRows = [
  ["6", "Ապրանքների մատակարարումից եկամուտը", ""],
  ["7", "Արտադրանքի մատակարարումից եկամուտը", ""],
  ["8", "Աշխատանքների կատարումից եկամուտը", ""],
  ["9", "Ծառայությունների մատուցումից եկամուտը, այդ թվում՝", ""],
  ["9.1", "Անհատ ձեռնարկատերերի ֆրախտի դիմաց ստացվող եկամուտը", ""],
  ["10", "Միջնորդական պայմանագրերի շրջանակներում իրականացված գործարքներից եկամուտը", ""],
  ["11", "Հիմնական միջոցների օտարումից եկամուտը", ""],
  ["12", "Ոչ նյութական ակտիվների օտարումից եկամուտը", ""],
  ["13", "Այլ ակտիվների օտարումից եկամուտը", ""],
  ["14", "Շահաբաժիններից եկամուտը", ""],
  ["15", "Վարկերի տրամադրումից տոկոսային եկամուտը", ""],
  ["16", "Փոխառությունների տրամադրումից տոկոսային եկամուտը", ""],
  ["17", "Ֆինանսական վարձակալությունից տոկոսային եկամուտը", ""],
  ["18", "Գործառնական վարձակալությունից վարձակալական վճարից և (կամ) սերվիտուտի վճարից եկամուտը", ""],
  ["19", "Ռոյալթիներից եկամուտը", ""],
  ["20", "Անհատույց ստացված դրամական միջոցներից եկամուտը", ""],
  ["21", "Անհատույց ստացված հողամասերից եկամուտը", ""],
  ["22", "Անհատույց ստացված այլ ակտիվներից եկամուտը", ""],
  ["23", "Դատարանի որոշումների հիման վրա տիրազուրկ ճանաչված և սեփականության իրավունքով փոխանցվող ակտիվներից եկամուտը", ""],
  ["24", "Տիրազուրկ ակտիվների նկատմամբ իրավունքների ճանաչման դեպքում տիրազուրկ ակտիվներից եկամուտը", ""],
  ["25", "Գույքագրման ժամանակ հայտնաբերված գույքի ավելցուկից եկամուտը", ""],
  ["26", "Պարտավորությունների ամբողջությամբ կամ մասնակի զեղչումից կամ ներումից ստացվող եկամուտը", ""],
  ["27", "Ապահովագրական հատուցումից եկամուտը", ""],
  ["28", "Պատճառված վնասի կամ կրած կորստի հատուցումից եկամուտը", ""],
  ["29", "Տույժերի, տուգանքների և գույքային այլ պատժամիջոցների տեսքով եկամուտը", ""],
  ["30", "Անվավեր ճանաչված գործարքների մասով նվազեցումների վերաձևակերպումից եկամուտը", ""],
  ["31", "Հարկման նպատակով դուրս գրման ենթակա կրեդիտորական պարտքերից եկամուտը", ""],
  ["32", "Նախկինում դուրս գրված անհուսալի դեբիտորական պարտքերի մարումից եկամուտը", ""],
  ["33", "Դեբիտորական պարտքերի հնարավոր կորուստների պահուստի ճշգրտումից եկամուտը", ""],
  ["34", "Բանկերի, վարկային կազմակերպությունների, ապահովագրական ընկերությունների և արժեթղթերի շուկայի մասնագիտացված անձանց հատուկ եկամուտները՝ նախկինում դուրս գրված ակտիվների վերականգնումից", ""],
  ["35", "Բանկերի, վարկային կազմակերպությունների, ապահովագրական ընկերությունների և արժեթղթերի շուկայի մասնագիտացված անձանց պահուստների նվազեցման գծով եկամուտը", ""],
  ["36", "Ապահովագրական ընկերությունների տեխնիկական պահուստների գծով ճանաչվող եկամուտը", ""],
  ["37", "Վերաապահովագրության փոխանցված պայմանագրերից ստացվող կոմիսիոն վարձատրությունից եկամուտը", ""],
  ["38", "Ածանցյալ ֆինանսական գործիքներով ստացվող վճարումներից եկամուտը", ""],
  ["39", "Հաշվանցման ենթակա ԱԱՀ-ի գումարներին ավելացվող գումարներից եկամուտը", ""],
  ["40", "Այլ եկամուտները", ""],
  ["41", "Համախառն եկամուտը՝ 6–40-րդ կետերում նշված եկամուտների հանրագումարը", "calculated"],
  ["41.1", "Արտոնագրային հարկով հարկվող գործունեությունից եկամուտը", ""],
  ["41.2", "Համատեղ գործունեությունից եկամուտը", ""],
  ["41.3", "Սահմանամերձ բնակավայրերում արտադրության կազմակերպման արդյունքում ստացված արտադրանքի իրացումից ստացման ենթակա եկամուտը", ""],
];


const expenseDeductionRows = [
  ["42", "Մատակարարված ապրանքների սկզբնական արժեքը", ""],
  ["43", "Մատակարարված արտադրանքի արտադրության հետ անմիջականորեն կապված ծախսը", ""],
  ["44", "Աշխատանքների կատարման հետ անմիջականորեն կապված ծախսը", ""],
  ["45", "Ծառայությունների մատուցման հետ անմիջականորեն կապված ծախսը", ""],
  ["46", "Միջնորդական պայմանագրերի շրջանակներում իրականացված գործարքների հետ անմիջականորեն կապված ծախսը", ""],
  ["47", "Օտարված հիմնական միջոցների հաշվեկշռային արժեքը", ""],
  ["48", "Օտարված ոչ նյութական ակտիվների հաշվեկշռային արժեքը", ""],
  ["49", "Օտարված այլ ակտիվների հաշվեկշռային արժեքը", ""],
  ["50", "Վարչական ծախսերը, այդ թվում՝", ""],
  ["50.1", "ՀՀ տարածքից դուրս գործուղման հետ կապված ծախսերը", ""],
  ["50.2", "ՀՀ տարածքում գործուղման հետ կապված ծախսերը", ""],
  ["50.3", "Ներկայացուցչական ծախսերը", ""],
  ["50.4", "Կառավարման ծառայությունների գծով ծախսերը", ""],
  ["50.5", "Խորհրդատվական ծառայությունների գծով ծախսերը", ""],
  ["50.6", "Տեղեկատվական ծառայությունների գծով ծախսերը", ""],
  ["51", "Իրացման ծախսերը, այդ թվում՝", ""],
  ["51.1", "Գովազդի գծով ծախսերը", ""],
  ["51.2", "Մարկետինգի գծով ծախսերը", ""],
  ["52", "Ոչ արտադրական բնույթի ծախսերը", ""],
  ["53", "Ֆինանսական ծախսերը, այդ թվում՝", ""],
  ["53.1", "Վարկերի, ինչպես նաև բանկերից և վարկային կազմակերպություններից ներգրավված փոխառությունների գծով տոկոսը", ""],
  ["53.2", "Բանկ և/կամ վարկային կազմակերպություն չհամարվող սուբյեկտներից ներգրավված փոխառությունների գծով տոկոսը", ""],
  ["54", "Ֆիզիկական անձանց օգնության, սննդի կազմակերպման, սոցիալ-մշակութային միջոցառումների և համանման այլ ծախսերը", ""],
  ["55", "Ապահովագրական և վերաապահովագրական ծախսը", ""],
  ["56", "Վարձակալական վճարի կամ սերվիտուտի գծով ծախսը", ""],
  ["57", "Պատճառված վնասի կամ կրած կորստի հատուցման գծով ծախսը", ""],
  ["58", "Տույժերի, տուգանքների և գույքային այլ պատժամիջոցների տեսքով ծախսը", ""],
  ["59", "Չփոխհատուցվող և սահմանված կարգով չհաշվանցվող հարկերի, տուրքերի և վճարների գծով ծախսը", ""],
  ["60", "Հաշվանցման ենթակա ԱԱՀ-ի գումարներից նվազեցվող գումարների գծով ծախսը", ""],
  ["61", "Այլ ծախսերը", ""],
  ["62", "Ընդամենը ծախսերը՝ 42–61-րդ կետերում նշված ծախսերի հանրագումարը", "calculated"],
  ["63", "Բնական կորուստը", ""],
  ["64", "Որակական կորուստը", ""],
  ["65", "Պատահական կորուստը", ""],
  ["66", "Այլ կորուստը", ""],
  ["67", "Ընդամենը կորուստները՝ 63–66-րդ կետերում նշված կորուստների հանրագումարը", "calculated"],
  ["68", "Անվավեր ճանաչված գործարքների մասով համախառն եկամտում ներառված գումարների վերաձևակերպումից նվազեցումը", ""],
  ["69", "Անհուսալի դեբիտորական պարտքերի դուրսգրման համար պահուստին կատարվող մասհանումները", ""],
  ["70", "Անհուսալի դեբիտորական պարտքերի դուրսգրման դեպքում պահուստին կատարված մասհանումները գերազանցող գումարները", ""],
  ["71", "Նախկինում դուրս գրված անհուսալի կրեդիտորական պարտքերի մարման գումարները", ""],
  ["72", "Բանկերի, վարկային կազմակերպությունների, ապահովագրական ընկերությունների և արժեթղթերի շուկայի մասնագիտացված անձանց պահուստներին ուղղված գումարները", ""],
  ["73", "Բանկերի, վարկային կազմակերպությունների, ապահովագրական ընկերությունների և արժեթղթերի շուկայի մասնագիտացված անձանց ապահովագրական և վերաապահովագրական հատուցումները", ""],
  ["74", "Ապահովագրական ընկերությունների տեխնիկական պահուստների գծով կատարվող ծախսերը", ""],
  ["75", "Կեղծ թղթադրամների և վճարային փաստաթղթերի պատճառով կրած կորուստները", ""],
  ["76", "Հարկային տարվան նախորդող 5 հարկային տարիների գործունեության արդյունքներով առաջացած հարկային վնասը", ""],
  ["77", "Գրադարաններին, թանգարաններին, դպրոցներին, բժշկական և ոչ առևտրային կազմակերպություններին տրամադրված ակտիվների, աշխատանքների կամ ծառայությունների արժեքը", ""],
  ["78", "Հաշմանդամ աշխատողի կամ ՔՊ պայմանագրով ծառայություն մատուցողի եկամուտների հանրագումարի 150%-ը", ""],
  ["79", "Ածանցյալ ֆինանսական գործիքներով կատարվող վճարումների գծով ծախսը", ""],
  ["80", "Ռեզիդենտ շահութահարկ վճարողի շահաբաժինները", ""],
  ["81", "Անհատ ձեռնարկատիրոջ կամ նոտարի կամավոր կենսաթոշակային վճար", ""],
  ["82", "Այլ նվազեցումներ", ""],
  ["83", "Ընդամենը այլ նվազեցումները՝ 68–82-րդ կետերում նշված այլ նվազեցումների հանրագումարը", "calculated"],
  ["84", "Ընդամենը նվազեցումներ՝ կետ 62 + կետ 67 + կետ 83", "calculated"],
  ["84.1", "Արտոնագրային հարկով հարկվող գործունեությունից նվազեցումները", ""],
  ["84.2", "Համատեղ գործունեությունից նվազեցումները", ""],
  ["84.3", "Սահմանամերձ բնակավայրերում արտադրության կազմակերպման գործունեության գծով նվազեցումները", ""],
];


const taxableProfitRows = [
  ["85", "Հարկվող շահույթը կամ հարկային վնասը", "calculated"],
  ["86", "Հարկվող շահույթի նվազեցման, այդ թվում՝ շահութահարկի վճարումից եկամուտների ազատման արտոնությունները", ""],
  ["87", "Հարկվող շահույթը՝ հաշվի առած հարկվող շահույթի նվազեցման արտոնությունները", "calculated"],
  ["88", "Հաշվետու տարվա շահութահարկի գումարը", "calculated"],
  ["89", "Կառավարության որոշմամբ հավանության արժանացած գործարար ծրագրի արտոնությամբ նվազեցվող շահութահարկի գումարը", ""],
  ["90", "Առանձին խմբերի քաղաքացիներին զեղչ կամ անվճար ծառայություններ մատուցելու արտոնությամբ նվազեցվող շահութահարկի գումարը", ""],
  ["91", "Ընդամենը շահութահարկի նվազեցման արտոնության հետևանքով նվազեցվող շահութահարկի գումարը", "calculated"],
  ["92", "Շահութահարկի գումարը՝ շահութահարկի նվազեցման արտոնությունները նվազեցնելուց հետո", "calculated"],
  ["93", "Նախորդ հաշվետու տարիների ընթացքում օտարերկրյա պետություններում գանձված և դեռ չնվազեցված շահութահարկի գումարը", ""],
  ["94", "Հաշվետու տարում օտարերկրյա պետություններում գանձված և շահութահարկից նվազեցման ենթակա հարկի գումարը", ""],
  ["95", "Օտարերկրյա պետություններում գանձված հարկի հաշվետու տարվա շահութահարկից նվազեցվող գումարը", "calculated"],
  ["96", "Օտարերկրյա պետություններում գանձված հարկի հաջորդ տարիներ փոխանցվող գումարը", "calculated"],
  ["97", "Մշտական հաստատությանը վճարված եկամուտներից հարկային գործակալի կողմից հաշվարկված և պահված շահութահարկի գումարը", ""],
  ["98", "Շահութահարկի գումարը՝ նվազեցումները կատարելուց հետո", "calculated"],
  ["99", "Ոչ ռեզիդենտի՝ մշտական հաստատությանը չվերագրվող եկամուտների մասով շահութահարկի գումարը", ""],
  ["100", "Շահութահարկի ընդհանուր գումարը", "calculated"],
  ["101", "Հաշվետու տարում շահութահարկի հաշվարկված կանխավճարների հանրագումարը", ""],
  ["102", "Շահութահարկի գումարը՝ կանխավճարները նվազեցնելուց հետո", "calculated"],
  ["103", "Նախորդ տարիներում վճարված և շահութահարկից չհաշվանցված նվազագույն շահութահարկի գումարը", ""],
  ["104", "Վճարման ենթակա շահութահարկի գումարը", "calculated"],
  ["105", "Հաջորդ տարիներ փոխանցվող չհաշվանցված նվազագույն շահութահարկի գումարը", "calculated"],
  ["106", "Բյուջեից փոխհատուցման ենթակա շահութահարկի գումարը", "calculated"],
  ["107", "Շրջանառության հարկով և/կամ արտոնագրային հարկով հարկվող գործունեության տեսակներով զբաղված ԱՁ-ների և նոտարների շահութահարկի գումարը", ""],
];


const section8TaxBaseRows = [
  ["1", "Հիմնական միջոցներ", "asset"],
  ["2", "Ոչ նյութական ակտիվներ", "asset"],
  ["3", "Ներդրումներ, այդ թվում՝ տրված վարկեր և փոխառություններ", "asset"],
  ["4", "Հումք, նյութեր, կիսապատրաստուկներ", "asset"],
  ["5", "Կենսաբանական ակտիվներ", "asset"],
  ["6", "Անավարտ արտադրություն", "asset"],
  ["7", "Պատրաստի արտադրանք", "asset"],
  ["8", "Ապրանքներ", "asset"],
  ["9", "Տրված կանխավճարներ", "asset"],
  ["10", "Դեբիտորական պարտքեր բյուջեներին", "asset"],
  ["11", "Դեբիտորական պարտքեր սոցիալական վճարների մասով", "asset"],
  ["12", "Դեբիտորական պարտքեր աշխատավարձի մասով", "asset"],
  ["13", "Դեբիտորական պարտքեր շահաբաժինների մասով", "asset"],
  ["14", "Այլ դեբիտորական պարտքեր", "asset"],
  ["15", "Առհաշիվ անձանցից ստացման ենթակա գումարներ", "asset"],
  ["16", "Դրամական միջոցներ", "asset"],
  ["17", "Արժեթղթեր", "asset"],
  ["18", "Այլ ակտիվներ", "asset"],
  ["19", "Ընդամենը ակտիվներ՝ 1–18-րդ կետերի հանրագումար", "total"],
  ["20", "Ստացված վարկեր և փոխառություններ", "liability"],
  ["21", "Ստացված կանխավճարներ", "liability"],
  ["22", "Կրեդիտորական պարտքեր բյուջեներին", "liability"],
  ["23", "Կրեդիտորական պարտքեր սոցիալական վճարների մասով", "liability"],
  ["24", "Կրեդիտորական պարտքեր աշխատավարձի մասով", "liability"],
  ["25", "Կրեդիտորական պարտքեր շահաբաժինների մասով", "liability"],
  ["26", "Կրեդիտորական պարտքեր գնումների մասով", "liability"],
  ["27", "Այլ կրեդիտորական պարտքեր", "liability"],
  ["28", "Առհաշիվ անձանց տրման ենթակա գումարներ", "liability"],
  ["29", "Այլ պարտավորություններ", "liability"],
  ["30", "Ընդամենը պարտավորություններ՝ 20–29-րդ կետերի հանրագումար", "total"],
  ["31", "Կանոնադրական կապիտալ", "equity"],
  ["32", "Չբաշխված շահույթ", "equity"],
  ["33", "Սեփական կապիտալի այլ տարրեր", "equity"],
  ["34", "Ընդամենը սեփական կապիտալ՝ 31–33-րդ կետերի հանրագումար", "total"],
];

export default function ProfitTaxYearReportPage() {
  const section8TopScrollRef = useRef<HTMLDivElement | null>(null);
  const section8TableScrollRef = useRef<HTMLDivElement | null>(null);
  const section8ScrollSyncRef = useRef(false);

  const syncSection8Scroll = (source: "top" | "table") => {
    if (section8ScrollSyncRef.current) {
      return;
    }

    const sourceElement =
      source === "top" ? section8TopScrollRef.current : section8TableScrollRef.current;
    const targetElement =
      source === "top" ? section8TableScrollRef.current : section8TopScrollRef.current;

    if (!sourceElement || !targetElement) {
      return;
    }

    section8ScrollSyncRef.current = true;
    targetElement.scrollLeft = sourceElement.scrollLeft;

    window.requestAnimationFrame(() => {
      section8ScrollSyncRef.current = false;
    });
  };


  const router = useRouter();
  const params = useParams<{ year: string }>();
  const year = params.year;
  const [activeTabTitle, setActiveTabTitle] = useState(profitTaxTabs[0].title);

  const activeTab = profitTaxTabs.find((tab) => tab.title === activeTabTitle) ?? profitTaxTabs[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: 24,
        color: "#0f172a",
      }}
    >
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "grid",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: "#64748b",
                fontSize: 13,
                fontWeight: 800,
                marginBottom: 6,
              }}
            >
              Հարկային հաշվետվություններ / Շահութահարկ
            </div>
            <h1 style={{ margin: 0, fontSize: 28 }}>Շահութահարկի հաշվարկ — {year}</h1>
            <p style={{ margin: "8px 0 0", color: "#475569", lineHeight: 1.6 }}>
              Demo skeleton է․ այս փուլում կառուցում ենք շահութահարկի պաշտոնական ձևի բաժինները։
              Իրական հաշվարկներ, ՊԵԿ ուղարկում կամ տվյալների պահպանում դեռ չենք կատարում։
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/accounting/tax-reports-v2/profit-tax")}
            style={{
              border: "1px solid #93c5fd",
              borderRadius: 12,
              background: "#eff6ff",
              color: "#1d4ed8",
              padding: "10px 14px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Փոխել տարին
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 4,
            overflowX: "auto",
            padding: "10px 10px 0",
            border: "1px solid #bfdbfe",
            borderBottom: "3px solid #2563eb",
            borderRadius: "14px 14px 0 0",
            background: "#e0f2fe",
          }}
        >
          {profitTaxTabs.map((tab) => {
            const isSelected = tab.title === activeTab.title;

            return (
              <button
                key={tab.title}
                type="button"
                onClick={() => setActiveTabTitle(tab.title)}
                style={{
                  minWidth: 180,
                  maxWidth: 240,
                  padding: "10px 12px",
                  border: "1px solid #93c5fd",
                  borderBottom: isSelected ? "3px solid #2563eb" : "1px solid #93c5fd",
                  borderRadius: "12px 12px 0 0",
                  background: isSelected ? "#bfdbfe" : "#f8fbff",
                  color: isSelected ? "#0f172a" : "#1e3a8a",
                  fontSize: 12,
                  fontWeight: 900,
                  lineHeight: 1.25,
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 -1px 0 #2563eb inset" : "none",
                  whiteSpace: "normal",
                }}
              >
                {tab.title}
              </button>
            );
          })}
        </div>

        <div
          style={{
            padding: "18px 20px",
            border: "1px solid #bfdbfe",
            borderTop: "none",
            borderRadius: "0 0 14px 14px",
            background: "#ffffff",
            color: "#0f172a",
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 10px",
                borderRadius: 999,
                background: "#eff6ff",
                color: "#1d4ed8",
                fontSize: 12,
                fontWeight: 900,
                marginBottom: 10,
              }}
            >
              {activeTab.section} · {activeTab.rows}
            </div>

            <h2 style={{ margin: 0, fontSize: 20 }}>{activeTab.title}</h2>
            <p style={{ margin: "8px 0 0", color: "#475569", lineHeight: 1.6 }}>
              {activeTab.description}
            </p>
          </div>

          {activeTab.title === "1. Համախառն եկամուտներ" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <strong>Բաժին 1․ Համախառն եկամուտը</strong>
                <span style={{ color: "#64748b", fontSize: 13, fontWeight: 800 }}>
                  դրամ · demo ձև
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    minWidth: 980,
                    borderCollapse: "collapse",
                    border: "1px solid #cbd5e1",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ padding: "10px 12px", border: "1px solid #cbd5e1", background: "#e2e8f0", textAlign: "left", width: 90 }}>
                        Տող
                      </th>
                      <th style={{ padding: "10px 12px", border: "1px solid #cbd5e1", background: "#e2e8f0", textAlign: "left" }}>
                        Ցուցանիշի անվանումը
                      </th>
                      <th style={{ padding: "10px 12px", border: "1px solid #cbd5e1", background: "#e2e8f0", textAlign: "right", width: 190 }}>
                        Գումար
                      </th>
                      <th style={{ padding: "10px 12px", border: "1px solid #cbd5e1", background: "#e2e8f0", textAlign: "left", width: 170 }}>
                        Աղբյուր
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {grossIncomeRows.map(([code, name, kind]) => {
                      const isTotal = kind === "calculated";

                      return (
                        <tr key={code}>
                          <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", fontWeight: 900, color: "#1d4ed8" }}>
                            {code}
                          </td>
                          <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", fontWeight: isTotal ? 900 : 600 }}>
                            {name}
                          </td>
                          <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", textAlign: "right", background: isTotal ? "#eff6ff" : "#ffffff", fontWeight: isTotal ? 900 : 600 }}>
                            {isTotal ? "ավտո հաշվարկ" : ""}
                          </td>
                          <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", color: "#64748b" }}>
                            {isTotal ? "6–40 տողերի գումար" : "հետագայում՝ ԳԳ/ձեռքով"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab.title === "2. Ծախսեր և նվազեցումներ" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <strong>Բաժին 1․ Ծախսեր, կորուստներ և այլ նվազեցումներ</strong>
                <span style={{ color: "#64748b", fontSize: 13, fontWeight: 800 }}>
                  դրամ · demo ձև
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    minWidth: 980,
                    borderCollapse: "collapse",
                    border: "1px solid #cbd5e1",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ padding: "10px 12px", border: "1px solid #cbd5e1", background: "#e2e8f0", textAlign: "left", width: 90 }}>
                        Տող
                      </th>
                      <th style={{ padding: "10px 12px", border: "1px solid #cbd5e1", background: "#e2e8f0", textAlign: "left" }}>
                        Ցուցանիշի անվանումը
                      </th>
                      <th style={{ padding: "10px 12px", border: "1px solid #cbd5e1", background: "#e2e8f0", textAlign: "right", width: 190 }}>
                        Գումար
                      </th>
                      <th style={{ padding: "10px 12px", border: "1px solid #cbd5e1", background: "#e2e8f0", textAlign: "left", width: 170 }}>
                        Աղբյուր
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseDeductionRows.map(([code, name, kind]) => {
                      const isTotal = kind === "calculated";

                      return (
                        <tr key={code}>
                          <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", fontWeight: 900, color: "#1d4ed8" }}>
                            {code}
                          </td>
                          <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", fontWeight: isTotal ? 900 : 600 }}>
                            {name}
                          </td>
                          <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", textAlign: "right", background: isTotal ? "#eff6ff" : "#ffffff", fontWeight: isTotal ? 900 : 600 }}>
                            {isTotal ? "ավտո հաշվարկ" : ""}
                          </td>
                          <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", color: "#64748b" }}>
                            {isTotal ? "ամփոփող հաշվարկ" : "հետագայում՝ ԳԳ/ձեռքով"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab.title === "3. Հարկվող շահույթ և շահութահարկ" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <strong>Բաժին 1․ Հարկվող շահույթ և շահութահարկի հաշվարկ</strong>
                <span style={{ color: "#64748b", fontSize: 13, fontWeight: 800 }}>
                  դրամ · demo ձև
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    minWidth: 980,
                    borderCollapse: "collapse",
                    border: "1px solid #cbd5e1",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ padding: "10px 12px", border: "1px solid #cbd5e1", background: "#e2e8f0", textAlign: "left", width: 90 }}>
                        Տող
                      </th>
                      <th style={{ padding: "10px 12px", border: "1px solid #cbd5e1", background: "#e2e8f0", textAlign: "left" }}>
                        Ցուցանիշի անվանումը
                      </th>
                      <th style={{ padding: "10px 12px", border: "1px solid #cbd5e1", background: "#e2e8f0", textAlign: "right", width: 190 }}>
                        Գումար
                      </th>
                      <th style={{ padding: "10px 12px", border: "1px solid #cbd5e1", background: "#e2e8f0", textAlign: "left", width: 210 }}>
                        Աղբյուր / բանաձև
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxableProfitRows.map(([code, name, kind]) => {
                      const isTotal = kind === "calculated";

                      return (
                        <tr key={code}>
                          <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", fontWeight: 900, color: "#1d4ed8" }}>
                            {code}
                          </td>
                          <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", fontWeight: isTotal ? 900 : 600 }}>
                            {name}
                          </td>
                          <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", textAlign: "right", background: isTotal ? "#eff6ff" : "#ffffff", fontWeight: isTotal ? 900 : 600 }}>
                            {isTotal ? "ավտո հաշվարկ" : ""}
                          </td>
                          <td style={{ padding: "9px 12px", border: "1px solid #cbd5e1", color: "#64748b" }}>
                            {isTotal ? "հաշվարկային տող" : "ձեռքով / հատուկ աղբյուր"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab.title === "10. Բաժին 8․ Հաշվեկշռային արժեքներ և հարկային բազա" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>Բաժին 8․ Ակտիվների և պարտավորությունների հաշվապահական արժեքներ և հարկային բազաներ</strong>
                  <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
                    Սա շահութահարկի ամենակարևոր լայն աղյուսակներից է․ հետագայում պետք է կապվի հաշվեկշռի, պաշարների, ՀՄ-ի, պարտքերի և կապիտալի տվյալների հետ։
                  </div>
                </div>
                <span style={{ color: "#64748b", fontSize: 13, fontWeight: 800 }}>
                  դրամ · wide table
                </span>
              </div>

              <div
                ref={section8TopScrollRef}
                onScroll={() => syncSection8Scroll("top")}
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  border: "1px solid #cbd5e1",
                  borderRadius: 10,
                  background: "#f8fafc",
                  height: 18,
                }}
                aria-label="Բաժին 8 աղյուսակի վերևի հորիզոնական scroll"
              >
                <div style={{ width: 1680, height: 1 }} />
              </div>

              <div
                ref={section8TableScrollRef}
                onScroll={() => syncSection8Scroll("table")}
                style={{ overflowX: "auto", border: "1px solid #cbd5e1", borderRadius: 12 }}
              >
                <table
                  style={{
                    width: "100%",
                    minWidth: 1680,
                    borderCollapse: "collapse",
                    fontSize: 12,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        rowSpan={2}
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 5,
                          padding: "10px 8px",
                          border: "1px solid #cbd5e1",
                          background: "#e2e8f0",
                          width: 60,
                          minWidth: 60,
                        }}
                      >
                        N
                      </th>
                      <th
                        rowSpan={2}
                        style={{
                          position: "sticky",
                          left: 60,
                          zIndex: 5,
                          padding: "10px 10px",
                          border: "1px solid #cbd5e1",
                          background: "#e2e8f0",
                          textAlign: "left",
                          width: 280,
                          minWidth: 280,
                        }}
                      >
                        Ակտիվ / պարտավորություն
                      </th>
                      <th colSpan={4} style={{ padding: "10px 10px", border: "1px solid #cbd5e1", background: "#dbeafe", textAlign: "center" }}>
                        Հաշվապահական հաշվեկշռային արժեք
                      </th>
                      <th colSpan={4} style={{ padding: "10px 10px", border: "1px solid #cbd5e1", background: "#dcfce7", textAlign: "center" }}>
                        Հարկային բազա
                      </th>
                      <th rowSpan={2} style={{ padding: "10px 10px", border: "1px solid #cbd5e1", background: "#e2e8f0", minWidth: 160 }}>
                        Աղբյուր
                      </th>
                    </tr>
                    <tr>
                      {[
                        "Մնացորդ 01.01",
                        "Մուտք / ավելացում",
                        "Ելք / պակասեցում",
                        "Մնացորդ 31.12",
                        "Մնացորդ 01.01",
                        "Մուտք / ավելացում",
                        "Ելք / պակասեցում",
                        "Մնացորդ 31.12",
                      ].map((header) => (
                        <th
                          key={header}
                          style={{
                            padding: "9px 8px",
                            border: "1px solid #cbd5e1",
                            background: "#f8fafc",
                            textAlign: "right",
                            minWidth: 135,
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section8TaxBaseRows.map(([code, name, kind]) => {
                      const isTotal = kind === "total";
                      const source =
                        kind === "asset"
                          ? "հաշվեկշիռ / ակտիվներ"
                          : kind === "liability"
                            ? "հաշվեկշիռ / պարտավորություններ"
                            : kind === "equity"
                              ? "հաշվեկշիռ / կապիտալ"
                              : "ավտո ամփոփում";

                      return (
                        <tr key={code}>
                          <td
                            style={{
                              position: "sticky",
                              left: 0,
                              zIndex: 3,
                              padding: "8px 8px",
                              border: "1px solid #cbd5e1",
                              fontWeight: 900,
                              color: "#1d4ed8",
                              background: isTotal ? "#eff6ff" : "#ffffff",
                              width: 60,
                              minWidth: 60,
                            }}
                          >
                            {code}
                          </td>
                          <td
                            style={{
                              position: "sticky",
                              left: 60,
                              zIndex: 3,
                              padding: "8px 10px",
                              border: "1px solid #cbd5e1",
                              fontWeight: isTotal ? 900 : 600,
                              background: isTotal ? "#eff6ff" : "#ffffff",
                              width: 280,
                              minWidth: 280,
                            }}
                          >
                            {name}
                          </td>
                          {Array.from({ length: 8 }).map((_, index) => (
                            <td
                              key={`${code}-${index}`}
                              style={{
                                padding: "8px 8px",
                                border: "1px solid #cbd5e1",
                                textAlign: "right",
                                background: isTotal ? "#eff6ff" : "#ffffff",
                                color: "#94a3b8",
                                fontWeight: isTotal ? 900 : 500,
                              }}
                            >
                              {isTotal ? "ավտո" : ""}
                            </td>
                          ))}
                          <td style={{ padding: "8px 10px", border: "1px solid #cbd5e1", color: "#64748b", background: isTotal ? "#eff6ff" : "#ffffff" }}>
                            {source}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div
              style={{
                border: "1px dashed #93c5fd",
                borderRadius: 14,
                background: "#f8fbff",
                padding: 16,
                color: "#475569",
                lineHeight: 1.6,
              }}
            >
              Այստեղ հաջորդ SAFE քայլերով կավելացնենք այս tab-ի իրական տողերը, աղյուսակները,
              հաշվարկային կապերը և ստուգման կանոնները։
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
