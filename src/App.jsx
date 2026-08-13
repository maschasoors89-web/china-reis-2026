import { useState, useEffect, useCallback, useRef } from "react";

const C = {
  ink:"#1A1A2E", paper:"#F7F4EF", mist:"#E8E4DC", ghost:"#C8C3B8", dim:"#8A8278",
  shanghai:"#4B52B0", yangshuo:"#2D8B5A", chengdu:"#B85C1A", beijing:"#9B2335",
  beidaihe:"#1A7A8A", home:"#555555", white:"#FFFFFF",
  sun:"#F59E0B", rain:"#3B82F6", tess:"#EC4899",
};

const REGIONS = {
  shanghai:{ label:"Shanghai", color:C.shanghai, emoji:"🏙️" },
  yangshuo:{ label:"Yangshuo", color:C.yangshuo, emoji:"🏔️" },
  chengdu: { label:"Chengdu",  color:C.chengdu,  emoji:"🐼" },
  beijing: { label:"Peking",   color:C.beijing,  emoji:"🏯" },
  beidaihe:{ label:"Beidaihe", color:C.beidaihe, emoji:"🏖️" },
  travel:  { label:"Reisdag",  color:C.home,     emoji:"✈️" },
};

// Seizoensgemiddelden augustus/september
const CLIMATE = {
  shanghai:{ temp:"30–34°C", feels:"gevoelstemperatuur tot 40°C", regen:"matig", uv:"Hoog", tip:"Hete, vochtige zomer. Ochtend vroeg naar buiten, middaguren binnen." },
  yangshuo:{ temp:"28–33°C", feels:"gevoelstemperatuur tot 38°C", regen:"kans op buien", uv:"Hoog", tip:"Subtropisch. Buien kunnen snel optrekken – fietsroutes 's ochtends doen." },
  chengdu: { temp:"27–32°C", feels:"bewolkt & vochtig", regen:"regelmatig bewolkt", uv:"Matig", tip:"Chengdu is vaak bewolkt. Geen harde zon maar wel plakkerig warm." },
  beijing: { temp:"26–32°C", feels:"droog & warm", regen:"laag", uv:"Hoog", tip:"Droogste periode van het jaar. Ideaal voor de Grote Muur. Wel zonnebrand!" },
  beidaihe:{ temp:"24–29°C", feels:"strandweer", regen:"laag", uv:"Matig-hoog", tip:"Aangenaam strandsklimaat, frisser dan de andere steden." },
};

