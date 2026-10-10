/**
 * Mock Data Repository for Timelens Photobooth Atelier
 * Prepared for future Supabase Database & Auth migration.
 */

import { formatIDR } from '../formatters.js';

export { formatIDR };

export const studioProfile = {
  name: "Timelens Photobooth Atelier",
  legalName: "PT Timelens Kreasi Abadi",
  address: "Jl. Wijaya II No. 42, Kebayoran Baru, Jakarta Selatan 12160",
  secondaryAddress: "Salon Saint-Germain & Studio Suite 04",
  phone: "+62 811-920-8800",
  email: "curator@timelensatelier.com",
  conciergeEmail: "concierge@timelens.id",
  npwp: "41.890.342.1-013.000",
  accounts: [
    {
      bank: "BCA",
      bankFullName: "Bank Central Asia (BCA)",
      branch: "KCU Thamrin",
      number: "883-092-1144",
      holder: "PT Timelens Kreasi Abadi",
      isPrimary: true
    },
    {
      bank: "Mandiri",
      bankFullName: "Bank Mandiri",
      branch: "KCP Senopati",
      number: "122-00-1988234-1",
      holder: "PT Timelens Kreasi Abadi",
      isPrimary: false
    }
  ],
  owner: {
    name: "Clara Vance",
    fullName: "Clara Vance, B.FA",
    title: "Studio Owner",
    role: "Managing Principal Partner & Financial Signee",
    email: "curator@timelensatelier.com",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqpNbH6UMfx8tbjI35nH_Ztxp-dom4RRCJVuNqxGa54f4coJcqT4yrxGwrLgb1ExiNVE4Ta_urfOI4i9Eivy5XN4mf6Ksz0RkE65J6NHudJwiaTwf8_ZjJBPggbcj_piyuyJhwOyzcvuxqrIO38I26j3Ev9sMlWAD732-eIA-w-SW1v1MGpczxDh3UayaFn2Ji0efcTGbpdybOxqfiHAOLljDNayurGSswCsbj-PVZ5mpCDpejR91L"
  },
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAP_nCHiEW0CNHpxtRE8KmT6YufiVkHM2X3EuoOWqqLDZTXHyJus7-LC6tFyLKBPBgP4y5HaUFlv00GHITvu44qwZ04GUKLyvgvNwmi0KDNdLpS0YTszdf1Kh0viPQOtlLZudKdUUAiI8E1Ip7AAVa-ONxTH8-QYggtXGGLgrW6bQFL001QN2EOZtl63hc5M2yn8vAGijt9TvHVSsGJ7No3QvxhxcuuZoJYn59mpI5Yw54GUoXXJFxXVemrOTb7wyGq_A"
};

