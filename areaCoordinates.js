const AREA_COORDINATES = {

  // ── ZONE 1 — Old Gurugram / City Centre ──────────────────────────────────
  "Sector 14 — Main Market":        { lat: 28.4595, lng: 77.0266 },
  "Sector 15 — Residential":        { lat: 28.4567, lng: 77.0289 },
  "Sector 17 — Old City":           { lat: 28.4612, lng: 77.0198 },
  "Sector 22 — Old City":           { lat: 28.4523, lng: 77.0312 },
  "Sector 23 — Old City":           { lat: 28.4498, lng: 77.0334 },
  "Sadar Bazar":                    { lat: 28.4731, lng: 77.0124 },
  "Rajiv Chowk":                    { lat: 28.4721, lng: 77.0198 },
  "Jacobpura":                      { lat: 28.4698, lng: 77.0089 },
  "Basai Road":                     { lat: 28.4812, lng: 76.9987 },
  "Dundahera":                      { lat: 28.4923, lng: 77.0023 },

  // ── ZONE 2 — NH-48 / Udyog Vihar ─────────────────────────────────────────
  "IFFCO Chowk":                    { lat: 28.4723, lng: 77.0738 },
  "MG Road":                        { lat: 28.4798, lng: 77.0850 },
  "Udyog Vihar Phase 1–2":          { lat: 28.5023, lng: 77.0812 },
  "Udyog Vihar Phase 3–4":          { lat: 28.5067, lng: 77.0867 },
  "Udyog Vihar Phase 5–6":          { lat: 28.5112, lng: 77.0923 },
  "Sector 18 — Udyog Vihar":        { lat: 28.4956, lng: 77.0798 },
  "Shankar Chowk":                  { lat: 28.4934, lng: 77.0934 },
  "Narsinghpur":                    { lat: 28.4612, lng: 77.0589 },
  "Kapashera":                      { lat: 28.5234, lng: 77.0634 },
  "Kherki Daula":                   { lat: 28.4234, lng: 77.0123 },

  // ── ZONE 3 — DLF Phases ───────────────────────────────────────────────────
  "DLF Phase 1":                    { lat: 28.4789, lng: 77.0912 },
  "DLF Phase 2":                    { lat: 28.4823, lng: 77.0956 },
  "DLF Phase 3":                    { lat: 28.4912, lng: 77.0978 },
  "DLF Phase 4 — Galleria Market":  { lat: 28.4634, lng: 77.0734 },
  "DLF Phase 5":                    { lat: 28.4556, lng: 77.0823 },
  "Sikanderpur":                    { lat: 28.4798, lng: 77.0934 },
  "Sector 42 — DLF Area":           { lat: 28.4712, lng: 77.0812 },
  "Sector 43 — DLF Phase 4":        { lat: 28.4656, lng: 77.0778 },
  "Sector 44 — HUDA City Centre":   { lat: 28.4734, lng: 77.0756 },
  "Sector 45 — DLF Area":           { lat: 28.4678, lng: 77.0823 },

  // ── ZONE 4 — Cyber City / Golf Course Road ────────────────────────────────
  "Cyber City":                     { lat: 28.4959, lng: 77.0893 },
  "Cyber Hub":                      { lat: 28.4945, lng: 77.0867 },
  "Sector 29 — Leisure Valley":     { lat: 28.4634, lng: 77.0623 },
  "Sector 30 — Galleria Market":    { lat: 28.4589, lng: 77.0656 },
  "Sector 38 — South City":         { lat: 28.4423, lng: 77.0434 },
  "Sector 47 — Sushant Lok":        { lat: 28.4512, lng: 77.0712 },
  "Sector 53 — Golf Course Road":   { lat: 28.4389, lng: 77.1023 },
  "Sector 56 — Residential":        { lat: 28.4234, lng: 77.1089 },
  "Sector 57 — Residential":        { lat: 28.4198, lng: 77.1134 },
  "Sector 66 — Golf Course Ext":    { lat: 28.4056, lng: 77.0934 },

  // ── ZONE 5 — Sohna Road ───────────────────────────────────────────────────
  "Sohna Road":                     { lat: 28.4156, lng: 77.0334 },
  "Badshahpur":                     { lat: 28.3934, lng: 77.0212 },
  "Vatika Chowk":                   { lat: 28.4023, lng: 77.0423 },
  "Sector 48 — Sohna Road":         { lat: 28.4312, lng: 77.0567 },
  "Sector 49 — Sohna Road":         { lat: 28.4278, lng: 77.0512 },
  "Sector 50 — South City 2":       { lat: 28.4198, lng: 77.0478 },
  "Sector 67 — Sohna Road":         { lat: 28.3956, lng: 77.0389 },
  "Sector 69 — Sohna Road":         { lat: 28.3878, lng: 77.0312 },
  "Sector 70 — Sohna Road":         { lat: 28.3823, lng: 77.0256 },
  "Sector 71 — Sohna Road":         { lat: 28.3767, lng: 77.0198 },

  // ── ZONE 6 — New Gurugram ─────────────────────────────────────────────────
  "Sector 72 — New Gurugram":       { lat: 28.3712, lng: 76.9934 },
  "Sector 75 — New Gurugram":       { lat: 28.3634, lng: 76.9867 },
  "Sector 79 — SPR Road":           { lat: 28.3556, lng: 76.9823 },
  "Sector 82 — SPR Road":           { lat: 28.3478, lng: 76.9756 },
  "Sector 83 — New Gurugram":       { lat: 28.3423, lng: 76.9712 },
  "Sector 86 — New Gurugram":       { lat: 28.3334, lng: 76.9634 },
  "Sector 88 — New Gurugram":       { lat: 28.3256, lng: 76.9578 },
  "Sector 92 — New Gurugram":       { lat: 28.3134, lng: 76.9489 },
  "Sector 95 — New Gurugram":       { lat: 28.3023, lng: 76.9412 },
  "Manesar / IMT Manesar":          { lat: 28.3589, lng: 76.9312 },

  // ── ZONE 7 — Palam Vihar & Dwarka Expressway ─────────────────────────────
  "Palam Vihar":                    { lat: 28.5089, lng: 77.0034 },
  "Palam Vihar Extension":          { lat: 28.5112, lng: 76.9978 },
  "New Palam Vihar":                { lat: 28.5134, lng: 76.9923 },
  "Sector 99 — Dwarka Expressway":  { lat: 28.4712, lng: 77.0123 },
  "Sector 103 — Dwarka Expressway": { lat: 28.4823, lng: 77.0056 },
  "Sector 106 — Dwarka Expressway": { lat: 28.4912, lng: 76.9989 },
  "Sector 108 — Dwarka Expressway": { lat: 28.4978, lng: 76.9934 },
  "Sector 110 — Dwarka Expressway": { lat: 28.5034, lng: 76.9878 },
  "Sector 112 — Dwarka Expressway": { lat: 28.5089, lng: 76.9823 },
  "Sector 113 — Dwarka Expressway": { lat: 28.5112, lng: 76.9767 }

};