const ACTIVITIES = {
  shanghai:[
    { id:"sh1", titel:"The Bund + Huangpu River Ferry 🛳", notitie:"Wandel langs de skyline, pak daarna de lokale pont (黄浦江渡轮) naar Pudong voor het iconische uitzicht op de skyline. Authentiek, een paar yuan.", weather:"sun", tess:true, metro:"🚇 Lijn 10 (Jiaotong Univ.) → East Nanjing Road (南京东路), ~30 min", zone:"bund" },
    { id:"sh2", titel:"Baja Bikes fietstour", notitie:"Geleide tour langs Shanghai's highlights. bajabikes.eu – vooraf boeken.", weather:"sun", tess:false, metro:"🚇 Lijn 10/12/13 → South Shaanxi Road (陕西南路), 5 min lopen naar Okura Garden Hotel (vertrekpunt)", zone:"bund" },
    { id:"sh3", titel:"Shanghai Ocean Aquarium", notitie:"Pinguïns, ijsberen, haaien. Airconditioned, vlak bij de Bund in Pudong.", weather:"indoor", tess:true, metro:"🚇 Lijn 2 → Lujiazui (陆家嘴)", zone:"pudong" },
    { id:"sh4", titel:"Peppa Pig World of Play", notitie:"Indoor pretpark voor peuters. Tess gaat uit haar dak!", weather:"indoor", tess:true, metro:"🚇 Lijn 2/3/4 → Zhongshan Park (中山公园), in Raffles City Changning", zone:"pudong" },
    { id:"sh5", titel:"Century Park", notitie:"Shanghai's grootste park met roeiboten, groene ruimte en ruimte voor Tess.", weather:"sun", tess:true, metro:"🚇 Lijn 2 → Century Park (世纪公园)", zone:"pudong" },
    { id:"sh6", titel:"Zhujiajiao waterstad", notitie:"Historisch canal-stadje op ~1 uur. Gondels, bruggetjes, oude winkeltjes.", weather:"any", tess:false, metro:"🚇 Lijn 17 → Zhujiajiao (朱家角)", zone:"buiten" },
    { id:"sh7", titel:"Columbia Circle + Xingfuli wandelroute", notitie:"~3,2 km autovrij onder platanenlaan. Tsutaya Books, robot-ordering. Direct vanuit jullie hotel op Panyu Road!", weather:"any", tess:false, metro:"🚶 Te voet vanuit hotel – Xingfuli ligt schuin tegenover op Panyu Road 381", zone:"hotel" },
    { id:"sh8", titel:"Futuristisch restaurant (drone/robot)", notitie:"Drone-bezorging of robot-bediening. Reserveren!", weather:"indoor", tess:true, metro:"🚇 Afhankelijk van restaurant – meestal in Pudong of Jing'An", zone:"centrum" },
    { id:"sh9", titel:"Yu Garden + bazaar (豫园)", notitie:"Klassieke Ming-dynasty tuin. Omringd door bazaarsteegjes – ideaal voor streetfood en souvenirs. Op ~2 km van hotel.", weather:"any", tess:true, metro:"🚇 Lijn 10 → Yu Garden (豫园)", zone:"bund" },
    { id:"sh10", titel:"French Concession + Tianzifang", notitie:"Historische Franse wijk met smalle steegjes, koffietentjes en galerijtjes. Een van de meest karakteristieke buurten van Shanghai.", weather:"any", tess:false, metro:"🚇 Lijn 1 → Shaanxi South Road (陕西南路)", zone:"french" },
    { id:"sh11", titel:"People's Park + Shanghai Museum", notitie:"Groen park met Shanghai Museum (gratis, 120.000 artefacten). Vanuit hotel: lijn 10 richting centrum.", weather:"sun", tess:true, metro:"🚇 Lijn 10 → People's Square (人民广场), 4 stops", zone:"centrum" },
    { id:"sh12", titel:"Lujiazui skyline – wolkenkrabbers", notitie:"Jin Mao Tower, SWFC en Shanghai Tower van dichtbij. Observation deck Shanghai Tower (632m!) optioneel.", weather:"any", tess:false, metro:"🚇 Lijn 2 → Lujiazui (陆家嘴)", zone:"pudong" },
    { id:"sh14", titel:"Jialing Street Food Market", notitie:"Drukke streetfood markt met lokale hapjes, snacks en sfeer. Leuk bij mooi weer.", weather:"sun", tess:true, metro:"🚇 Lijn 15 → Huadong Ligong Daxue (华东理工大学) Exit 2, ~10 min lopen. Ochtendmarkt: ga vóór 11u!", zone:"hotel" },
    { id:"sh18", titel:"1000 Trees (千树) 🌳", notitie:"Spectaculair winkel- en kunstcomplex aan de Suzhou Creek. Het gebouw is letterlijk bedekt met bomen en planten op meerdere terrassen. Uniek voor een foto en voor een wandeling.", weather:"any", tess:true, metro:"🚇 Lijn 13 → Jiangning Road (江宁路) Exit 1, ~10 min lopen. Of lijn 7 → Changping Road (昌平路). Didi ±20 min vanaf hotel.", zone:"bund" },
    { id:"sh19", titel:"VBot robots – Raffles City Changning 🤖", notitie:"De VBot Experience Store zit op Level 1 van Raffles City Changning. Interactie met AI-robot 'Da Tou': loopt, reageert op stemcommando's (ook Engels), doet trucjes. Dichtstbij voor robotervaring!", weather:"indoor", tess:true, metro:"🚇 Lijn 2/3/4 → Zhongshan Park (中山公园) Exit 3. Rechtstreeks verbonden met het winkelcentrum (1139 Changning Road).", zone:"hotel" },
    { id:"sh15", titel:"PRISMA Mall Pudong – dinosaurussen 🦖", notitie:"Gloednieuw megamall (420.000m²) met gratis dino-tentoonstelling op verdiepingen 4-6. Open t/m 31 aug 2026! Volledig airconditioned.", weather:"indoor", tess:true, metro:"🚇 Didi/taxi vanaf hotel ±20 min. Of lijn 6 → Lancun Road (蓝村路) dan taxi ~10 min.", zone:"pudong" },
    { id:"sh16", titel:"Xujiahui shopping district", notitie:"Groot indoor winkelgebied met meerdere malls aan elkaar. Ideaal bij regen. Exit 3 bij Zikawei Library voor oriëntatie.", weather:"indoor", tess:false, metro:"🚇 Lijn 1/9/11 → Xujiahui (徐家汇)", zone:"french" },
    { id:"sh17", titel:"Neobio Family Center 🎪", notitie:"Indoor familiepark: speelstad, klimmuren, trampoline, boekenwinkels, restaurant. Meerdere locaties. Bij Yu Garden te combineren met bezoek aan de tuin.", weather:"indoor", tess:true, metro:"🚇 Lijn 10 → Yu Garden (豫园) voor de Yu Garden-vestiging. Of Ruihong Tiandi vestiging: lijn 4/12 → Linping Road", zone:"bund" },
  ],
  yangshuo:[
    { id:"ys1", titel:"E-bike rijstvelden route + One Chi Café", notitie:"Xiyue Haven → Gongnong Bridge → Greenway. 100% autovrij, kinderzitje.", weather:"sun", tess:true, metro:"🚲 Direct vanuit Xiyue Haven – geen vervoer nodig", zone:"rivier" },
    { id:"ys2", titel:"Bamboe vlot varen – Yulong River", notitie:"Rustig afdrijven. Zwemvest aanwezig.", weather:"sun", tess:true, metro:"🛺 Tuk-tuk of taxi vanuit Yangshuo centrum (~10 min)", zone:"rivier" },
    { id:"ys3", titel:"Ruyi Peak kabelbaan", notitie:"Spectaculair uitzicht over karstbergen.", weather:"sun", tess:false, metro:"🚌 Bus of taxi vanuit Yangshuo centrum (~20 min)", zone:"berg" },
    { id:"ys4", titel:"Ten-Mile Gallery – e-scooter met kinderzitje", notitie:"Langs Yulong rivier met karstbergen. Huren in Yangshuo.", weather:"sun", tess:true, metro:"🛵 E-scooter huren in Yangshuo West Street", zone:"rivier" },
    { id:"ys5", titel:"Yangshuo centrum verkennen", notitie:"West Street, winkeltjes, streetfood.", weather:"any", tess:true, metro:"🚶 Te voet vanuit centrum", zone:"centrum" },
  ],
  chengdu:[
    { id:"cd1", titel:"Giant Panda Base 🐼", notitie:"Vroeg gaan (08:00)! Panda's actiefst in de ochtend. Rode panda's ook.", weather:"any", tess:true, metro:"🚇 Lijn 3 → Panda Avenue (熊猫大道), dan bus 198", zone:"noord" },
    { id:"cd2", titel:"Renmin Park", notitie:"Bootjes, speeltuin, theehuizen. Ontspannen voor Tess.", weather:"sun", tess:true, metro:"🚇 Lijn 4 → Renmin Park (人民公园)", zone:"west" },
    { id:"cd3", titel:"Kuanzhai Alley", notitie:"Historische 'brede en smalle steeg', streetfood.", weather:"any", tess:false, metro:"🚇 Lijn 4 → Kuanzhai Alley (宽窄巷子)", zone:"west" },
    { id:"cd4", titel:"Taikoo Li + Chunxi Road + 3D panda 🐼", notitie:"Trendy winkelwijk. Bij IFS mall: 3D panda klimt uit de gevel – voorkant zichtbaar op verdieping 7, achterkant vanuit de straat. 's Avonds mooi met de Daci Temple lichtshow.", weather:"any", tess:true, metro:"🚇 Lijn 2/3 → Chunxi Road (春熙路)", zone:"centrum" },
    { id:"cd9", titel:"Jinli Old Street (锦里) 🏮", notitie:"Historische steeg met streetfood, lantaarns en ambachten naast het Wuhou Temple. 's Avonds het mooiste als de lantaarns branden. Dan dan mian en wontons ook hier verkrijgbaar.", weather:"any", tess:true, metro:"🚇 Lijn 3 → Gaoshengqiao (高升桥), dan 600m lopen richting noordwest", zone:"zuid" },
    { id:"cd5", titel:"Eastern Suburb Memory", notitie:"Creatieve wijk in oude fabriekshal. Art, muziek, streetfood.", weather:"any", tess:false, metro:"🚇 Lijn 4 → Er Xian Qiao (二仙桥)", zone:"oost" },
    { id:"cd6", titel:"Hotpot avond 🌶️", notitie:"Half-half pot bestellen voor Tess. Bù là = niet pittig!", weather:"indoor", tess:false, metro:"🚇 Diverse locaties – Chunxi Road area heeft veel opties", zone:"centrum" },
    { id:"cd7", titel:"Tower of Vitality (生机之塔) 💧", notitie:"Zes bamboe-pilaren van 26-39m hoog met watercascades. 's Avonds spectaculaire kleurveranderende lichtshow. Bij SKP Mall, Financial City.", weather:"any", tess:true, metro:"🚇 Lijn 1 → Jincheng Road (锦城大道)", zone:"zuid" },

  ],
  beijing:[
    { id:"bj1", titel:"Grote Muur – Mutianyu", notitie:"Kabelbaan omhoog, rodelbaan omlaag! Geen tas meenemen.", weather:"sun", tess:true, metro:"🚇 Geen metro – georganiseerde bus (H23) of tour vanuit Dongzhimen", zone:"buiten" },
    { id:"bj2", titel:"Verboden Stad + Tiananmen", notitie:"⚠️ GEEN TAS = kortere rij! Tickets online. Stampboekje kopen!", weather:"sun", tess:false, metro:"🚇 Lijn 1 → Tiananmen East (天安门东)", zone:"centrum" },
    { id:"bj3", titel:"Gài Zhāng stempels 📮", notitie:"Inktstempels verzamelen. Gratis bij Tiananmen. Tess vindt dit geweldig!", weather:"any", tess:true, metro:"🚇 Lijn 1 → Tiananmen East (天安门东)", zone:"centrum" },
    { id:"bj4", titel:"Chaoyang Park", notitie:"Eendjes voeren, bootje varen, speeltuinen. Perfect voor Tess!", weather:"sun", tess:true, metro:"🚇 Lijn 10 → Nongzhangguan (农展馆), of lijn 6 → Hujialou", zone:"oost" },
    { id:"bj5", titel:"Sanlitun wijk", notitie:"Trendy winkelen, internationale sfeer, goede lunch-opties.", weather:"any", tess:false, metro:"🚇 Lijn 10 → Tuanjiehu (团结湖)", zone:"oost" },
    { id:"bj6", titel:"Wangfujing snackstraat", notitie:"Schorpioen-spiesen, zeesterren. Dapper zijn!", weather:"any", tess:false, metro:"🚇 Lijn 1 → Wangfujing (王府井)", zone:"centrum" },
    { id:"bj7", titel:"Shichahai hutong & meren", notitie:"Historische steegjes rondom drie meren. Fietsen, rustig.", weather:"any", tess:false, metro:"🚇 Lijn 6 → Beihai North (北海北)", zone:"centrum" },
    { id:"bj8", titel:"Peking eend bij Siji Minfu 🦆", notitie:"Beste prijs-kwaliteit. Qianmen of Forbidden City vestiging. Reserveren!", weather:"indoor", tess:false, metro:"🚇 Lijn 2 → Qianmen (前门)", zone:"centrum" },
  ],
  beidaihe:[
    { id:"bd1", titel:"Strand zwemmen", notitie:"Gele Zee strand. Rustig en zandstrand.", weather:"sun", tess:true, metro:"🚶 Te voet vanuit Summer Solstice hotel", zone:"strand" },
    { id:"bd2", titel:"Pigeon Nest Park", notitie:"Kustpark met rotsen. Rustige wandeling.", weather:"any", tess:true, metro:"🚌 Bus of taxi vanuit hotel (~10 min)", zone:"strand" },
    { id:"bd3", titel:"Liuzhuang Night Market", notitie:"Avondmarkt vlak bij hotel. Streetfood, souvenirs.", weather:"any", tess:true, metro:"🚶 Te voet – vlak bij Summer Solstice hotel", zone:"strand" },
  ],
};