export const initialBookings = [
  {
    id: "BK-2024-089",
    eventName: "Adeline & Marcus Wedding Celebration",
    displayTitle: "Adeline & Marcus Wedding",
    customerName: "Adeline Hartono",
    customerTitle: "Bride • Primary Contact",
    customerPhone: "+62 812-9988-7711",
    customerEmail: "adeline.hartono@gmail.com",
    date: "2024-10-24",
    dateFormatted: "Friday, Oct 24, 2024",
    time: "18:00 – 22:00",
    duration: "4 Hours",
    durationHours: 4,
    guestCount: 300,
    venueName: "The Glasshouse, Senayan, Jakarta Pusat",
    venueAddress: "Jl. Gerbang Pemuda No.3, Gelora, Kecamatan Tanah Abang, Jakarta Pusat",
    venueDetail: "Level 2 Conservatory · Loading Dock B",
    venueImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrC0BohAbPLiQEZ2CocKpfe4JUN3RwjBAaR7VZKP7nDIAwjifrs6Qp8jGrdrpj4eNFKZ-eFVfgyhVz46uOefV3e2vZXgZnIl-DzXxFR6-POFi9Wjtb_d4BorZK8uhOZeMHGoDbJc2_6nN2z-eWwXi7KAa7k2HHFNuRp8ToFmFysPStGVE8pF2WNOqc7K5NfBI8NOL8ZzyBolfJPecsrKPLpe6DYr7f034e3pHP6Yu-5FWmBneIYkj-",
    status: "Confirmed",
    packageConfig: "Photobooth 4 Hours + Custom Backdrop",
    paperSpecs: "Matte Cream Archival Foil Stamped Cards",
    backdrop: "Satin Red",
    paperType: "Photostrip (2x6)",
    frameDesign: "Dari Client",
    totalPrice: 3250000,
    downPayment: 1500000,
    remainingDue: 1750000,
    isTodayActive: true,
    opsCount: 2,
    orderRef: "#TL-8824"
  },
  {
    id: "BK-2024-090",
    eventName: "Wedding Reception of Amalia & Dimas Hartanto",
    displayTitle: "Amalia & Dimas Wedding",
    customerName: "Amalia & Dimas Hartanto",
    customerTitle: "Wedding Couple",
    customerPhone: "+62 812-7711-2299",
    customerEmail: "amalia.dimas@gmail.com",
    date: "2024-11-16",
    dateFormatted: "Saturday, Nov 16, 2024",
    time: "18:30 – 21:30",
    duration: "3 Hours",
    durationHours: 3,
    guestCount: 450,
    venueName: "The Glasshouse Ballroom SCBD, Senayan",
    venueAddress: "SCBD Lot 8, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan",
    venueDetail: "Grand Ballroom Level 3 · Loading Dock A",
    status: "Scheduled",
    packageConfig: "Paket Atelier Classic Photobooth",
    paperSpecs: "Unlimited 4R & Dual Photostrips",
    backdrop: "Satin Red",
    paperType: "4R (4x6)",
    frameDesign: "Dibuatkan oleh Timelens",
    totalPrice: 9750000,
    downPayment: 4875000,
    remainingDue: 4875000,
    isTodayActive: false,
    opsCount: 2,
    orderRef: "#TL-INV-2024/10/090"
  },
  {
    id: "BK-2024-082",
    eventName: "Harper Annual Gala 2024",
    displayTitle: "Harper Gala",
    customerName: "Elena Rostova",
    customerTitle: "Lead Event Coordinator",
    customerPhone: "+62 813-4422-9011",
    customerEmail: "elena@harpermedia.co",
    date: "2024-10-12",
    dateFormatted: "Saturday, Oct 12, 2024",
    time: "16:00 – 22:00",
    duration: "6 Hours",
    durationHours: 6,
    guestCount: 500,
    venueName: "Grand Ballroom, Fairmont Jakarta",
    venueAddress: "Jl. Asia Afrika No.8, Gelora, Senayan, Jakarta",
    status: "Confirmed",
    packageConfig: "Photobooth 6 Hours",
    backdrop: "Glam Silver",
    paperType: "Photostrip (2x6)",
    frameDesign: "Dibuatkan oleh Timelens",
    totalPrice: 6500000,
    downPayment: 6500000,
    remainingDue: 0,
    opsCount: 3,
    orderRef: "#TL-8812"
  },
  {
    id: "BK-2024-085",
    eventName: "Maya & Dan Intimate Wedding Celebration",
    displayTitle: "Maya & Dan Wedding",
    customerName: "Maya Danubrata",
    customerTitle: "Bride",
    customerPhone: "+62 811-3444-5555",
    customerEmail: "maya.dan@gmail.com",
    date: "2024-10-18",
    dateFormatted: "Friday, Oct 18, 2024",
    time: "19:00 – 23:00",
    duration: "4 Hours",
    durationHours: 4,
    guestCount: 200,
    venueName: "Villa Botanica, Bogor",
    venueAddress: "Jl. Raya Puncak KM 78, Cisarua, Bogor",
    status: "Confirmed",
    packageConfig: "Photobooth 4 Hours",
    backdrop: "Clean White",
    paperType: "Photo Crack",
    frameDesign: "Dibuatkan oleh Timelens",
    totalPrice: 4200000,
    downPayment: 4200000,
    remainingDue: 0,
    opsCount: 2,
    orderRef: "#TL-8818"
  },
  {
    id: "BK-2024-091",
    eventName: "Lumière Brand Pop-up Launch",
    displayTitle: "Lumière Brand Pop-up",
    customerName: "Marcus Chen",
    customerTitle: "Marketing Director",
    customerPhone: "+62 812-4455-6677",
    customerEmail: "marcus@lumiere.com",
    date: "2024-10-26",
    dateFormatted: "Saturday, Oct 26, 2024",
    time: "14:00 – 20:00",
    duration: "6 Hours",
    durationHours: 6,
    guestCount: 400,
    venueName: "Gallery Pavilion, Menteng",
    venueAddress: "Jl. Teuku Umar No. 10, Menteng, Jakarta Pusat",
    status: "Confirmed",
    packageConfig: "Photobooth 6 Hours",
    backdrop: "Glam Silver",
    paperType: "4R (4x6)",
    frameDesign: "Dari Client",
    totalPrice: 5800000,
    downPayment: 5800000,
    remainingDue: 0,
    opsCount: 3,
    orderRef: "#TL-8826"
  },
  {
    id: "BK-2024-092",
    eventName: "Sarah’s 30th Birthday Soirée",
    displayTitle: "Sarah's 30th Birthday Soirée",
    customerName: "Sarah Jenkins",
    customerTitle: "Host",
    customerPhone: "+62 815-9988-1234",
    customerEmail: "sarah.jenkins@outlook.com",
    date: "2024-10-29",
    dateFormatted: "Tuesday, Oct 29, 2024",
    time: "19:30 – 21:30",
    duration: "2 Hours",
    durationHours: 2,
    guestCount: 80,
    venueName: "Private Villa, Canggu",
    venueAddress: "Jl. Pantai Batu Bolong, Canggu, Bali",
    status: "Confirmed",
    packageConfig: "Photobooth 2 Hours",
    backdrop: "Clean White",
    paperType: "Photostrip (2x6)",
    frameDesign: "Dibuatkan oleh Timelens",
    totalPrice: 2800000,
    downPayment: 2800000,
    remainingDue: 0,
    opsCount: 1,
    orderRef: "#TL-8829"
  },
  {
    id: "BK-2024-093",
    eventName: "Evelyn & David Reception",
    displayTitle: "Evelyn & David Reception",
    customerName: "Evelyn Wijaya",
    customerTitle: "Bride",
    customerPhone: "+62 819-0123-4567",
    customerEmail: "evelyn.wijaya@yahoo.com",
    date: "2024-11-02",
    dateFormatted: "Saturday, Nov 02, 2024",
    time: "17:00 – 21:00",
    duration: "4 Hours",
    durationHours: 4,
    guestCount: 350,
    venueName: "Botanica Hall, Jakarta",
    venueAddress: "Jl. Simprug Garden No. 1, Kebayoran Lama, Jakarta",
    status: "Confirmed",
    packageConfig: "Photobooth 4 Hours",
    backdrop: "Satin Red",
    paperType: "4R (4x6)",
    frameDesign: "Dari Client",
    totalPrice: 3500000,
    downPayment: 3500000,
    remainingDue: 0,
    opsCount: 2,
    orderRef: "#TL-8832"
  }
];

