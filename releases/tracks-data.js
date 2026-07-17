// Pokestir — canonical recording catalog
//
// This file is edited directly and is the single source of truth for recording
// metadata. A recording appears once here even when it belongs to both a single
// and one or more albums. releases/data.js stores the ordered release membership.
//
// Keys use "isrc:<ISRC>" when the recording has an ISRC. Use a stable
// "local:<slug>" key only while an ISRC is genuinely unknown, then update the
// key and every release reference when the ISRC is found.
//
// New recording template:
//   "isrc:QZXXXXXXXXXX": {
//     title: "Canonical recording title",
//     isrc: "QZXXXXXXXXXX",
//     artists: ["Pokestir", "Other Artist"],   // omit for solo Pokestir tracks
//     duration: "3:42",
//     spotifyTrackId: "",
//     preview: ""
//   },
//
// `artists` lists the credited artists in Spotify's display order (primary
// first, then co-primaries/featured). Tracks without it render as "Pokestir".
// ISRCs (and release UPCs in data.js) are kept for reference but are no
// longer displayed anywhere on the site.
//
// Preview URLs must be stable Spotify MP3 previews. Apple AAC previews are not
// used because their audio/x-m4p responses fail in some browsers. Do not use
// Deezer previews either: their signed URLs expire and are unsuitable here.

