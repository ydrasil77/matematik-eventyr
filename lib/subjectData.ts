export type SubjectId = "reading" | "history" | "physics" | "biology" | "language";

export interface SubjectQuestion {
  q: string;
  opts: [string, string, string, string];
  a: number; // 0-3 index
}

export interface SubjectLevel {
  floor: number;
  name: string;
  emoji: string;
  grade: string;
  desc: string;
  questions: SubjectQuestion[];
}

export interface SubjectConfig {
  id: SubjectId;
  name: string;
  emoji: string;
  gradient: string;
  desc: string;
  levels: SubjectLevel[];
}

// ─────────────────────────────────────────────────────────
// 📖  LÆSNING  (Bogstavernes Tårn)
// ─────────────────────────────────────────────────────────
const READING_LEVELS: SubjectLevel[] = [
  {
    floor: 1, name: "Vokal-Vogter", emoji: "🔤", grade: "Børnehaveklasse", desc: "Find vokalerne A E I O U",
    questions: [
      { q: "Hvilke af disse er en vokal?", opts: ["B", "A", "K", "S"], a: 1 },
      { q: "Hvilken bogstav er IKKE en vokal?", opts: ["E", "I", "T", "O"], a: 2 },
      { q: "Hvad er den første vokal i alfabetet?", opts: ["E", "I", "A", "U"], a: 2 },
      { q: "Hvor mange vokaler er der i 'IS'?", opts: ["0", "2", "1", "3"], a: 2 },
      { q: "Hvilken er en vokal?", opts: ["D", "F", "U", "M"], a: 2 },
      { q: "Hvad lyder 'Æ' som?", opts: ["I hund", "I æble", "I bold", "I fugl"], a: 1 },
    ],
  },
  {
    floor: 2, name: "Bogstav-Ridder", emoji: "🅰️", grade: "Børnehaveklasse", desc: "Genkend store og små bogstaver",
    questions: [
      { q: "Hvad er det lille 'A' skrives som?", opts: ["A", "a", "Å", "æ"], a: 1 },
      { q: "Hvad er det store 'b' skrives som?", opts: ["d", "B", "p", "q"], a: 1 },
      { q: "Hvilken bogstav kommer efter D i alfabetet?", opts: ["C", "F", "E", "G"], a: 2 },
      { q: "Hvad lyder 'S' som?", opts: ["ZZZ", "SSS", "PPP", "MMM"], a: 1 },
      { q: "Hvilken bogstav starter 'APE'?", opts: ["E", "P", "A", "B"], a: 2 },
      { q: "Hvad er det store 's' skrives som?", opts: ["z", "S", "C", "G"], a: 1 },
    ],
  },
  {
    floor: 3, name: "Lyd-Lærling", emoji: "🔊", grade: "1. klasse", desc: "Sæt lyd til bogstaver",
    questions: [
      { q: "Hvad laver vi, når vi udtaler 'B' + 'A' + 'T'?", opts: ["Stave", "Læse", "Skrive", "Tegne"], a: 1 },
      { q: "Hvad er lyden i starten af 'Hund'?", opts: ["N", "U", "D", "H"], a: 3 },
      { q: "Hvad er lyden til sidst i 'Sol'?", opts: ["S", "O", "L", "E"], a: 2 },
      { q: "Hvor mange lyde er der i 'KAT'?", opts: ["1", "2", "3", "4"], a: 2 },
      { q: "Hvad lyder 'Ø' som?", opts: ["I ost", "I øre", "I is", "I bil"], a: 1 },
      { q: "Hvilken lyd starter 'FUGL'?", opts: ["U", "G", "F", "L"], a: 2 },
    ],
  },
  {
    floor: 4, name: "Ord-Opdager", emoji: "📝", grade: "1. klasse", desc: "Læs korte ord",
    questions: [
      { q: "Hvad staver B-I-L?", opts: ["BIL", "PIL", "MIL", "SIL"], a: 0 },
      { q: "Hvad staver K-A-T?", opts: ["HAT", "BAT", "KAT", "RAT"], a: 2 },
      { q: "Hvad staver H-U-S?", opts: ["BUS", "LUS", "HUS", "MUS"], a: 2 },
      { q: "Hvad staver S-O-L?", opts: ["BOL", "SOL", "MOL", "VOL"], a: 1 },
      { q: "Hvad staver F-I-S-K?", opts: ["DISK", "RISK", "FISK", "BISK"], a: 2 },
      { q: "Hvad staver B-O-G?", opts: ["LOG", "FOG", "HOG", "BOG"], a: 3 },
    ],
  },
  {
    floor: 5, name: "Stavelse-Stærk", emoji: "✂️", grade: "1. klasse", desc: "Del ord i stavelser",
    questions: [
      { q: "Hvor mange stavelser er der i 'KA-GE'?", opts: ["1", "2", "3", "4"], a: 1 },
      { q: "Hvor mange stavelser er der i 'SOL'?", opts: ["1", "2", "3", "4"], a: 0 },
      { q: "Hvor mange stavelser er der i 'LE-GE-TØJ'?", opts: ["1", "2", "3", "4"], a: 2 },
      { q: "Hvordan deler man 'SOMMER'?", opts: ["S-OMMER", "SOM-MER", "SOMM-ER", "SO-MMER"], a: 1 },
      { q: "Hvor mange stavelser er der i 'HUS'?", opts: ["1", "2", "3", "4"], a: 0 },
      { q: "Hvad er første stavelse i 'BANANER'?", opts: ["BAN", "BA", "BANA", "B"], a: 1 },
    ],
  },
  {
    floor: 6, name: "Rim-Ridder", emoji: "🎵", grade: "1. klasse", desc: "Find rimord",
    questions: [
      { q: "Hvad rimer på 'KAT'?", opts: ["SOL", "HAT", "BIL", "MUS"], a: 1 },
      { q: "Hvad rimer på 'SOL'?", opts: ["BOL", "HUS", "KAT", "FIS"], a: 0 },
      { q: "Hvad rimer på 'HUS'?", opts: ["SOL", "KAT", "MUS", "BIL"], a: 2 },
      { q: "Hvad rimer på 'BIL'?", opts: ["KAT", "PIL", "SOL", "HUS"], a: 1 },
      { q: "Rimer 'BOLD' og 'FOLD'?", opts: ["Nej", "Ja", "Måske", "Ved ikke"], a: 1 },
      { q: "Hvad rimer IKKE på 'HAV'?", opts: ["GAV", "LAV", "SAV", "HUS"], a: 3 },
    ],
  },
  {
    floor: 7, name: "Sætnings-Smed", emoji: "📖", grade: "1.–2. klasse", desc: "Forstå enkle sætninger",
    questions: [
      { q: "Hvad mangler? 'Hunden ___ i haven.'", opts: ["spiser", "leger", "sover", "løber"], a: 1 },
      { q: "Hvad er et navneord i 'Den røde bil kører'?", opts: ["Den", "røde", "bil", "kører"], a: 2 },
      { q: "Hvad starter en sætning med?", opts: ["Lille bogstav", "Stort bogstav", "Tal", "Punktum"], a: 1 },
      { q: "Hvad slutter en sætning med?", opts: ["Komma", "Apostrof", "Punktum", "Mellemrum"], a: 2 },
      { q: "Hvad sker der i sætningen 'Katten sover'?", opts: ["Katten spiser", "Katten sover", "Katten leger", "Katten løber"], a: 1 },
      { q: "Vælg den rigtige: 'Jeg ___ mælk.'", opts: ["spiser", "drikker", "sover", "leger"], a: 1 },
    ],
  },
  {
    floor: 8, name: "Ord-Forstår", emoji: "🔍", grade: "2. klasse", desc: "Forstå ords betydning",
    questions: [
      { q: "Hvad er en 'KLO'?", opts: ["En fugl", "Et dyr der klatrer", "Et dyr der flyver", "En negl på et dyr"], a: 3 },
      { q: "Hvad betyder 'HURTIG'?", opts: ["Langsom", "Stor", "Stærk", "Hurtigt bevægende"], a: 3 },
      { q: "Modsat af 'STOR' er?", opts: ["Lang", "Lille", "Tyk", "Fed"], a: 1 },
      { q: "Hvad er et 'MAP'?", opts: ["En blomst", "En bog med kort", "En fugl", "Et hus"], a: 1 },
      { q: "Hvad betyder 'KOLD'?", opts: ["Varm", "Lav temperatur", "Vådelig", "Blød"], a: 1 },
      { q: "Modsat af 'NY' er?", opts: ["Gammel", "Lille", "Farverig", "Hård"], a: 0 },
    ],
  },
  {
    floor: 9, name: "Tekst-Trold", emoji: "📚", grade: "2.–3. klasse", desc: "Læseforståelse",
    questions: [
      { q: "'Peter har en hund. Hunden hedder Max.' Hvad hedder hunden?", opts: ["Peter", "Max", "Bob", "Rex"], a: 1 },
      { q: "'Det regnede. Maja tog en paraply.' Hvorfor tog hun paraplyen?", opts: ["Det var koldt", "Det regnede", "Det blæste", "Solen skinnede"], a: 1 },
      { q: "Hvad er en 'Forfatter'?", opts: ["En der tegner", "En der skriver bøger", "En der læser", "En der sælger bøger"], a: 1 },
      { q: "Hvad er et 'Kapitel' i en bog?", opts: ["En side", "Et afsnit/del af bogen", "Et billede", "Titlen"], a: 1 },
      { q: "'Hønen lagde et æg.' Hvem har lagt ægget?", opts: ["Hanen", "Fugleungen", "Hønen", "Ænderen"], a: 2 },
      { q: "Hvad er en 'Overskrift'?", opts: ["Det første ord", "Titlen på et afsnit", "Det laatste ord", "En illustration"], a: 1 },
    ],
  },
  {
    floor: 10, name: "Mester-Læser", emoji: "🏆", grade: "3. klasse", desc: "Avanceret læsning",
    questions: [
      { q: "Hvad er forskellen på fakta og fiktion?", opts: ["Ingen forskel", "Fakta er sandt, fiktion er opfundet", "Fiktion er sandt", "Fakta er opfundet"], a: 1 },
      { q: "Hvad er et 'Digt'?", opts: ["En kort historie", "En tekst med rim og rytme", "En tegneserie", "En avisartikel"], a: 1 },
      { q: "Hvad er et synonym for 'GLAD'?", opts: ["Trist", "Sur", "Lykkelig", "Bange"], a: 2 },
      { q: "Hvad er en 'Fabel'?", opts: ["En musikstykke", "En korthistorie med en moral", "Et digt", "En biografi"], a: 1 },
      { q: "Hvad er et 'Antonym' til 'STÆRK'?", opts: ["Stærkere", "Svag", "Stor", "Hård"], a: 1 },
      { q: "Hvad er en 'Biografi'?", opts: ["En opfunden historie", "En beretning om et rigtigt menneskes liv", "Et digt", "En tegneserie"], a: 1 },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// 🏛️  HISTORIE  (Historiens Ruiner)
// ─────────────────────────────────────────────────────────
const HISTORY_LEVELS: SubjectLevel[] = [
  {
    floor: 1, name: "Viking-Lærling", emoji: "⚔️", grade: "1.–2. klasse", desc: "Hvad ved du om vikingerne?",
    questions: [
      { q: "Hvad kaldtes vikingernes skibe?", opts: ["Galejer", "Langskibe", "Sejlskibe", "Kanoer"], a: 1 },
      { q: "Hvad var Odins krage?", opts: ["Ravn", "Due", "Ørn", "Falk"], a: 0 },
      { q: "Hvad kaldte vikingerne deres helte-himmeri?", opts: ["Olympen", "Valhalla", "Midgaard", "Asgaard"], a: 1 },
      { q: "Hvem var den vigtigste viking-gud?", opts: ["Tor", "Loke", "Odin", "Frej"], a: 2 },
      { q: "Hvad brugte vikingerne som penge?", opts: ["Mønter af guld + sølv", "Sten", "Dyr", "Korn"], a: 0 },
      { q: "Hvad er en 'Runesten'?", opts: ["En bold", "En sten med vikingeskrift", "Et vikingeskib", "Et sværd"], a: 1 },
    ],
  },
  {
    floor: 2, name: "Kongeriges-Kender", emoji: "👑", grade: "2. klasse", desc: "Kongerne i Danmark",
    questions: [
      { q: "Hvad hedder den nuværende danske kongefamilie?", opts: ["Windorferne", "Glücksborgerne", "Habsburgerne", "Romanowerne"], a: 1 },
      { q: "Hvem var Harald Blåtand?", opts: ["En viking-jarl", "En dansk kong", "En biskop", "En handelsmand"], a: 1 },
      { q: "Hvad var Harald Blåtands store bedrift?", opts: ["Han byggede Lego", "Han samlede Danmark og kristnede det", "Han opdagede Amerika", "Han byggede Kronborg"], a: 1 },
      { q: "Hvornår startede Danmarks kongerrige?", opts: ["År 500", "År 958", "År 1066", "År 1200"], a: 1 },
      { q: "Hvad er Kongesædet i Danmark?", opts: ["Amalienborg", "Christiansborg", "Rosenborg", "Frederiksborg"], a: 0 },
      { q: "Hvem er den daværende dronning (2024)?", opts: ["Margrethe II", "Mary", "Alexandrine", "Anne-Marie"], a: 0 },
    ],
  },
  {
    floor: 3, name: "Dannebrog-Drager", emoji: "🇩🇰", grade: "2. klasse", desc: "Om det danske flag og symboler",
    questions: [
      { q: "Hvad er det dansk flag kaldt?", opts: ["Dannevirke", "Dannebrog", "Danmarksflag", "Triflaget"], a: 1 },
      { q: "Hvilke farver har Dannebrog?", opts: ["Blå og hvid", "Rødt og hvidt", "Gult og rødt", "Grønt og hvidt"], a: 1 },
      { q: "Hvornår siges Dannebrog at have faldet fra himlen?", opts: ["1219", "1492", "1066", "1864"], a: 0 },
      { q: "Hvad er Danmarks nationalfugl?", opts: ["Ørnen", "Svanen", "Tranen", "Skaden"], a: 1 },
      { q: "Hvad er Nordens ældste flag?", opts: ["Norges Dannebrog", "Danmarks Dannebrog", "Sveriges kors", "Finlands flag"], a: 1 },
      { q: "Hvad er Danmarks nationaldag?", opts: ["5. Juni", "17. Maj", "4. Juli", "1. April"], a: 0 },
    ],
  },
  {
    floor: 4, name: "Middelalder-Mager", emoji: "🏰", grade: "2.–3. klasse", desc: "Middelalderens Danmark",
    questions: [
      { q: "Hvad er et 'Slot' i middelalderen?", opts: ["En kirke", "En befæstet bolig for adelen", "Et marked", "En skole"], a: 1 },
      { q: "Hvad hed de soldater der kæmpede til hest?", opts: ["Vogtere", "Riddere", "Bønder", "Handelsmænd"], a: 1 },
      { q: "Hvad er et 'Kloster'?", opts: ["Et marked", "Et sted munke/nonner boede", "En borg", "Et hospital"], a: 1 },
      { q: "Hvad er 'Pesten' også kaldet?", opts: ["Den Hvide Død", "Den Sorte Død", "Den Røde Pest", "Den Store Syge"], a: 1 },
      { q: "Hvad er et 'Gilde' i middelalderen?", opts: ["En fejring", "En sammenslutning af håndværkere", "En religion", "En orden af riddere"], a: 1 },
      { q: "Hvad brugte man i stedet for telefon i middelalderen?", opts: ["Brev sendt med bud", "Semaforer", "Trommer", "Ildsignaler"], a: 0 },
    ],
  },
  {
    floor: 5, name: "H.C. Andersen-Kender", emoji: "📖", grade: "2.–3. klasse", desc: "Hans Christian Andersen",
    questions: [
      { q: "Hvor er H.C. Andersen fra?", opts: ["København", "Aarhus", "Odense", "Ålborg"], a: 2 },
      { q: "Hvem skrev 'Den Lille Havfrue'?", opts: ["Brødrene Grimm", "H.C. Andersen", "Paul la Cour", "N.F.S. Grundtvig"], a: 1 },
      { q: "Hvornår var H.C. Andersen født?", opts: ["1750", "1805", "1865", "1900"], a: 1 },
      { q: "Hvad er H.C. Andersen berømt for?", opts: ["Eventyr og digte", "Malerier", "Musik", "Opfindelser"], a: 0 },
      { q: "Hvad hedder eventyret om en and der viser sig at være en svane?", opts: ["Tommelise", "Den Lille Havfrue", "Den grimme Ælling", "Snedronningen"], a: 2 },
      { q: "Hvad hedder H.C. Andersens berømte have i Odense?", opts: ["Botanisk have", "H.C. Andersens Have", "Eventyrparken", "Fyrtøjshaven"], a: 1 },
    ],
  },
  {
    floor: 6, name: "Opdagelses-Rejsende", emoji: "🗺️", grade: "3. klasse", desc: "Store opdagelser og opdagelsesrejsende",
    questions: [
      { q: "Hvem opdagede Amerika i 1492?", opts: ["Vasco da Gama", "Christoffer Columbus", "Leif Eriksson", "Ferdinand Magellan"], a: 1 },
      { q: "Hvem sejlede hele verden rundt første gang?", opts: ["Columbus", "Da Gama", "Magellan", "Drake"], a: 2 },
      { q: "Hvad søgte opdagelsesrejsende efter i Asien?", opts: ["Guld", "Krydderier og silke", "Slavet", "Land"], a: 1 },
      { q: "Hvornår opdagede Leif Eriksson Amerika?", opts: ["År 1000", "1492", "1066", "1776"], a: 0 },
      { q: "Hvad betyder 'opdagelsesrejsende'?", opts: ["En der opdager nye lande", "En søkaptajn", "En handelsrejsende", "En naturforsker"], a: 0 },
      { q: "Hvad er 'Silkevej'?", opts: ["En vej af silke", "En handelsrute fra Europa til Asien", "Et maleri", "En blomst"], a: 1 },
    ],
  },
  {
    floor: 7, name: "Verdenskrig-Forstår", emoji: "🕊️", grade: "3.–4. klasse", desc: "Verdenskrigene",
    questions: [
      { q: "Hvornår begyndte 1. Verdenskrig?", opts: ["1904", "1914", "1918", "1939"], a: 1 },
      { q: "Hvad er 'Fred'?", opts: ["Krig", "Ro og ingen krig", "Aftale", "Fejring"], a: 1 },
      { q: "Hvad er FN?", opts: ["En international organisation for fred", "Et land", "En bank", "En hær"], a: 0 },
      { q: "Hvornår var Danmark besat af Tyskland?", opts: ["1914-1918", "1939-1945", "1920-1930", "1945-1950"], a: 1 },
      { q: "Hvad er en 'flygtning'?", opts: ["En der flyver", "En der er flygtet fra sit hjemland", "En pilot", "En sportsmand"], a: 1 },
      { q: "Hvem var den britiske premierminister under 2. Verdenskrig?", opts: ["Hitler", "Churchill", "Roosevelt", "Stalin"], a: 1 },
    ],
  },
  {
    floor: 8, name: "Danmarks-Geograf", emoji: "🗾", grade: "3.–4. klasse", desc: "Danmarks geografi og nabolande",
    questions: [
      { q: "Hvad er Danmarks naboland mod syd?", opts: ["Sverige", "Norge", "Tyskland", "Holland"], a: 2 },
      { q: "Hvad er Danmarks hovedstad?", opts: ["Aarhus", "Odense", "København", "Aalborg"], a: 2 },
      { q: "Hvad er den skandinaviske halvø?", opts: ["Danmark+Norge", "Norge+Sverige", "Sverige+Finland", "Alle nordiske lande"], a: 1 },
      { q: "Hvad er Danmark omgivet af?", opts: ["Oceaner", "Hav og fjorde", "Bjerge", "Ørkener"], a: 1 },
      { q: "Hvad er Bornholm?", opts: ["En by", "En dansk ø i Østersøen", "Et bjerg", "En halvø"], a: 1 },
      { q: "Hvad er Grønland?", opts: ["En dansk provins", "Et autonomt territorium under Danmark", "Et selvstændigt land", "En norsk ø"], a: 1 },
    ],
  },
  {
    floor: 9, name: "Nutids-Kender", emoji: "🌍", grade: "4.–5. klasse", desc: "Det moderne Danmark",
    questions: [
      { q: "Hvornår fik kvinder i Danmark stemmeret?", opts: ["1913", "1915", "1920", "1945"], a: 1 },
      { q: "Hvad er et 'demokrati'?", opts: ["Ét menneskes styre", "Folkets styre via valg", "Militærsstyre", "Kirkens styre"], a: 1 },
      { q: "Hvad er Europæisk Union?", opts: ["En militæralliance", "Et europæisk samarbejde", "Et land", "En verdensbank"], a: 1 },
      { q: "Hvad er det danske parlament kaldt?", opts: ["Rigsdagen", "Stortinget", "Folketing", "Bundesdag"], a: 2 },
      { q: "Hvornår er Danmarks nationaldag?", opts: ["5. juni", "1. januar", "17. maj", "4. juli"], a: 0 },
      { q: "Hvad er Danmarks valuta?", opts: ["Euro", "Krone", "Franc", "Pound"], a: 1 },
    ],
  },
  {
    floor: 10, name: "Verdens-Vismand", emoji: "🏆", grade: "5. klasse", desc: "Verdenshistorie – store begivenheder",
    questions: [
      { q: "Hvornår faldt Berlinmuren?", opts: ["1979", "1989", "1991", "1999"], a: 1 },
      { q: "Hvem var den første mand på månen?", opts: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn"], a: 2 },
      { q: "Hvornår landede Neil Armstrong på månen?", opts: ["1963", "1969", "1972", "1975"], a: 1 },
      { q: "Hvem var Nelson Mandela?", opts: ["En britisk statsminister", "En sydafrikansk frihedskæmper og præsident", "En amerikansk præsident", "En FN-leder"], a: 1 },
      { q: "Hvad er 'Kolonialisme'?", opts: ["En slags landbrug", "Et land styrer et andet land", "Et handelsnetværk", "En religion"], a: 1 },
      { q: "Hvornår begyndte Internettet at blive brugt af alle?", opts: ["1970erne", "1980erne", "1990erne", "2000erne"], a: 2 },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// ⚡  FYSIK  (Fysikkens Fyr)
// ─────────────────────────────────────────────────────────
const PHYSICS_LEVELS: SubjectLevel[] = [
  {
    floor: 1, name: "Tyngde-Testpilot", emoji: "🍎", grade: "1. klasse", desc: "Tyngdekraft og fald",
    questions: [
      { q: "Hvad sker der når du slipper et æble?", opts: ["Det flyver op", "Det falder ned", "Det svæver", "Det smelter"], a: 1 },
      { q: "Hvad trækker ting ned mod jorden?", opts: ["Sol", "Måne", "Tyngdekraft", "Vind"], a: 2 },
      { q: "Hvad falder hurtigst? En fjeder eller en sten?", opts: ["Fjeder", "Sten", "De falder ens", "Ingen falder"], a: 2 },
      { q: "Hvad hedder den kraft der holder os på Jordens overflade?", opts: ["Magnetkraft", "Tyngdekraft", "Vindkraft", "Vandkraft"], a: 1 },
      { q: "Kan tyngdekraft ses direkte?", opts: ["Ja", "Nej, kun dens virkning", "Kun i mørke", "Kun udendørs"], a: 1 },
      { q: "Hvad er lidt tyngdekraft på Månen sammenlignet med Jordens?", opts: ["Dobbelt så stor", "Den samme", "Ca. 6 gange svagere", "Ingen tyngdekraft"], a: 2 },
    ],
  },
  {
    floor: 2, name: "Lys-Leger", emoji: "💡", grade: "1.–2. klasse", desc: "Lys og farver",
    questions: [
      { q: "Hvad er lysets farver i en regnbue?", opts: ["Rød/grøn/blå", "Rød/orange/gul/grøn/blå/indigo/violet", "Sort og hvid", "Kun varme farver"], a: 1 },
      { q: "Hvad sker der med lys, når det rammer et spejl?", opts: ["Det forsvinder", "Det reflekteres", "Det bryder", "Det absorberes"], a: 1 },
      { q: "Hvad er skygge?", opts: ["Lys der reflekterer", "Stedet bag et objekt der blokerer lys", "En farve", "En anden type lys"], a: 1 },
      { q: "Hvad bevæger sig hurtigst?", opts: ["Lyd", "Bil", "Lys", "Flyvemaskine"], a: 2 },
      { q: "Hvad er prisme?", opts: ["En bold", "Et glasstykke der deler lys i farver", "En lygte", "En laser"], a: 1 },
      { q: "Kan du se farver i mørke?", opts: ["Ja, altid", "Nej, vi behøver lys", "Kun røde farver", "Kun grønne farver"], a: 1 },
    ],
  },
  {
    floor: 3, name: "Magnet-Mester", emoji: "🧲", grade: "2. klasse", desc: "Magnetisme",
    questions: [
      { q: "Hvad tiltrækker en magnet?", opts: ["Alt metal", "Kun jern, nikkel og kobolt", "Kun guld", "Plastik"], a: 1 },
      { q: "Hvad har en magnet?", opts: ["To sider", "To poler (Nord og Syd)", "Fire poler", "En pol"], a: 1 },
      { q: "Hvad sker der når to magneter har samme pol mod hinanden?", opts: ["De tiltrækker", "De frastøder", "Intet sker", "De smelter"], a: 1 },
      { q: "Hvad er jordens magnetfelt?", opts: ["En magnetisk kraft rundt om Jorden", "En elektrisk felt", "Tyngdekraften", "En bølge"], a: 0 },
      { q: "Hvad bruger en kompas til at vise retning?", opts: ["Solen", "Stjernerne", "Jordens magnetfelt", "Tyngdekraften"], a: 2 },
      { q: "Er et gummiviskelæder magnetisk?", opts: ["Ja", "Nej", "Kun i kulde", "Kun når det er tørt"], a: 1 },
    ],
  },
  {
    floor: 4, name: "Elektro-Eventyr", emoji: "⚡", grade: "2.–3. klasse", desc: "Elektricitet og strøm",
    questions: [
      { q: "Hvad er elektricitet?", opts: ["En type varme", "Strøm af elektroner", "En gas", "Lys direkte"], a: 1 },
      { q: "Hvad er en 'kredsløb' i elektricitet?", opts: ["En lukket vej for strøm", "En åben ledning", "En batteri", "Et stik"], a: 0 },
      { q: "Hvad sker der med strøm i et åbent kredsløb?", opts: ["Strøm flyder dobbelt", "Strøm flyder ikke", "Strøm springer over", "Ingenting"], a: 1 },
      { q: "Hvad er en 'isolator' i elektricitet?", opts: ["Et materiale der leder strøm godt", "Et materiale der ikke leder strøm", "En energikilde", "Et måleinstrument"], a: 1 },
      { q: "Hvad er god leder for elektricitet?", opts: ["Gummi", "Plast", "Kobber", "Træ"], a: 2 },
      { q: "Hvad er faretegnet for elektricitet?", opts: ["⚠️ Et kors", "⚡ Lyn-symbol", "🚫 Forbudsskilt", "🔴 Rød cirkel"], a: 1 },
    ],
  },
  {
    floor: 5, name: "Lyd-Lærling", emoji: "🔊", grade: "2.–3. klasse", desc: "Lyd og bølger",
    questions: [
      { q: "Hvad er lyd?", opts: ["Lys der danser", "Vibrationer der bevæger sig", "En gas", "En kraftform"], a: 1 },
      { q: "Kan lyd bevæge sig i vakuum?", opts: ["Ja", "Nej", "Kun ved høj frekvens", "Kun om natten"], a: 1 },
      { q: "Hvad er ekko?", opts: ["Et nyt lyd", "Reflekteret lyd", "Ekstra stærkt lyd", "En slags musik"], a: 1 },
      { q: "Hvad er Hz (hertz)?", opts: ["Enhed for lyd-hastighed", "Enhed for frekvens (svingninger per sekund)", "Enhed for lydstyrke", "Enhed for afstand"], a: 1 },
      { q: "Hvad bevæger lyd hurtigst i?", opts: ["Luft", "Vand", "Faste stoffer (metal)", "Vakuum"], a: 2 },
      { q: "Hvad er ultralyd?", opts: ["Meget stærk lyd", "Lyd over menneskers høreevne", "Lyd under vand", "Elektrisk lyd"], a: 1 },
    ],
  },
  {
    floor: 6, name: "Varme-Vogter", emoji: "🌡️", grade: "3. klasse", desc: "Varme og temperatur",
    questions: [
      { q: "Hvad er temperatur en måling af?", opts: ["Tyngde", "Varme eller kulde (molekylernes bevægelse)", "Fugtighed", "Lufttryk"], a: 1 },
      { q: "Hvad er frysepunktet for vand i Celsius?", opts: ["100°C", "0°C", "-100°C", "37°C"], a: 1 },
      { q: "Hvad er kogepunktet for vand i Celsius?", opts: ["50°C", "75°C", "100°C", "200°C"], a: 2 },
      { q: "Hvad er varmeledning?", opts: ["Varme der bevæger sig via lys", "Varme der overføres via direkte kontakt", "Varme der bevæger sig via luft", "Stråling"], a: 1 },
      { q: "Hvad er absolut nulpunkt i Kelvin?", opts: ["0 K", "-100 K", "273 K", "-273 K"], a: 0 },
      { q: "Hvad sker der med de fleste stoffer ved opvarmning?", opts: ["De trækker sig sammen", "De udvider sig", "De smelter straks", "Ingenting"], a: 1 },
    ],
  },
  {
    floor: 7, name: "Vand-Videnskabsmand", emoji: "💧", grade: "3. klasse", desc: "Vandets former og kredsløb",
    questions: [
      { q: "Hvad er de tre tilstande for vand?", opts: ["Flydende/gas/plast", "Fast/flydende/gas", "Varm/kold/normal", "Blød/hård/mellemblød"], a: 1 },
      { q: "Hvad hedder det, at vand fordamper til skyer?", opts: ["Kondensation", "Fordampning (evaporation)", "Sublimation", "Smeltning"], a: 1 },
      { q: "Hvad hedder det, at vanddamp bliver til vanddråber?", opts: ["Fordampning", "Frysning", "Kondensation", "Nedbør"], a: 2 },
      { q: "Hvad dækker ca. 70% af Jordens overflade?", opts: ["Land", "Ørken", "Vand", "Is"], a: 2 },
      { q: "Hvad hedder det vand der er under Jordens overflade?", opts: ["Undervandsvand", "Grundvand", "Havvand", "Regnvand"], a: 1 },
      { q: "Hvad er et gletsjer?", opts: ["En flod", "En kæmpe bevægende masse af is", "En sø", "Et vandfald"], a: 1 },
    ],
  },
  {
    floor: 8, name: "Vejr-Vidner", emoji: "🌤️", grade: "3.–4. klasse", desc: "Vejr og atmosfære",
    questions: [
      { q: "Hvad er Jordens atmosfære?", opts: ["Vand rundt om Jordens", "En tynd luftkappe rundt om Jordens overfladen", "Jordskorpen", "Havet"], a: 1 },
      { q: "Hvad forårsager vind?", opts: ["Regn", "Temperaturforskelle i luften", "Magnetkraft", "Tyngdekraft"], a: 1 },
      { q: "Hvad er et 'Barometre'?", opts: ["Termometer", "Måler luftfugtighed", "Måler lufttryk", "Måler vind"], a: 2 },
      { q: "Hvad er drivhuseffekten?", opts: ["En effekt af at vokse planter", "Opvarmning af Jordens pga. gasser der holder varme", "En vejrfænomen med regn", "En type sol-stråling"], a: 1 },
      { q: "Hvad er den vigtigste drivhusgas?", opts: ["Ilt", "Kvælstof", "Kuldioxid (CO₂)", "Helium"], a: 2 },
      { q: "Hvad er et orkan?", opts: ["En let brise", "En kraftig tropisk storm", "En tordenbyge", "En type nedbør"], a: 1 },
    ],
  },
  {
    floor: 9, name: "Stjerne-Spejder", emoji: "🌟", grade: "4. klasse", desc: "Solsystemet og rummet",
    questions: [
      { q: "Hvad er den nærmeste stjerne til Jorden (undtagen Solen)?", opts: ["Sirius", "Proxima Centauri", "Betelgeuse", "Polstjernen"], a: 1 },
      { q: "Hvad er et 'Asteroide'?", opts: ["En lille stjerne", "En klippeket i rummet", "En planet uden atmosfære", "En månekrater"], a: 1 },
      { q: "Hvad er den største planet i solsystemet?", opts: ["Saturnus", "Venus", "Jupiter", "Uranus"], a: 2 },
      { q: "Hvornår gik den første mand på Månen?", opts: ["1959", "1965", "1969", "1972"], a: 2 },
      { q: "Hvad er et 'Lysår'?", opts: ["Tidsrum lys bruger på et år", "Energienhod for lys", "Afstand lys tilbagelægger på et år", "En stjerne-størrelse"], a: 2 },
      { q: "Hvad er den korrekte rækkefølge fra Solen? (2 første)", opts: ["Merkur-Venus-Jorden", "Venus-Merkur-Jorden", "Jorden-Venus-Merkur", "Merkur-Jorden-Venus"], a: 0 },
    ],
  },
  {
    floor: 10, name: "Energi-Ekspert", emoji: "🏆", grade: "4.–5. klasse", desc: "Energi og dens former",
    questions: [
      { q: "Hvad er energi?", opts: ["Noget der kan se", "Evnen til at udføre arbejde", "En type gas", "En kraftform"], a: 1 },
      { q: "Hvad er vedvarende energikilder?", opts: ["Kul og olie", "Sol, vind og vand", "Naturgas", "Atomkraft"], a: 1 },
      { q: "Hvad er kinetisk energi?", opts: ["Energi lagret i et objekt", "Bevægelsesenergy", "Kemisk energi", "Elektrisk energi"], a: 1 },
      { q: "Hvad er potentiel energi?", opts: ["Bevægelsesenergy", "Varmeenergy", "Lagret energi p.g.a. position", "Lydenergi"], a: 2 },
      { q: "Hvad er den første lov om termodynamik?", opts: ["Energi kan skabes", "Energi kan hverken skabes eller ødelægges", "Varme flyder fra kold til varm", "Energi er konstant"], a: 1 },
      { q: "Hvad er solpaneler?", opts: ["Paneler der opsamler vind", "Paneler der omdanner sollys til elektricitet", "Paneler der opsamler regn", "Varmeplader"], a: 1 },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// 🌿  BIOLOGI  (Biologiens Skov)
// ─────────────────────────────────────────────────────────
const BIOLOGY_LEVELS: SubjectLevel[] = [
  {
    floor: 1, name: "Kæledyrs-Kender", emoji: "🐾", grade: "1. klasse", desc: "Lær om kæledyr",
    questions: [
      { q: "Hvad er det mest populære kæledyr i Danmark?", opts: ["Hamster", "Kanin", "Hund", "Fugl"], a: 2 },
      { q: "Hvad spiser en kat?", opts: ["Kun gulerod", "Kød og fisk", "Kun slik", "Kun brød"], a: 1 },
      { q: "Hvad er en 'puppe'?", opts: ["En hvalp", "Et ungt stadium af en sommerfugl", "En lille kat", "Et insektæg"], a: 1 },
      { q: "Hvad er forskellen på hund og kat?", opts: ["Ingen forskel", "Hunden er trofast og gøer, katten er selvstændig og mjaver", "Katten er større", "Hunden klatrer i træer"], a: 1 },
      { q: "Hvad siger en hund?", opts: ["Mjav", "Kvik-kvik", "Vov-vov", "Brøl"], a: 2 },
      { q: "Hvad er en 'veterinær'?", opts: ["En dyrehandler", "En dyrelæge", "En dyreopdrætter", "En dyrefotograf"], a: 1 },
    ],
  },
  {
    floor: 2, name: "Skovdyr-Spejder", emoji: "🦊", grade: "1.–2. klasse", desc: "Dyr i den danske skov",
    questions: [
      { q: "Hvad spiser en ræv?", opts: ["Kun bær", "Kød, æg, frugt (altspisende)", "Kun mus", "Kun græs"], a: 1 },
      { q: "Hvad er en 'Grævling'?", opts: ["En trækfugl", "Et pattedyr med sorte og hvide striber", "En type hjort", "Et insekt"], a: 1 },
      { q: "Hvad er 'Pindsvinets' forsvar?", opts: ["Gift", "Stikkelshår (pigge)", "At løbe hurtigt", "At skyde blæk"], a: 1 },
      { q: "Hvad spiser en egern?", opts: ["Kød", "Nødder og frø", "Svampe og kun det", "Blade og bær"], a: 1 },
      { q: "Hvad er en Rådyr?", opts: ["Et stort hjortedyr", "Et lille dansk hjortedyr", "En skovfugl", "En skovlus"], a: 1 },
      { q: "Hvornår går bjørne i 'hi'?", opts: ["Om foråret", "Om sommeren", "Om efteråret", "Om vinteren"], a: 3 },
    ],
  },
  {
    floor: 3, name: "Havdyr-Helt", emoji: "🐟", grade: "2. klasse", desc: "Dyr i havet",
    questions: [
      { q: "Hvad er den største fisk i havet?", opts: ["Stor hvide haj", "Hvalhai", "Blåhval", "Sværdfisk"], a: 1 },
      { q: "Er en hval en fisk eller et pattedyr?", opts: ["En fisk", "Et pattedyr", "Et reptil", "Et insekt"], a: 1 },
      { q: "Hvad er et 'Koralrev'?", opts: ["En undervands-by", "En undervands-struktur bygget af koraldyr", "En fiskearm", "Et hav-bjerg"], a: 1 },
      { q: "Hvad spiser en sæl?", opts: ["Tang", "Fisk og blæksprutter", "Krabber og tang", "Plankton"], a: 1 },
      { q: "Hvad er en 'Blæksprutte'?", opts: ["En fisk", "Et bløddyr med mange arme", "En albue", "Et havpattedyr"], a: 1 },
      { q: "Hvad er det unikke ved en Søhest?", opts: ["Den er hurtigst i havet", "Hannen bærer ungerne", "Den kan flyve", "Den sover stående"], a: 1 },
    ],
  },
  {
    floor: 4, name: "Plante-Pioner", emoji: "🌱", grade: "2. klasse", desc: "Planter og blomster",
    questions: [
      { q: "Hvad er 'Fotosyntese'?", opts: ["Dyr der spiser planter", "Planter laver mad af sollys og CO₂", "Planter drikker vand", "En blomst åbner sig"], a: 1 },
      { q: "Hvad er den grønne farve i planter kaldet?", opts: ["Kromosom", "Klorofyl", "Karotener", "Antocyaner"], a: 1 },
      { q: "Hvad bruger planter til at lave mad?", opts: ["Vand + Jord", "Sollys + CO₂ + Vand", "Luft + Jord", "Regn + Salt"], a: 1 },
      { q: "Hvad er pollen?", opts: ["Et frø", "Støv fra blomster brugt til befrugtning", "En planterod", "Et plantepigment"], a: 1 },
      { q: "Hvad er 'Frøplante'?", opts: ["En plante der formeres via sporer", "En plante der formeres via frø", "En vandplante", "En kaktus"], a: 1 },
      { q: "Hvad er den primære funktion af blomsters farver?", opts: ["At se smukke ud", "At tiltrække bestøvere (bier, sommerfugle)", "At beskytte mod sol", "At skræmme fjender"], a: 1 },
    ],
  },
  {
    floor: 5, name: "Krop-Kender", emoji: "🫀", grade: "2.–3. klasse", desc: "Menneskekroppens store organer",
    questions: [
      { q: "Hvad er hjertets funktion?", opts: ["Tænke", "Pumpe blod rundt i kroppen", "Fordøje mad", "Trække vejret"], a: 1 },
      { q: "Hvad er lungens funktion?", opts: ["Pumpe blod", "Optage ilt og afgive CO₂", "Fordøje mad", "Filtrere blod"], a: 1 },
      { q: "Hvad er hjernens funktion?", opts: ["At pumpe blod", "Styre kroppen og tanker/følelser", "Fordøje mad", "Producere enzymer"], a: 1 },
      { q: "Hvad er leveren funktion?", opts: ["Pumpe blod", "Trække vejret", "Filtrere blod og producere galde", "Sende nerver"], a: 2 },
      { q: "Hvad er nyrernes funktion?", opts: ["Producere blod", "Filtrere affaldsstoffer fra blodet til urin", "Optage ilt", "Fordøje mad"], a: 1 },
      { q: "Hvad er mave-tarm-kanalen?", opts: ["Blodårerne", "Systemet der fordøjer mad", "Nervesystemet", "Åndedrætssystemet"], a: 1 },
    ],
  },
  {
    floor: 6, name: "Sans-Specialist", emoji: "👁️", grade: "3. klasse", desc: "De fem sanser",
    questions: [
      { q: "Hvad er de fem sanser?", opts: ["Se/Høre/Lugte/Smage/Føle", "Se/Høre/Tænke/Smage/Mærke", "Se/Høre/Lugte/Elske/Føle", "Se/Høre/Lugte/Smage/Drømme"], a: 0 },
      { q: "Hvilken sans bruger vi ørerne til?", opts: ["Lugte", "Smage", "Høre", "Se"], a: 2 },
      { q: "Hvad er 'Pupillen'?", opts: ["En del af øret", "Det mørke hul midt i øjet", "En nerve", "En del af næsen"], a: 1 },
      { q: "Hvad er smagsløg?", opts: ["En del af næsen", "Celler på tungen der registrerer smag", "En kirtel i halsen", "En del af øjet"], a: 1 },
      { q: "Hvad er de fire grundsmage?", opts: ["Sødt/Salt/Surt/Bitter", "Sødt/Surt/Stærkt/Mildt", "Sødt/Salt/Surt/Krydret", "Sødt/Salt/Fedtet/Bitter"], a: 0 },
      { q: "Hvad er den femte grundsmag der for nyligt blev opdaget?", opts: ["Spicy", "Kokumi", "Umami", "Frisk"], a: 2 },
    ],
  },
  {
    floor: 7, name: "Sund-Styrke", emoji: "🍎", grade: "3. klasse", desc: "Sund kost og motion",
    questions: [
      { q: "Hvad er de vigtigste næringsstoffer?", opts: ["Sukker/Fedt/Salt", "Protein/Kulhydrat/Fedt/Vitaminer/Mineraler", "Kalorier/Fiber/Vand", "Vitaminer/Salt/Sukker"], a: 1 },
      { q: "Hvad er 'Protein' godt for?", opts: ["Hurtig energi", "Bygge og reparere muskler og væv", "Holde varmen", "Fordøjelse"], a: 1 },
      { q: "Hvad er 'Fiber' godt for?", opts: ["Muskelbyggeri", "Fordøjelsen og tarmens bakterier", "Syn", "Immunforsvaret"], a: 1 },
      { q: "Hvad sker der i kroppen under motion?", opts: ["Hjertet slår langsommere", "Hjertet slår hurtigere, muskler bruger energi", "Man mister vitaminer", "Kropstemperaturen falder"], a: 1 },
      { q: "Hvad er et vitamin?", opts: ["Et hormon", "Et næringsstof kroppen behøver i små mængder", "En type protein", "En fedtsyre"], a: 1 },
      { q: "Hvad giver kroppen hurtig energi?", opts: ["Fedt", "Kulhydrater (sukker/stivelse)", "Protein", "Vand"], a: 1 },
    ],
  },
  {
    floor: 8, name: "Årstids-Forsker", emoji: "🍂", grade: "3.–4. klasse", desc: "Årstider og naturens cyklus",
    questions: [
      { q: "Hvad er det der skaber årstiderne?", opts: ["Jordens afstand til Solen", "Jordens hældning under revolution om Solen", "Månefaserne", "Vind fra polerne"], a: 1 },
      { q: "Hvad er 'Hibernering' (dvale)?", opts: ["Dyrenes årlige migration", "En lang søvn over vinteren for at spare energi", "Dyrenes parringssæson", "Et dyr der skifter farve"], a: 1 },
      { q: "Hvad er 'Migration' for fugle?", opts: ["De skifter fjer", "De flyver til varmere steder om vinteren", "De laver rede om foråret", "De synger om morgenen"], a: 1 },
      { q: "Hvad sker med blade om efteråret?", opts: ["De vokser ekstra", "De skifter farve og falder af", "De producerer mere klorofyl", "De bliver mørkere"], a: 1 },
      { q: "Hvad er 'Blomstringens årstid' i Danmark?", opts: ["Vinter", "Efterår", "Forår/Sommer", "Kun sommer"], a: 2 },
      { q: "Hvad er 'Kuldepunktet' (minimum) for at der kan sne?", opts: ["0°C eller derunder", "Altid under -10°C", "Under -5°C", "Under 5°C"], a: 0 },
    ],
  },
  {
    floor: 9, name: "Insekt-Inspektør", emoji: "🐛", grade: "4. klasse", desc: "Insekternes verden",
    questions: [
      { q: "Hvad kendetegner et insekt?", opts: ["6 ben og 3 kropsele", "8 ben og 2 kropsele", "4 ben og 4 kropsele", "6 ben og 2 kropsele"], a: 0 },
      { q: "Hvad er metamorfose for en sommerfugl?", opts: ["En slags dans", "Forandring: æg→larve→puppe→sommerfugl", "Vækst uden forandring", "En fugleart"], a: 1 },
      { q: "Hvad er biers vigtigste rolle i naturen?", opts: ["At lave honning", "Bestøvning af blomster og planter", "Dræbe skadedyr", "At fodre fugle"], a: 1 },
      { q: "Hvad er en 'Larve'?", opts: ["Et insektæg", "Den unge (uudviklede) form af et insekt", "En stor bille", "Et edderkop"], a: 1 },
      { q: "Hvad er forskellen på insekter og edderkopper?", opts: ["Ingen forskel", "Edderkopper har 8 ben; insekter 6 ben", "Insekter har 8 ben; edderkopper 6 ben", "Begge har 6 ben"], a: 1 },
      { q: "Hvad er en 'Myre-koloni'?", opts: ["En enkelt myre", "Et organiseret samfund af myrer", "Et myreæg", "En dronning-myre"], a: 1 },
    ],
  },
  {
    floor: 10, name: "Fødekæde-Filosof", emoji: "🏆", grade: "4.–5. klasse", desc: "Fødekæder og økosystemer",
    questions: [
      { q: "Hvad er en 'Fødekæde'?", opts: ["En mad-opskrift", "En rækkefølge der viser hvem der spiser hvem", "En butikskæde", "En type diæt"], a: 1 },
      { q: "Hvad er en 'Producent' i en fødekæde?", opts: ["Et dyr der jager", "En plante der laver mad via fotosyntese", "Et ådselsæder", "Et kødædende dyr"], a: 1 },
      { q: "Hvad er en 'Toprovdyr'?", opts: ["Det første led i fødekæden", "Det dyr der ikke selv spises af andre", "Den mindste organisme", "En planteæder"], a: 1 },
      { q: "Hvad er et 'Økosystem'?", opts: ["Et laboratorium", "Alle levende organismer og miljøet i et område", "Kun planter i et område", "Kun dyr i et område"], a: 1 },
      { q: "Hvad er 'Biodiversitet'?", opts: ["Antallet af planter", "Mangfoldighed af levende organismer i et område", "Antallet af dyr", "Mængden af vand"], a: 1 },
      { q: "Hvad er 'Nedbryderens' rolle?", opts: ["Jage andre dyr", "Nedbryde dødt organisk materiale til næringsstoffer", "Skaffe vand", "Producere ilt"], a: 1 },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// 🌍  SPROG  (Sprogenes Portal — Engelsk)
// ─────────────────────────────────────────────────────────
const LANGUAGE_LEVELS: SubjectLevel[] = [
  {
    floor: 1, name: "Farve-Finder", emoji: "🌈", grade: "1. klasse", desc: "Farver på engelsk",
    questions: [
      { q: "Hvad er 'RØD' på engelsk?", opts: ["Blue", "Green", "Red", "Yellow"], a: 2 },
      { q: "Hvad er 'BLÅ' på engelsk?", opts: ["Red", "Blue", "Green", "Purple"], a: 1 },
      { q: "Hvad er 'GRØN' på engelsk?", opts: ["Yellow", "Orange", "Green", "Brown"], a: 2 },
      { q: "Hvad er 'GUL' på engelsk?", opts: ["White", "Yellow", "Black", "Pink"], a: 1 },
      { q: "Hvad er 'HVID' på engelsk?", opts: ["Black", "Gray", "White", "Silver"], a: 2 },
      { q: "Hvad er 'SORT' på engelsk?", opts: ["Black", "Green", "Blue", "Brown"], a: 0 },
    ],
  },
  {
    floor: 2, name: "Tal-Trold", emoji: "🔢", grade: "1. klasse", desc: "Tal på engelsk",
    questions: [
      { q: "Hvad er 'EN' på engelsk?", opts: ["Two", "Zero", "One", "Three"], a: 2 },
      { q: "Hvad er 'TO' på engelsk?", opts: ["One", "Three", "Four", "Two"], a: 3 },
      { q: "Hvad er 'FEM' på engelsk?", opts: ["Four", "Five", "Six", "Seven"], a: 1 },
      { q: "Hvad er 'TI' på engelsk?", opts: ["Eight", "Nine", "Ten", "Seven"], a: 2 },
      { q: "Hvad er 'NUL' på engelsk?", opts: ["One", "Zero", "None", "Nil"], a: 1 },
      { q: "Hvad er 'HUNDREDE' på engelsk?", opts: ["Thousand", "Million", "Hundred", "Ninety"], a: 2 },
    ],
  },
  {
    floor: 3, name: "Dyre-Detektiv", emoji: "🦁", grade: "1.–2. klasse", desc: "Dyrenavne på engelsk",
    questions: [
      { q: "Hvad er 'HUND' på engelsk?", opts: ["Cat", "Dog", "Horse", "Bird"], a: 1 },
      { q: "Hvad er 'KAT' på engelsk?", opts: ["Dog", "Rabbit", "Cat", "Fish"], a: 2 },
      { q: "Hvad er 'HEST' på engelsk?", opts: ["Cow", "Pig", "Sheep", "Horse"], a: 3 },
      { q: "Hvad er 'FUGL' på engelsk?", opts: ["Fish", "Bird", "Frog", "Bee"], a: 1 },
      { q: "Hvad er 'LØVe' på engelsk?", opts: ["Tiger", "Bear", "Lion", "Wolf"], a: 2 },
      { q: "Hvad er 'ELEFANT' på engelsk?", opts: ["Elephant", "Giraffe", "Hippo", "Rhino"], a: 0 },
    ],
  },
  {
    floor: 4, name: "Familie-Forsker", emoji: "👨‍👩‍👧", grade: "1.–2. klasse", desc: "Familieord på engelsk",
    questions: [
      { q: "Hvad er 'MOR' på engelsk?", opts: ["Father", "Sister", "Mother", "Brother"], a: 2 },
      { q: "Hvad er 'FAR' på engelsk?", opts: ["Mother", "Father", "Uncle", "Cousin"], a: 1 },
      { q: "Hvad er 'SØSTER' på engelsk?", opts: ["Brother", "Daughter", "Sister", "Aunt"], a: 2 },
      { q: "Hvad er 'BROR' på engelsk?", opts: ["Father", "Cousin", "Son", "Brother"], a: 3 },
      { q: "Hvad er 'BEDSTEMOR' på engelsk?", opts: ["Grandmother", "Aunt", "Mother", "Granddaughter"], a: 0 },
      { q: "Hvad er 'ONKEL' på engelsk?", opts: ["Nephew", "Cousin", "Uncle", "Brother"], a: 2 },
    ],
  },
  {
    floor: 5, name: "Mad-Mester", emoji: "🍕", grade: "2. klasse", desc: "Mad og drikke på engelsk",
    questions: [
      { q: "Hvad er 'ÆBLE' på engelsk?", opts: ["Orange", "Banana", "Apple", "Pear"], a: 2 },
      { q: "Hvad er 'VAND' på engelsk?", opts: ["Juice", "Milk", "Tea", "Water"], a: 3 },
      { q: "Hvad er 'BRØD' på engelsk?", opts: ["Cake", "Bread", "Rice", "Pasta"], a: 1 },
      { q: "Hvad er 'MÆLK' på engelsk?", opts: ["Water", "Juice", "Milk", "Coffee"], a: 2 },
      { q: "Hvad er 'PIZZA' på engelsk?", opts: ["Burger", "Sushi", "Pizza", "Salad"], a: 2 },
      { q: "Hvad er 'CHOKOLADE' på engelsk?", opts: ["Candy", "Chocolate", "Cookie", "Jam"], a: 1 },
    ],
  },
  {
    floor: 6, name: "Krop-Kongen", emoji: "🧍", grade: "2. klasse", desc: "Kroppen på engelsk",
    questions: [
      { q: "Hvad er 'HOVED' på engelsk?", opts: ["Hand", "Foot", "Head", "Eye"], a: 2 },
      { q: "Hvad er 'HÅND' på engelsk?", opts: ["Arm", "Hand", "Finger", "Fist"], a: 1 },
      { q: "Hvad er 'ØJE' på engelsk?", opts: ["Ear", "Nose", "Eye", "Mouth"], a: 2 },
      { q: "Hvad er 'NÆse' på engelsk?", opts: ["Lip", "Chin", "Cheek", "Nose"], a: 3 },
      { q: "Hvad er 'BEN' ('benben') på engelsk?", opts: ["Arm", "Knee", "Leg", "Hip"], a: 2 },
      { q: "Hvad er 'TAND' på engelsk?", opts: ["Tongue", "Lip", "Tooth", "Gum"], a: 2 },
    ],
  },
  {
    floor: 7, name: "Hilse-Helt", emoji: "👋", grade: "2.–3. klasse", desc: "Hilsner og høflighed på engelsk",
    questions: [
      { q: "Hvad betyder 'Hello'?", opts: ["Farvel", "Hej", "Tak", "Undskyld"], a: 1 },
      { q: "Hvad betyder 'Goodbye'?", opts: ["Hej", "Tak", "Farvel", "Undskyld"], a: 2 },
      { q: "Hvad betyder 'Thank you'?", opts: ["Hej", "Farvel", "Vær so god", "Tak"], a: 3 },
      { q: "Hvad betyder 'Please'?", opts: ["Tak", "Vær so god / Må jeg bede", "Undskyld", "Selvfølgelig"], a: 1 },
      { q: "Hvad betyder 'Sorry'?", opts: ["Tak", "Hej", "Undskyld", "Farvel"], a: 2 },
      { q: "Hvad betyder 'Good morning'?", opts: ["Godnat", "God aften", "God morgen", "God dag"], a: 2 },
    ],
  },
  {
    floor: 8, name: "Vejr-Viden", emoji: "🌦️", grade: "3. klasse", desc: "Vejrord på engelsk",
    questions: [
      { q: "Hvad betyder 'Sunny'?", opts: ["Regnfuld", "Solrig", "Overskyet", "Stormfuld"], a: 1 },
      { q: "Hvad betyder 'Rainy'?", opts: ["Snerig", "Tåget", "Regnfuld", "Blæsende"], a: 2 },
      { q: "Hvad betyder 'Cloudy'?", opts: ["Solrig", "Overskyet", "Regnfuld", "Kold"], a: 1 },
      { q: "Hvad betyder 'Windy'?", opts: ["Varm", "Kold", "Regnfuld", "Blæsende"], a: 3 },
      { q: "Hvad betyder 'Snowy'?", opts: ["Regnfuld", "Tåget", "Haglrig", "Snerig"], a: 3 },
      { q: "Hvad betyder 'Hot'?", opts: ["Kold", "Lun", "Varm/Hed", "Kølig"], a: 2 },
    ],
  },
  {
    floor: 9, name: "Sætnings-Surfer", emoji: "💬", grade: "3.–4. klasse", desc: "Enkle engelske sætninger",
    questions: [
      { q: "Hvad betyder 'I am happy'?", opts: ["Jeg er trist", "Jeg er sulten", "Jeg er glad", "Jeg er træt"], a: 2 },
      { q: "Hvad betyder 'How old are you?'", opts: ["Hvad hedder du?", "Hvor bor du?", "Hvad laver du?", "Hvor gammel er du?"], a: 3 },
      { q: "Hvad betyder 'I like cats'?", opts: ["Jeg hader katte", "Jeg frygter katte", "Jeg kan lide katte", "Jeg har katte"], a: 2 },
      { q: "Hvad betyder 'What is your name?'", opts: ["Hvad laver du?", "Hvad hedder du?", "Hvor bor du?", "Hvornår er du født?"], a: 1 },
      { q: "Hvad betyder 'Where do you live?'", opts: ["Hvad laver du?", "Hvornår er du født?", "Hvad hedder du?", "Hvor bor du?"], a: 3 },
      { q: "Hvad betyder 'I love you'?", opts: ["Jeg hader dig", "Jeg savner dig", "Jeg elsker dig", "Jeg kender dig"], a: 2 },
    ],
  },
  {
    floor: 10, name: "Sprog-Mester", emoji: "🏆", grade: "4.–5. klasse", desc: "Avanceret engelsk",
    questions: [
      { q: "Hvad er 'SKOLE' på engelsk?", opts: ["Library", "Hospital", "School", "Office"], a: 2 },
      { q: "Hvad er 'LÆRER' på engelsk?", opts: ["Student", "Principal", "Teacher", "Doctor"], a: 2 },
      { q: "Hvad er 'BIBLIOTEK' på engelsk?", opts: ["Bookstore", "Museum", "Library", "Archive"], a: 2 },
      { q: "Hvad betyder 'because'?", opts: ["Men", "Og", "Fordi", "Selvom"], a: 2 },
      { q: "Hvad er flertalsformen af 'child'?", opts: ["Childs", "Children", "Childes", "Childre"], a: 1 },
      { q: "Hvad betyder 'beautiful'?", opts: ["Hæslig", "Farverig", "Smuk/flot", "Gammel"], a: 2 },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// Master config exported
// ─────────────────────────────────────────────────────────
export const SUBJECTS: SubjectConfig[] = [
  {
    id: "reading",
    name: "Bogstavernes Tårn",
    emoji: "📖",
    gradient: "from-sky-400 to-blue-600",
    desc: "Læsning og bogstaver",
    levels: READING_LEVELS,
  },
  {
    id: "history",
    name: "Historiens Ruiner",
    emoji: "🏛️",
    gradient: "from-amber-400 to-orange-600",
    desc: "Danmarkshistorie og verden",
    levels: HISTORY_LEVELS,
  },
  {
    id: "physics",
    name: "Fysikkens Fyr",
    emoji: "⚡",
    gradient: "from-yellow-300 to-lime-500",
    desc: "Naturvidenskab og fysik",
    levels: PHYSICS_LEVELS,
  },
  {
    id: "biology",
    name: "Biologiens Skov",
    emoji: "🌿",
    gradient: "from-green-400 to-emerald-600",
    desc: "Natur, dyr og menneskekroppen",
    levels: BIOLOGY_LEVELS,
  },
  {
    id: "language",
    name: "Sprogenes Portal",
    emoji: "🌍",
    gradient: "from-purple-400 to-fuchsia-600",
    desc: "Engelsk og fremmedsprog",
    levels: LANGUAGE_LEVELS,
  },
];

export function getSubject(id: SubjectId): SubjectConfig | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getSubjectLevel(subjectId: SubjectId, floor: number): SubjectLevel | undefined {
  return getSubject(subjectId)?.levels.find((l) => l.floor === floor);
}