export const initialIncomingOrders = [
  {
    id: "ORD-01",
    eventTitle: "Clara & Julian Engagement",
    clientName: "Clara Oswald",
    clientEmail: "clara.o@example.com",
    clientPhone: "+62 812-3344-5566",
    eventDate: "2024-11-15",
    eventDateFormatted: "Nov 15, 2024",
    eventTime: "18:00 WIB",
    duration: "Photobooth 4 Hours",
    durationExtra: "+1",
    venueName: "Plataran Dharmawangsa",
    venueDetail: "Jakarta Selatan · Included Guest Book",
    submittedTime: "Submitted 2 hours ago",
    status: "new",
    imageNum: "01",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0qcZOxe59lyN4ynHexj5gGTEUoFagI9HFY4ZuUjE_UYOTSfdaZESw6JnmFSYJMh4WFuFwBqZvpKPbGHu8ba0ogU4Q9svKChMrPkcP4kgHdR9Jq8PVm6MGCJAIzpx5EhD8CoVhtOqxRwSwXZ9Ol_k5o3WDQ6ewXOcIza4Ttecim8D7BM90q03-1O1ponoyLOEtkyNjRfv0_1OG0zQzXAJ5ki49nYCGAvX7gCv-GE0ErHRkSMCZOt-J",
    packageTotal: 3500000,
    estimatedFee: "Rp 3.500.000"
  },
  {
    id: "ORD-02",
    eventTitle: "Studio Milestone Dinner",
    clientName: "Adrian Thorne",
    clientEmail: "adrian.t@zenith.co",
    clientPhone: "+62 811-9876-5432",
    eventDate: "2024-11-20",
    eventDateFormatted: "Nov 20, 2024",
    eventTime: "19:00 WIB",
    duration: "Photobooth 2 Hours",
    durationExtra: null,
    venueName: "Fairmont Grand Ballroom",
    venueDetail: "Senayan, Jakarta Pusat",
    submittedTime: "Submitted Yesterday",
    status: "new",
    imageNum: "02",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzzPGjr9fdc_SYBG4_cg1xA0MYwpyG9YNorjoKxcxPAJC9xoCl5npQV7BTg8rZvj2zk1FsbYPuE3UjcJB19knYR_joxIrxDwP_2R_bPj_aZCpa42n-88uAyU4GoEJ9E7bRFO_wvyFMKYYViSLotlPNHcqIIq_49hmFRshfAKYdJhSQ4R5G-JAV0dL0ZXoLdvIQjjDVdYl3yaYT9vbLZLyBphtRvXt-zBX4CO8TH5eYkbuwDaF6C8ez",
    packageTotal: 2500000,
    estimatedFee: "Rp 2.500.000"
  },
  {
    id: "ORD-03",
    eventTitle: "Maya & Ken Wedding Reception",
    clientName: "Maya Indrawan",
    clientEmail: "maya.in@gmail.com",
    clientPhone: "+62 813-7766-5544",
    eventDate: "2024-12-07",
    eventDateFormatted: "Dec 07, 2024",
    eventTime: "17:00 WIB",
    duration: "Photobooth 6 Hours",
    durationExtra: "+2",
    venueName: "Four Seasons Jakarta",
    venueDetail: "Gatot Subroto · Backdrop + Extra Prints",
    submittedTime: "Submitted 3 days ago",
    status: "reviewed",
    imageNum: "03",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCquFDyygR-Ep39t-nh2ASQ8xPmbNYNtD60YX2p9e_GumI7S-0bUpovtFPOomH1PhBtI6ydNhZ0YryKnPR9HoCrmlmQsX51NQqe8aoH2srzAq1zDQacyI2JqVHW-QNV_mUzPZX9pwUSoVlRj4kvBFfA5UY2ZyRp2ekbHLk-d1sIn7y0Zsn80biWw3K6mB2GvAgYj2GsOJ8I6eDV-Qq7DDlTKhUCxCtu7OX-XQffU4su_CNJIS4mMtq",
    packageTotal: 5200000,
    estimatedFee: "Rp 5.200.000"
  },
  {
    id: "ORD-04",
    eventTitle: "Rachel 25th Birthday Bash",
    clientName: "Rachel Tan",
    clientEmail: "rtan@outlook.com",
    clientPhone: "+62 818-1234-5678",
    eventDate: "2024-12-14",
    eventDateFormatted: "Dec 14, 2024",
    eventTime: "20:00 WIB",
    duration: "Photobooth 2 Hours",
    durationExtra: null,
    venueName: "Private Rooftop, SCBD",
    venueDetail: "Sudirman Central District",
    submittedTime: "Submitted 5 days ago",
    status: "confirmed",
    imageNum: "04",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1I6vGWWOfuvOxDx2OlmCTTzc8i-JUfLBQMZNlckniHuTnnG7hfBmKJOM5viewW8k0oqV2YAuf9ys046czdWEMi617Wl_qazjOYpOtDTWJctDUkzHlJDeCiFDLvdWrtjJfQQvsJvu9Ymdwq-asSV-U4IHUgDTPcOVByYa7V1likBJNhyyenxZbFtKG1buJ-zN2CyGaaKfybqK8bCJVEIRJZd8mPlpsJVYpAgZQOfNLYHgglbQZB_9V",
    packageTotal: 2800000,
    estimatedFee: "Rp 2.800.000"
  }
];