const TRACKS = {
  "isrc:QZ6K42500261": {
    title: "A Brief Moment (Arr. for Orchestra by Pokestir) [from \"Pokémon Scarlet & Violet\"]",
    isrc: "QZ6K42500261",
    duration: "2:41",
    spotifyTrackId: "69F7tb5fUVuaynRE5Jl8fI",
    preview: "https://p.scdn.co/mp3-preview/6967eff3f8ecee9903053326b4ae9800e4e51f81"
  },
  "isrc:QZPJ32396585": {
    title: "A Captain’s Trial Begins! (feat. Pokestir)",
    isrc: "QZPJ32396585",
    artists: ["StevenMix", "Pokestir"],
    duration: "4:29",
    spotifyTrackId: "0HPxNaIKuUQxZI29782uWa",
    preview: "https://p.scdn.co/mp3-preview/0a44695be1e2b79a97409537d3215a3f937acdaf"
  },
  "isrc:QZWV32540469": {
    title: "A Mystic Waltz",
    isrc: "QZWV32540469",
    duration: "3:00",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32396592": {
    title: "Aether Paradise (Arrangement)",
    isrc: "QZPJ32396592",
    duration: "4:16",
    spotifyTrackId: "71eAgTvmAMGBOsb0yTQF6P",
    preview: "https://p.scdn.co/mp3-preview/3947560b96e8977f7083f3044306ba0ca2956ed3"
  },
  "isrc:QZPJ32198863": {
    title: "Airship Theme (From \"Super Mario Bros 3\") [Arrangement]",
    isrc: "QZPJ32198863",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "4:29",
    spotifyTrackId: "3E86ex2Lrz01c5Jot9HoOO",
    preview: "https://p.scdn.co/mp3-preview/256f79445ab2f21ce32d4aa2c143d85c2de31dfa"
  },
  "isrc:QZPJ32396579": {
    title: "Alola Region Theme (feat. StevenMix) [Orchestral Arrangement]",
    isrc: "QZPJ32396579",
    artists: ["Pokestir", "StevenMix"],
    duration: "4:33",
    spotifyTrackId: "1LkdF7ydQdf68CCDOxp8bT",
    preview: "https://p.scdn.co/mp3-preview/648b1a82b36c65d0e06bf89c7175dd14f1875d50"
  },
  "isrc:QZPJ32396594": {
    title: "Ancient Poni Path (Orchestral Arrangement)",
    isrc: "QZPJ32396594",
    duration: "3:13",
    spotifyTrackId: "0PaJVwdxEMkMfNIS2cBfSZ",
    preview: "https://p.scdn.co/mp3-preview/df5c7e0bf1184ab63af41732afd9901ebb29725b"
  },
  "isrc:QZPJ32318648": {
    title: "Anistar City (Arrangement)",
    isrc: "QZPJ32318648",
    artists: ["Pokestir", "StevenMix"],
    duration: "3:12",
    spotifyTrackId: "0iba4ZfB3xWw4aeYOabM7b",
    preview: "https://p.scdn.co/mp3-preview/ce2c2f91ae1edd3b010c8d0afcd5c29067f8d712"
  },
  "isrc:QZPJ32209731": {
    title: "Anxious Heart (From \"Final Fantasy VII\") (Arrangement)",
    isrc: "QZPJ32209731",
    duration: "3:45",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32318638": {
    title: "Aquacorde Town (Arrangement)",
    isrc: "QZPJ32318638",
    artists: ["Pokestir", "StevenMix"],
    duration: "1:58",
    spotifyTrackId: "5Ud29s3230wfYqNMDjAedW",
    preview: "https://p.scdn.co/mp3-preview/36f768e3b63946003db06abebe5f4501192e952a"
  },
  "isrc:QZ6K42600796": {
    title: "Aspertia City (From \"Pokémon Black 2 & White 2\")",
    isrc: "QZ6K42600796",
    duration: "5:18",
    spotifyTrackId: "6TbcIYpEjHD3HRkJJTfVTo",
    preview: "https://p.scdn.co/mp3-preview/68410fe103039bafa18c04913db9bb22e6cdd306"
  },
  "isrc:QZPJ32184450": {
    title: "Athletic Theme (From \"Yoshi's Island\") (Arrangement)",
    isrc: "QZPJ32184450",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "3:42",
    spotifyTrackId: "5ggcbGCFgOg7gcSHlwCyNW",
    preview: "https://p.scdn.co/mp3-preview/6a4c1bdbbe859178cc094d6e4a90e1480cf2d04a"
  },
  "isrc:QZPJ32133920": {
    title: "Azalea Town (From \"Pokémon HeartGold & SoulSilver\")",
    isrc: "QZPJ32133920",
    artists: ["Shota Kageyama", "Go Ichinose", "Pokestir"],
    duration: "4:55",
    spotifyTrackId: "7ghAgHhwUPWOJjU2qxOHjb",
    preview: "https://p.scdn.co/mp3-preview/ee5bc0150e46ec3ddaeec7a98b8cb67727572105"
  },
  "isrc:QZPJ32145501": {
    title: "Battle (Brendan / May) (From \"Pokémon Ruby & Sapphire\") [Arrangement]",
    isrc: "QZPJ32145501",
    duration: "4:39",
    spotifyTrackId: "7wOx30XvLM7Bng3ty38O5u",
    preview: "https://p.scdn.co/mp3-preview/1b139c5a9b51a2030aa09474b767b441ceef88e4"
  },
  "isrc:QZ6K42500964": {
    title: "Battle (Champion) (From \"Pokémon Black & White\")",
    isrc: "QZ6K42500964",
    artists: ["Pokestir", "StevenMix"],
    duration: "4:44",
    spotifyTrackId: "0EW9Ks8gvKwR779Batyh8c",
    preview: "https://p.scdn.co/mp3-preview/5946ee2d0c65cbacbc80fd57b6cb56931b11e8c9"
  },
  "isrc:QZ6K42501135": {
    title: "Battle (From \"The Legend of Zelda: Ocarina of Time\")",
    isrc: "QZ6K42501135",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "2:02",
    spotifyTrackId: "1qd6B4Cca3l2KZViOZ1r4H",
    preview: "https://p.scdn.co/mp3-preview/8ff346f42b9d072eda4a7a3d8c329653f41e35ba"
  },
  "isrc:QZGWX2245185": {
    title: "Battle (Gym Leader) (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZGWX2245185",
    duration: "5:33",
    spotifyTrackId: "1AbbDDZSCd8q2r1lydWiua",
    preview: "https://p.scdn.co/mp3-preview/222f4df31622ad912a1bee7194f00219a87320c0"
  },
  "isrc:QZPJ32139642": {
    title: "Battle (Gym Leader) (From \"Pokémon Ruby & Sapphire\") [Arrangement]",
    isrc: "QZPJ32139642",
    duration: "4:33",
    spotifyTrackId: "7uUhHBF35wjVlbJYBBiC5T",
    preview: "https://p.scdn.co/mp3-preview/353b10d27398a2f5740f874deaaa55b7f4999d10"
  },
  "isrc:QZGWX2245183": {
    title: "Battle (Legendary Pokémon) (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZGWX2245183",
    duration: "3:19",
    spotifyTrackId: "6TAUECXAN3VsPl2LPMsbqM",
    preview: "https://p.scdn.co/mp3-preview/8a60dbe939ee38983ab65fec9d43334451e30f87"
  },
  "isrc:QZ6K42500963": {
    title: "Battle (Steven) (From \"Pokémon Ruby & Sapphire\")",
    isrc: "QZ6K42500963",
    duration: "3:26",
    spotifyTrackId: "1LvQHbZBorG1oLQgB2mhvo",
    preview: "https://p.scdn.co/mp3-preview/34d647feaa7ffbeeec210e7c0ed04f0be23286fd"
  },
  "isrc:QZPJ32153465": {
    title: "Battle (Subway Trainer) (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32153465",
    duration: "3:31",
    spotifyTrackId: "0gwk9nakgSBzIj1jniLGV9",
    preview: "https://p.scdn.co/mp3-preview/94168524e67c618b2fd340b497a155df6f6cb912"
  },
  "isrc:QZPJ32197573": {
    title: "Battle (Team Galactic Commander) (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32197573",
    duration: "4:06",
    spotifyTrackId: "38voY5GodMyplmWAJMHqqv",
    preview: "https://p.scdn.co/mp3-preview/33286ba87a3dd75dacfa70ac9c725f93e0f84c48"
  },
  "isrc:QZPJ32124245": {
    title: "Battle (Team Plasma) (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32124245",
    duration: "5:42",
    spotifyTrackId: "1L8iLrvjqGpBJK7tFqVzI9",
    preview: "https://p.scdn.co/mp3-preview/ef77bd6f9710e300a33a6ce4a09d8062fa950f65"
  },
  "isrc:QZPJ32317542": {
    title: "Battle (Team Rocket) (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZPJ32317542",
    duration: "5:23",
    spotifyTrackId: "4ntS334LaA1UyAADFUXqHe",
    preview: "https://p.scdn.co/mp3-preview/b971234b2279942270972f52f5249697468c241f"
  },
  "isrc:QZPJ32214832": {
    title: "Battle (Trainer Battle) (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32214832",
    duration: "3:20",
    spotifyTrackId: "4GR1X1Cl19M0IvoA3RXGOP",
    preview: "https://p.scdn.co/mp3-preview/9f1102bcee99d5f24cd250eef62c90e0073abba7"
  },
  "isrc:QZPJ32116035": {
    title: "Battle (Trainer Battle) [from \"Pokémon Diamond & Pearl\"] [Arrangement]",
    isrc: "QZPJ32116035",
    duration: "5:51",
    spotifyTrackId: "1bpJcxl2WXI2UMvKtJrFye",
    preview: "https://p.scdn.co/mp3-preview/51435cb118e5b9e57dedbd2c2e00f5a9bcf58bd6"
  },
  "isrc:QZ6K42500385": {
    title: "Battle (Wild Pokémon) [from “Pokémon Ruby & Sapphire”] [Modern Arrangement]",
    isrc: "QZ6K42500385",
    artists: ["Pokestir", "Mudstep"],
    duration: "2:16",
    spotifyTrackId: "1QUVgW6CwvNvtggl68ZscH",
    preview: "https://p.scdn.co/mp3-preview/a93d6b9304fce0c96c2c5cbebbc5b1c335e090b3"
  },
  "isrc:QZPJ32334368": {
    title: "Battle 1 (From \"Chrono Trigger\") [Arrangement]",
    isrc: "QZPJ32334368",
    artists: ["Yasunori Mitsuda", "Pokestir"],
    duration: "2:22",
    spotifyTrackId: "6ciyDW2jvIjEWnp5iJDeUU",
    preview: "https://p.scdn.co/mp3-preview/bf13ece57c3c58f7c391360599ca2415f95695bd"
  },
  "isrc:QZPJ32383047": {
    title: "Battle 2 (From \"Chrono Trigger\")",
    isrc: "QZPJ32383047",
    artists: ["Yasunori Mitsuda", "Pokestir"],
    duration: "3:44",
    spotifyTrackId: "6lJzSkaZmHnrKtt0oC8sAb",
    preview: "https://p.scdn.co/mp3-preview/00c22cc6051ba423ccbbcf6735cf5315d079d92c"
  },
  "isrc:QZ6K42501416": {
    title: "Battle at Sea (From \"the Legend of Zelda: The Wind Waker\")",
    isrc: "QZ6K42501416",
    artists: ["Kenta Nagata", "Koji Kondo", "Hajime Wakai", "Toru Minegishi", "Pokestir"],
    duration: "2:27",
    spotifyTrackId: "2bW07PItL5FfsNluxeoXli",
    preview: "https://p.scdn.co/mp3-preview/75ee8866c59db1f5941e234c267d5b050c9b965c"
  },
  "isrc:QZ6K42501083": {
    title: "Battle with Magus (From \"Chrono Trigger\")",
    isrc: "QZ6K42501083",
    artists: ["Yasunori Mitsuda", "Pokestir"],
    duration: "2:53",
    spotifyTrackId: "7ntrzutaRcNdWWwe8W43ld",
    preview: "https://p.scdn.co/mp3-preview/dad251966be646da1075180168e4993f846c3ad1"
  },
  "isrc:QZ6K42501017": {
    title: "Battle! (Champion Cynthia) (from \"Pokémon Diamond & Pearl\") (Modern Arrangement)",
    isrc: "QZ6K42501017",
    duration: "3:17",
    spotifyTrackId: "4Ax90tTnZq9SBORZr3ccs9",
    preview: "https://p.scdn.co/mp3-preview/e86a2ba63b095bb9d7f0feeecf987e7337a92a9b"
  },
  "isrc:QZPJ32208614": {
    title: "Battle! (Champion) (From \"Pokémon Black & White\") (Arrangement)",
    isrc: "QZPJ32208614",
    duration: "4:44",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32343096": {
    title: "Battle! (Champion) (From \"Pokémon Gold & Silver\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZPJ32343096",
    duration: "4:10",
    spotifyTrackId: "3rvt0GYcRCs8zsyEw7Tu3m",
    preview: "https://p.scdn.co/mp3-preview/b417f4e4328abbbc53657d236ff4ce9a3134c665"
  },
  "isrc:QZPJ32276351": {
    title: "Battle! (Dialga/Palkia) (From \"Pokémon Diamond & Pearl\")",
    isrc: "QZPJ32276351",
    duration: "5:46",
    spotifyTrackId: "0dBslS2pu294K4FO9nXAYa",
    preview: "https://p.scdn.co/mp3-preview/a35d73fcae49e4da99b66dbea2980a4c9762564a"
  },
  "isrc:QZPJ32108085": {
    title: "Battle! (Elite Four) (From “Pokémon Diamond & Pearl”)",
    isrc: "QZPJ32108085",
    duration: "5:33",
    spotifyTrackId: "7nVH0cwC9OE0nQeGMhJdlu",
    preview: "https://p.scdn.co/mp3-preview/72c8555dad44522fa7a89f130f3eefd40fa80209"
  },
  "isrc:QZPJ32178684": {
    title: "Battle! (Elite Four) (From \"Pokémon Ruby & Sapphire\") (Arrangement)",
    isrc: "QZPJ32178684",
    duration: "4:24",
    spotifyTrackId: "1gk5xSqiiJR1tPY6kBLRKx",
    preview: "https://p.scdn.co/mp3-preview/d177c2e928d157362e6de6689eec88e53c675b24"
  },
  "isrc:QZGWX2247030": {
    title: "Battle! (Rocket Executives) (From \"Pokémon HeartGold & SoulSilver\")",
    isrc: "QZGWX2247030",
    duration: "5:22",
    spotifyTrackId: "68sbqfgJvWfNalNclW7dsA",
    preview: "https://p.scdn.co/mp3-preview/820cf7ef6166203c67974a5dfebee9055ffb186c"
  },
  "isrc:QZPJ32102556": {
    title: "Battle! (Trainer Battle—Kanto Version) (From \"Pokémon HeartGold & SoulSilver\")",
    isrc: "QZPJ32102556",
    duration: "5:40",
    spotifyTrackId: "5C1rbrFDXCVkPVHFxAfYR8",
    preview: "https://p.scdn.co/mp3-preview/48caf1c07f2aa292d8ca027c6c77432320324b7c"
  },
  "isrc:QZPJ32359857": {
    title: "Battle! Champion Iris (From “Pokémon Black 2 & White 2”) - Arrangement",
    isrc: "QZPJ32359857",
    duration: "5:05",
    spotifyTrackId: "38LIz1HAd0Ako7m4ZcS4IE",
    preview: "https://p.scdn.co/mp3-preview/eca055d1a16d1956afc2b52faf597085131e88a0"
  },
  "isrc:QZ6K42600178": {
    title: "Battle! Cheren / Bianca (From \"Pokémon Black & White\") [Jazz Arrangement]",
    isrc: "QZ6K42600178",
    duration: "2:52",
    spotifyTrackId: "1ALBcT6UQYsmRTWFOLdYKP",
    preview: "https://p.scdn.co/mp3-preview/2ff0fd18562639767b04315c091e8f1bc6c12e22"
  },
  "isrc:QZ6K42501290": {
    title: "Battle! Colress (From \"Pokémon Black 2 & White 2\") [Jazz Fusion Arrangement]",
    isrc: "QZ6K42501290",
    duration: "3:22",
    spotifyTrackId: "39cTZ8BSjOEyhk8KhmiNOS",
    preview: "https://p.scdn.co/mp3-preview/653300b9f0000a0c6b91e7cf50a1d9e8ed39f656"
  },
  "isrc:QZPJ32380636": {
    title: "Battle! Elite Four (From \"Pokémon X & Y\") [Arrangement]",
    isrc: "QZPJ32380636",
    artists: ["Pokestir", "StevenMix"],
    duration: "3:44",
    spotifyTrackId: "29XAbGKY9KnONScJRNLFdD",
    preview: "https://p.scdn.co/mp3-preview/68c1045c2282a87eab83e1005238c02c0998942b"
  },
  "isrc:QZPJ32187930": {
    title: "Battle! Giratina (From \"Pokémon Platinum\") [Arrangement]",
    isrc: "QZPJ32187930",
    duration: "3:42",
    spotifyTrackId: "2vsQKoJC3JH3uBVALUkTDy",
    preview: "https://p.scdn.co/mp3-preview/2480c327f4820bdd1dd859ecabcd4a499e3586ab"
  },
  "isrc:QZPJ32189512": {
    title: "Battle! Gym Leader (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32189512",
    artists: ["Pokestir", "StevenMix"],
    duration: "4:03",
    spotifyTrackId: "3UxD37FUPB8im6RagXicm4",
    preview: "https://p.scdn.co/mp3-preview/4a7897deef01bd8c7d5945315c6a4ba96831ce99"
  },
  "isrc:QZ6K42600184": {
    title: "Battle! Gym Leader (From \"Pokémon Black 2 & White 2\")",
    isrc: "QZ6K42600184",
    duration: "4:05",
    spotifyTrackId: "3Xl4rLiXQROeJ9xPgaSMPs",
    preview: "https://p.scdn.co/mp3-preview/b3726984d47be873ad2a5f846b99070d62221aa2"
  },
  "isrc:QZPJ32273630": {
    title: "Battle! Gym Leader (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZPJ32273630",
    duration: "5:00",
    spotifyTrackId: "2K1J76npun4IzDQN5IFhAw",
    preview: "https://p.scdn.co/mp3-preview/8faedf62f27f9f3537bbab4777a1096db1f7ed64"
  },
  "isrc:QZ6K42501457": {
    title: "Battle! Gym Leader (From \"Pokémon Red & Blue\")",
    isrc: "QZ6K42501457",
    duration: "3:19",
    spotifyTrackId: "27V1Z9okkPBlF5PWOQ2016",
    preview: "https://p.scdn.co/mp3-preview/789c787b682f50241b0f269de5c0ab9358ed0d6e"
  },
  "isrc:QZPJ32257456": {
    title: "Battle! Johto Trainer (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZPJ32257456",
    duration: "5:02",
    spotifyTrackId: "7CRitLriYEVuOWMYSqqIPV",
    preview: "https://p.scdn.co/mp3-preview/394ab2a4d8b211eb5d5082dadc9bfb5145b06f05"
  },
  "isrc:QZPJ32147272": {
    title: "Battle! Lake Guardians (From \"Pokémon Diamond and Pearl\")",
    isrc: "QZPJ32147272",
    duration: "4:59",
    spotifyTrackId: "0UIYeNdE8ZbP0rjgYwMiie",
    preview: "https://p.scdn.co/mp3-preview/a99a42734762a80aa58498328132252a7d87472b"
  },
  "isrc:QZ6K42600183": {
    title: "Battle! Marnie (From \"Pokémon Sword & Shield\")",
    isrc: "QZ6K42600183",
    duration: "3:57",
    spotifyTrackId: "0vfiWrzWfnxKBwOA0iNPNX",
    preview: "https://p.scdn.co/mp3-preview/2fef5ea5d875ab0a0cf7baaa7fded5205e97cae4"
  },
  "isrc:QZ6K42600182": {
    title: "Battle! N (From \"Pokémon Black & White\")",
    isrc: "QZ6K42600182",
    duration: "3:12",
    spotifyTrackId: "2PyPLfPzyIXk8mYE9EmB6X",
    preview: "https://p.scdn.co/mp3-preview/92758271da15eecda88cf13a5e77baf0119bc35f"
  },
  "isrc:QZ6K42600186": {
    title: "Battle! Raikou (From \"Pokémon HeartGold & SoulSilver\")",
    isrc: "QZ6K42600186",
    duration: "3:27",
    spotifyTrackId: "2Ypa6WLoLtNdPPXAe7y7kJ",
    preview: "https://p.scdn.co/mp3-preview/d788086d25a9319d4981564a2e9300a6ed8fc646"
  },
  "isrc:QZPJ32289942": {
    title: "Battle! Rival (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32289942",
    duration: "2:57",
    spotifyTrackId: "3qxu8JYC6OFgLqM6pPFY3X",
    preview: "https://p.scdn.co/mp3-preview/d5f7aac2675820f7a4c0add3df69ca21d0ec24c6"
  },
  "isrc:QZPJ32308373": {
    title: "Battle! Rival (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZPJ32308373",
    duration: "3:12",
    spotifyTrackId: "00mSemqqSPMwF6WSRQjdGr",
    preview: "https://p.scdn.co/mp3-preview/2e463dd188f9450d7bd5ffdae49d8440784e6dcf"
  },
  "isrc:QZPJ32231905": {
    title: "Battle! Steven (From \"Pokémon Ruby & Sapphire\") [Arrangement]",
    isrc: "QZPJ32231905",
    duration: "3:26",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42600185": {
    title: "Battle! Team Aqua / Team Magma Leaders (From \"Pokémon Ruby & Sapphire\")",
    isrc: "QZ6K42600185",
    duration: "3:18",
    spotifyTrackId: "3R9khgVeRUvO7Xb8k97b43",
    preview: "https://p.scdn.co/mp3-preview/c38ba92b16a3b28c3ed3d051131e9b3b2a84cb8e"
  },
  "isrc:QZ6K42600181": {
    title: "Battle! Trainer (From \"Pokémon Scarlet & Violet\")",
    isrc: "QZ6K42600181",
    duration: "3:11",
    spotifyTrackId: "0YOgi62LmZ6grqdf8X92JN",
    preview: "https://p.scdn.co/mp3-preview/f914285cfbcdfd2f911508d87df602d766a07a47"
  },
  "isrc:QZPJ32249038": {
    title: "Battle! Trainer Battle (From \"Pokémon Red & Blue\") [Arrangement]",
    isrc: "QZPJ32249038",
    duration: "4:08",
    spotifyTrackId: "4bLtqzd4YdfcxrGKmdeowJ",
    preview: "https://p.scdn.co/mp3-preview/c143b32882210a8722192481734223675d0f9ab5"
  },
  "isrc:QZGWX2237769": {
    title: "Betrayal",
    isrc: "QZGWX2237769",
    duration: "2:08",
    spotifyTrackId: "50EdUC4JJw4gsFH9vRmEwN",
    preview: "https://p.scdn.co/mp3-preview/8a1b48b0dfaaecc5b501122e50850eb77b9350b7"
  },
  "isrc:QZPJ32150307": {
    title: "Beware the Forest's Mushrooms (From “Super Mario Rpg”) [Arrangement]",
    isrc: "QZPJ32150307",
    artists: ["Yoko Shimomura", "Pokestir"],
    duration: "4:42",
    spotifyTrackId: "69k6lDKxrQV0kkDLdJLLAQ",
    preview: "https://p.scdn.co/mp3-preview/98943c64ba9bf839a3a50e933498798b12931a3b"
  },
  "isrc:QZPJ32345647": {
    title: "Bicycle (From \"Pokémon Black & White\")",
    isrc: "QZPJ32345647",
    artists: ["Shota Kageyama", "Hitomi Sato", "Pokestir"],
    duration: "2:26",
    spotifyTrackId: "4Roi7B7x5WSPUSwlrZnWFJ",
    preview: "https://p.scdn.co/mp3-preview/d7ebc763e0792292fbad10913d413253730e05f7"
  },
  "isrc:QZGWX2245184": {
    title: "Bicycle (From \"Pokémon HeartGold & SoulSilver\")",
    isrc: "QZGWX2245184",
    duration: "5:15",
    spotifyTrackId: "1y3gbfbBhOnuvDXfzQXutn",
    preview: "https://p.scdn.co/mp3-preview/7acb6543f45500b896c360ac0febf5aa8c02113d"
  },
  "isrc:QZPJ32227402": {
    title: "Bicycle Theme (From \"Pokémon Diamond & Pearl\") (Arrangement)",
    isrc: "QZPJ32227402",
    duration: "3:34",
    spotifyTrackId: "6W9Uyk5JqB8OFdMlhCUGo8",
    preview: "https://p.scdn.co/mp3-preview/af0eead8dea8f97fa8750392d1aeeb28ddd73b7a"
  },
  "isrc:QZPJ32387266": {
    title: "Birth of a God (From \"Final Fantasy VII\") [Cinematic Arrangement]",
    isrc: "QZPJ32387266",
    duration: "6:50",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32408787": {
    title: "Bob - Omb Battlefield (From \"Super Mario 64\") [Arrangement]",
    isrc: "QZPJ32408787",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "3:35",
    spotifyTrackId: "1fCWec9GdHnCtHY9nEAztA",
    preview: "https://p.scdn.co/mp3-preview/52b6d7c4e138d4e13f1f71d7b85141f79b8a316e"
  },
  "isrc:QZPJ32174121": {
    title: "Bonetrousle (From \"Undertale\") (Arrangement)",
    isrc: "QZPJ32174121",
    duration: "4:01",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32441895": {
    title: "Boss Battle (From \"the Legend of Zelda: Ocarina of Time\") [Orchestral Arrangement]",
    isrc: "QZPJ32441895",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "3:31",
    spotifyTrackId: "5ABkS1Q5FuLuqEk74TDwUI",
    preview: "https://p.scdn.co/mp3-preview/ceb598360108e22f93bb3599fe76e0d1be1a3146"
  },
  "isrc:QZPJ32182765": {
    title: "Boss Battle 1 (From \"Chrono Trigger\") (Orchestral Arrangement)",
    isrc: "QZPJ32182765",
    artists: ["Noriko Matsueda", "Pokestir"],
    duration: "4:39",
    spotifyTrackId: "1cm3EV0gtDLCvKyfzTskNv",
    preview: "https://p.scdn.co/mp3-preview/0b35be71a6e13026c3f988a6f31049bbb77be188"
  },
  "isrc:QZ6K42500316": {
    title: "Boss Battle 2 (From \"Chrono Trigger) [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42500316",
    artists: ["Yasunori Mitsuda", "Pokestir"],
    duration: "3:42",
    spotifyTrackId: "62GUfiNXjdTPKN9y3aJdxL",
    preview: "https://p.scdn.co/mp3-preview/e791a9e51a9372e3d70365b7d199ea64917332f2"
  },
  "isrc:QZPJ32246157": {
    title: "Bowser's Road (From \"Super Mario 64\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZPJ32246157",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "4:49",
    spotifyTrackId: "4wDhs1xzRC2QPK8qMpLWbE",
    preview: "https://p.scdn.co/mp3-preview/db136bda91cb0b1cc666f3cf37349e2ae5245433"
  },
  "isrc:QZPJ32348859": {
    title: "Calling from Heaven (From \"Castlevania Bloodlines\") [Arrangement]",
    isrc: "QZPJ32348859",
    duration: "3:30",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32318641": {
    title: "Camphrier Town (Arrangement)",
    isrc: "QZPJ32318641",
    duration: "2:37",
    spotifyTrackId: "34CabOmjIUzzoBBed7nfik",
    preview: "https://p.scdn.co/mp3-preview/2c23c82a3229e15fffba45a853690a52ac88cc8d"
  },
  "isrc:QZPJ32365596": {
    title: "Canalave City (From \"Pokémon Diamond & Pearl\")",
    isrc: "QZPJ32365596",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "5:08",
    spotifyTrackId: "3QkfKpfapE1oMTe1Rezgiq",
    preview: "https://p.scdn.co/mp3-preview/b71fa65ad3f12f60761baa9c9dab6128efad702f"
  },
  "isrc:QZPJ32334727": {
    title: "Canubelle Park",
    isrc: "QZPJ32334727",
    duration: "4:00",
    spotifyTrackId: "1Y8MsxAIaKX2kYgQfmFWi9",
    preview: "https://p.scdn.co/mp3-preview/705ac8384af19e24556dccb68b2d1a125399f218"
  },
  "isrc:QZPJ32334728": {
    title: "Canubelle Park (Indoors)",
    isrc: "QZPJ32334728",
    duration: "4:00",
    spotifyTrackId: "71xzdxYX48CTcI4mdmpPsG",
    preview: "https://p.scdn.co/mp3-preview/df273f1e5d0dd3b4b11f6756434308bc08353d9f"
  },
  "isrc:QZPJ32242460": {
    title: "Castelia City (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32242460",
    duration: "4:14",
    spotifyTrackId: "11B6zGYWHyrITAFVvnBoJx",
    preview: "https://p.scdn.co/mp3-preview/0c3420f29f4d2b39379cdd7ac2d5a0344d67ac5f"
  },
  "isrc:QZ6K42500355": {
    title: "Castle (From “Dragon Quest VI) [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42500355",
    duration: "1:06",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZGWX2246987": {
    title: "Castle & Fortress (From \"Yoshi's Island\") [Arrangement]",
    isrc: "QZGWX2246987",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "4:23",
    spotifyTrackId: "3HAyVDlNZCJ8jmStfcKMjz",
    preview: "https://p.scdn.co/mp3-preview/15400cae091e4b11b4aebd917a5daeddb2d08c3d"
  },
  "isrc:QZ6K42601011": {
    title: "Castle Theme (From \"New Super Mario Bros.\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42601011",
    artists: ["Asuka Ohta", "Pokestir"],
    duration: "2:53",
    spotifyTrackId: "3vTAfWW2tJSnu9hfPqRIDL",
    preview: "https://p.scdn.co/mp3-preview/3b9476d17edc3709555eca83cbd6c73c354c0a0e"
  },
  "isrc:QZPJ32162360": {
    title: "Challenging a Battle Competition (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32162360",
    duration: "3:18",
    spotifyTrackId: "6SN2jQbpEe7jiOKEy5f5sb",
    preview: "https://p.scdn.co/mp3-preview/73d8fe1530d4f4bcfda85283a6f229a1d45250e1"
  },
  "isrc:QZGWX2237768": {
    title: "Chaos",
    isrc: "QZGWX2237768",
    duration: "2:05",
    spotifyTrackId: "2bUekZdRu4WD05LP2Ow5og",
    preview: "https://p.scdn.co/mp3-preview/5208205a5189734fd7a7831a5657a00773008e67"
  },
  "isrc:QZGWX2245075": {
    title: "Chargestone Cave (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZGWX2245075",
    duration: "5:20",
    spotifyTrackId: "4pyi5UlvPmGPjA80PSrfxY",
    preview: "https://p.scdn.co/mp3-preview/2c63796c68ff86151e4feee01630d6f2bb0406f1"
  },
  "isrc:QZ6K42500366": {
    title: "Checking the News: Daytime (News Channel) [feat. CrystalVGM] [Drum N Bass Arrangement]",
    isrc: "QZ6K42500366",
    artists: ["Pokestir", "CrystalVGM"],
    duration: "3:48",
    spotifyTrackId: "6iMz0ESszyNKCEVAJUveuY",
    preview: "https://p.scdn.co/mp3-preview/bcfb572fd9d07b21bbdc14bdfa079bdf8d7fdb7f"
  },
  "isrc:QZPJ32328390": {
    title: "Chocobo Jam (From \"Final Fantasy X\") [Arrangement]",
    isrc: "QZPJ32328390",
    duration: "3:46",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32296233": {
    title: "Cianwood City (From \"Pokémon HeartGold & SoulSilver\")",
    isrc: "QZPJ32296233",
    artists: ["Go Ichinose", "Morikazu Aoki", "Junichi Masuda", "Pokestir"],
    duration: "3:51",
    spotifyTrackId: "2QFVcPNGkizkxKWFReancF",
    preview: "https://p.scdn.co/mp3-preview/a38c9b676dfc92899bbc966fabb7acc989c91b98"
  },
  "isrc:QZPJ32141713": {
    title: "Coronation Day (From \"Pokémon Black & White\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZPJ32141713",
    artists: ["Shota Kageyama", "Junichi Masuda", "Pokestir"],
    duration: "2:16",
    spotifyTrackId: "5jNXCHoO8IfAmplFkkZEcc",
    preview: "https://p.scdn.co/mp3-preview/6b5d8d053a89ec0afa011ff22d44fcc94dee3260"
  },
  "isrc:QZGWX2245059": {
    title: "Corridors of Time (From \"Chrono Trigger\") [Arrangement]",
    isrc: "QZGWX2245059",
    artists: ["Yasunori Mitsuda", "Pokestir"],
    duration: "5:24",
    spotifyTrackId: "5qhUiYP1hfFmuf2W8Iowa0",
    preview: "https://p.scdn.co/mp3-preview/1fceb9580f8b12476c8d5b81b992b4fac46c011c"
  },
  "isrc:QZPJ32357597": {
    title: "Cortex Strikes Back Hub (From \"Crash Bandicoot 2\")",
    isrc: "QZPJ32357597",
    duration: "4:58",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32318645": {
    title: "Coumarine City (Arrangement)",
    isrc: "QZPJ32318645",
    duration: "2:58",
    spotifyTrackId: "4GP5RbZw5mXleG62o0o3ch",
    preview: "https://p.scdn.co/mp3-preview/8354e45c59a8fdb79d9a69fe1a22a51a7b58e182"
  },
  "isrc:QZGWX2247033": {
    title: "Crazy Dave (Intro Theme) (From \"Plants Vs. Zombies\") [Arrangement]",
    isrc: "QZGWX2247033",
    duration: "5:24",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42501081": {
    title: "Credits (From \"The Legend of Zelda: Ocarina of Time\")",
    isrc: "QZ6K42501081",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "4:33",
    spotifyTrackId: "2Hr9yzq3DvNHG8RyWkN1Dh",
    preview: "https://p.scdn.co/mp3-preview/90440f7a17748bfa602a10e83374d74cf3fc2323"
  },
  "isrc:QZPJ32469258": {
    title: "Cult of Despair",
    isrc: "QZPJ32469258",
    duration: "1:06",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32132935": {
    title: "Cycling (From \"Pokémon Red & Blue\") [Arrangement]",
    isrc: "QZPJ32132935",
    artists: ["Junichi Masuda", "Pokestir"],
    duration: "4:45",
    spotifyTrackId: "4m5HX6kAt3HDWeeNF4XdJM",
    preview: "https://p.scdn.co/mp3-preview/a0d74a7ff574486765498c600f73f6b1b4da1014"
  },
  "isrc:QZPJ32318642": {
    title: "Cyllage City (Arrangement)",
    isrc: "QZPJ32318642",
    artists: ["StevenMix"],
    duration: "3:19",
    spotifyTrackId: "5Ww3QzvEJfzCsvxLEdKoby",
    preview: "https://p.scdn.co/mp3-preview/1d5c86b8e610678929c01c479d4fb36dd0fcdd61"
  },
  "isrc:QZPJ32286510": {
    title: "Danganronpa V3 (From \"Danganronpa V3: Killing Harmony\") [Arrangement]",
    isrc: "QZPJ32286510",
    duration: "3:20",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32269267": {
    title: "Dark Impetus (From \"Kingdom Hearts Birth by Sleep\") (Arrangement)",
    isrc: "QZPJ32269267",
    duration: "4:53",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42501469": {
    title: "Dark Sanctuary (From \"Deltarune) [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42501469",
    artists: ["Toby Fox", "Pokestir"],
    duration: "3:48",
    spotifyTrackId: "4hTTgBqjS2MM5iZsZOgZoM",
    preview: "https://p.scdn.co/mp3-preview/14cb71f5f4790345ef03011fafc06def02ffcdca"
  },
  "isrc:QZ6K42600187": {
    title: "Decisive Battle! N (From \"Pokémon Black & White\")",
    isrc: "QZ6K42600187",
    duration: "4:57",
    spotifyTrackId: "7qnGcMe7eLiYiUehi8lpke",
    preview: "https://p.scdn.co/mp3-preview/85f2f363c32f72663c1b623cded703377be06979"
  },
  "isrc:QZPJ32438732": {
    title: "Delfino Plaza (From \"Super Mario Sunshine\") [Arrangement]",
    isrc: "QZPJ32438732",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "4:14",
    spotifyTrackId: "3yU3MLi8q2qTt4BREYyqhI",
    preview: "https://p.scdn.co/mp3-preview/a3ee52a45ffc9fd09c088f37fab586408c26f368"
  },
  "isrc:QZPJ32318647": {
    title: "Dendemille Town (Arrangement)",
    isrc: "QZPJ32318647",
    artists: ["StevenMix"],
    duration: "3:12",
    spotifyTrackId: "1S1Tv0nndGG1Qhw2kNSPAk",
    preview: "https://p.scdn.co/mp3-preview/81ccfdaf186f734dad720df39bfe424e6bf7c09c"
  },
  "isrc:QZ6K42601122": {
    title: "Dewford Town (From \"Pokémon Ruby & Sapphire\")",
    isrc: "QZ6K42601122",
    duration: "4:36",
    spotifyTrackId: "0oXo9R5H5pKBUcWRkorKUo",
    preview: "https://p.scdn.co/mp3-preview/8353de6338eec39bb41c54addc6c45a8433ad092"
  },
  "isrc:QZPJ32293113": {
    title: "Dingodile (From \"Crash Bandicoot 3: Warped\") [Arrangement]",
    isrc: "QZPJ32293113",
    duration: "5:12",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32369381": {
    title: "Dire, Dire Docks (From \"Super Mario 64\") [Arrangement]",
    isrc: "QZPJ32369381",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "5:57",
    spotifyTrackId: "1DE7dlxRNEOmzWiQJBskW0",
    preview: "https://p.scdn.co/mp3-preview/5a6ff8a9ece6cef0c2577f7f31339b7c606ac245"
  },
  "isrc:QZ6K42500361": {
    title: "Doodle (Photos Channel) [Jazz Arrangement]",
    isrc: "QZ6K42500361",
    duration: "4:04",
    spotifyTrackId: "1jOjrHyOyaS0Z8pUtjAtpZ",
    preview: "https://p.scdn.co/mp3-preview/e9023931ab7fd606e582b8c0ccd864b20716f81e"
  },
  "isrc:QZ6K42501414": {
    title: "Dragon Roost Island (From \"the Legend of Zelda: The Wind Waker\")",
    isrc: "QZ6K42501414",
    artists: ["Kenta Nagata", "Pokestir"],
    duration: "3:00",
    spotifyTrackId: "6Gsri5ruvYJyUKVj1gVtrw",
    preview: "https://p.scdn.co/mp3-preview/ee51067b2162a56711ad2af5b378e6cd00cf388a"
  },
  "isrc:QZGWX2245043": {
    title: "Dragonspiral Tower (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZGWX2245043",
    duration: "5:27",
    spotifyTrackId: "5JLmRewZt4RWMTVbEVbDdj",
    preview: "https://p.scdn.co/mp3-preview/f0ca7c2c1de0f3542756b4ef884ef1c0fb4e67c2"
  },
  "isrc:QZPJ32157279": {
    title: "Dreamyard (From \"Pokémon Black & White\")",
    isrc: "QZPJ32157279",
    duration: "4:50",
    spotifyTrackId: "0Lzg8hRWnixuZiJHuzJXpo",
    preview: "https://p.scdn.co/mp3-preview/807e2d5c925ef728c5de2420d7f75e032018e92b"
  },
  "isrc:QZGWX2245045": {
    title: "Driftveil City (From \"Pokémon Black & White\")",
    isrc: "QZGWX2245045",
    duration: "5:18",
    spotifyTrackId: "2y2LxGPqGK7Zspo97ZYtY9",
    preview: "https://p.scdn.co/mp3-preview/eb6f383c3835687cd57672396482338ed79de445"
  },
  "isrc:QZPJ32175757": {
    title: "Driftveil City (From \"Pokémon Black & White\") [2022 Arrangement]",
    isrc: "QZPJ32175757",
    duration: "4:02",
    spotifyTrackId: "01gxB3FnSktxZ0voplAwgh",
    preview: "https://p.scdn.co/mp3-preview/2f9e9ecbb183f29797ce08b6e7e5302de490c938"
  },
  "isrc:QZ6K42501084": {
    title: "East Province (From \"Pokémon Scarlet & Violet\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42501084",
    duration: "4:18",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32168957": {
    title: "Embracing One's Duty (From \"Pokémon Black & White\")",
    isrc: "QZPJ32168957",
    duration: "4:29",
    spotifyTrackId: "29V2hDI9WP5uCtWBKNxcSG",
    preview: "https://p.scdn.co/mp3-preview/d6ce3449e6f899ee33941cd9f6151991a729416b"
  },
  "isrc:QZGWX2245191": {
    title: "Ending \"Onward to Our Own Futures\" (Modern Arrangement)",
    isrc: "QZGWX2245191",
    duration: "2:24",
    spotifyTrackId: "5WgwcQIhehnoTxUmFGAXS0",
    preview: "https://p.scdn.co/mp3-preview/c4fc581c8b6a983d77bc16af253934dcbcd2a921"
  },
  "isrc:QZPJ32338002": {
    title: "Entralink (From \"Pokémon Black & White\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZPJ32338002",
    artists: ["Go Ichinose", "Shota Kageyama", "Pokestir"],
    duration: "2:54",
    spotifyTrackId: "27QMkEeXyrLNJgjVS6ca5f",
    preview: "https://p.scdn.co/mp3-preview/0522a573da7e46404aa687364b83429e9cfc0e95"
  },
  "isrc:QZGWX2237767": {
    title: "Escape",
    isrc: "QZGWX2237767",
    duration: "2:05",
    spotifyTrackId: "3liaR2reUJ429i8OFR16xl",
    preview: "https://p.scdn.co/mp3-preview/c94ec2c1ea85ef4d2fbde38b50653dad90538783"
  },
  "isrc:QZGWX2251438": {
    title: "Eterna City (Day) (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZGWX2251438",
    duration: "4:58",
    spotifyTrackId: "5soouPPaqaHnrxg5YopfJo",
    preview: "https://p.scdn.co/mp3-preview/f66183e8c8aeb04faba62e7e36ed2f8095f6bdc4"
  },
  "isrc:QZPJ32161153": {
    title: "Eterna City (Night) (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32161153",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "4:58",
    spotifyTrackId: "6BaMMoLB0rld2AVAb7sniB",
    preview: "https://p.scdn.co/mp3-preview/98f8e2b16c662e265075f1d8ab58d40362fa083e"
  },
  "isrc:QZGWX2245179": {
    title: "Eusine (From \"Pokémon HeartGold & SoulSilver\")",
    isrc: "QZGWX2245179",
    duration: "3:15",
    spotifyTrackId: "095rle6Mw4KA2x82ITy1uO",
    preview: "https://p.scdn.co/mp3-preview/b0bfc035ce9ddceaa97b5c3e828b19a2995d6b05"
  },
  "isrc:QZGWX2237766": {
    title: "Experiments",
    isrc: "QZGWX2237766",
    duration: "2:01",
    spotifyTrackId: "2JUISUxF25y36TBw9HvdjT",
    preview: "https://p.scdn.co/mp3-preview/f861912750bb4cf30faa197ce7ebc4bce3b852de"
  },
  "isrc:QZGWX2245190": {
    title: "Farewell (From \"Pokémon Black & White\") [Modern Arrangement]",
    isrc: "QZGWX2245190",
    duration: "4:36",
    spotifyTrackId: "6KcGOHX8aGQnDIxfxsDUOT",
    preview: "https://p.scdn.co/mp3-preview/365344285c0a6aab54cf5dd3ef5411fcb8baf1b9"
  },
  "isrc:QZPJ32396583": {
    title: "Ferry Terminal (Garage Remix)",
    isrc: "QZPJ32396583",
    artists: ["onion_mu"],
    duration: "2:20",
    spotifyTrackId: "3ciGtM19bZxitM4RCPWI6i",
    preview: "https://p.scdn.co/mp3-preview/3b4722c2f650bf0745c431685090bbe36d138d0f"
  },
  "isrc:QZPJ32127948": {
    title: "Floccesy Town (From \"Pokémon Black 2 & White 2\") [Arrangement]",
    isrc: "QZPJ32127948",
    artists: ["Hitomi Sato", "Go Ichinose", "Pokestir"],
    duration: "4:52",
    spotifyTrackId: "3rd9swihvdFa4e2lIQNhCY",
    preview: "https://p.scdn.co/mp3-preview/b10405c1e2bc27cc2dcd2e3f7bdac485db4f6f69"
  },
  "isrc:QZGWX2245159": {
    title: "Flower Garden (From \"Yoshi's Island\")",
    isrc: "QZGWX2245159",
    artists: ["Kazumi Totaka", "Pokestir"],
    duration: "5:12",
    spotifyTrackId: "0idybBaAq6xZBbJ1gtERjY",
    preview: "https://p.scdn.co/mp3-preview/875d6a5af057cadb1bffd21a7041eba88d2445bc"
  },
  "isrc:QZ6K42500364": {
    title: "Forecast: Daytime (Forecast Channel) (Arr. for Orchestra)",
    isrc: "QZ6K42500364",
    duration: "2:18",
    spotifyTrackId: "4zg515cW3Wu5USt3YCVD34",
    preview: "https://p.scdn.co/mp3-preview/c7188f15d6b963cce115018631a84c2068242a1a"
  },
  "isrc:QZ6K42501142": {
    title: "Forest Temple (From \"The Legend of Zelda: Ocarina of Time\")",
    isrc: "QZ6K42501142",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "3:35",
    spotifyTrackId: "3KdxcXhUcLFLeIwzHXUI5W",
    preview: "https://p.scdn.co/mp3-preview/8fa688a746d5c80e53fdbf776065bcf21ac2407b"
  },
  "isrc:QZPJ32277418": {
    title: "Fortress (From \"Super Mario World\") [Cinematic Arrangement]",
    isrc: "QZPJ32277418",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "5:20",
    spotifyTrackId: "41MgUf7tNldeuG4GDHHv33",
    preview: "https://p.scdn.co/mp3-preview/d8b207d288818358b63a5f704388662d5a52e302"
  },
  "isrc:QZPJ32224792": {
    title: "Freezeezy Peak (From \"Banjo - Kazooie\") [Arrangement]",
    isrc: "QZPJ32224792",
    duration: "6:02",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32435884": {
    title: "Freezy Flake Galaxy (From \"Super Mario Galaxy 2\") [Arrangement]",
    isrc: "QZPJ32435884",
    artists: ["Mahito Yokota", "Pokestir"],
    duration: "4:38",
    spotifyTrackId: "39i9y7oc5rgjqFQ7DrlEax",
    preview: "https://p.scdn.co/mp3-preview/206d7e6351f2803065e63a979b4de12bd6df067f"
  },
  "isrc:QZ6K42501274": {
    title: "Frog's Theme (From \"Chrono Trigger\")",
    isrc: "QZ6K42501274",
    artists: ["Yasunori Mitsuda", "Pokestir"],
    duration: "2:15",
    spotifyTrackId: "6LCEernF5PGiA2SfqzvhmM",
    preview: "https://p.scdn.co/mp3-preview/7f489ebe687338b4b145f215c9fd29616fb4bc4b"
  },
  "isrc:QZPJ32202071": {
    title: "Galactic Eterna Building (From \"Pokémon Diamond & Pearl\") (Arrangement)",
    isrc: "QZPJ32202071",
    duration: "3:24",
    spotifyTrackId: "1LDZVb5bI15w1qyp833brk",
    preview: "https://p.scdn.co/mp3-preview/35b4a77d8d0f976b0caad5746b314118fe937e6b"
  },
  "isrc:QZPJ32171959": {
    title: "Game Corner (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32171959",
    duration: "4:23",
    spotifyTrackId: "7DzpVOv09tuRDzInmkMgHw",
    preview: "https://p.scdn.co/mp3-preview/6cd39ac3e379338f0ffd82e949fa94f632801dfa"
  },
  "isrc:QZ6K42500358": {
    title: "Game Corner (From \"Pokémon Ruby & Sapphire\") [Jazz Arrangement]",
    isrc: "QZ6K42500358",
    duration: "4:10",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42501408": {
    title: "Ganondorf Battle (From \"the Legend of Zelda: The Wind Waker\")",
    isrc: "QZ6K42501408",
    artists: ["Kenta Nagata", "Koji Kondo", "Hajime Wakai", "Toru Minegishi", "Pokestir"],
    duration: "4:14",
    spotifyTrackId: "4CsdzsP4CidKb65TUD4lqo",
    preview: "https://p.scdn.co/mp3-preview/00291b98c9de6ffc4f04bedf3a35feb281b4eab2"
  },
  "isrc:QZGWX2245160": {
    title: "Gate (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZGWX2245160",
    duration: "5:26",
    spotifyTrackId: "1D6lLQlB9LI1b0JjxC45lB",
    preview: "https://p.scdn.co/mp3-preview/4927962437b47419fd861b55a1fc734cbc43e1e4"
  },
  "isrc:QZPJ32148502": {
    title: "Gear Station (From \"Pokémon Black & White\")",
    isrc: "QZPJ32148502",
    artists: ["Go Ichinose", "Morikazu Aoiki", "Pokestir"],
    duration: "4:38",
    spotifyTrackId: "5UvOsN3cH6at8sLuJLAbWm",
    preview: "https://p.scdn.co/mp3-preview/3ccd50d6bbcb8a2b312339db560e8e37cdeb2016"
  },
  "isrc:QZPJ32318643": {
    title: "Geosenge Town (Arrangement)",
    isrc: "QZPJ32318643",
    artists: ["Pokestir", "StevenMix"],
    duration: "2:59",
    spotifyTrackId: "4gL99Q4h7Un7QfmpxlZZnR",
    preview: "https://p.scdn.co/mp3-preview/c91e50c5690a4052e782fef39900091377d6686b"
  },
  "isrc:QZPJ32302596": {
    title: "Gerudo Valley (From \"The Legend of Zelda: Ocarina of Time\")",
    isrc: "QZPJ32302596",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "3:58",
    spotifyTrackId: "5lKkmmuIgJGC9xhQOJwfe5",
    preview: "https://p.scdn.co/mp3-preview/6a7c71603c6541c47f994f6324e2aedd1b8835e9"
  },
  "isrc:QZGWX2245060": {
    title: "Goldenrod City (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZGWX2245060",
    duration: "5:07",
    spotifyTrackId: "1qGM4nZoBywSBMZ8v5qa4K",
    preview: "https://p.scdn.co/mp3-preview/efca7653c51249f5a3bb8b0b5297bdf54862cacd"
  },
  "isrc:QZPJ32114113": {
    title: "Goldenrod Game Corner (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZPJ32114113",
    artists: ["Shota Kageyama", "Go Ichinose", "Pokestir"],
    duration: "5:23",
    spotifyTrackId: "1TVA5xCqIwD4rA9IsKIBhS",
    preview: "https://p.scdn.co/mp3-preview/3fa8cc8f8a4e34a396cbca38711f8401f51c2d60"
  },
  "isrc:QZ6K42501410": {
    title: "Grandma (From \"the Legend of Zelda: The Wind Waker\")",
    isrc: "QZ6K42501410",
    artists: ["Kenta Nagata", "Koji Kondo", "Hajime Wakai", "Toru Minegishi", "Pokestir"],
    duration: "3:12",
    spotifyTrackId: "1ELZsdhvwKo7mK34cfbmYm",
    preview: "https://p.scdn.co/mp3-preview/2e17c1922155156a978a14411a4ec6b8fc3de531"
  },
  "isrc:QZ6K42600744": {
    title: "Ground Theme (From \"New Super Mario Bros\")",
    isrc: "QZ6K42600744",
    duration: "5:14",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32423957": {
    title: "Guardia Millennial Fair (From \"Chrono Trigger\")",
    isrc: "QZPJ32423957",
    artists: ["Yasunori Mitsuda", "Pokestir"],
    duration: "4:44",
    spotifyTrackId: "5B2oN5aTMi7Qpo4vhKbfd6",
    preview: "https://p.scdn.co/mp3-preview/725572362b0bf1a83e2fe7781990a8ca0983257f"
  },
  "isrc:QZPJ32396582": {
    title: "Hau'oli City (Night) [Arrangement]",
    isrc: "QZPJ32396582",
    artists: ["Pokestir", "StevenMix"],
    duration: "3:00",
    spotifyTrackId: "1Gi8JtLVzlwv0ywNmnucEF",
    preview: "https://p.scdn.co/mp3-preview/71a506e6039c6305058ea724bb18f94c4c51e828"
  },
  "isrc:QZPJ32396586": {
    title: "Heahea City (Arrangement)",
    isrc: "QZPJ32396586",
    artists: ["Pokestir", "StevenMix"],
    duration: "3:26",
    spotifyTrackId: "1Ybb4Oo3JwEX6RRPucULpO",
    preview: "https://p.scdn.co/mp3-preview/c1120299578d9c12726e97bf290921a9882e83dd"
  },
  "isrc:QZ6K42501401": {
    title: "Hearthome City (From \"Pokémon Diamond & Pearl\") [Jazz Arrangement]",
    isrc: "QZ6K42501401",
    duration: "2:05",
    spotifyTrackId: "5wsk2qT8R2pDS1aA7B74Mb",
    preview: "https://p.scdn.co/mp3-preview/91033f31ae085630c8e8a9ce374eda9f5acd5ee3"
  },
  "isrc:QZPJ32124959": {
    title: "Hoenn Victory Road (From \"Pokémon Ruby & Sapphire\") [Arrangement]",
    isrc: "QZPJ32124959",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "5:20",
    spotifyTrackId: "0UoOSgsVKaUfRrYELDGswL",
    preview: "https://p.scdn.co/mp3-preview/c693a12d605db713b01aa60e01e7087c5a1e58dc"
  },
  "isrc:QZ6K42501132": {
    title: "House (From \"The Legend of Zelda: Ocarina of Time\")",
    isrc: "QZ6K42501132",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "1:26",
    spotifyTrackId: "2XXhEbUAr73iLQF6mp3QFB",
    preview: "https://p.scdn.co/mp3-preview/01ea4d2e56244ca604cfee438302b1e22cf2dd23"
  },
  "isrc:QZ6K42600752": {
    title: "Hyrule Castle (From \"The Legend of Zelda: A Link to the Past\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42600752",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "2:55",
    spotifyTrackId: "4ExY0YFUJrsRmXlG5Ub779",
    preview: "https://p.scdn.co/mp3-preview/052524a96171454927bbb7465bfbc936d5a2be9f"
  },
  "isrc:QZ6K42501406": {
    title: "Hyrule Castle (From \"the Legend of Zelda: The Wind Waker\")",
    isrc: "QZ6K42501406",
    artists: ["Kenta Nagata", "Koji Kondo", "Hajime Wakai", "Toru Minegishi", "Pokestir"],
    duration: "4:11",
    spotifyTrackId: "03usNLyr6qX4wk9HQaT9B1",
    preview: "https://p.scdn.co/mp3-preview/4b373f70de722147ff16ccd0ccab78758d93e895"
  },
  "isrc:QZ6K42501080": {
    title: "Hyrule Field (From \"The Legend of Zelda: Ocarina of Time\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42501080",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "4:57",
    spotifyTrackId: "6C6dZvDGWbLZrXgXgIlnS6",
    preview: "https://p.scdn.co/mp3-preview/c6d99521d9fdb1ff8fb9e969d20c0352a418a771"
  },
  "isrc:QZPJ32351947": {
    title: "Icirrus City (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32351947",
    artists: ["Shota Kageyama", "Pokestir"],
    duration: "2:31",
    spotifyTrackId: "5F0QjUp9JtcWboV57HlpTI",
    preview: "https://p.scdn.co/mp3-preview/696d6c80ed6aace6d20cb7f3935021a27807730b"
  },
  "isrc:QZPJ32136565": {
    title: "In the Final (From \"Mario & Luigi: Bowser's Inside Story\") [Arrangement]",
    isrc: "QZPJ32136565",
    artists: ["Yoko Shimomura", "Pokestir"],
    duration: "4:17",
    spotifyTrackId: "6wOyzD9cpf0ng8wKLXFRie",
    preview: "https://p.scdn.co/mp3-preview/b7d4b5167081e2e25774f061f0208eb69aede52d"
  },
  "isrc:QZPJ32333405": {
    title: "In the Usual Room",
    isrc: "QZPJ32333405",
    duration: "4:56",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42501415": {
    title: "Intense Battle (From \"the Legend of Zelda: The Wind Waker\")",
    isrc: "QZ6K42501415",
    artists: ["Kenta Nagata", "Koji Kondo", "Hajime Wakai", "Toru Minegishi", "Pokestir"],
    duration: "2:22",
    spotifyTrackId: "76hzrSHTCRqKn1Tq1rxkZa",
    preview: "https://p.scdn.co/mp3-preview/7fea457768a1c183804325645b6277ffa2e2c446"
  },
  "isrc:QZPJ32318774": {
    title: "Introduction (From \"Pokémon Diamond & Pearl\") [Orchestral Arrangement]",
    isrc: "QZPJ32318774",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "4:48",
    spotifyTrackId: "69IMQWykY1yuym4ZMaKNfO",
    preview: "https://p.scdn.co/mp3-preview/92edd58b4a4c9179d5a14906c752fe2e575fdd0f"
  },
  "isrc:QZPJ32469259": {
    title: "Is It Worth It?",
    isrc: "QZPJ32469259",
    duration: "2:08",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32222807": {
    title: "Johto Wild Battle (From \"Pokémon HeartGold & SoulSilver\") (Arrangement)",
    isrc: "QZPJ32222807",
    duration: "3:18",
    spotifyTrackId: "1hdDXznibMtXRp7o9epPr3",
    preview: "https://p.scdn.co/mp3-preview/9632767f559a4053c2ff51ea596932de57c4e4d5"
  },
  "isrc:QZPJ32432448": {
    title: "Jubilife City (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32432448",
    artists: ["Hitomi Sato", "Pokestir"],
    duration: "3:13",
    spotifyTrackId: "7iCov4QDuuUSPz5To2ee1q",
    preview: "https://p.scdn.co/mp3-preview/2922788b664cad1a4f5310d35134d44a2f73f628"
  },
  "isrc:QZ6K42500315": {
    title: "Kalos Region Theme (From \"Pokemon X & Y) [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42500315",
    artists: ["Shota Kageyama", "Pokestir"],
    duration: "3:03",
    spotifyTrackId: "3AFQkC7H2AmbdJj3q06Nok",
    preview: "https://p.scdn.co/mp3-preview/c0b24d0cae6973237f73e8a025f16ec66e69628d"
  },
  "isrc:QZPJ32318650": {
    title: "Kiloude City (Arrangement)",
    isrc: "QZPJ32318650",
    artists: ["StevenMix"],
    duration: "2:41",
    spotifyTrackId: "3LKa3AUhVlYhPvs06kpbSo",
    preview: "https://p.scdn.co/mp3-preview/2cef950f9d0035a0478772230e7bf0c0226fdc80"
  },
  "isrc:QZPJ32374355": {
    title: "Kokiri Forest (From \"the Legend of Zelda: Ocarina of Time\") [Arrangement]",
    isrc: "QZPJ32374355",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "2:26",
    spotifyTrackId: "7Apku1LnEVTbENgu45z0yU",
    preview: "https://p.scdn.co/mp3-preview/7717edf32876370c9872c2247668c7a6ab2a36c8"
  },
  "isrc:QZPJ32305303": {
    title: "Lacunosa Town (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32305303",
    artists: ["Go Ichinose", "Shota Kageyama", "Hitomi Sato", "Pokestir"],
    duration: "3:23",
    spotifyTrackId: "4fmxXJMRf8GlzEsWNG8K6B",
    preview: "https://p.scdn.co/mp3-preview/4af1230b7daa1a9334764c3926e728c6cca8aeb0"
  },
  "isrc:QZPJ32279543": {
    title: "Lake of Rage (From \"Pokémon Heartgold & Soulsilver\") [Orchestral Arrangement]",
    isrc: "QZPJ32279543",
    artists: ["Go Ichinose", "Junichi Masuda", "Pokestir", "David Karsten"],
    duration: "3:05",
    spotifyTrackId: "2TdC6NlyL9wMfvAxrP5SzV",
    preview: "https://p.scdn.co/mp3-preview/90c41570d0a868ae4512cc7cfbd647269aec9ef8"
  },
  "isrc:QZ6K42501280": {
    title: "Last Battle (From \"Chrono Trigger\")",
    isrc: "QZ6K42501280",
    artists: ["Yasunori Mitsuda", "Pokestir"],
    duration: "3:50",
    spotifyTrackId: "27mAFMSku0tzLE8jnAWLXq",
    preview: "https://p.scdn.co/mp3-preview/853d78846604198b7abff0d6bb885daeabc10659"
  },
  "isrc:QZ6K42501145": {
    title: "Last Battle (From \"The Legend of Zelda: Ocarina of Time\")",
    isrc: "QZ6K42501145",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "3:39",
    spotifyTrackId: "1PFnyhoD3GaZIsWnWgAVIf",
    preview: "https://p.scdn.co/mp3-preview/9fa84e7e62ae2ebe99626225ebe6a1c4501f7b7b"
  },
  "isrc:QZPJ32216716": {
    title: "Lavender Town (From \"Pokémon HeartGold & SoulSilver\") (Arrangement)",
    isrc: "QZPJ32216716",
    duration: "3:26",
    spotifyTrackId: "4cWZw2uVruyclLsqcdx4P0",
    preview: "https://p.scdn.co/mp3-preview/734c802ab5656b9da3b0f9f48d08fabb12fe9d7b"
  },
  "isrc:QZPJ32318646": {
    title: "Laverre City (feat. StevenMix) [Arrangement]",
    isrc: "QZPJ32318646",
    artists: ["Pokestir", "StevenMix"],
    duration: "3:26",
    spotifyTrackId: "6R4C7F1cgMo7ziRmJWTOE1",
    preview: "https://p.scdn.co/mp3-preview/abc02e4b96a1977f628daf653b40421da5cc3132"
  },
  "isrc:QZ6K42501085": {
    title: "Levincia (From \"Pokémon Scarlet & Violet\") [Modern Arrangement]",
    isrc: "QZ6K42501085",
    duration: "3:42",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32413773": {
    title: "Looker's Theme (From \"Pokémon Platinum\") [Arrangement]",
    isrc: "QZPJ32413773",
    artists: ["Hitomi Sato", "Pokestir"],
    duration: "2:03",
    spotifyTrackId: "7rCGn8Oz7VVbk6EO8pm9qr",
    preview: "https://p.scdn.co/mp3-preview/1639928ee962a4d0a3f0b159d55957edff138904"
  },
  "isrc:QZPJ32303788": {
    title: "Lost Woods (From \"The Legend of Zelda: Ocarina of Time\")",
    isrc: "QZPJ32303788",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "3:13",
    spotifyTrackId: "3uwdm84ZyAfp4keICyQ13l",
    preview: "https://p.scdn.co/mp3-preview/6bb859e9b243baaeddea7ed8af88b95d89a130b8"
  },
  "isrc:QZPJ32318640": {
    title: "Lumiose City (Arrangement)",
    isrc: "QZPJ32318640",
    duration: "3:31",
    spotifyTrackId: "725kUA0uNbLmmw1bxuE57z",
    preview: "https://p.scdn.co/mp3-preview/9511032df13fe668de3c606e307c6e79a0ea2d53"
  },
  "isrc:QZPJ32419332": {
    title: "Mad Monster Mansion (From \"Banjo Kazooie\") [Orchestral Arrangement]",
    isrc: "QZPJ32419332",
    duration: "4:00",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32396581": {
    title: "Mahalo Trail (Orchestral Arrangement)",
    isrc: "QZPJ32396581",
    duration: "2:28",
    spotifyTrackId: "0sviqdEXbfLe9USfZujfli",
    preview: "https://p.scdn.co/mp3-preview/435cabf3e097e2698fec4f5dc62d0c96da03fb20"
  },
  "isrc:QZPJ32377113": {
    title: "Main Theme (From \"Chrono Trigger\") [Orchestral Arrangement]",
    isrc: "QZPJ32377113",
    artists: ["Yasunori Mitsuda", "Pokestir"],
    duration: "4:22",
    spotifyTrackId: "2iyNWecg4gaoockkLwOBLN",
    preview: "https://p.scdn.co/mp3-preview/29552fe3d039ce1a6dda87911ed27138e90b2151"
  },
  "isrc:QZ6K42501456": {
    title: "Main Theme (From \"Streetpass MII Plaza\")",
    isrc: "QZ6K42501456",
    duration: "4:01",
    spotifyTrackId: "78J3m15h4H1orF1UZHX2pK",
    preview: "https://p.scdn.co/mp3-preview/12bde504a1be82a68db3e1b99b0ac622fbad3f37"
  },
  "isrc:QZ6K42500360": {
    title: "Main Theme (Photos Channel) [Modern Arrangement]",
    isrc: "QZ6K42500360",
    duration: "2:15",
    spotifyTrackId: "3ZgDiGrAefTRgONCBQMjwy",
    preview: "https://p.scdn.co/mp3-preview/fb3f20e2e0efbcc6f8aa0392cafa2af4b8ce4cc1"
  },
  "isrc:QZ6K42500363": {
    title: "Main Theme (Wii Shop Channel) [Jazz Arrangement]",
    isrc: "QZ6K42500363",
    duration: "3:41",
    spotifyTrackId: "17TDnmJWsT9ug1t4PYijjG",
    preview: "https://p.scdn.co/mp3-preview/5e9d73207fcf56ef3a69704af8c112f70afc708a"
  },
  "isrc:QZGWX2249461": {
    title: "May the Hunt Begin (From \"Khymern Hunters\")",
    isrc: "QZGWX2249461",
    duration: "5:48",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42500368": {
    title: "Menu (Everybody Votes Channel) [Jazzy House Arrangement]",
    isrc: "QZ6K42500368",
    duration: "2:19",
    spotifyTrackId: "1pvxrMvHt7wCYxeIbMJQLp",
    preview: "https://p.scdn.co/mp3-preview/e73d2d056c3e155c9fef3f23261772a3f8ecbe49"
  },
  "isrc:QZPJ32388849": {
    title: "Middle Boss Battle (From \"the Legend of Zelda: Ocarina of Time\") [Arrangement]",
    isrc: "QZPJ32388849",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "3:05",
    spotifyTrackId: "72go80l2AdNSR78URft3NC",
    preview: "https://p.scdn.co/mp3-preview/c9d8100515a14089539e2412b91e81ee00acabf3"
  },
  "isrc:QZ6K42500359": {
    title: "MII Plaza (MII Channel) [Modern Arrangement]",
    isrc: "QZ6K42500359",
    duration: "3:42",
    spotifyTrackId: "348HvTyQMtyJMMxhaOlmFT",
    preview: "https://p.scdn.co/mp3-preview/70636cf2b87c2e76e70af1862f1779784c9aecb8"
  },
  "isrc:QZPJ32285176": {
    title: "Mistralton City (From \"Pokemon Black and White\") [Arrangement]",
    isrc: "QZPJ32285176",
    artists: ["Go Ichinose", "Pokestir", "The Zame"],
    duration: "3:58",
    spotifyTrackId: "6Cnr4No2uXVaJZs71YWKIQ",
    preview: "https://p.scdn.co/mp3-preview/e872e1fe7997d9abf5a31d53335cd509f7c147a5"
  },
  "isrc:QZ6K42501407": {
    title: "Molgera Battle (From \"the Legend of Zelda: The Wind Waker\")",
    isrc: "QZ6K42501407",
    artists: ["Kenta Nagata", "Koji Kondo", "Hajime Wakai", "Toru Minegishi", "Pokestir"],
    duration: "2:35",
    spotifyTrackId: "7Cn7kwehgCTfv3ljJLGiya",
    preview: "https://p.scdn.co/mp3-preview/8f05679245f50c299223030aec124a07d0f3736d"
  },
  "isrc:QZ6K42500979": {
    title: "Mt. Chimney (From \"Pokémon Ruby & Sapphire\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42500979",
    duration: "3:11",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32282119": {
    title: "Mt. Coronet (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32282119",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "4:21",
    spotifyTrackId: "5jUVfEVAtnkrjEIcg0cPiT",
    preview: "https://p.scdn.co/mp3-preview/f60e1bb9aa0ba09008e2c598ba92f74f8dec754b"
  },
  "isrc:QZGWX2249069": {
    title: "Musical \"Meloettaaa (From \"Pokémon Black 2 & White 2\") [Arrangement]",
    isrc: "QZGWX2249069",
    duration: "2:57",
    spotifyTrackId: "5Q0BvGEJmQSBBx2GVEfdFG",
    preview: "https://p.scdn.co/mp3-preview/f47608d09631f849aa4a1d879ea0d704c01b46fb"
  },
  "isrc:QZPJ32173112": {
    title: "Musical Theater (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32173112",
    duration: "3:23",
    spotifyTrackId: "4MyjwbVFQxWnVxmGf1Ffoa",
    preview: "https://p.scdn.co/mp3-preview/d8ca75a5bdfddd565c4e1cdf549c6ea8278d7cb5"
  },
  "isrc:QZPJ32138049": {
    title: "Musical: Pokémon Party (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32138049",
    artists: ["Minako Adachi", "Pokestir"],
    duration: "4:22",
    spotifyTrackId: "3x4TPVrnOwsAY0E9zJyAFJ",
    preview: "https://p.scdn.co/mp3-preview/70d78e03bb10fdfde1461395592dc1a74b43c39c"
  },
  "isrc:QZGWX2245061": {
    title: "N's Castle (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZGWX2245061",
    duration: "5:35",
    spotifyTrackId: "4eEoJbAyxTxZBEmZegslNo",
    preview: "https://p.scdn.co/mp3-preview/703ca8240820679fbd8c6c04d7b246261f2dc0bc"
  },
  "isrc:QZPJ32332168": {
    title: "Nacrene City (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32332168",
    artists: ["Shota Kageyama", "Go Ichinose", "Pokestir"],
    duration: "4:43",
    spotifyTrackId: "5bNZreg9BJL8zjegEtdGWm",
    preview: "https://p.scdn.co/mp3-preview/54c11732c92641360970f7a7ce621d5ac5cb467d"
  },
  "isrc:QZPJ32114841": {
    title: "Nimbasa City (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32114841",
    artists: ["Shota Kageyama", "Pokestir"],
    duration: "5:36",
    spotifyTrackId: "5NhJxfan0HZoiKr6H1c8Oj",
    preview: "https://p.scdn.co/mp3-preview/beb314bde13e17d4758677f245decceb3cb14935"
  },
  "isrc:QZPJ32325962": {
    title: "Nimbasa City (From \"Pokémon Black & White\") [Modern Arrangement]",
    isrc: "QZPJ32325962",
    artists: ["Shota Kageyama", "Pokestir"],
    duration: "3:53",
    spotifyTrackId: "1nVZKlkUBZKQ6fm35P7Zty",
    preview: "https://p.scdn.co/mp3-preview/beb314bde13e17d4758677f245decceb3cb14935"
  },
  "isrc:QZGWX2237772": {
    title: "No Mercy",
    isrc: "QZGWX2237772",
    duration: "2:06",
    spotifyTrackId: "2RYP27jiZBfeH5ZeBqxfVG",
    preview: "https://p.scdn.co/mp3-preview/90fcb68e3d2385d41da051438ba0db0360c90b82"
  },
  "isrc:QZ6K42500357": {
    title: "North Province (From \"Pokémon Scarlet & Violet\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42500357",
    duration: "4:19",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZGWX2237771": {
    title: "Nostalgia",
    isrc: "QZGWX2237771",
    duration: "2:05",
    spotifyTrackId: "34aupacQJ1isQ97jeuOdM4",
    preview: "https://p.scdn.co/mp3-preview/0cfdb131ffe0c12dbdcc63d822792aa477d5219f"
  },
  "isrc:QZPJ32250042": {
    title: "Nuvema Town (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32250042",
    artists: ["Shota Kageyama", "Pokestir"],
    duration: "2:59",
    spotifyTrackId: "19TUCl8uH7SmgCoPDDF5Bv",
    preview: "https://p.scdn.co/mp3-preview/2e1f5efcb33436c45dc30ce881ace86cedee2e77"
  },
  "isrc:QZPJ32220766": {
    title: "Oldale Town (From \"Pokémon Ruby & Sapphire\") [Arrangement]",
    isrc: "QZPJ32220766",
    duration: "2:40",
    spotifyTrackId: "0VP4xjK9vSHJBIyDEuwJpH",
    preview: "https://p.scdn.co/mp3-preview/d827820adf7eb2f77d10e37407d14953182a04b7"
  },
  "isrc:QZPJ32211422": {
    title: "Olivine Lighthouse (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZPJ32211422",
    duration: "4:07",
    spotifyTrackId: "1VwFTk5TXcVDW3J7cXqiZv",
    preview: "https://p.scdn.co/mp3-preview/8671d6860ed44da8ba7c3bd461a9fd316927dfba"
  },
  "isrc:QZPJ32180165": {
    title: "Opelucid City (Black) (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32180165",
    duration: "4:00",
    spotifyTrackId: "4spgAFQeDv38cXPHd0d09b",
    preview: "https://p.scdn.co/mp3-preview/0d1273cc26e0b941753a16c464c222d619b1b6ab"
  },
  "isrc:QZPJ32281069": {
    title: "Opelucid City (From \"Pokémon White\") [Arrangement]",
    isrc: "QZPJ32281069",
    artists: ["Shota Kageyama", "Go Ichinose", "Pokestir"],
    duration: "3:26",
    spotifyTrackId: "7m5sxE7xUruRI9rnkqU8JB",
    preview: "https://p.scdn.co/mp3-preview/79a074ab8ee768aa23b8273d7b8543af842e1e03"
  },
  "isrc:QZPJ32266806": {
    title: "Opening Movie (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZPJ32266806",
    artists: ["Go Ichinose", "Junichi Masuda", "Morikazu Aoki", "Pokestir"],
    duration: "1:10",
    spotifyTrackId: "4nNtSqt7LcY3KCVmHeakVv",
    preview: "https://p.scdn.co/mp3-preview/91c7f2eea9851963bf63a06dfaf1152194d4e20f"
  },
  "isrc:QZPJ32165123": {
    title: "Oreburgh Mine (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32165123",
    duration: "4:37",
    spotifyTrackId: "4kJXHhTi3MBdGV4CqU4HYT",
    preview: "https://p.scdn.co/mp3-preview/49e2c40d9ba7993df04739fe6de56a2a43b7d267"
  },
  "isrc:QZ6K42501409": {
    title: "Outset Island (From \"the Legend of Zelda: The Wind Waker\")",
    isrc: "QZ6K42501409",
    artists: ["Kenta Nagata", "Koji Kondo", "Hajime Wakai", "Toru Minegishi", "Pokestir"],
    duration: "3:50",
    spotifyTrackId: "3T2atZZlyuq4jVVX5hRj4Q",
    preview: "https://p.scdn.co/mp3-preview/1f2e2b057129cd5a491bb38956f350abcda4e0cc"
  },
  "isrc:QZPJ32255646": {
    title: "Overworld (From \"Super Mario World\") (Arrangement)",
    isrc: "QZPJ32255646",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "2:54",
    spotifyTrackId: "416PYrFCRZuIqF8MwR9O1W",
    preview: "https://p.scdn.co/mp3-preview/2b95ac3e0375ab0718bad76fc7209fa2d62b3d67"
  },
  "isrc:QZPJ32310058": {
    title: "Overworld (From \"the Legend of Zelda\") [Arrangement]",
    isrc: "QZPJ32310058",
    duration: "4:00",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32476474": {
    title: "Pacific Blue",
    isrc: "QZPJ32476474",
    duration: "3:58",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42500978": {
    title: "Palace (From “Super Mario Bros. Wonder”) [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42500978",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "5:17",
    spotifyTrackId: "1K9b0ecxhAKAqGm3bLjzeA",
    preview: "https://p.scdn.co/mp3-preview/08d605a4cba53b50d5d34a73bb172d92f4d9c300"
  },
  "isrc:QZPJ32396588": {
    title: "Paniola Ranch (Orchestral Arrangement)",
    isrc: "QZPJ32396588",
    artists: ["StevenMix"],
    duration: "3:04",
    spotifyTrackId: "5meabxp7bICOKAekc2hBSw",
    preview: "https://p.scdn.co/mp3-preview/1935ece79964a0238b629796da043ab55c6bd0ea"
  },
  "isrc:QZGWX2237765": {
    title: "Peace",
    isrc: "QZGWX2237765",
    duration: "2:06",
    spotifyTrackId: "5M3cPewG1b1g1IbJAJ0mnl",
    preview: "https://p.scdn.co/mp3-preview/fa8478261cbc09756e1fde3498aeabe9a89ebc33"
  },
  "isrc:QZ6K42501411": {
    title: "Pirates (From \"the Legend of Zelda: The Wind Waker\")",
    isrc: "QZ6K42501411",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "3:06",
    spotifyTrackId: "1hWc2N1RRXJYssff3KGSBK",
    preview: "https://p.scdn.co/mp3-preview/72274ca247449197bf95740fdcaf78ac5658a984"
  },
  "isrc:QZPJ32334731": {
    title: "Pizza Time!",
    isrc: "QZPJ32334731",
    duration: "2:08",
    spotifyTrackId: "1CIvmPi1wBk6ZnBBp4zB9Z",
    preview: "https://p.scdn.co/mp3-preview/7b881f8b5c5d8f305f3da0155300a6fead2f6a28"
  },
  "isrc:QZPJ32396591": {
    title: "Poke Pelago (Arrangement)",
    isrc: "QZPJ32396591",
    artists: ["StevenMix"],
    duration: "3:09",
    spotifyTrackId: "1VXgBtbh2ldmKKdBGwZyzF",
    preview: "https://p.scdn.co/mp3-preview/6f9460fff14738d8c4b412e5092ca681fa6b7e1d"
  },
  "isrc:QZPJ32111075": {
    title: "Pokéathlon: Finals (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZPJ32111075",
    artists: ["Shota Kageyama", "Takuto Kitsuta", "Pokestir"],
    duration: "5:25",
    spotifyTrackId: "6kJEMtyUWMVBnUZNW20RZY",
    preview: "https://p.scdn.co/mp3-preview/d28fd830418a297465f3f872179a532a7e54744a"
  },
  "isrc:QZGWX2245176": {
    title: "Pokémon Center (From \"Pokémon Black & White\")",
    isrc: "QZGWX2245176",
    duration: "5:22",
    spotifyTrackId: "0pcU04A4LXl0CYkug42MLb",
    preview: "https://p.scdn.co/mp3-preview/bc252133e5a748091e9778ca635a9adaf14d8c65"
  },
  "isrc:QZZEB2566742": {
    title: "Power Surge",
    isrc: "QZZEB2566742",
    duration: "2:16",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32264557": {
    title: "Princess Zelda (From \"The Legend of Zelda: Ocarina of Time\") (Orchestral Arrangement)",
    isrc: "QZPJ32264557",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "3:21",
    spotifyTrackId: "5eHMNNvJshJY6aKU93AXfI",
    preview: "https://p.scdn.co/mp3-preview/17b17a112c2d546f8dcef938efa4648a9bc34e47"
  },
  "isrc:QZ6K42500362": {
    title: "Puzzle (Photos Channel) [Bossa Arrangement]",
    isrc: "QZ6K42500362",
    duration: "2:38",
    spotifyTrackId: "4WaXDbuTYdbdBjzd6Nn0NO",
    preview: "https://p.scdn.co/mp3-preview/e233615a4e66d07c85f1d2b5e40fb3d482daaefb"
  },
  "isrc:QZPJ32248198": {
    title: "Quantum Nightscape",
    isrc: "QZPJ32248198",
    duration: "3:00",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZGWX2245189": {
    title: "Relic Castle (From “Pokémon Black & White”) - Arrangement",
    isrc: "QZGWX2245189",
    duration: "5:15",
    spotifyTrackId: "07lkqQz8P598mt27XNy4NG",
    preview: "https://p.scdn.co/mp3-preview/0404da8935a922c80e46a6fd6a4d665ca40512a9"
  },
  "isrc:QZ6K42500319": {
    title: "Relic Song (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZ6K42500319",
    duration: "2:45",
    spotifyTrackId: "7uTo43qaMG0apvTcj4hflB",
    preview: "https://p.scdn.co/mp3-preview/344bb114ec5deab2666e1afa158b77eff99a6e88"
  },
  "isrc:QZ6K42500369": {
    title: "Results (Everybody Votes Channel) [feat. Pokestir] [Jazzy House Arrangement]",
    isrc: "QZ6K42500369",
    artists: ["CrystalVGM", "Pokestir"],
    duration: "2:36",
    spotifyTrackId: "3olaASEw30YhXzIiDczfNp",
    preview: "https://p.scdn.co/mp3-preview/02483b38936e31689e5e024d2296c472fb5fb014"
  },
  "isrc:QZPJ32427249": {
    title: "Reversal Mountain (From “Pokémon White 2”) - Arrangement",
    isrc: "QZPJ32427249",
    duration: "2:48",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32396580": {
    title: "Route 1 on Melemele Island (Arrangement)",
    isrc: "QZPJ32396580",
    artists: ["StevenMix"],
    duration: "2:59",
    spotifyTrackId: "1011ytmEcnXXolhD43ktLu",
    preview: "https://p.scdn.co/mp3-preview/f3f0bb8778c2dc83a97a09284c07a2c4b83b5742"
  },
  "isrc:QZPJ32253323": {
    title: "Route 10 (From \"Pokémon Black & White\") [2023 Arrangement]",
    isrc: "QZPJ32253323",
    artists: ["Shota Kageyama", "Pokestir"],
    duration: "4:26",
    spotifyTrackId: "0OBTkFqgW5NXy1s7gVYMDk",
    preview: "https://p.scdn.co/mp3-preview/4d88dab53a3c5c25ddff34057b88a237ed5ad668"
  },
  "isrc:QZGWX2247027": {
    title: "Route 10 (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZGWX2247027",
    duration: "6:21",
    spotifyTrackId: "3LexDBlVXblTcF4BuLWzrO",
    preview: "https://p.scdn.co/mp3-preview/4d88dab53a3c5c25ddff34057b88a237ed5ad668"
  },
  "isrc:QZPJ32396596": {
    title: "Route 10 on Ula'ula Island (Orchestral Arrangement)",
    isrc: "QZPJ32396596",
    artists: ["Pokestir", "StevenMix"],
    duration: "3:43",
    spotifyTrackId: "2J6DTL8liJdtA5liJKkSzD",
    preview: "https://p.scdn.co/mp3-preview/7d7089835b8d5eee050eeae79c227c68aac2fdd6"
  },
  "isrc:QZ6K42501333": {
    title: "Route 104 (From \"Pokémon Ruby & Sapphire) [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42501333",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "2:54",
    spotifyTrackId: "2xbxkHnpu8CTAAYBhJAYki",
    preview: "https://p.scdn.co/mp3-preview/24ef0e40ce113f9f8af957d599f348c36d9ed518"
  },
  "isrc:QZPJ32373045": {
    title: "Route 111 (From \"Pokémon Ruby & Sapphire\") [Arrangement]",
    isrc: "QZPJ32373045",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "2:12",
    spotifyTrackId: "6TYzg8rPSVCM2fHFOgIHLm",
    preview: "https://p.scdn.co/mp3-preview/d3080bf7755847e11b417c6d85f1d57c9eff8e53"
  },
  "isrc:QZ6K42600977": {
    title: "Route 113 (from \"Pokémon Ruby & Sapphire\") (Jazz Arrangement)",
    isrc: "QZ6K42600977",
    duration: "3:26",
    spotifyTrackId: "1DdzvqCQag1VfiKJQ7LNCR",
    preview: "https://p.scdn.co/mp3-preview/f85cf14855f2fea3a0d4d6cc63facc7c72fc7473"
  },
  "isrc:QZPJ32203836": {
    title: "Route 119 (From \"Pokémon Ruby & Sapphire\") [Arrangement]",
    isrc: "QZPJ32203836",
    duration: "3:52",
    spotifyTrackId: "3LWCFuIwwUOgRFcjkLkhf8",
    preview: "https://p.scdn.co/mp3-preview/86150f081fb5b1a8fff839a6e18b33c298c4469d"
  },
  "isrc:QZPJ32228799": {
    title: "Route 12 (From \"Pokémon Black & White\") [Orchestral Arrangement]",
    isrc: "QZPJ32228799",
    duration: "4:12",
    spotifyTrackId: "4kYkprwvEyG1FnMlGv2zMK",
    preview: "https://p.scdn.co/mp3-preview/f0c810f970965000c634f65c591beb395a3d889b"
  },
  "isrc:QZPJ32298152": {
    title: "Route 120 (From \"Pokémon Ruby & Sapphire\") [Orchestral Arrangement]",
    isrc: "QZPJ32298152",
    artists: ["Morikazu Aoki", "Pokestir"],
    duration: "4:00",
    spotifyTrackId: "1Lx7f45XHP1OZHeXxu941F",
    preview: "https://p.scdn.co/mp3-preview/40329ca861431ff520df5fb5628bab6358f966ed"
  },
  "isrc:QZ6K42500370": {
    title: "Route 18 (From \"Pokemon X & Y) [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42500370",
    artists: ["Shota Kageyama", "Pokestir"],
    duration: "3:27",
    spotifyTrackId: "1vwIIGoGRZHn92lYboOdcc",
    preview: "https://p.scdn.co/mp3-preview/c9cad8ba55bae0e95847f3b79047d7e814d775c0"
  },
  "isrc:QZPJ32263213": {
    title: "Route 19 (From \"Pokémon Black 2 & White 2\") [Arrangement]",
    isrc: "QZPJ32263213",
    artists: ["Go Ichinose", "Shota Kageyama", "Pokestir"],
    duration: "4:59",
    spotifyTrackId: "5NiLze5ZqfJdVS5hLfrGeR",
    preview: "https://p.scdn.co/mp3-preview/3d08c2e1d46e0e20cc5c1e0adaad3312b4791f35"
  },
  "isrc:QZPJ32106840": {
    title: "Route 2 (Autumn) [from \"Pokémon Black & White\"] [Arrangement]",
    isrc: "QZPJ32106840",
    duration: "5:28",
    spotifyTrackId: "1dPGkBI1aK4gpS1YuQ1Mo8",
    preview: "https://p.scdn.co/mp3-preview/b0aaf5f5f2f6812831a6308d6b40c28909a31c44"
  },
  "isrc:QZPJ32396584": {
    title: "Route 2 on Melemele Island (Orchestral Arrangement)",
    isrc: "QZPJ32396584",
    duration: "3:47",
    spotifyTrackId: "6QuyEJH0neiatggOvopHWx",
    preview: "https://p.scdn.co/mp3-preview/8742e477fb55a3b1ed5f0e5f9ce7f67389af9cf9"
  },
  "isrc:QZPJ32300918": {
    title: "Route 201 (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32300918",
    artists: ["Hitomi Sato", "Pokestir"],
    duration: "2:10",
    spotifyTrackId: "5bQu4D0pHvuDm9qpfkVGms",
    preview: "https://p.scdn.co/mp3-preview/b9e17922a4963508929fd2ed46eb362cdb019225"
  },
  "isrc:QZPJ32271825": {
    title: "Route 203 (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32271825",
    artists: ["Hitomi Sato", "Go Ichinose", "Pokestir"],
    duration: "4:13",
    spotifyTrackId: "5sTUEzm1NG0DMfOdKwRm1f",
    preview: "https://p.scdn.co/mp3-preview/bb2d6b68cbd727110e8aedd1baf07c1a4e0f0387"
  },
  "isrc:QZGWX2245151": {
    title: "Route 205 (Day) (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZGWX2245151",
    duration: "5:41",
    spotifyTrackId: "4YTWNZhHTUIyULKr1uQNp0",
    preview: "https://p.scdn.co/mp3-preview/50ab412e06845980d645ef26f98efe5e79a6c96c"
  },
  "local:route-206-2026": {
    title: "Route 206 (From \"Pokémon Diamond & Pearl\") [Arr. for Orchestra by Pokestir]",
    isrc: "",
    duration: "",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZGWX2245068": {
    title: "Route 209 (Day) (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZGWX2245068",
    duration: "6:11",
    spotifyTrackId: "78GMmNLd6hlghnhB4iI3iz",
    preview: "https://p.scdn.co/mp3-preview/b9ba80f281434e1d8d44bfdaf9a430d31156cd89"
  },
  "isrc:QZPJ32118229": {
    title: "Route 209 (Night) (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32118229",
    artists: ["Hitomi Sato", "Pokestir"],
    duration: "5:01",
    spotifyTrackId: "7tSHQy7jawyLcFPMpQQgHy",
    preview: "https://p.scdn.co/mp3-preview/1a7079a8bbcf626a336a3e5c582969ae0b47aebe"
  },
  "isrc:QZPJ32181927": {
    title: "Route 210 (From \"Pokémon Diamond & Pearl\") [Orchestral Arrangement]",
    isrc: "QZPJ32181927",
    duration: "5:00",
    spotifyTrackId: "4RmcYRrDzEYmLZ8o7LLmN5",
    preview: "https://p.scdn.co/mp3-preview/96402a1ef6b58d64c8420ff2f980af13d5f239be"
  },
  "isrc:QZPJ32126790": {
    title: "Route 216 (Day) (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32126790",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "4:51",
    spotifyTrackId: "25gGPIhqZl1nSrXFoputey",
    preview: "https://p.scdn.co/mp3-preview/a03459971bf9c6a79c3951e69ac1934229beed75"
  },
  "isrc:QZPJ32374354": {
    title: "Route 22 (From \"Pokémon Black 2 & White 2\") [Arrangement]",
    isrc: "QZPJ32374354",
    artists: ["Hitomi Sato", "Pokestir"],
    duration: "2:40",
    spotifyTrackId: "7JYY1bfG5KLF4FubuQfROY",
    preview: "https://p.scdn.co/mp3-preview/7d1127d55e3b93beb3e244c9f090c47319b27a5a"
  },
  "isrc:QZGWX2245181": {
    title: "Route 22 (Spring / Summer) (From \"Pokémon Black 2 & White 2\") [Arrangement]",
    isrc: "QZGWX2245181",
    duration: "5:10",
    spotifyTrackId: "3KF7Lhl23XrO4CfW8NdGXi",
    preview: "https://p.scdn.co/mp3-preview/4195b64268e532f20a3d19409691e47a609554d7"
  },
  "isrc:QZPJ32142941": {
    title: "Route 225 (Day) (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32142941",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "3:50",
    spotifyTrackId: "5fTUV06uOvTbSgdzPIGBY7",
    preview: "https://p.scdn.co/mp3-preview/ef4dbec4700796e1b9b6d727c5cd4adfda5954a3"
  },
  "isrc:QZPJ32429453": {
    title: "Route 225 (From \"Pokémon Diamond & Pearl\") [Synth - Pop Remix]",
    isrc: "QZPJ32429453",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "3:49",
    spotifyTrackId: "1ZbhmCXPxftYsQiR0xphSt",
    preview: "https://p.scdn.co/mp3-preview/e1f737ec67a03caa2aa8e72e82f645f1909f05f3"
  },
  "isrc:QZPJ32391557": {
    title: "Route 228 (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32391557",
    artists: ["Hitomi Sato", "Pokestir"],
    duration: "5:04",
    spotifyTrackId: "4bDfiotHcZYO7nQEfOUOjH",
    preview: "https://p.scdn.co/mp3-preview/691006b42471bc32253d58ae109e44770d19c201"
  },
  "isrc:QZPJ32235858": {
    title: "Route 26 (From \"Pokémon HeartGold & SoulSilver\") (Orchestral Arrangement)",
    isrc: "QZPJ32235858",
    duration: "4:40",
    spotifyTrackId: "5FTNIo0rPHBcNQlLToAEsO",
    preview: "https://p.scdn.co/mp3-preview/214ce071fb6bc653449f6a7a0ec2d14cac896c3d"
  },
  "isrc:QZ6K42600795": {
    title: "Route 3 (From \"Pokémon Red & Blue\") (Arr. for Orchestra by Pokestir)",
    isrc: "QZ6K42600795",
    artists: ["Junichi Masuda", "Pokestir"],
    duration: "3:42",
    spotifyTrackId: "420jh49y4CkKdng2nIQLXC",
    preview: "https://p.scdn.co/mp3-preview/d2c6971d4aa50ee5a117f4718d080efed4239167"
  },
  "isrc:QZPJ32435883": {
    title: "Route 30 (From \"Pokémon Gold & Silver\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZPJ32435883",
    duration: "3:59",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZGWX2245174": {
    title: "Route 30 (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZGWX2245174",
    duration: "5:06",
    spotifyTrackId: "5D6bAr46EWYaDTvbzcE8x2",
    preview: "https://p.scdn.co/mp3-preview/0212d9270b6639599369bf0527b49121e269b3c2"
  },
  "isrc:QZGWX2245172": {
    title: "Route 34 (From \"Pokémon HeartGold & SoulSilver\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZGWX2245172",
    duration: "5:33",
    spotifyTrackId: "1mcHJVBbpvOPcoq3HWjPIa",
    preview: "https://p.scdn.co/mp3-preview/0715a7f9a9ef2f3f61946b2fcd454d1aeded59bc"
  },
  "isrc:QZPJ32121696": {
    title: "Route 38 (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZPJ32121696",
    artists: ["Junichi Masuda", "Pokestir"],
    duration: "5:43",
    spotifyTrackId: "1x5v9QRaO8TIiX7OmnT52j",
    preview: "https://p.scdn.co/mp3-preview/44c07f63545ea4e89684ba022782ddc2491421b3"
  },
  "isrc:QZPJ32120849": {
    title: "Route 4 (Autumn) (From \"Pokémon Black & White\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZPJ32120849",
    artists: ["Shota Kageyama", "Junichi Masuda", "Pokestir"],
    duration: "5:11",
    spotifyTrackId: "3jaj5mX4NBtG3gdHoQP8FA",
    preview: "https://p.scdn.co/mp3-preview/3ca0fa6e76021059cc77f98b8345e389bd8c89e7"
  },
  "isrc:QZPJ32396587": {
    title: "Route 4 on Akala Island (feat. StevenMix) [Orchestral Arrangement]",
    isrc: "QZPJ32396587",
    artists: ["Pokestir", "StevenMix"],
    duration: "2:51",
    spotifyTrackId: "0h1D8qJaquXCNzV5MtWxfE",
    preview: "https://p.scdn.co/mp3-preview/939d3c4907d37b73bfe4f3187a6cd81b4d15c8d0"
  },
  "isrc:QZ6K42501086": {
    title: "Route 47 (From \"Pokémon HeartGold & SoulSilver\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42501086",
    duration: "3:43",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32396590": {
    title: "Royal Avenue (Arrangement)",
    isrc: "QZPJ32396590",
    artists: ["StevenMix"],
    duration: "2:41",
    spotifyTrackId: "0cQhMey8KfJXVG5bDdNBL1",
    preview: "https://p.scdn.co/mp3-preview/9ee6ec377b430a0a5fd11db793234d6dcff4e8a9"
  },
  "isrc:QZ6K42500353": {
    title: "Ruins (From \"Undertale) [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42500353",
    artists: ["Toby Fox", "Pokestir"],
    duration: "4:03",
    spotifyTrackId: "4gh12auyW84iRpfwOW1nrG",
    preview: "https://p.scdn.co/mp3-preview/82205f9b2cf1319289b6cab8ed1572f0e70bd44d"
  },
  "isrc:QZ6K42600793": {
    title: "Rustboro City (From \"Pokémon Ruby & Sapphire\") [Jazz Arrangement]",
    isrc: "QZ6K42600793",
    duration: "4:11",
    spotifyTrackId: "3TSYk97i8VnYnV3c1mvHTs",
    preview: "https://p.scdn.co/mp3-preview/b15b14291a8119ee87851a68d0be5b49a9b9cecd"
  },
  "isrc:QZPJ32164134": {
    title: "Ryme City (From \"Pokémon Detective Pikachu\")",
    isrc: "QZPJ32164134",
    duration: "3:59",
    spotifyTrackId: "1yCcVUbko4HiLfrCy5QoUL",
    preview: "https://p.scdn.co/mp3-preview/321da2af56404245202963eac3ef68ef50d93cd6"
  },
  "isrc:QZGWX2237773": {
    title: "Sacrifice",
    isrc: "QZGWX2237773",
    duration: "2:08",
    spotifyTrackId: "1cHed1lbPGCVzVZeNcchMu",
    preview: "https://p.scdn.co/mp3-preview/e25840ed9812a188e9802e80a07512914869e2a5"
  },
  "isrc:QZ6K42600180": {
    title: "Safari Zone",
    isrc: "QZ6K42600180",
    duration: "2:32",
    spotifyTrackId: "1qgg81VGi3N41S7EKyenFw",
    preview: "https://p.scdn.co/mp3-preview/b30a521590265cba26a2818d6bf842a8410acb40"
  },
  "isrc:QZ6K42600179": {
    title: "Safari Zone Gate",
    isrc: "QZ6K42600179",
    duration: "1:48",
    spotifyTrackId: "698M31MFjjFWvznvdUIDMn",
    preview: "https://p.scdn.co/mp3-preview/24cc606f619c5c324c917da029d1e6251e70dc34"
  },
  "isrc:QZGWX2245070": {
    title: "Sandgem Town (Day) (From \"Pokémon Diamond & Pearl\")",
    isrc: "QZGWX2245070",
    duration: "5:18",
    spotifyTrackId: "1CdTGnO9MLhn1kwAAJi3yf",
    preview: "https://p.scdn.co/mp3-preview/59e5a79642d6af5b4d612928a690f4e2bb9f8829"
  },
  "isrc:QZPJ32318639": {
    title: "Santalune City (Arrangement)",
    isrc: "QZPJ32318639",
    artists: ["Pokestir", "StevenMix"],
    duration: "2:07",
    spotifyTrackId: "2PuzjlwmO6kAr6jcEi8hUV",
    preview: "https://p.scdn.co/mp3-preview/55752d8352cd6dfff839b0beb68a307850495b57"
  },
  "isrc:QZPJ32347767": {
    title: "Santalune Forest (From \"Pokémon X & Y\") [Arrangement]",
    isrc: "QZPJ32347767",
    artists: ["Shota Kageyama", "Pokestir"],
    duration: "3:20",
    spotifyTrackId: "16M5CJmq9sb5OLoNdfNSWJ",
    preview: "https://p.scdn.co/mp3-preview/06e1ef1b148de9a5fc5a6daf1c22b4ea9fdedc67"
  },
  "isrc:QZPJ32299467": {
    title: "Sapphire Reverie",
    isrc: "QZPJ32299467",
    duration: "4:12",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42600763": {
    title: "Saturos Battle (From \"Golden Sun\")",
    isrc: "QZ6K42600763",
    duration: "3:02",
    spotifyTrackId: "09RTlRf9PyrSNfqyDacYUm",
    preview: "https://p.scdn.co/mp3-preview/fd960e53c98a0a9b98844a3b4fa29ce8507a8a4c"
  },
  "isrc:QZPJ32396593": {
    title: "Seafolk Village (Arrangement)",
    isrc: "QZPJ32396593",
    duration: "3:03",
    spotifyTrackId: "1tsW05GGc5nkbFegOtQl86",
    preview: "https://p.scdn.co/mp3-preview/7e804402cecbd55c2d3bf3fbf453f395f02942ab"
  },
  "isrc:QZ6K42501270": {
    title: "Secret of the Forest (From \"Chrono Trigger\")",
    isrc: "QZ6K42501270",
    artists: ["Yasunori Mitsuda", "Pokestir"],
    duration: "4:30",
    spotifyTrackId: "1nZwtiaeC2pdQ51N0ZF6MB",
    preview: "https://p.scdn.co/mp3-preview/454acc49d8f60857e579c01ba61a747c62b4a7f8"
  },
  "isrc:QZPJ32167873": {
    title: "Secret of the Forest (From \"Chrono Trigger\") (Arrangement)",
    isrc: "QZPJ32167873",
    duration: "4:21",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32318644": {
    title: "Shalour City (Arrangement)",
    isrc: "QZPJ32318644",
    artists: ["StevenMix"],
    duration: "3:58",
    spotifyTrackId: "3scDeP1xbpIWHsy1HfIYV6",
    preview: "https://p.scdn.co/mp3-preview/7375ecb46b194d8060b94eeade679e444c1e9561"
  },
  "isrc:QZ6K42501134": {
    title: "Shop (From \"The Legend of Zelda: Ocarina of Time\")",
    isrc: "QZ6K42501134",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "3:58",
    spotifyTrackId: "1lABaoTU97M7NMnGaMLTEK",
    preview: "https://p.scdn.co/mp3-preview/182d71926e87fd2b5392affd179ea9b4854dab30"
  },
  "isrc:QZPJ32334730": {
    title: "Showtime! Normal Entertamer",
    isrc: "QZPJ32334730",
    duration: "4:35",
    spotifyTrackId: "4TRc2iXcXjuIWm8KIWoigl",
    preview: "https://p.scdn.co/mp3-preview/a84becded21824dfb570e9320814528156661f78"
  },
  "isrc:QZPJ32334732": {
    title: "Showtime! Vs. Miranda",
    isrc: "QZPJ32334732",
    duration: "4:10",
    spotifyTrackId: "0nu1hZyOXOSeFekInmunfS",
    preview: "https://p.scdn.co/mp3-preview/c78346a6552915efdaaddc0f838b6413bcffab0d"
  },
  "isrc:QZPJ32334729": {
    title: "Showtime! Wild Tamashii",
    isrc: "QZPJ32334729",
    duration: "4:05",
    spotifyTrackId: "2chkndXU3G3MBwztLUKV6H",
    preview: "https://p.scdn.co/mp3-preview/d9d05e93ea1ed2ff00c8e25db112dec7e621fdc1"
  },
  "isrc:QZ6K42601012": {
    title: "Shurrey Hill (From \"Tales of the Abyss\")",
    isrc: "QZ6K42601012",
    duration: "3:55",
    spotifyTrackId: "6hyTIgn44WjRzBLGKFzc76",
    preview: "https://p.scdn.co/mp3-preview/615462dddf9d60c9e32d266f92ade4b64dbc591b"
  },
  "isrc:QZ6K42501272": {
    title: "Silent Light (From \"Chrono Trigger\")",
    isrc: "QZ6K42501272",
    artists: ["Nobuo Uematsu", "Pokestir"],
    duration: "3:31",
    spotifyTrackId: "5mfmKTb5PLg5GJVsAYmUNV",
    preview: "https://p.scdn.co/mp3-preview/7a4299cd50d3b07280bde5a911423e6937d1b209"
  },
  "isrc:QZPJ32130394": {
    title: "Snow Mountain (From \"Super Mario 64\") [Arrangement]",
    isrc: "QZPJ32130394",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "5:44",
    spotifyTrackId: "5Kol6BHAnZEPumatXGUh4Y",
    preview: "https://p.scdn.co/mp3-preview/c1c444c8c31bec72a6cfd593081b7de83e3c2b58"
  },
  "isrc:QZPJ32318649": {
    title: "Snowbelle City (feat. StevenMix) [Arrangement]",
    isrc: "QZPJ32318649",
    artists: ["Pokestir", "StevenMix"],
    duration: "3:58",
    spotifyTrackId: "2hCSPnLN6Y6rF6kL0HIQhS",
    preview: "https://p.scdn.co/mp3-preview/3cb94158a6df60fb5f712a98c69a3ee40da946d5"
  },
  "isrc:QZPJ32325577": {
    title: "Snowdin Town (From \"Undertale\") [Arrangement]",
    isrc: "QZPJ32325577",
    duration: "3:54",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42500356": {
    title: "Snowman (From \"Earthbound\") [Arr. for Orchestra by Pokestir and CrystalVGM]",
    isrc: "QZ6K42500356",
    artists: ["Hirokazu Tanaka", "Keiichi Suzuki", "Hiroshi Kanazu", "Pokestir", "CrystalVGM"],
    duration: "4:32",
    spotifyTrackId: "33pJ7j8MZu4V9Sic1SVo4I",
    preview: "https://p.scdn.co/mp3-preview/cc9769b5b26a63e2654479c59eec6ef4d2353dac"
  },
  "isrc:QZ6K42501514": {
    title: "Snowpoint City (From \"Pokémon Diamond & Pearl) [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42501514",
    artists: ["Junichi Masuda", "Pokestir"],
    duration: "4:09",
    spotifyTrackId: "69LkybiIOcwCCjeiXYjr70",
    preview: "https://p.scdn.co/mp3-preview/41a0d0e6853eec8daffd3982ba2586a8092952c2"
  },
  "isrc:QZ6K42501513": {
    title: "Snowy - Mountain (From “Super Mario Bros. Wonder) [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42501513",
    artists: ["Koji Kondo", "Shiho Fujii", "Pokestir"],
    duration: "4:25",
    spotifyTrackId: "5Ax41hUEl2M4JKhSSO0SLF",
    preview: "https://p.scdn.co/mp3-preview/f083a395e6d47922a495103154d8eaf4301cfff0"
  },
  "isrc:QZPJ32211895": {
    title: "Solaceon Town (From \"Pokémon Diamond & Pearl\") (Arrangement)",
    isrc: "QZPJ32211895",
    duration: "4:08",
    spotifyTrackId: "6Elxp75MyYyGIuAGlYErh0",
    preview: "https://p.scdn.co/mp3-preview/399d81775aadd68bd0b9c213f0bed61e3b74947a"
  },
  "isrc:QZPJ32161151": {
    title: "Song of Storms (From \"the Legend of Zelda: Ocarina of Time\") [Arrangement]",
    isrc: "QZPJ32161151",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "4:15",
    spotifyTrackId: "5rklT3VqExDVggV51jpQAY",
    preview: "https://p.scdn.co/mp3-preview/d9e8bb1c00e736f4805fb5372d191902521ec515"
  },
  "isrc:QZ6K42500314": {
    title: "Sootopolis City (From \"Pokemon Ruby & Sapphire\")",
    isrc: "QZ6K42500314",
    duration: "5:00",
    spotifyTrackId: "2izlsJgAjn3QySFA0MJCga",
    preview: "https://p.scdn.co/mp3-preview/c2a3b8896bc53c38694a016600a8bda82636fb74"
  },
  "isrc:QZ6K42500959": {
    title: "South Province (From \"Pokémon Scarlet & Violet) [Arr. for Orchestra by Pokestir]",
    isrc: "QZ6K42500959",
    artists: ["Toby Fox", "Minako Adachi", "Pokestir"],
    duration: "5:34",
    spotifyTrackId: "5rCylS8Cy2Kqn9kkbMHsfV",
    preview: "https://p.scdn.co/mp3-preview/3d3040033fec134cddf25d54c9f0da3b1094b599"
  },
  "isrc:QZPJ32109964": {
    title: "Spamton (From \"Deltarune\")",
    isrc: "QZPJ32109964",
    duration: "5:38",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZGWX2245178": {
    title: "Spear Pillar (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZGWX2245178",
    duration: "5:37",
    spotifyTrackId: "231ZkC9B9KP8heN68mNroJ",
    preview: "https://p.scdn.co/mp3-preview/bebf6e2b90ab578f70757ff7e5df71894dc23247"
  },
  "isrc:QZGWX2245073": {
    title: "Spiral Mountain (From \"Banjo - Kazooie\") [Arrangement]",
    isrc: "QZGWX2245073",
    duration: "6:05",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32118231": {
    title: "Stark Mountain (From \"Pokémon Diamond & Pearl\") [Arr. for Orchestra by Pokestir]",
    isrc: "QZPJ32118231",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "5:50",
    spotifyTrackId: "0xn2kggyoncJkCQnft34rM",
    preview: "https://p.scdn.co/mp3-preview/aa501aee6c9b71bd310884ed2b9483b862979347"
  },
  "isrc:QZ6K42501455": {
    title: "Stow-on-Side (From \"Pokémon Sword & Shield\") (Jazz Fusion Arrangement)",
    isrc: "QZ6K42501455",
    duration: "4:00",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42500367": {
    title: "Submission Plaza (Check MII out Channel) [Synthwave Arrangement]",
    isrc: "QZ6K42500367",
    duration: "3:01",
    spotifyTrackId: "1IurZHkUtBET5vj0VW4pUF",
    preview: "https://p.scdn.co/mp3-preview/e65d7fb836eebc4ca025715f762b403dab17f882"
  },
  "isrc:QZ6K42500318": {
    title: "Summer - Nature's Crescendo [from “Stardew Valley”] [Arrangement]",
    isrc: "QZ6K42500318",
    duration: "3:25",
    spotifyTrackId: "17uynQuyTB6DicCoGrWOuZ",
    preview: "https://p.scdn.co/mp3-preview/96bca503ddea06fda19dd5acecaa06f0cd4fe6cf"
  },
  "isrc:QZPJ32211893": {
    title: "Sunyshore City (From \"Pokémon Diamond & Pearl\") (Arrangement)",
    isrc: "QZPJ32211893",
    duration: "4:05",
    spotifyTrackId: "7reQF9WbdCdFsZPBlm2BCx",
    preview: "https://p.scdn.co/mp3-preview/a72cc07513e38f01982ae2a2227fbb1081864d73"
  },
  "isrc:QZPJ32369382": {
    title: "Surf (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32369382",
    artists: ["Hitomi Sato", "Pokestir"],
    duration: "4:24",
    spotifyTrackId: "6YLf5ZvIpKm9nLXsGYv0JY",
    preview: "https://p.scdn.co/mp3-preview/59c7a4d270385a7478f4aa79a8c939fa830574d7"
  },
  "isrc:QZGWX2237770": {
    title: "Sweet Revenge",
    isrc: "QZGWX2237770",
    duration: "2:11",
    spotifyTrackId: "6TvCkPuMXgDldNOzgiPrgo",
    preview: "https://p.scdn.co/mp3-preview/d878e80d864cec68bcd8d0567b2b8f78f8f4bd6c"
  },
  "isrc:QZPJ32181166": {
    title: "Swimming (From \"Super Mario World\") [Arrangement]",
    isrc: "QZPJ32181166",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "4:15",
    spotifyTrackId: "7ABCDoiFELy9VNL8pOk7cu",
    preview: "https://p.scdn.co/mp3-preview/0f0ece0baed736f0a4c351f620616580ad154339"
  },
  "isrc:QZPJ32135746": {
    title: "Team Galactic Hq (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32135746",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "4:26",
    spotifyTrackId: "5brbR2zCuib2aWt5o3iaGO",
    preview: "https://p.scdn.co/mp3-preview/dff120d113a8aac8dba3cb646fe3adcc7e1d0779"
  },
  "isrc:QZPJ32190821": {
    title: "Team Rocket Hq (From \"Pokémon Heartgold & Soulsilver\") [Orchestral Arrangement]",
    isrc: "QZPJ32190821",
    duration: "3:43",
    spotifyTrackId: "52SDZ7t2yc9pSOGLtD2Wlc",
    preview: "https://p.scdn.co/mp3-preview/e6d1f22291f3de7be9182969d99877147121c3c9"
  },
  "isrc:QZPJ32396589": {
    title: "Ten Carat Hill (Arrangement)",
    isrc: "QZPJ32396589",
    artists: ["StevenMix"],
    duration: "3:17",
    spotifyTrackId: "4vjfMEinjq4btuITHVbQSb",
    preview: "https://p.scdn.co/mp3-preview/adbb7a499a397fd60c6dadf346868bad91a5dd31"
  },
  "isrc:QZPJ32440323": {
    title: "The Ancestral Divide",
    isrc: "QZPJ32440323",
    duration: "3:36",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42500262": {
    title: "The Decisive Battle (Arrangement) [from \"Final Fantasy VI\"]",
    isrc: "QZ6K42500262",
    duration: "2:49",
    spotifyTrackId: "5jp2BNGZMduF8z4CaZLQuL",
    preview: "https://p.scdn.co/mp3-preview/cffb3754dff40a231e88854e993c97f3baf238e4"
  },
  "isrc:QZPJ32282891": {
    title: "The Forest of Hope (From \"Pikmin 1\")",
    isrc: "QZPJ32282891",
    duration: "4:07",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZGWX2247029": {
    title: "The Frozen City (From \"Pokémon Black 2 & White 2\") [Arrangement]",
    isrc: "QZGWX2247029",
    duration: "5:19",
    spotifyTrackId: "6YwL3ZFlO0jvqXqEzKTSvS",
    preview: "https://p.scdn.co/mp3-preview/7f631a2b105eaead1770cb3f00fa3146c8dd21ca"
  },
  "isrc:QZPJ32334733": {
    title: "The Grand Finale",
    isrc: "QZPJ32334733",
    duration: "3:24",
    spotifyTrackId: "2U65ePHQmtWJk4AzG9BmuF",
    preview: "https://p.scdn.co/mp3-preview/44275d0b1bcb0c5fe43718a8ee35d5c93f40c825"
  },
  "isrc:QZ6K42501413": {
    title: "The Great Sea (From \"the Legend of Zelda: The Wind Waker\")",
    isrc: "QZ6K42501413",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "5:15",
    spotifyTrackId: "6ISUsvP6yDDHzkejcog2lQ",
    preview: "https://p.scdn.co/mp3-preview/e465a31b5121b93bd759f2e07afde3bd58900da8"
  },
  "isrc:QZPJ32177748": {
    title: "The Highwind Takes to the Skies (From \"Final Fantasy VII\") [Arrangement]",
    isrc: "QZPJ32177748",
    duration: "5:00",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZGWX2245188": {
    title: "The Moon (From \"DuckTales\")",
    isrc: "QZGWX2245188",
    duration: "5:56",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32396597": {
    title: "The Path to the League (feat. StevenMix) [Orchestral Arrangement]",
    isrc: "QZPJ32396597",
    artists: ["Pokestir", "StevenMix"],
    duration: "3:21",
    spotifyTrackId: "7fiBWkq179cAsipppkIlLo",
    preview: "https://p.scdn.co/mp3-preview/e6b3eb38996f984db2c9f152b030078ec2a00222"
  },
  "isrc:QZPJ32116741": {
    title: "The Pokémon League (From “Pokémon Black & White”) [Arrangement]",
    isrc: "QZPJ32116741",
    artists: ["Shota Kageyama", "Pokestir"],
    duration: "5:28",
    spotifyTrackId: "1jqD8tPI4fznbmPmnzQZF0",
    preview: "https://p.scdn.co/mp3-preview/63d29e1008435e9d74bfb04446700236c626f42f"
  },
  "isrc:QZ6K42600539": {
    title: "The Third Sanctuary (From \"DELTARUNE\")",
    isrc: "QZ6K42600539",
    duration: "4:07",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZGWX2250901": {
    title: "The Underground (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZGWX2250901",
    artists: ["Go Ichinose", "Pokestir"],
    duration: "5:02",
    spotifyTrackId: "3HssJHRHnOiakCeoKrYOi0",
    preview: "https://p.scdn.co/mp3-preview/6b5861b20f18d3bf2340cb2970aeca4f43c069db"
  },
  "isrc:QZPJ32119164": {
    title: "Title Screen (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32119164",
    artists: ["Junichi Masuda", "Go Ichinose", "Pokestir"],
    duration: "1:18",
    spotifyTrackId: "3QgadhMDdAXxerJ5pCkch3",
    preview: "https://p.scdn.co/mp3-preview/1ea58304cfa0f9df85e7a976dcdce2491293a847"
  },
  "isrc:QZPJ32266807": {
    title: "Title Screen (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZPJ32266807",
    artists: ["Junichi Masuda", "Shota Kageyama", "Pokestir"],
    duration: "1:37",
    spotifyTrackId: "2h7sLdVEL7OwioOiHdNEgn",
    preview: "https://p.scdn.co/mp3-preview/985518a45112d702fccc743e2989a2f5a7fbf774"
  },
  "isrc:QZPJ32230130": {
    title: "Title Screen (From \"Super Mario World\") (Orchestral Arrangement)",
    isrc: "QZPJ32230130",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "4:04",
    spotifyTrackId: "4E1HxJR5lGF3sZzuhRfyV1",
    preview: "https://p.scdn.co/mp3-preview/75f507c8f574dab0f5ebf2bdd8df4d506b7018bc"
  },
  "isrc:QZ6K42501405": {
    title: "Title Screen (From \"the Legend of Zelda: The Wind Waker\")",
    isrc: "QZ6K42501405",
    artists: ["Kenta Nagata", "Koji Kondo", "Hajime Wakai", "Toru Minegishi", "Pokestir"],
    duration: "3:46",
    spotifyTrackId: "4IKigjLRn1SaLVC0F4kWZ5",
    preview: "https://p.scdn.co/mp3-preview/bd68f2f7052d1eac82e352635563ea5d9d65caf0"
  },
  "isrc:QZPJ32306901": {
    title: "Title Theme (From \"The Legend of Zelda: Ocarina of Time\")",
    isrc: "QZPJ32306901",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "3:48",
    spotifyTrackId: "4XMqu73QWliPgxuRj803xG",
    preview: "https://p.scdn.co/mp3-preview/a09f8b00b377ee865f3003a7f314063137ecba93"
  },
  "isrc:QZ6K42500263": {
    title: "Tour Vancouver Velocity (Arrangement) [from \"Mario Kart 8 Deluxe\"]",
    isrc: "QZ6K42500263",
    duration: "3:17",
    spotifyTrackId: "3CZN1VXIqwXcQ7geC3AmRa",
    preview: "https://p.scdn.co/mp3-preview/9f880796ee946a7920b89d52db317627aeb8f5b9"
  },
  "isrc:QZGWX2245019": {
    title: "Treasure Trove Cove (From \"Banjo - Kazooie\") [Arrangement]",
    isrc: "QZGWX2245019",
    duration: "5:56",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42501018": {
    title: "Undella Town - Summer (from \"Pokémon Black & White\") (Modern Arrangement)",
    isrc: "QZ6K42501018",
    duration: "2:15",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32122828": {
    title: "Underground Theme (From \"Yoshi’s Island\") [Arrangement]",
    isrc: "QZPJ32122828",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "4:55",
    spotifyTrackId: "5rUsqKmJ0puJVG5SdKJ1hr",
    preview: "https://p.scdn.co/mp3-preview/4dad8e0c8c8bac45a82d7872283a82dc2c1e39db"
  },
  "isrc:QZ6K42501279": {
    title: "Undersea Palace (From \"Chrono Trigger\")",
    isrc: "QZ6K42501279",
    artists: ["Yasunori Mitsuda", "Pokestir", "Mudstep"],
    duration: "3:30",
    spotifyTrackId: "7lwXqKufhb6FC8p9uBWxcb",
    preview: "https://p.scdn.co/mp3-preview/7f22d2f347e25c463e448472795a9e07a4c70d2c"
  },
  "isrc:QZPJ32469257": {
    title: "Unithor",
    isrc: "QZPJ32469257",
    duration: "1:47",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32259827": {
    title: "Unova Route 1 (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32259827",
    artists: ["Shota Kageyama", "Go Ichinose", "Pokestir"],
    duration: "3:40",
    spotifyTrackId: "6seOkbh9wOzjGYN4fnWV74",
    preview: "https://p.scdn.co/mp3-preview/15124f5ffbe93a328b8ec972eca6f1386bda2086"
  },
  "isrc:QZ6K42500317": {
    title: "Valor Lakefront (Jazz Arrangement) [from \"Pokémon Diamond & Pearl\"]",
    isrc: "QZ6K42500317",
    duration: "3:55",
    spotifyTrackId: "4FORK2ooVxshBxoKU3e5Vv",
    preview: "https://p.scdn.co/mp3-preview/60435b2e87c012cb48bd248db98acde79fd0813e"
  },
  "isrc:QZPJ32318637": {
    title: "Vaniville Town (Arrangement)",
    isrc: "QZPJ32318637",
    duration: "2:37",
    spotifyTrackId: "73fbCiNb2uB5UhpkEsOwKg",
    preview: "https://p.scdn.co/mp3-preview/b4f8d7a6ae7b25909a56b8aeb1a655b33facb71f"
  },
  "isrc:QZPJ32396595": {
    title: "Vast Poni Canyon (feat. Pokestir) [Arrangement]",
    isrc: "QZPJ32396595",
    artists: ["StevenMix", "Pokestir"],
    duration: "3:50",
    spotifyTrackId: "3beW87GBYa8WGTxsWgT1LF",
    preview: "https://p.scdn.co/mp3-preview/7697ac4a6a8bdd71f0a6ef072ec91374daaddc00"
  },
  "isrc:QZPJ32174780": {
    title: "Veilstone City (Day) (From \"Pokémon Diamond & Pearl\") [Arrangement]",
    isrc: "QZPJ32174780",
    duration: "4:04",
    spotifyTrackId: "2bt8qehj71i5q5Bd01u4Ap",
    preview: "https://p.scdn.co/mp3-preview/8c17923b687e178994922e5125b9febea3928646"
  },
  "local:verdant-hills-2021": {
    title: "Verdant Hills",
    isrc: "",
    duration: "5:34",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZGWX2245182": {
    title: "Victory Lies Before You! (From “Pokémon Black & White”) - Arrangement",
    isrc: "QZGWX2245182",
    duration: "4:58",
    spotifyTrackId: "3bwQVmPsHCV6uruzuXm3yt",
    preview: "https://p.scdn.co/mp3-preview/aee0216b82e0cfac74e761f1dfeba75aa5d89742"
  },
  "isrc:QZPJ32165906": {
    title: "Victory Road (From \"Pokémon Black & White\") [Arrangement]",
    isrc: "QZPJ32165906",
    duration: "4:25",
    spotifyTrackId: "0h5bRFGlsqPdJbBlKH6hZg",
    preview: "https://p.scdn.co/mp3-preview/6998a1aeee2468d385dc1b5fac70344a1807981f"
  },
  "isrc:QZPJ32194726": {
    title: "Violet City (From \"Pokémon Heartgold & Soulsilver\") [Arrangement]",
    isrc: "QZPJ32194726",
    duration: "3:10",
    spotifyTrackId: "43L2pu1IB23jvpLPhJtCRC",
    preview: "https://p.scdn.co/mp3-preview/479f54e8568dbafcc5be304972418ff72a7162b9"
  },
  "isrc:QZPJ32156015": {
    title: "Viridian City (From \"Pokémon HeartGold & SoulSilver\")",
    isrc: "QZPJ32156015",
    artists: ["Junichi Masuda", "Takuto Kitsuta", "Pokestir"],
    duration: "4:28",
    spotifyTrackId: "3OtM9BF4szFGk5WlevUHjy",
    preview: "https://p.scdn.co/mp3-preview/c0daf9640b2c446b8ffaebfc3c737711c0bef215"
  },
  "isrc:QZPJ32426246": {
    title: "Vs. The Queen of Dreams",
    isrc: "QZPJ32426246",
    duration: "3:57",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZPJ32130396": {
    title: "Walrus Cove (From \"Diddy Kong Racing\") [Arrangement]",
    isrc: "QZPJ32130396",
    duration: "5:25",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42501402": {
    title: "Waltz of the Boos (From \"Super Mario Galaxy\") [Electronic Arrangement]",
    isrc: "QZ6K42501402",
    duration: "3:44",
    spotifyTrackId: "6onyHn0kWimPrES8lr7ZhK",
    preview: "https://p.scdn.co/mp3-preview/448434874954ae47c0e978184550cd8c30edf152"
  },
  "isrc:QZPJ32274867": {
    title: "Warp Room (From \"Crash Bandicoot 3: Warped\")",
    isrc: "QZPJ32274867",
    duration: "4:07",
    spotifyTrackId: "",
    preview: ""
  },
  "isrc:QZ6K42500264": {
    title: "Warp Room [Arrangement] (from \"Crash Bandicoot 2: N-Tranced\")",
    isrc: "QZ6K42500264",
    duration: "1:44",
    spotifyTrackId: "1TfuLhTdzh9cZBPIRxZNhS",
    preview: "https://p.scdn.co/mp3-preview/2364fc1615a13dfec9fbfcefebe00b4e361ba120"
  },
  "isrc:QZ6K42501143": {
    title: "Water Temple (From \"The Legend of Zelda: Ocarina of Time\")",
    isrc: "QZ6K42501143",
    artists: ["Koji Kondo", "Pokestir"],
    duration: "5:11",
    spotifyTrackId: "16JdDzeOceFTuMkvmDdqUI",
    preview: "https://p.scdn.co/mp3-preview/2b4a201624fb379ad93d57b3101a16f83c779062"
  },
  "isrc:QZ6K42501269": {
    title: "Wind Scene (600 A.D.) [From \"Chrono Trigger\"]",
    isrc: "QZ6K42501269",
    artists: ["Yasunori Mitsuda", "Pokestir"],
    duration: "3:14",
    spotifyTrackId: "5PVPTyXthvhzCLa4UexBc1",
    preview: "https://p.scdn.co/mp3-preview/4c9d5355118cc61cff23ea786448361d1e430ca9"
  },
  "isrc:QZ6K42501412": {
    title: "Windfall Island (From \"the Legend of Zelda: The Wind Waker\")",
    isrc: "QZ6K42501412",
    artists: ["Kenta Nagata", "Koji Kondo", "Hajime Wakai", "Toru Minegishi", "Pokestir"],
    duration: "2:13",
    spotifyTrackId: "2W7NVMsYz4LQcUilmdo2jf",
    preview: "https://p.scdn.co/mp3-preview/e8c6663a746d8a1c660438b4a79aa69804f5206b"
  },
};