const DISHES = [
  { id:"ds1", nl:"Peking eend", zh:"北京烤鸭", pinyin:"Běijīng kǎoyā", klank:"bay-jing kow-ya", stad:"Peking", desc:"Knapperig geroosterde eend, aan tafel gesneden. Geserveerd met flinterdunne pannenkoekjes, bosuitjes, komkommer en hoisin-saus. Symbool van de Pekingse keuken.", warn:false },
  { id:"ds2", nl:"Xiaolongbao", zh:"小笼包", pinyin:"Xiǎolóngbāo", klank:"syow-loong-bow", stad:"Shanghai", desc:"Soep-dumplings gevuld met heet bouillon en varkensvlees. Let op: eerst een gaatje bijten, dan de soep opdrinken voor je de rest opeet.", warn:true, warnTekst:"⚠️ Heet! Eerst gaatje bijten" },
  { id:"ds3", nl:"Shaobing", zh:"烧饼", pinyin:"Shāobǐng", klank:"shaow-bing", stad:"Overal", desc:"Knapperig sesambroodje gevuld met vlees, ei of groente. Straatvoedsel-klassieker – denk aan een stevige sandwich met een krokante korst.", warn:false },
  { id:"ds4", nl:"Congee (rijstpap)", zh:"粥", pinyin:"Zhōu", klank:"joe", stad:"Overal", desc:"Dikke rijstepap, vaak als ontbijt. Neutraal van smaak, met toppings zoals ingelegde groente, ei of gedroogd vlees. Comfort food.", warn:false },
  { id:"ds5", nl:"Youtiao", zh:"油条", pinyin:"Yóutiáo", klank:"yoh-tyow", stad:"Overal", desc:"Lang gefrituurd deegstengel – luchtig en krokant. Traditioneel gegeten bij congee. Waarschijnlijk Tess-favoriet!", warn:false },
  { id:"ds6", nl:"Jianbing (straatpannenkoek)", zh:"煎饼", pinyin:"Jiānbǐng", klank:"jyen-bing", stad:"Overal", desc:"Dunne savory pannenkoek gebakken op een hete plaat, met ei, bosui, hoisin en krokant deeg. Hét Chinese straatontbijt.", warn:false },
  { id:"ds7", nl:"Fan Tuan", zh:"饭团", pinyin:"Fàntuán", klank:"fan-twahn", stad:"Shanghai", desc:"Rijstbal gevuld met youtiao en ingelegde groente. Compact en voedzaam – Chinese versie van een onigiri.", warn:false },
  { id:"ds8", nl:"Mapo Tofu", zh:"麻婆豆腐", pinyin:"Mápó dòufu", klank:"ma-paw doe-foo", stad:"Chengdu", desc:"Zachte tofu in een vurige saus van Sichuan peperbollen en chili. Karakteristiek verdovend gevoel. Soms met varkensvlees.", warn:true, warnTekst:"🌶️ Pittig · vraag naar varkensvlees-vrij" },
  { id:"ds9", nl:"Hotpot", zh:"火锅", pinyin:"Huǒguō", klank:"hwoh-gwoh", stad:"Chengdu", desc:"Kokende bouillon op tafel, eigen ingrediënten indopen. Chengdu-stijl pikant met Sichuan peper. Half-half pot bestellen voor Tess!", warn:true, warnTekst:"🌶️ Half-half pot voor Tess!" },
  { id:"ds10", nl:"Hui Guo Rou Mian", zh:"回锅肉面", pinyin:"Huíguōròu miàn", klank:"hway-gwoh-roh myen", stad:"Chengdu", desc:"Noedels met tweemaal gebakken varkensvlees in pittige paprikasaus. Aanbevolen: Shangchi Mianguan, Shangchi Zhengjie 39.", warn:false },
  { id:"ds11", nl:"Chongqing Liangfen", zh:"重庆凉粉", pinyin:"Chóngqìng liángfěn", klank:"choong-ching lyang-fun", stad:"Chengdu", desc:"Koude rijstgelei-noedels in chili-olie, azijn en knoflook. Fris-pittig, heerlijk in de hitte.", warn:true, warnTekst:"🌶️ Pittig" },
  { id:"ds12", nl:"Huang Liangfen", zh:"黄凉粉", pinyin:"Huáng liángfěn", klank:"hwang lyang-fun", stad:"Chengdu", desc:"Gele bonenmeel-gelei koud geserveerd met pittige saus. Karakteristieke gele kleur. Lichte zomerhap.", warn:false },

  { id:"ds14", nl:"Re Gan Mian", zh:"热干面", pinyin:"Règān miàn", klank:"ruh-gan myen", stad:"Overal", desc:"Hete droge noedels met sesamdeeg, sojasaus en azijn. Droog en hartig, sterk eigen smaak. Populair straatontbijt.", warn:false },
  { id:"ds15", nl:"San Yang Mian", zh:"三样面", pinyin:"Sān yàng miàn", klank:"san yang myen", stad:"Chengdu", desc:"Noedels in drie varianten bij Lao Chengdu San Yang Mian. De 'oude' variant – geblancheerde noedels met pittige vleessaus en sperziebonen – is de favoriet. Michelin Bib Gourmand aanbevolen.", warn:true, warnTekst:"🌶️ Pittig" },
  { id:"ds16", nl:"Wonton met chili", zh:"抄手", pinyin:"Chāoshǒu", klank:"chow-show", stad:"Chengdu", desc:"Zachte wontons in bouillon, geserveerd met gehakte chili aan de zijkant. Typisch Chengdu-stijl. Bestel dit als bijgerecht bij de San Yang Mian.", warn:true, warnTekst:"🌶️ Pittig" },
];