export const initialExpenses = [
  {
    id: "EXP-01",
    date: "2024-10-24",
    dateFormatted: "24 Okt 2024",
    category: "Konsumsi / Crew Ops",
    eventName: "Birthday Natasha",
    description: "Makan siang crew (3 orang)",
    amount: 150000,
    paymentMethod: "Cash",
    notes: "Diberikan langsung kepada supervisor lapangan saat briefing siang.",
    period: "2024-10"
  },
  {
    id: "EXP-02",
    date: "2024-10-21",
    dateFormatted: "21 Okt 2024",
    category: "Transportasi",
    eventName: "Wedding Sarah & Dimas",
    description: "Transport & Tol operasional van crew Bogor - Jakarta",
    amount: 250000,
    paymentMethod: "Cash",
    notes: "Diserahkan kepada Kru Runner untuk reload logistik di SCBD.",
    period: "2024-10"
  },
  {
    id: "EXP-03",
    date: "2024-10-18",
    dateFormatted: "18 Okt 2024",
    category: "Crew Fee / Ops",
    eventName: "Corporate Gathering BCA",
    description: "Uang saku & konsumsi 2 operator booth lapangan",
    amount: 300000,
    paymentMethod: "Cash",
    notes: "Sesi operasional 5 jam.",
    period: "2024-10"
  },
  {
    id: "EXP-04",
    date: "2024-10-12",
    dateFormatted: "12 Okt 2024",
    category: "Logistik Event",
    eventName: "Sweet 17th Aurel",
    description: "Kebutuhan lakban kabel, baterai cadangan & props darurat",
    amount: 120000,
    paymentMethod: "Cash",
    notes: "Pembelian di toko elektronik dekat venue.",
    period: "2024-10"
  },
  {
    id: "EXP-05",
    date: "2024-10-05",
    dateFormatted: "05 Okt 2024",
    category: "Operasional Venue",
    eventName: "Engagement Bianca & Ryan",
    description: "Parkir loading dock venue & tips porter mall",
    amount: 80000,
    paymentMethod: "Cash",
    notes: "Parkir basement & tiket bongkar muat.",
    period: "2024-10"
  }
];

