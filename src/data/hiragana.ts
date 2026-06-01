export type CharEntry = [string, string]; // [hiragana, romaji]
export type WordEntry = [string, string, string]; // [hiragana, romaji, translation]

export const HIRAGANA: Record<string, CharEntry[]> = {
  vowels: [["あ","a"],["い","i"],["う","u"],["え","e"],["お","o"]],
  k: [["か","ka"],["き","ki"],["く","ku"],["け","ke"],["こ","ko"]],
  s: [["さ","sa"],["し","shi"],["す","su"],["せ","se"],["そ","so"]],
  t: [["た","ta"],["ち","chi"],["つ","tsu"],["て","te"],["と","to"]],
  n: [["な","na"],["に","ni"],["ぬ","nu"],["ね","ne"],["の","no"],["ん","n"]],
  h: [["は","ha"],["ひ","hi"],["ふ","fu"],["へ","he"],["ほ","ho"]],
  m: [["ま","ma"],["み","mi"],["む","mu"],["め","me"],["も","mo"]],
  y: [["や","ya"],["ゆ","yu"],["よ","yo"]],
  r: [["ら","ra"],["り","ri"],["る","ru"],["れ","re"],["ろ","ro"]],
  w: [["わ","wa"],["を","wo"]],
};

export const ALL_CHARS: CharEntry[] = Object.values(HIRAGANA).flat();

export const WORDS: WordEntry[] = [
  ["さくら","sakura","cerisier"],
  ["やま","yama","montagne"],
  ["かわ","kawa","rivière"],
  ["そら","sora","ciel"],
  ["うみ","umi","mer"],
  ["はな","hana","fleur"],
  ["ねこ","neko","chat"],
  ["いぬ","inu","chien"],
  ["き","ki","arbre"],
  ["みず","mizu","eau"],
  ["ひ","hi","feu / soleil"],
  ["つき","tsuki","lune"],
  ["ほし","hoshi","étoile"],
  ["かぜ","kaze","vent"],
  ["ゆき","yuki","neige"],
  ["あめ","ame","pluie"],
  ["にわ","niwa","jardin"],
  ["みち","michi","chemin"],
  ["まち","machi","ville"],
  ["しろ","shiro","château"],
  ["てら","tera","temple"],
  ["かみ","kami","dieu / papier"],
  ["こども","kodomo","enfant"],
  ["おとこ","otoko","homme"],
  ["おんな","onna","femme"],
  ["ちち","chichi","père"],
  ["はは","haha","mère"],
  ["とも","tomo","ami"],
  ["こえ","koe","voix"],
  ["て","te","main"],
  ["め","me","oeil"],
  ["みみ","mimi","oreille"],
  ["くち","kuchi","bouche"],
  ["あし","ashi","pied / jambe"],
  ["あたま","atama","tête"],
  ["こころ","kokoro","coeur / esprit"],
  ["いのち","inochi","vie"],
  ["ゆめ","yume","rêve"],
  ["おと","oto","son"],
  ["いろ","iro","couleur"],
  ["ちから","chikara","force"],
  ["ひかり","hikari","lumière"],
  ["かげ","kage","ombre"],
  ["なまえ","namae","prénom / nom"],
  ["ことば","kotoba","mot / langue"],
  ["うた","uta","chanson"],
  ["たび","tabi","voyage"],
  ["あさ","asa","matin"],
  ["よる","yoru","nuit"],
  ["はる","haru","printemps"],
  ["なつ","natsu","été"],
  ["あき","aki","automne"],
  ["ふゆ","fuyu","hiver"],
];

export const GROUPS = ["all","vowels","k","s","t","n","h","m","y","r","w"] as const;
export type Group = typeof GROUPS[number];

export const GROUP_LABELS: Record<Group, string> = {
  all: "Tous", vowels: "Voyelles", k: "K", s: "S", t: "T",
  n: "N", h: "H", m: "M", y: "Y", r: "R", w: "W",
};

export function getRand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