const DAYS_TEMPLATE = [
  { id:"d01", date:"22 aug", dag:"za", regio:"travel", label:"Vertrek 🛫",
    ochtend:{ titel:"Trein Den Bosch → Schiphol", notitie:"Trein vertrekt 12:00 vanuit Den Bosch. Ruim op tijd voor inchecken!" },
    middag:{ titel:"KLM895 vertrekt 15:20 ✈️", notitie:"Schiphol → Shanghai Pudong. Aankomst 09:25 lokale tijd (23 aug)" },
    avond:null },
  { id:"d02", date:"23 aug", dag:"zo", regio:"shanghai", label:"Aankomst Shanghai",
    ochtend:{ titel:"Aankomst Pudong 09:25 · inchecken", notitie:"Crowne Plaza Shanghai Changning, Panyu Road 400. Rustig aan na de vlucht!" },
    middag:{ titel:"Buurtverkenning: Xingfuli + Xinhua Road", notitie:"Xingfuli (Panyu Road 381, schuin tegenover hotel) → autovrij steegje met koffie en ijssalons. Dan Xinhua Road: platanenlaan met jaren '20 villa's. Rustig en buggyvriendelijk, geen metro nodig." },
    avond:{ titel:"Columbia Circle ☕", notitie:"Columbia Circle (Yan'an West Road 1262): Tsutaya Books, robot-ordering, groot autovrij plein. Perfect voor Tess om rond te rennen. Dan vroeg slapen!" }},
  { id:"d03", date:"24 aug", dag:"ma", regio:"shanghai", label:"",
    ochtend:{ titel:"Baja Bikes fietstour 🚴", notitie:"Vertrek Okura Garden Hotel. Lijn 10/12/13 → South Shaanxi Road, 5 min lopen. Fietstour langs highlights – goed moment om te zien wat je nog wil bezoeken!" },
    middag:{ titel:"The Bund + Huangpu River Ferry 🛳", notitie:"Lijn 10 → East Nanjing Road (~30 min). Wandel langs de skyline, pak dan de lokale pont (黄浦江渡轮) naar Pudong voor het iconische uitzicht. Paar yuan, authentiek." },
    avond:{ titel:"Futuristisch restaurant", notitie:"Drone-bezorging of robot-bediening. Reserveren!" }},
  { id:"d04", date:"25 aug", dag:"di", regio:"shanghai", label:"",
    ochtend:{ titel:"Peppa Pig World of Play", notitie:"Indoor, voor Tess! Of Century Park bij mooi weer." },
    middag:{ titel:"Century Park", notitie:"Roeiboten, groene ruimte." },
    avond:{ titel:"Vrij", notitie:"" }},
  { id:"d05", date:"26 aug", dag:"wo", regio:"shanghai", label:"",
    ochtend:{ titel:"Columbia Circle + Xingfuli wandelroute", notitie:"~3,2 km autovrij. Tsutaya Books, robot-ordering." },
    middag:{ titel:"Xinhua Road villa's → Wuyi Road", notitie:"Platanenlaan, historische sfeer." },
    avond:{ titel:"Zhujiajiao waterstad (optioneel)", notitie:"Of vrije avond." }},
  { id:"d06", date:"27 aug", dag:"do", regio:"travel", label:"Vlucht → Guilin",
    ochtend:{ titel:"Uitchecken Crowne Plaza", notitie:"" },
    middag:{ titel:"MU3722 10:00 → 12:35", notitie:"Shanghai Pudong → Guilin Liangjiang (uitg. HO1147)" },
    avond:{ titel:"Inchecken Xiyue Haven", notitie:"Yangshuo Qiyue Waterfront · Ten-Mile Gallery Yulong River" }},
  { id:"d07", date:"28 aug", dag:"vr", regio:"yangshuo", label:"",
    ochtend:{ titel:"E-bike rijstvelden route", notitie:"Xiyue Haven → Gongnong Bridge → Greenway. Kinderzitje." },
    middag:{ titel:"One Chi Rice Field Café ☕", notitie:"Koffiestop in de rijstvelden. Airco voor Tess." },
    avond:{ titel:"Vrij", notitie:"" }},
  { id:"d08", date:"29 aug", dag:"za", regio:"yangshuo", label:"",
    ochtend:{ titel:"Bamboe vlot varen 🛶", notitie:"Yulong River. Zwemvest aanwezig." },
    middag:{ titel:"Ruyi Peak kabelbaan", notitie:"Spectaculair uitzicht over karstbergen." },
    avond:{ titel:"Ten-Mile Gallery e-scooter", notitie:"Kinderzitje huren in Yangshuo." }},
  { id:"d09", date:"30 aug", dag:"zo", regio:"travel", label:"Trein → Chengdu 🚄",
    ochtend:{ titel:"Uitchecken Xiyue Haven", notitie:"" },
    middag:{ titel:"Hogesnelheidstrein Guilin → Chengdu", notitie:"Pre-order – details volgen. Ca. 6-8 uur reistijd." },
    avond:{ titel:"Inchecken Monkey King Hotel", notitie:"No. 122-124 Renmin South Road, Qingyang District" }},
  { id:"d10", date:"31 aug", dag:"ma", regio:"chengdu", label:"Panda dag! 🐼",
    ochtend:{ titel:"Giant Panda Base – vroeg!", notitie:"08:00 gaan. Panda's actiefst in de ochtend. Rode panda's ook!" },
    middag:{ titel:"Renmin Park", notitie:"Bootjes, speeltuin – relaxt voor Tess." },
    avond:{ titel:"Vrij", notitie:"" }},
  { id:"d11", date:"1 sep", dag:"di", regio:"chengdu", label:"",
    ochtend:{ titel:"Kuanzhai Alley", notitie:"Historische steeg, streetfood, theewinkels." },
    middag:{ titel:"Taikoo Li + Chunxi Road", notitie:"Trendy winkelen, lokale merken." },
    avond:{ titel:"Hotpot! 🌶️", notitie:"Half-half pot voor Tess. Bù là = niet pittig!" }},
  { id:"d12", date:"2 sep", dag:"wo", regio:"chengdu", label:"",
    ochtend:{ titel:"Renmin Park ochtend", notitie:"Rustig, theehuis sfeer." },
    middag:{ titel:"Eastern Suburb Memory", notitie:"Creatieve wijk, art, muziek, streetfood." },
    avond:{ titel:"Vrij", notitie:"" }},
  { id:"d13", date:"3 sep", dag:"do", regio:"travel", label:"Vlucht → Peking",
    ochtend:{ titel:"Uitchecken Monkey King", notitie:"" },
    middag:{ titel:"CA4115 11:00 → 13:45", notitie:"Chengdu Shuangliu → Beijing Capital" },
    avond:{ titel:"Inchecken Le Joy Hotel", notitie:"Xidan Joy City, No. 131 Yi, Xidan North Street" }},
  { id:"d14", date:"4 sep", dag:"vr", regio:"beijing", label:"Grote Muur dag",
    ochtend:{ titel:"Grote Muur – Mutianyu 🏔️", notitie:"Vroeg vertrekken! Kabelbaan omhoog, rodelbaan omlaag. Geen zware tas." },
    middag:{ titel:"Grote Muur verkennen", notitie:"Locker bij ingang voor tassen." },
    avond:{ titel:"Peking eend bij Siji Minfu?", notitie:"Metro lijn 1 vanuit Xidan." }},
  { id:"d15", date:"5 sep", dag:"za", regio:"beijing", label:"Verboden Stad",
    ochtend:{ titel:"Tiananmen + Verboden Stad", notitie:"⚠️ GEEN TAS = kortere rij! Tickets online. Stampboekje kopen!" },
    middag:{ titel:"Gài Zhāng stempels 📮", notitie:"Gratis bij Tiananmen. Tess zal dit geweldig vinden!" },
    avond:{ titel:"Wangfujing snackstraat", notitie:"Schorpioen-spiesen, zeesterren. Dapper zijn!" }},
  { id:"d16", date:"6 sep", dag:"zo", regio:"beijing", label:"",
    ochtend:{ titel:"Chaoyang Park 🦆", notitie:"Eendjes voeren, bootje varen. Perfect voor Tess!" },
    middag:{ titel:"Sanlitun wijk", notitie:"Trendy winkelen, lunch." },
    avond:{ titel:"Peking eend 🦆", notitie:"Siji Minfu of Da Dong. Reserveren!" }},
  { id:"d17", date:"7 sep", dag:"ma", regio:"travel", label:"Trein → Beidaihe",
    ochtend:{ titel:"Uitchecken Le Joy", notitie:"" },
    middag:{ titel:"Trein naar Beidaihe", notitie:"Peking → Qinhuangdao. Nog te bevestigen." },
    avond:{ titel:"Inchecken Summer Solstice", notitie:"No. 1 Shuangshi Road, Beidaihe District" }},
  { id:"d18", date:"8 sep", dag:"di", regio:"beidaihe", label:"Strand dag 🏖️",
    ochtend:{ titel:"Strand zwemmen", notitie:"Gele Zee. Ontspannen!" },
    middag:{ titel:"Strand", notitie:"" },
    avond:{ titel:"Liuzhuang Night Market", notitie:"Vlak bij het hotel." }},
  { id:"d19", date:"9 sep", dag:"wo", regio:"beidaihe", label:"",
    ochtend:{ titel:"Pigeon Nest Park", notitie:"Rustige wandeling langs de kust." },
    middag:{ titel:"Strand – laatste dag!", notitie:"" },
    avond:{ titel:"Uitrusten", notitie:"" }},
  { id:"d20", date:"10 sep", dag:"do", regio:"travel", label:"Terug naar Peking",
    ochtend:{ titel:"Uitchecken Summer Solstice", notitie:"" },
    middag:{ titel:"Trein terug naar Peking", notitie:"Hotel tbc – nog te boeken." },
    avond:{ titel:"Laatste avond in China 🥹", notitie:"Rustiger avond voor vroege vlucht morgen." }},
  { id:"d21", date:"11 sep", dag:"vr", regio:"travel", label:"Thuisvlucht 🏠",
    ochtend:{ titel:"KLM898 vertrekt 10:55", notitie:"Beijing Capital → Amsterdam Schiphol. Aankomst 17:20!" },
    middag:null, avond:null },
];

const FLIGHTS=[
  {label:"KLM895",van:"AMS",naar:"PVG",datum:"22 aug",tijd:"15:20 → 09:25+1"},
  {label:"MU3722",van:"PVG",naar:"KWL",datum:"27 aug",tijd:"10:00 → 12:35",note:"uitg. HO1147"},
  {label:"CA4115",van:"CTU",naar:"PEK",datum:"3 sep",tijd:"11:00 → 13:45"},
  {label:"KLM898",van:"PEK",naar:"AMS",datum:"11 sep",tijd:"10:55 → 17:20"},
];
const HOTELS=[
  {naam:"Crowne Plaza Shanghai Changning",in:"23 aug",uit:"27 aug",adres:"No. 400 Panyu Road, Changning District"},
  {naam:"Yangshuo Qiyue Waterfront · Xiyue Haven",in:"27 aug",uit:"30 aug",adres:"No. 23, Zhudouzhai Ecological Village"},
  {naam:"Monkey King Hotel (HuaGuoShan)",in:"30 aug",uit:"3 sep",adres:"No. 122-124, Section 1, Renmin South Road"},
  {naam:"Le Joy Hotel",in:"3 sep",uit:"7 sep",adres:"Xidan Joy City, No. 131 Yi, Xidan North Street"},
  {naam:"Summer Solstice · Family Resort",in:"7 sep",uit:"10 sep",adres:"No. 1 Shuangshi Road, Beidaihe District"},
];
const WOORDEN=[
  {nl:"Niet pittig",zh:"不辣",pin:"Bù là",klank:"boe-la"},
  {nl:"Rekening aub",zh:"买单",pin:"Mǎidān",klank:"my-dan"},
  {nl:"Water",zh:"水",pin:"Shuǐ",klank:"swoe-ie"},
  {nl:"Bier",zh:"啤酒",pin:"Píjiǔ",klank:"pee-djoo"},
  {nl:"Rijst",zh:"米饭",pin:"Mǐfàn",klank:"mee-fan"},
  {nl:"Droge noodles",zh:"干面",pin:"Gān miàn",klank:"gan myen"},
  {nl:"Dank je",zh:"谢谢",pin:"Xièxiè",klank:"syeh-syeh"},
  {nl:"Toilet",zh:"厕所",pin:"Cèsuǒ",klank:"tseh-swoh"},
  {nl:"Lekker!",zh:"好吃",pin:"Hǎo chī",klank:"how-chur"},
  {nl:"Hoeveel?",zh:"多少钱",pin:"Duōshǎo qián",klank:"dwoh-shaow chyen"},
];

// ─── STORAGE ──────────────────────────────────────────────────────────────────
async function storageGet(key) {
  try { const val = localStorage.getItem(key); return val ? JSON.parse(val) : null; }
  catch { return null; }
}
async function storageSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); }
  catch(e) { console.warn("storage failed", e); }
}