export const initialFormSubmissions = [
  {
    id: "SUB-01",
    clientName: "Sarah & Dimas",
    eventTitle: "Wedding Reception",
    duration: "4 Jam",
    timeAgo: "25 Menit yang lalu",
    status: "DP Terverifikasi",
    statusColor: "tertiary"
  },
  {
    id: "SUB-02",
    clientName: "Bank Mandiri Gala",
    eventTitle: "Corporate Annual Dinner",
    duration: "6 Jam",
    timeAgo: "2 Jam yang lalu",
    status: "Lunas",
    statusColor: "tertiary"
  },
  {
    id: "SUB-03",
    clientName: "Arka & Nadira",
    eventTitle: "Intimate Engagement",
    duration: "2 Jam",
    timeAgo: "Kemarin, 19:40",
    status: "Menunggu DP",
    statusColor: "secondary"
  }
];

export const monthlyReportsData = [
  {
    month: "JULI",
    monthFull: "Juli 2024",
    eventsCount: 8,
    revenue: 24000000,
    expenses: 3900000,
    netProfit: 20100000,
    revenueShort: "24M",
    expenseShort: "3.9",
    netShort: "20.1M"
  },
  {
    month: "AGUSTUS",
    monthFull: "Agustus 2024",
    eventsCount: 11,
    revenue: 25500000,
    expenses: 4100000,
    netProfit: 21400000,
    revenueShort: "25.5",
    expenseShort: "4.1",
    netShort: "21.4M"
  },
  {
    month: "SEPTEMBER",
    monthFull: "September 2024",
    eventsCount: 13,
    revenue: 28000000,
    expenses: 4200000,
    netProfit: 23800000,
    revenueShort: "28M",
    expenseShort: "4.2",
    netShort: "23.8M"
  },
  {
    month: "OKTOBER",
    monthFull: "Oktober 2024",
    eventsCount: 18,
    completedEvents: 14,
    pendingDpEvents: 4,
    revenue: 32500000,
    expenses: 4850000,
    netProfit: 27650000,
    revenueShort: "32.5",
    expenseShort: "4.8",
    netShort: "27.65M",
    marginPercent: 85.1,
    isPeak: true
  }
];

