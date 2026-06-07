const DIACRITIC_MAP: Record<string, string> = {
  á: "a", à: "a", â: "a", ä: "a", ã: "a", å: "a", ą: "a",
  é: "e", è: "e", ê: "e", ë: "e", ě: "e",
  í: "i", ì: "i", î: "i", ï: "i",
  ó: "o", ò: "o", ô: "o", ö: "o", õ: "o", ø: "o",
  ú: "u", ù: "u", û: "u", ü: "u", ů: "u",
  ý: "y", ÿ: "y",
  ñ: "n", ń: "n",
  ç: "c", č: "c", ć: "c",
  š: "s", ś: "s",
  ž: "z", ź: "z", ż: "z",
  ř: "r",
  ł: "l",
  ď: "d",
  ť: "t",
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .split("")
    .map((c) => DIACRITIC_MAP[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