function getTodayId() {
  const diff = Math.floor((new Date()-new Date("2026-08-22T00:00:00"))/86400000);
  if(diff<0) return "d01";
  if(diff>=DAYS_TEMPLATE.length) return DAYS_TEMPLATE[DAYS_TEMPLATE.length-1].id;
  return DAYS_TEMPLATE[diff].id;
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Chip({children,color,bg,style={}}) {
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,letterSpacing:"0.03em",padding:"3px 8px",borderRadius:20,color:color||C.ink,background:bg||C.mist,...style}}>{children}</span>;
}
function Btn({active,onClick,children,activeColor,small=false}) {
  return <button onClick={onClick} style={{padding:small?"5px 10px":"7px 14px",borderRadius:20,border:"none",cursor:"pointer",background:active?(activeColor||C.ink):C.mist,color:active?C.white:C.dim,fontSize:small?11:13,fontWeight:active?700:400,transition:"all .15s"}}>{children}</button>;
}
function SlotCard({slot,label,accent}) {
  if(!slot) return null;
  return (
    <div style={{borderLeft:`3px solid ${accent}`,paddingLeft:12,marginBottom:8}}>
      <div style={{fontSize:10,fontWeight:700,color:accent,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>{label}</div>
      <div style={{fontSize:14,fontWeight:600,color:C.ink,lineHeight:1.3}}>{slot.titel}</div>
      {slot.notitie&&<div style={{fontSize:12,color:C.dim,marginTop:3,lineHeight:1.5}}>{slot.notitie}</div>}
    </div>
  );
}

// ─── ZONE LABELS ──────────────────────────────────────────────────────────────
const ZONE_LABELS = {
  shanghai: {
    hotel:   "🏨 Bij hotel (Changning)",
    bund:    "🌊 Bund & centrum",
    french:  "🌿 French Concession",
    pudong:  "🏙️ Pudong",
    buiten:  "🚌 Buiten stad",
  },
  chengdu: {
    west:    "🟡 West – Kuanzhai/Renmin",
    centrum: "🟠 Centrum – Chunxi/Taikoo",
    noord:   "🔵 Noord – Panda Base",
    oost:    "🟣 Oost – Eastern Suburb",
    zuid:    "🟢 Zuid – Jinli/Wuhou",
  },
  beijing: {
    centrum: "🔴 Centrum – Verboden Stad",
    oost:    "🟢 Oost – Sanlitun/Chaoyang",
    buiten:  "🚌 Buiten stad – Grote Muur",
  },
  yangshuo: {
    rivier:  "🛶 Langs de rivier",
    berg:    "⛰️ Bergen",
    centrum: "🏘️ Yangshuo centrum",
  },
  beidaihe: {
    strand: "🏖️ Strand & omgeving",
  },
};

// ─── SUGGESTIES ───────────────────────────────────────────────────────────────
function Suggesties({regio,weatherMode,tessMode}) {
  const [activeZone,setActiveZone]=useState(null);
  if(regio==="travel") return null;
  let list = ACTIVITIES[regio]||[];
  if(weatherMode==="rain") list=list.filter(a=>a.weather==="indoor"||a.weather==="any");
  if(weatherMode==="sun")  list=list.filter(a=>a.weather==="sun"||a.weather==="any");
  if(tessMode) list=list.filter(a=>a.tess);
  if(activeZone) list=list.filter(a=>a.zone===activeZone);

  const zones = ZONE_LABELS[regio];

  return (
    <div>
      {/* zone filter */}
      {zones&&(
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:7}}>📌 Per wijk</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <button onClick={()=>setActiveZone(null)} style={{fontSize:11,padding:"4px 10px",borderRadius:20,border:`1px solid ${!activeZone?C.ink:C.mist}`,background:!activeZone?C.ink:"none",color:!activeZone?C.white:C.dim,cursor:"pointer",fontWeight:!activeZone?700:400}}>Alles</button>
            {Object.entries(zones).map(([z,label])=>(
              <button key={z} onClick={()=>setActiveZone(activeZone===z?null:z)}
                style={{fontSize:11,padding:"4px 10px",borderRadius:20,border:`1px solid ${activeZone===z?C.shanghai:C.mist}`,background:activeZone===z?`${C.shanghai}15`:"none",color:activeZone===z?C.shanghai:C.dim,cursor:"pointer",fontWeight:activeZone===z?700:400}}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {list.length===0&&<div style={{padding:"10px 12px",background:C.mist,borderRadius:10,fontSize:12,color:C.dim,fontStyle:"italic"}}>Geen activiteiten gevonden met deze filters.</div>}
      <div style={{display:"grid",gap:6}}>
        {list.map(act=>(
          <div key={act.id} style={{background:C.white,borderRadius:10,padding:"10px 12px",border:`0.5px solid ${C.mist}`,borderLeft:`3px solid ${act.weather==="indoor"?C.rain:act.weather==="sun"?C.sun:C.ghost}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:C.ink}}>{act.titel}</div>
                <div style={{fontSize:11,color:C.dim,marginTop:3,lineHeight:1.5}}>{act.notitie}</div>
                {act.metro&&<div style={{fontSize:11,color:C.shanghai,marginTop:5,fontWeight:500}}>{act.metro}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0,alignItems:"flex-end"}}>
                {act.tess&&<Chip bg="#FCE7F3" color={C.tess}>👧 Tess</Chip>}
                <Chip bg={act.weather==="indoor"?"#EBF5FF":act.weather==="sun"?"#FFFBEB":"#F0FFF4"} color={act.weather==="indoor"?C.rain:act.weather==="sun"?C.sun:C.yangshuo}>
                  {act.weather==="indoor"?"🏠 Indoor":act.weather==="sun"?"☀️ Buiten":"🌂 Altijd"}
                </Chip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── VANDAAG TAB ──────────────────────────────────────────────────────────────
function VandaagTab({dayData,setDayData,selectedId,setSelectedId}) {
  const day = DAYS_TEMPLATE.find(d=>d.id===selectedId)||DAYS_TEMPLATE[0];
  const regio = REGIONS[day.regio];
  const saved = dayData[day.id]||{};
  const [note,setNote]=useState(saved.note||"");
  const [done,setDone]=useState(saved.done||false);
  const [weatherMode,setWeatherMode]=useState(saved.weatherMode||"any");
  const [tessMode,setTessMode]=useState(saved.tessMode||false);
  const [showSug,setShowSug]=useState(false);
  const [saving,setSaving]=useState(false);

  useEffect(()=>{
    const s=dayData[day.id]||{};
    setNote(s.note||""); setDone(s.done||false);
    setWeatherMode(s.weatherMode||"any"); setTessMode(s.tessMode||false);
  },[day.id]);

  const save=useCallback(async(n,d,wm,tm)=>{
    setSaving(true);
    const upd={...dayData,[day.id]:{note:n,done:d,weatherMode:wm,tessMode:tm}};
    setDayData(upd); await storageSet("daydata",upd); setSaving(false);
  },[day.id,dayData,setDayData]);

  const idx=DAYS_TEMPLATE.findIndex(d=>d.id===selectedId);
  const prev=idx>0?DAYS_TEMPLATE[idx-1]:null;
  const next=idx<DAYS_TEMPLATE.length-1?DAYS_TEMPLATE[idx+1]:null;
  const daysUntil=Math.floor((new Date("2026-08-22")-new Date())/86400000);

  const setWM=(v)=>{setWeatherMode(v);save(note,done,v,tessMode);};
  const setTM=(v)=>{setTessMode(v);save(note,done,weatherMode,v);};

  return (
    <div style={{padding:"0 16px 16px"}}>
      {daysUntil>0&&(
        <div style={{background:`${regio.color}15`,border:`1px solid ${regio.color}30`,borderRadius:10,padding:"8px 12px",marginBottom:12,fontSize:12,color:regio.color,fontWeight:600,textAlign:"center"}}>
          🗓 Nog {daysUntil} dagen tot vertrek!
        </div>
      )}

      {/* nav */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <button onClick={()=>prev&&setSelectedId(prev.id)} style={{background:"none",border:"none",fontSize:24,cursor:prev?"pointer":"default",color:prev?C.ink:C.ghost,padding:"6px 14px"}}>‹</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:12,color:C.dim,fontWeight:600}}>{day.dag} {day.date}</div>
        </div>
        <button onClick={()=>next&&setSelectedId(next.id)} style={{background:"none",border:"none",fontSize:24,cursor:next?"pointer":"default",color:next?C.ink:C.ghost,padding:"6px 14px"}}>›</button>
      </div>

      {/* ticket */}
      <div style={{background:C.white,borderRadius:16,boxShadow:"0 2px 16px rgba(0,0,0,0.08)",overflow:"hidden",marginBottom:12}}>
        <div style={{background:regio.color,padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:22,fontWeight:800,color:C.white,lineHeight:1}}>{regio.emoji} {regio.label}</div>
              {day.label&&<div style={{fontSize:13,color:`${C.white}CC`,marginTop:3}}>{day.label}</div>}
            </div>
            {done&&<div style={{fontSize:28}}>✅</div>}
          </div>
        </div>
        <div style={{borderTop:`2px dashed ${C.mist}`,margin:"0 16px"}}/>
        <div style={{padding:"14px 16px"}}>
          <SlotCard slot={day.ochtend} label="Ochtend" accent={regio.color}/>
          <SlotCard slot={day.middag}  label="Middag"  accent={regio.color}/>
          <SlotCard slot={day.avond}   label="Avond"   accent={regio.color}/>
        </div>
        <div style={{borderTop:`2px dashed ${C.mist}`,margin:"0 16px"}}/>
        <div style={{padding:"12px 16px"}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Notities</div>
          <textarea value={note} onChange={e=>setNote(e.target.value)} onBlur={()=>save(note,done,weatherMode,tessMode)}
            placeholder="Schrijf hier notities of aanpassingen…"
            style={{width:"100%",minHeight:64,border:`1px solid ${C.mist}`,borderRadius:8,padding:"8px 10px",fontSize:13,color:C.ink,background:C.paper,resize:"vertical",fontFamily:"inherit",lineHeight:1.5,outline:"none"}}/>
          {saving&&<div style={{fontSize:11,color:C.dim,marginTop:2}}>Opslaan…</div>}
        </div>
      </div>

      {/* afvinken */}
      <button onClick={()=>{const nd=!done;setDone(nd);save(note,nd,weatherMode,tessMode);}} style={{width:"100%",padding:"12px 0",background:done?C.mist:regio.color,color:done?C.dim:C.white,border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:12}}>
        {done?"✅ Afgevinkt – ongedaan maken":"Dag afvinken ✓"}
      </button>

      {/* suggesties */}
      {day.regio!=="travel"&&(
        <div style={{background:C.white,borderRadius:14,overflow:"hidden",boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
          <button onClick={()=>setShowSug(s=>!s)} style={{width:"100%",padding:"13px 16px",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left"}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:C.ink}}>🎯 Activiteitensuggesties</div>
              <div style={{fontSize:11,color:C.dim,marginTop:2}}>Aanpassen op weer & Tess</div>
            </div>
            <span style={{fontSize:18,color:C.ghost}}>{showSug?"▲":"▼"}</span>
          </button>
          {showSug&&(
            <div style={{padding:"0 14px 14px",borderTop:`1px solid ${C.mist}`}}>

              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:7}}>Hoe is het weer vandaag?</div>
                <div style={{display:"flex",gap:7}}>
                  <Btn active={weatherMode==="sun"}  onClick={()=>setWM(weatherMode==="sun"?"any":"sun")}  activeColor={C.sun}>☀️ Mooi</Btn>
                  <Btn active={weatherMode==="rain"} onClick={()=>setWM(weatherMode==="rain"?"any":"rain")} activeColor={C.rain}>🌧 Regen</Btn>
                  <Btn active={weatherMode==="any"}  onClick={()=>setWM("any")} activeColor={C.ghost}>🌤 Alles</Btn>
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:7}}>Tess-modus</div>
                <Btn active={tessMode} onClick={()=>setTM(!tessMode)} activeColor={C.tess}>👧 Alleen kindvriendelijk</Btn>
              </div>
              <Suggesties regio={day.regio} weatherMode={weatherMode} tessMode={tessMode}/>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PLANNING TAB ─────────────────────────────────────────────────────────────
function PlanningTab({dayData,setSelectedId,setTab}) {
  return (
    <div style={{padding:"0 16px 16px"}}>
      {DAYS_TEMPLATE.map(day=>{
        const regio=REGIONS[day.regio];
        const saved=dayData[day.id]||{};
        if(day.regio==="travel") return (
          <div key={day.id} style={{display:"flex",alignItems:"center",gap:8,margin:"8px 0"}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:C.mist,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>✈️</div>
            <div style={{flex:1,height:1,background:C.mist}}/>
            <div style={{fontSize:11,color:C.dim,fontWeight:600}}>{day.dag} {day.date} · {day.label}</div>
            <div style={{flex:1,height:1,background:C.mist}}/>
          </div>
        );
        return (
          <div key={day.id} onClick={()=>{setSelectedId(day.id);setTab("vandaag");}} style={{background:C.white,borderRadius:12,marginBottom:6,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",cursor:"pointer",display:"flex",opacity:saved.done?0.55:1}}>
            <div style={{width:4,background:regio.color,flexShrink:0}}/>
            <div style={{padding:"10px 12px",flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:11,color:C.dim,marginBottom:2}}>{day.dag} {day.date}</div>
                  <div style={{fontSize:14,fontWeight:700,color:C.ink}}>{day.label||day.ochtend?.titel||day.middag?.titel||"Vrije dag"}</div>
                  {!day.label&&day.middag&&<div style={{fontSize:12,color:C.dim,marginTop:2}}>+ {day.middag.titel}</div>}
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                  <Chip bg={`${regio.color}20`} color={regio.color}>{regio.emoji} {regio.label}</Chip>
                  <div style={{display:"flex",gap:4}}>
                    {saved.done&&<span style={{fontSize:14}}>✅</span>}
                    {saved.tessMode&&<Chip bg="#FCE7F3" color={C.tess} style={{fontSize:10}}>👧</Chip>}
                    {saved.weatherMode==="rain"&&<Chip bg="#EBF5FF" color={C.rain} style={{fontSize:10}}>🌧</Chip>}
                    {saved.weatherMode==="sun"&&<Chip bg="#FFFBEB" color={C.sun} style={{fontSize:10}}>☀️</Chip>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── INFO TAB ─────────────────────────────────────────────────────────────────
const GETALLEN = [
  ["1","一","Wijsvinger omhoog ☝️"],
  ["2","二","Wijsvinger + middelvinger omhoog (V-teken) ✌️"],
  ["3","三","Wijsvinger + middelvinger + ringvinger omhoog"],
  ["4","四","Alle vingers omhoog, duim gevouwen"],
  ["5","五","Hele hand open 🖐️"],
  ["6","六","Duim + pink uitsteken, drie middelste vingers gevouwen 🤙"],
  ["7","七","Duim + wijsvinger + middelvinger bij elkaar"],
  ["8","八","Duim omhoog + wijsvinger + middelvinger gestrekt"],
  ["9","九","Wijsvinger gebogen als haakje, rest gevouwen"],
  ["10","十","Vuist (of duim omhoog) ✊"],
];

const INFO_ITEMS = [
  { id:"i01", regio:"shanghai", titel:"Futuristische Shanghai",
    tekst:"🤖 COFE+ robots op Nanjing Road – latte-art uit een machine.\n🚗 Zelfrijdende Didi-taxi's in Changning district.\n🚁 Drone-bezorging zichtbaar bij winkelcentra.\n📱 QR-ordering: scan tafelcode, bestel, betaal met Alipay.\n🏗️ Tsutaya Books in Columbia Circle: monumentale boekenwanden + Japans design." },
  { id:"i02", regio:"yangshuo", titel:"Fietsgids Yangshuo",
    tekst:"Route 1 – E-bike rijstvelden (~1,5u)\nXiyue Haven → Gongnong Bridge → Greenway → One Chi Rice Field Café → terug.\n100% autovrij, vlak asfalt, kinderzitje mogelijk.\n\nRoute 2 – Ten-Mile Gallery\nE-scooter huren in Yangshuo centrum. Langs Yulong rivier, karstbergen aan weerszijden.\n\nMust-see: Ruyi Peak kabelbaan – panorama over heel Yangshuo." },
  { id:"i03", regio:"beijing", titel:"Verboden Stad tips",
    tekst:"⚠️ Geen tas meenemen = aparte ingang, rij véél korter.\n🎟️ Tickets online boeken (max 80.000 bezoekers per dag!).\n📮 Gài Zhāng: koop stampboekje bij souvenirwinkel. Gratis stempel bij Tiananmen.\n⛵ Optioneel: boottour via de keizerlijke grachten." },
  { id:"i04", regio:"beijing", titel:"Grote Muur – Mutianyu",
    tekst:"🚡 Kabelbaan omhoog – ook goed met buggy.\n🛷 Rodelbaan omlaag – Tess zal genieten!\n🎒 Locker bij ingang: geen zware tas nodig op de muur.\n⏰ Vroeg vertrekken (08:30): minder druk, koeler.\n🚌 Bus of georganiseerde tour vanuit Peking (~1,5u enkele reis)." },
];

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "zh-CN";
  utt.rate = 0.8;
  utt.volume = 1;
  utt.pitch = 1;
  // Try to find a Chinese voice; wait for voices to load if needed
  const trySpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.startsWith("zh"));
    if (zhVoice) utt.voice = zhVoice;
    window.speechSynthesis.speak(utt);
  };
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = trySpeak;
  } else {
    trySpeak();
  }
}

function InfoTab() {
  const [open,setOpen]=useState(null);
  const [filter,setFilter]=useState("all");
  const [openChinees,setOpenChinees]=useState(true);
  const [openGetallen,setOpenGetallen]=useState(false);
  const filtered=INFO_ITEMS.filter(i=>filter==="all"||i.regio===filter);
  return (
    <div style={{padding:"0 16px 16px"}}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {["all","shanghai","yangshuo","chengdu","beijing"].map(r=>{
          const reg=r==="all"?{label:"Alles",emoji:"📚",color:C.ink}:REGIONS[r];
          const on=filter===r;
          return <button key={r} onClick={()=>setFilter(r)} style={{fontSize:11,padding:"4px 10px",borderRadius:20,border:`1px solid ${on?reg.color:C.mist}`,background:on?`${reg.color}20`:C.white,color:on?reg.color:C.dim,cursor:"pointer",fontWeight:on?700:400}}>{reg.emoji} {reg.label}</button>;
        })}
      </div>
      {/* Handig Chinees – altijd zichtbaar */}
      <div style={{background:C.white,borderRadius:12,marginBottom:8,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
        <button onClick={()=>setOpenChinees(o=>!o)} style={{width:"100%",padding:"12px 14px",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",textAlign:"left"}}>
          <div style={{fontSize:14,fontWeight:700,color:C.ink}}>🇨🇳 Handig Chinees</div>
          <span style={{fontSize:16,color:C.ghost}}>{openChinees?"▲":"▼"}</span>
        </button>
        {openChinees&&(
          <div style={{padding:"0 14px 14px",borderTop:`1px solid ${C.mist}`}}>


            {WOORDEN.map((w,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<WOORDEN.length-1?`1px solid ${C.mist}`:"none",flexWrap:"wrap"}}>
                <div style={{width:100,fontSize:12,fontWeight:600,color:C.ink,flexShrink:0}}>{w.nl}</div>
                <div style={{fontSize:18,color:C.shanghai,fontWeight:700,width:55,flexShrink:0}}>{w.zh}</div>
                <div style={{fontSize:11,color:C.dim,flex:1}}>{w.pin}<br/><em style={{color:C.ghost}}>{w.klank}</em></div>
                <button onClick={()=>speak(w.zh)} title="Uitspreken"
                  style={{background:"none",border:`1px solid ${C.mist}`,borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:14,color:C.dim,flexShrink:0}}>
                  🔊
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Getallen */}
      <div style={{background:C.white,borderRadius:12,marginBottom:8,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
        <button onClick={()=>setOpenGetallen(o=>!o)} style={{width:"100%",padding:"12px 14px",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",textAlign:"left"}}>
          <div style={{fontSize:14,fontWeight:700,color:C.ink}}>🔢 Getallen</div>
          <span style={{fontSize:16,color:C.ghost}}>{openGetallen?"▲":"▼"}</span>
        </button>
        {openGetallen&&(
          <div style={{padding:"0 14px 14px",borderTop:`1px solid ${C.mist}`}}>
            <div style={{display:"grid",gap:5}}>
              {GETALLEN.map(([n,zh,uitleg])=>(
                <div key={n} style={{display:"flex",gap:10,alignItems:"center",padding:"6px 10px",background:C.paper,borderRadius:8}}>
                  <div style={{fontSize:15,fontWeight:800,color:C.ink,width:22,flexShrink:0}}>{n}</div>
                  <div style={{fontSize:18,fontWeight:700,color:C.shanghai,width:24,flexShrink:0}}>{zh}</div>
                  <div style={{fontSize:12,color:C.dim,lineHeight:1.4}}>{uitleg}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {filtered.length===0&&<div style={{textAlign:"center",padding:30,color:C.dim,fontSize:13}}>Geen info voor deze stad.</div>}
      {filtered.map(item=>{
        const reg=REGIONS[item.regio]||{color:C.ink,emoji:"📚"};
        const isOpen=open===item.id;
        return (
          <div key={item.id} style={{background:C.white,borderRadius:12,marginBottom:8,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
            <button onClick={()=>setOpen(isOpen?null:item.id)} style={{width:"100%",padding:"12px 14px",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",textAlign:"left"}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:C.ink}}>{item.titel}</div>
                <Chip bg={`${reg.color}15`} color={reg.color} style={{marginTop:4}}>{reg.emoji} {REGIONS[item.regio]?.label}</Chip>
              </div>
              <span style={{fontSize:16,color:C.ghost,marginLeft:8}}>{isOpen?"▲":"▼"}</span>
            </button>
            {isOpen&&<div style={{padding:"0 14px 14px",fontSize:13,color:C.dim,lineHeight:1.7,whiteSpace:"pre-wrap",borderTop:`1px solid ${C.mist}`,paddingTop:12}}>{item.tekst}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── ETEN TAB ─────────────────────────────────────────────────────────────────
function EtenTab() {
  const [open,setOpen]=useState(null);
  const [filter,setFilter]=useState("all");
  const [tried,setTried]=useState(()=>{
    try { return JSON.parse(localStorage.getItem("dishes_tried")||"{}"); }
    catch { return {}; }
  });
  const toggleTried=(id)=>{
    const upd={...tried,[id]:!tried[id]};
    setTried(upd);
    try { localStorage.setItem("dishes_tried",JSON.stringify(upd)); } catch{}
  };
  const steden=["all","Shanghai","Chengdu","Peking","Overal"];
  const filtered=filter==="all"?DISHES:DISHES.filter(d=>d.stad===filter);
  return (
    <div style={{padding:"0 16px 16px"}}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {steden.map(s=>{
          const on=filter===s;
          const color=s==="Shanghai"?C.shanghai:s==="Chengdu"?C.chengdu:s==="Peking"?C.beijing:C.ink;
          return <button key={s} onClick={()=>setFilter(s)} style={{fontSize:11,padding:"4px 10px",borderRadius:20,border:`1px solid ${on?color:C.mist}`,background:on?`${color}20`:C.white,color:on?color:C.dim,cursor:"pointer",fontWeight:on?700:400}}>{s==="all"?"🍜 Alles":s}</button>;
        })}
      </div>
      <div style={{display:"grid",gap:6}}>
        {filtered.map(dish=>{
          const isOpen=open===dish.id;
          const cityColor=dish.stad==="Shanghai"?C.shanghai:dish.stad==="Chengdu"?C.chengdu:dish.stad==="Peking"?C.beijing:C.ghost;
          return (
            <div key={dish.id} style={{background:C.white,borderRadius:12,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
              <div style={{display:"flex",alignItems:"center",gap:0}}>
                <button onClick={()=>toggleTried(dish.id)}
                  style={{padding:"12px 10px 12px 14px",background:"none",border:"none",cursor:"pointer",flexShrink:0,fontSize:20}}>
                  {tried[dish.id] ? "✅" : "⬜"}
                </button>
                <button onClick={()=>setOpen(isOpen?null:dish.id)} style={{flex:1,padding:"12px 14px 12px 4px",background:"none",border:"none",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                  <div style={{flex:1,opacity:tried[dish.id]?0.45:1}}>
                    <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontSize:14,fontWeight:700,color:C.ink,textDecoration:tried[dish.id]?"line-through":"none"}}>{dish.nl}</span>
                      <span style={{fontSize:16,color:C.shanghai,fontWeight:700}}>{dish.zh}</span>
                    </div>
                    <div style={{fontSize:11,color:C.dim,marginTop:3}}>{dish.pinyin}</div>
                    <div style={{display:"flex",gap:5,marginTop:5,flexWrap:"wrap"}}>
                      <Chip bg={`${cityColor}15`} color={cityColor}>{dish.stad}</Chip>
                      {dish.warn&&<Chip bg="#FEF3C7" color="#92400E">{dish.warnTekst}</Chip>}
                    </div>
                  </div>
                  <span style={{fontSize:16,color:C.ghost,flexShrink:0}}>{isOpen?"▲":"▼"}</span>
                </button>
              </div>
              {isOpen&&(
                <div style={{padding:"0 14px 14px",borderTop:`1px solid ${C.mist}`,paddingTop:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <div style={{fontSize:12,color:C.dim}}>{dish.pinyin}</div>
                    <em style={{fontSize:11,color:C.ghost}}>{dish.klank}</em>
                    <button onClick={()=>speak(dish.zh)} style={{marginLeft:"auto",background:"none",border:`1px solid ${C.mist}`,borderRadius:8,padding:"3px 8px",cursor:"pointer",fontSize:13,color:C.dim}}>🔊</button>
                  </div>
                  <div style={{fontSize:13,color:C.dim,lineHeight:1.6}}>{dish.desc}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* restaurants */}
      {(filter==="all"||filter==="Peking"||filter==="Chengdu"||filter==="Yangshuo")&&(
        <>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:"0.08em",margin:"18px 0 10px"}}>🍽 Aanbevolen restaurants</div>
          {RESTAURANTS
            .filter(r=>filter==="all"||r.stad===filter||(filter==="Yangshuo"&&r.stad==="Yangshuo"))
            .map(r=><RestaurantKaart key={r.id} r={r}/>)}
        </>
      )}
    </div>
  );
}

const RESTAURANTS = [
  {
    id:"r01", naam:"Siji Minfu", zh:"四季民福烤鸭店", stad:"Peking", color:"#9B2335",
    gerecht:"Peking eend 🦆",
    desc:"Meest geliefd bij locals voor Peking eend. De eend wordt boven fruitenhout geroosterd en aan tafel gesneden.",
    locaties:[
      { naam:"Qianmen-vestiging", adres:"18 Langfang Ertiao, vlak bij Qianmen Pedestrian Street" },
      { naam:"Forbidden City-vestiging", adres:"11 Nanchizi Street, naast de oostpoort van de Verboden Stad" },
    ],
    tip:"Reserveren! Bereikbaar met metro lijn 1 vanuit Xidan.",
  },
  {
    id:"r02", naam:"Shangchi Mianguan", zh:"商池面馆", stad:"Chengdu", color:"#B85C1A",
    gerecht:"Hui Guo Rou Mian 回锅肉面",
    desc:"Klein, authentiek noedelrestaurant geliefd bij locals. Noedels met tweemaal gebakken varkensvlees in pittige paprikasaus.",
    locaties:[
      { naam:"Enige vestiging", adres:"Shangchi Zhengjie 39, Chengdu" },
    ],
    tip:"Klein en snel vol – ga vroeg of buiten piektijden.",
  },
  {
    id:"r03", naam:"One Chi Rice Field Café", zh:"一尺花园", stad:"Yangshuo", color:"#2D8B5A",
    gerecht:"Koffie & taart ☕",
    desc:"Modern café midden in de rijstvelden, langs de e-bike route. Ideale koffiestop met uitzicht op de karstbergen.",
    locaties:[
      { naam:"In de rijstvelden", adres:"Langs de Greenway, ca. 25 min fietsen vanaf Xiyue Haven" },
    ],
    tip:"Sapjes, taart en airco – perfect als Tess even wil afkoelen.",
  },
  {
    id:"r04", naam:"Lao Chengdu San Yang Mian", zh:"老成都三样面", stad:"Chengdu", color:"#B85C1A",
    gerecht:"San Yang Mian + Wontons",
    desc:"Authentiek 'hole-in-the-wall' noedelrestaurant, Michelin Bib Gourmand. Populair bij locals. Noedels in drie varianten ('oud', 'nieuw', 'meer') – de 'oude' met pittige vleessaus en sperziebonen is de favoriet. Wontons met gehakte chili erbij bestellen!",
    locaties:[
      { naam:"Guojielou Street vestiging", adres:"No. 6-8, 46 Guojielou Street, Qingyang, Chengdu" },
    ],
    tip:"Geen reservering mogelijk – ga vroeg. Klein en snel vol. Sluit af met tofu-dessert met rode bonen!",
  },
  {
    id:"r05", naam:"Haidilao Hotpot", zh:"海底捞", stad:"Shanghai / Chengdu / Peking", color:"#9B2335",
    gerecht:"Hotpot 🌶️",
    desc:"Meest kindvriendelijke hotpot-keten van China. Speelkamer met begeleiding, gratis speelgoed voor kinderen, kindermaaltijden, noodle-dansshow aan tafel. Meerdere vestigingen in elke stad.",
    locaties:[
      { naam:"Meerdere vestigingen", adres:"Zoek dichtstbijzijnde locatie via de Haidilao app of WeChat" },
    ],
    tip:"Reserveer vooraf via WeChat mini-program. Bestel een 4-vaks pot – 1 pittig, 3 mild water. Véél goedkoper dan 2-vaks!",
  },
];

function RestaurantKaart({r}) {
  const [open,setOpen]=useState(false);
  return (
    <div style={{background:"#FFFFFF",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",marginBottom:8}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",padding:"12px 14px",background:"none",border:"none",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
            <span style={{fontSize:14,fontWeight:700,color:"#1A1A2E"}}>{r.naam}</span>
            <span style={{fontSize:15,color:"#4B52B0",fontWeight:700}}>{r.zh}</span>
          </div>
          <div style={{fontSize:12,color:"#8A8278",marginTop:2}}>{r.gerecht}</div>
          <span style={{display:"inline-flex",alignItems:"center",fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:20,background:`${r.color}15`,color:r.color,marginTop:5}}>{r.stad}</span>
        </div>
        <span style={{fontSize:16,color:"#C8C3B8",flexShrink:0}}>{open?"▲":"▼"}</span>
      </button>
      {open&&(
        <div style={{padding:"0 14px 14px",borderTop:"1px solid #E8E4DC",paddingTop:12}}>
          <div style={{fontSize:13,color:"#8A8278",lineHeight:1.6,marginBottom:10}}>{r.desc}</div>
          {r.locaties.map((l,i)=>(
            <div key={i} style={{background:"#F7F4EF",borderRadius:8,padding:"8px 10px",marginBottom:6}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1A1A2E"}}>{l.naam}</div>
              <div style={{fontSize:11,color:"#8A8278",marginTop:2}}>{l.adres}</div>
            </div>
          ))}
          <div style={{fontSize:12,color:r.color,fontWeight:600,marginTop:6}}>💡 {r.tip}</div>
        </div>
      )}
    </div>
  );
}

// ─── LOGISTIEK TAB ────────────────────────────────────────────────────────────
function LogistiekTab() {
  const [openSection,setOpenSection]=useState("vluchten");
  const S=({id,label,children})=>{
    const on=openSection===id;
    return (
      <div style={{background:C.white,borderRadius:12,marginBottom:8,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
        <button onClick={()=>setOpenSection(on?null:id)} style={{width:"100%",padding:"12px 14px",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left"}}>
          <span style={{fontSize:14,fontWeight:700,color:C.ink}}>{label}</span>
          <span style={{fontSize:16,color:C.ghost}}>{on?"▲":"▼"}</span>
        </button>
        {on&&<div style={{padding:"0 14px 14px",borderTop:`1px solid ${C.mist}`}}>{children}</div>}
      </div>
    );
  };
  return (
    <div style={{padding:"0 16px 16px"}}>
      <S id="vluchten" label="✈️ Vluchten">
        {FLIGHTS.map((f,i)=>(
          <div key={i} style={{padding:"10px 0",borderBottom:i<FLIGHTS.length-1?`1px solid ${C.mist}`:"none"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:C.ink}}>{f.label}</div>
                <div style={{fontSize:12,color:C.dim}}>{f.van} → {f.naar} · {f.datum}</div>
                {f.note&&<div style={{fontSize:11,color:C.ghost}}>{f.note}</div>}
              </div>
              <Chip bg={`${C.shanghai}15`} color={C.shanghai}>{f.tijd}</Chip>
            </div>
          </div>
        ))}
      </S>
      <S id="hotels" label="🏨 Hotels">
        {HOTELS.map((h,i)=>(
          <div key={i} style={{padding:"10px 0",borderBottom:i<HOTELS.length-1?`1px solid ${C.mist}`:"none"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.ink}}>{h.naam}</div>
            <div style={{fontSize:11,color:C.dim,marginTop:2}}>{h.adres}</div>
            <div style={{display:"flex",gap:6,marginTop:5}}>
              <Chip bg={`${C.yangshuo}15`} color={C.yangshuo}>In: {h.in}</Chip>
              <Chip bg={`${C.beijing}15`} color={C.beijing}>Uit: {h.uit}</Chip>
            </div>
          </div>
        ))}
      </S>

    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab]=useState("vandaag");
  const [selectedId,setSelectedId]=useState(getTodayId());
  const [dayData,setDayData]=useState({});
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ storageGet("daydata").then(d=>{ if(d)setDayData(d); setLoading(false); }); },[]);

  const TABS=[
    {id:"vandaag",  label:"Vandaag",  icon:"📅"},
    {id:"planning", label:"Planning", icon:"🗺️"},
    {id:"info",     label:"Info",     icon:"💡"},
    {id:"eten",     label:"Eten",     icon:"🍜"},
    {id:"logistiek",label:"Logistiek",icon:"✈️"},
  ];

  if(loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.paper,color:C.dim,fontSize:14}}>Laden…</div>;

  return (
    <div style={{background:C.paper,minHeight:"100vh",maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column",fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>
      <div style={{background:C.ink,padding:"14px 16px 10px",display:"flex",alignItems:"baseline",justifyContent:"space-between",flexShrink:0}}>
        <div>
          <div style={{fontSize:18,fontWeight:800,color:C.white,letterSpacing:"-0.02em"}}>China 🇨🇳</div>
          <div style={{fontSize:11,color:`${C.white}80`,marginTop:1}}>22 aug – 11 sep 2026</div>
        </div>
        <div style={{fontSize:10,color:`${C.white}50`}}>gedeeld · {DAYS_TEMPLATE.length} dagen</div>
      </div>

      <div style={{flex:1,overflowY:"auto",paddingTop:14}}>
        {tab==="vandaag"  &&<VandaagTab dayData={dayData} setDayData={setDayData} selectedId={selectedId} setSelectedId={setSelectedId}/>}
        {tab==="planning" &&<PlanningTab dayData={dayData} setSelectedId={setSelectedId} setTab={setTab}/>}
        {tab==="info"     &&<InfoTab/>}
        {tab==="eten"     &&<EtenTab/>}
        {tab==="logistiek"&&<LogistiekTab/>}
      </div>

      <div style={{background:C.white,borderTop:`1px solid ${C.mist}`,display:"flex",flexShrink:0,paddingBottom:"env(safe-area-inset-bottom)"}}>
        {TABS.map(t=>{
          const on=tab===t.id;
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 0 8px",border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,borderTop:`2px solid ${on?C.ink:"transparent"}`}}>
              <span style={{fontSize:17}}>{t.icon}</span>
              <span style={{fontSize:9,fontWeight:on?700:400,color:on?C.ink:C.dim,letterSpacing:"0.03em"}}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