export const pricingOptions = {
  durationRates: {
    "2 Jam": 2000000,
    "3 Jam": 2400000,
    "4 Jam": 2800000,
    "5 Jam": 3200000,
    "6 Jam": 3600000
  },
  frameOptions: [
    { id: "client", label: "Dari Client", description: "Klien mengirim file layout sendiri", surcharge: 0 },
    { id: "timelens", label: "Dibuatkan oleh Timelens", description: "Design oleh timelens dengan 1X revisi", surcharge: 300000 }
  ],
  paperOptions: [
    {
      id: "photostrip",
      name: "Photostrip (2x6)",
      description: "Format strip vertikal 3 atau 4 pose ganda. Paling digemari tamu undangan.",
    },
    {
      id: "4r",
      name: "4R (4x6)",
      description: "Format foto penuh landscape/potrait 4R bingkai editorial elegan.",
    },
    {
      id: "photo_crack",
      name: "Photo Crack",
      description: "Sentuhan tepian bertekstur vintage crack premium cotton paper.",
    }
  ],
  backdropOptions: [
    {
      id: "clean_white",
      name: "Clean White",
    },
    {
      id: "glam_silver",
      name: "Glam Silver",
    },
    {
      id: "glam_gold",
      name: "Glam Gold",
    },
    {
      id: "glam_black",
      name: "Glam Black",
    },
    {
      id: "satin_red",
      name: "Satin Red",
    },
    {
      id: "velvet_green",
      name: "Velvet Green",
    },
    {
      id: "velvet_blue",
      name: "Velvet Blue",
    },
    {
      id: "client_backdrop",
      name: "Dari Client",
    },
  ]
};