const ZONES = [
  {
    zone: "Zone 1 — Old Gurugram",
    areas: [
      "Sector 14 — Main Market",
      "Sector 15 — Residential",
      "Sector 17 — Old City",
      "Sector 22 — Old City",
      "Sector 23 — Old City",
      "Sadar Bazar",
      "Rajiv Chowk",
      "Jacobpura",
      "Basai Road",
      "Dundahera"
    ]
  },
  {
    zone: "Zone 2 — NH-48 / Udyog Vihar",
    areas: [
      "IFFCO Chowk",
      "MG Road",
      "Udyog Vihar Phase 1–2",
      "Udyog Vihar Phase 3–4",
      "Udyog Vihar Phase 5–6",
      "Sector 18 — Udyog Vihar",
      "Shankar Chowk",
      "Narsinghpur",
      "Kapashera",
      "Kherki Daula"
    ]
  },
  {
    zone: "Zone 3 — DLF Phases",
    areas: [
      "DLF Phase 1",
      "DLF Phase 2",
      "DLF Phase 3",
      "DLF Phase 4 — Galleria Market",
      "DLF Phase 5",
      "Sikanderpur",
      "Sector 42 — DLF Area",
      "Sector 43 — DLF Phase 4",
      "Sector 44 — HUDA City Centre",
      "Sector 45 — DLF Area"
    ]
  },
  {
    zone: "Zone 4 — Cyber City / Golf Course Rd",
    areas: [
      "Cyber City",
      "Cyber Hub",
      "Sector 29 — Leisure Valley",
      "Sector 30 — Galleria Market",
      "Sector 38 — South City",
      "Sector 47 — Sushant Lok",
      "Sector 53 — Golf Course Road",
      "Sector 56 — Residential",
      "Sector 57 — Residential",
      "Sector 66 — Golf Course Ext"
    ]
  },
  {
    zone: "Zone 5 — Sohna Road",
    areas: [
      "Sohna Road",
      "Badshahpur",
      "Vatika Chowk",
      "Sector 48 — Sohna Road",
      "Sector 49 — Sohna Road",
      "Sector 50 — South City 2",
      "Sector 67 — Sohna Road",
      "Sector 69 — Sohna Road",
      "Sector 70 — Sohna Road",
      "Sector 71 — Sohna Road"
    ]
  },
  {
    zone: "Zone 6 — New Gurugram",
    areas: [
      "Sector 72 — New Gurugram",
      "Sector 75 — New Gurugram",
      "Sector 79 — SPR Road",
      "Sector 82 — SPR Road",
      "Sector 83 — New Gurugram",
      "Sector 86 — New Gurugram",
      "Sector 88 — New Gurugram",
      "Sector 92 — New Gurugram",
      "Sector 95 — New Gurugram",
      "Manesar / IMT Manesar"
    ]
  },
  {
    zone: "Zone 7 — Palam Vihar & Dwarka Exp",
    areas: [
      "Palam Vihar",
      "Palam Vihar Extension",
      "New Palam Vihar",
      "Sector 99 — Dwarka Expressway",
      "Sector 103 — Dwarka Expressway",
      "Sector 106 — Dwarka Expressway",
      "Sector 108 — Dwarka Expressway",
      "Sector 110 — Dwarka Expressway",
      "Sector 112 — Dwarka Expressway",
      "Sector 113 — Dwarka Expressway"
    ]
  }
];

module.exports = {
  AREA_COORDINATES,
  ZONES
};