export const defaultInvoiceSettings = {
  studioName: "Timelens Photobooth Atelier",
  studioPhone: "+62 811-920-8800",
  studioAddress: "Jl. Wijaya II No. 42, Kebayoran Baru, Jakarta Selatan 12160",
  invoicePrefix: "TL-INV-",
  invoicePattern: "[TAHUN]/[BULAN]/[NO]",
  receiptPrefix: "TL-RCT-",
  receiptPattern: "[TAHUN]/[NO]",
  dpLabel: "Down Payment (DP 50%)",
  settleLabel: "Pelunasan H-3 Acara",
  bankName: "Bank Central Asia (BCA)",
  accountNum: "883-092-1144",
  accountName: "PT Timelens Kreasi Abadi",
  paymentInstruction: "Harap sertakan kode booking / nama klien pada berita transfer & konfirmasi via WhatsApp.",
  termsConditions: `1. Uang muka (DP) tidak dapat dikembalikan jika terjadi pembatalan sepihak.\n2. Pelunasan wajib diselesaikan maksimal H-3 sebelum hari pelaksanaan acara photobooth.\n3. Pihak Timelens Photobooth Atelier berhak mengatur jadwal setup booth 2 jam sebelum acara dimulai.`,
  footerNote: "Terima kasih telah mempercayakan momen berharga Anda bersama Timelens Photobooth Atelier.",
  receiptTitle: "KWITANSI RESMI PELUNASAN / OFFICIAL SETTLEMENT RECEIPT",
  receiptPayerLabel: "Telah Diterima Dari (Received From)",
  receiptWordsLabel: "Sejumlah Uang (Amount in Words)",
  receiptDefaultDesc: "Pelunasan Sewa Photobooth Atelier & Cetak Arsip Fisik Tanpa Batas",
  includeStamp: true,
  stampColor: "bronze",
  stampText: "TIMELENS ATELIER · LUNAS / VERIFIED · VALIDATED PARIS • JAKARTA",
  includeSignature: true,
  handoverClauses: `1. Kwitansi ini merupakan bukti sah pelunasan biaya sewa photobooth Timelens Atelier.\n2. Soft file foto high-resolution akan diunggah ke Timelens Archival Cloud maksimal 2x24 jam setelah acara selesai.\n3. Master photo strips fisik asli diserahkan kepada perwakilan PIC / Wedding Organizer pada saat closing booth.\n4. Tim photobooth berhak menolak pembongkaran dini tanpa konfirmasi pihak berwenang di lokasi.`,
  whatsappGatewayConnected: true,
  whatsappTemplates: {
    dp: `Yth. *{nama_klien}*,\n\nTerima kasih atas reservasi photobooth atelier bersama *Timelens Photobooth Atelier*.\n\nBerikut ringkasan faktur pemesanan Anda:\n• No. Faktur: *{no_invoice}*\n• Total Investasi: *{total_tagihan}*\n• Nominal DP (50%): *{nominal_dp}*\n• Batas Waktu: *{jatuh_tempo}*\n\nPembayaran dapat disalurkan melalui transfer ke:\n*{nama_bank}* : *{nomor_rekening}*\na/n PT Timelens Kreasi Abadi\n\nTinjau detail reservasi dan unduh invoice resmi Anda di:\n{link_invoice}\n\nSalam hangat,\n*Tim Concierge Timelens Atelier*`,
    receipt: `Yth. *{nama_klien}*,\n\nTerima kasih. Pembayaran pelunasan untuk tagihan *{no_invoice}* telah kami terima dengan sempurna.\n\n• Status: *LUNAS (Paid in Full)*\n• Total Terbayar: *{total_tagihan}*\n• Saldo Sisa: *Rp 0*\n\nKwitansi digital resmi bercap tanda atelier telah terbit dan dapat diunduh pada tautan berikut:\n{link_kwitansi}\n\nKoleksi potret dan tim operator kami siap menghidupkan momentum berharga Anda.\n\nSalam hangat,\n*Tim Concierge Timelens Atelier*`,
    reminder: `Yth. *{nama_klien}*,\n\nMenyapa Anda dengan hangat dari *Timelens Atelier*.\n\nIni merupakan pengingat ramah bahwa sesi instalasi photobooth untuk perhelatan istimewa Anda akan berlangsung dalam *3 hari ke depan*.\n\n• No. Reservasi: *{no_invoice}*\n• Status Pembayaran: *Terkonfirmasi*\n\nJika ada koordinasi teknis panggung atau penyesuaian backdrop di lokasi, tim kami siap mendampingi melalui WhatsApp ini.\n\nSalam hormat,\n*Tim Concierge Timelens Atelier*`
  }
};
