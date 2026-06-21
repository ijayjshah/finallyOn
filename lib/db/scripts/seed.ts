import { sql } from "drizzle-orm";
import { db, pool } from "../src/index.js";
import { hashPassword } from "../src/password.js";
import {
  analyticsEventsTable,
  approvalLogsTable,
  areasTable,
  categoriesTable,
  districtsTable,
  emailVerificationCodesTable,
  inquiriesTable,
  jobsTable,
  listingPhotosTable,
  listingsTable,
  passwordResetTokensTable,
  profilePhotosTable,
  profileServicesTable,
  profileTagsTable,
  reviewsTable,
  serviceProfilesTable,
  sessionsTable,
  usersTable,
  waitlistLeadsTable,
} from "../src/schema/index.js";

const NAVSARI_AREAS = [
  "Navsari City",
  "Jalalpore",
  "Gandevi",
  "Chikhli",
  "Vansda",
  "Bilimora",
  "Vijalpore",
  "Dungri",
  "Mahuva",
  "Vejalpore",
];

const SERVICE_CATEGORIES = [
  "Electrician",
  "Plumber",
  "Beautician",
  "Home Chef / Tiffin Service",
  "Home Tutor",
  "Mehendi Artist",
];

const BUSINESS_CATEGORIES = [
  "Grocery / Kirana",
  "Pharmacy",
  "Salon / Parlour",
  "Bakery / Sweet Shop",
];

async function clearDatabase() {
  await db.execute(sql`
    TRUNCATE TABLE
      approval_logs,
      analytics_events,
      inquiries,
      reviews,
      profile_services,
      profile_photos,
      profile_tags,
      listing_photos,
      jobs,
      listings,
      service_profiles,
      waitlist_leads,
      sessions,
      email_verification_codes,
      password_reset_tokens,
      users,
      areas,
      categories,
      districts
    RESTART IDENTITY CASCADE
  `);
}

function photo(seed: string) {
  return `https://picsum.photos/seed/${seed}/800/600`;
}

async function seed() {
  console.log("Clearing existing data...");
  await clearDatabase();

  console.log("Seeding districts & areas...");
  const [navsari] = await db
    .insert(districtsTable)
    .values([
      { name: "Navsari", slug: "navsari", status: "live", sortOrder: 1 },
      { name: "Surat", slug: "surat", status: "coming_soon", sortOrder: 2 },
      { name: "Valsad", slug: "valsad", status: "coming_soon", sortOrder: 3 },
      { name: "Vapi", slug: "vapi", status: "coming_soon", sortOrder: 4 },
    ])
    .returning();

  const areaRows = await db
    .insert(areasTable)
    .values(
      NAVSARI_AREAS.map((name) => ({
        districtId: navsari!.id,
        name,
      })),
    )
    .returning();

  const areaByName = Object.fromEntries(areaRows.map((a) => [a.name, a.id]));

  console.log("Seeding categories...");
  await db.insert(categoriesTable).values([
    ...SERVICE_CATEGORIES.map((name, i) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      kind: "service_provider" as const,
      sortOrder: i + 1,
    })),
    ...BUSINESS_CATEGORIES.map((name, i) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      kind: "business" as const,
      sortOrder: i + 1,
    })),
  ]);

  console.log("Seeding users...");
  const adminHash = await hashPassword("admin123");
  const demoHash = await hashPassword("demo123");
  const providerHash = await hashPassword("provider123");

  const userRows = await db
    .insert(usersTable)
    .values([
      {
        name: "FinallyOn Admin",
        email: "admin@finallyon.in",
        passwordHash: adminHash,
        phone: "+91 99999 00001",
        whatsappNumber: "919999900001",
        userType: "user",
        role: "admin",
        status: "active",
        city: "Navsari",
        districtName: "Navsari",
        districtId: navsari!.id,
        emailVerifiedAt: new Date(),
      },
      {
        name: "Demo User",
        email: "demo@finallyon.in",
        passwordHash: demoHash,
        phone: "+91 99999 00000",
        whatsappNumber: "919999900000",
        userType: "user",
        role: "user",
        status: "active",
        city: "Navsari",
        districtName: "Navsari",
        districtId: navsari!.id,
        emailVerifiedAt: new Date(),
        onboardingCompletedAt: new Date(),
      },
      {
        name: "Ramesh Patel",
        email: "ramesh@finallyon.in",
        passwordHash: providerHash,
        phone: "+91 98765 43210",
        whatsappNumber: "919876543210",
        userType: "service_provider",
        role: "user",
        status: "active",
        city: "Navsari",
        districtName: "Navsari",
        districtId: navsari!.id,
        serviceCategory: "Electrician",
        emailVerifiedAt: new Date(),
      },
      {
        name: "Priya Shah",
        email: "priya@finallyon.in",
        passwordHash: providerHash,
        phone: "+91 98765 43211",
        whatsappNumber: "919876543211",
        userType: "service_provider",
        role: "user",
        status: "active",
        city: "Navsari",
        districtName: "Navsari",
        districtId: navsari!.id,
        serviceCategory: "Beautician",
        emailVerifiedAt: new Date(),
      },
      {
        name: "Mohammed Shaikh",
        email: "mohammed@finallyon.in",
        passwordHash: providerHash,
        phone: "+91 98765 43212",
        whatsappNumber: "919876543212",
        userType: "service_provider",
        role: "user",
        status: "active",
        city: "Navsari",
        districtName: "Navsari",
        districtId: navsari!.id,
        serviceCategory: "Plumber",
        emailVerifiedAt: new Date(),
      },
      {
        name: "Kavita Desai",
        email: "kavita@finallyon.in",
        passwordHash: providerHash,
        phone: "+91 98765 43213",
        whatsappNumber: "919876543213",
        userType: "business_owner",
        role: "user",
        status: "active",
        city: "Navsari",
        districtName: "Navsari",
        districtId: navsari!.id,
        serviceCategory: "Grocery / Kirana",
        emailVerifiedAt: new Date(),
      },
    ])
    .returning();

  const userByEmail = Object.fromEntries(userRows.map((u) => [u.email, u]));

  console.log("Seeding service profiles...");
  const profileSpecs = [
    {
      userEmail: "ramesh@finallyon.in",
      name: "Ramesh Patel",
      category: "Electrician",
      profileType: "service" as const,
      area: "Navsari City",
      description:
        "Licensed electrician with 14 years of experience serving Navsari district.",
      experience: "14 years",
      rating: "4.8",
      reviewCount: 156,
      tags: ["Wiring", "Panel Repair", "Emergency"],
      services: [
        {
          name: "Home Wiring (per room)",
          price: "₹500–₹800",
          description: "Complete wiring with branded materials",
        },
        {
          name: "Fan/Light Installation",
          price: "₹150/unit",
          description: "Ceiling fans, lights, switches",
        },
      ],
      photoSeeds: ["ramesh-1", "ramesh-2"],
    },
    {
      userEmail: "priya@finallyon.in",
      name: "Priya Shah",
      category: "Beautician",
      profileType: "service" as const,
      area: "Jalalpore",
      description: "Professional beautician and makeup artist in Jalalpore.",
      experience: "8 years",
      rating: "4.9",
      reviewCount: 203,
      tags: ["Bridal", "Makeup", "Facials"],
      services: [
        {
          name: "Bridal Makeup Package",
          price: "₹8,000–₹15,000",
          description: "Full bridal with trial session",
        },
      ],
      photoSeeds: ["priya-1", "priya-2", "priya-3"],
    },
    {
      userEmail: "mohammed@finallyon.in",
      name: "Mohammed Shaikh",
      category: "Plumber",
      profileType: "service" as const,
      area: "Bilimora",
      description: "Experienced plumber serving Bilimora and nearby towns.",
      experience: "10 years",
      rating: "4.7",
      reviewCount: 89,
      tags: ["Pipe Fitting", "Bathroom", "Drainage"],
      services: [
        {
          name: "Pipe Fitting & Repair",
          price: "₹300–₹600",
          description: "All pipe materials supported",
        },
      ],
      photoSeeds: ["mohammed-1"],
    },
    {
      userEmail: "kavita@finallyon.in",
      name: "Kavita Desai Kirana",
      category: "Grocery / Kirana",
      profileType: "business" as const,
      area: "Gandevi",
      description: "Trusted neighbourhood kirana store in Gandevi with daily essentials.",
      experience: "12 years",
      rating: "4.6",
      reviewCount: 64,
      tags: ["Grocery", "Home Delivery", "Daily Needs"],
      services: [
        {
          name: "Home Delivery",
          price: "Free above ₹500",
          description: "Same-day delivery in Gandevi",
        },
      ],
      photoSeeds: ["kavita-1", "kavita-2"],
      deliveryAvailable: true,
    },
  ];

  const profileIds: number[] = [];

  for (const spec of profileSpecs) {
    const user = userByEmail[spec.userEmail]!;
    const [profile] = await db
      .insert(serviceProfilesTable)
      .values({
        userId: user.id,
        name: spec.name,
        category: spec.category,
        profileType: spec.profileType,
        city: "Navsari",
        area: spec.area,
        districtName: "Navsari",
        districtId: navsari!.id,
        areaId: areaByName[spec.area],
        description: spec.description,
        experience: spec.experience,
        phone: user.phone,
        whatsappNumber: user.whatsappNumber,
        mapUrl: `https://maps.google.com/?q=${encodeURIComponent(spec.area + " Navsari")}`,
        verified: true,
        available: true,
        rating: spec.rating,
        reviewCount: spec.reviewCount,
        approvalStatus: "approved",
        deliveryAvailable: spec.deliveryAvailable ?? false,
        pickupAvailable: true,
      })
      .returning();

    profileIds.push(profile!.id);

    await db.insert(profileServicesTable).values(
      spec.services.map((service, index) => ({
        profileId: profile!.id,
        ...service,
        sortOrder: index,
      })),
    );

    await db.insert(profilePhotosTable).values(
      spec.photoSeeds.map((seed, index) => ({
        profileId: profile!.id,
        url: photo(seed),
        sortOrder: index,
      })),
    );

    await db.insert(profileTagsTable).values(
      spec.tags.map((tag) => ({
        profileId: profile!.id,
        tag,
      })),
    );
  }

  console.log("Seeding listings...");
  const kavita = userByEmail["kavita@finallyon.in"]!;
  const [listing] = await db
    .insert(listingsTable)
    .values({
      userId: kavita.id,
      title: "Monthly Grocery Combo Pack",
      category: "Grocery / Kirana",
      subCategory: "Combo",
      description: "Dal, rice, oil, masala and snacks combo for a family of four.",
      price: "₹1,499",
      city: "Navsari",
      area: "Gandevi",
      districtName: "Navsari",
      districtId: navsari!.id,
      areaId: areaByName["Gandevi"],
      type: "product",
      deliveryAvailable: true,
      pickupAvailable: true,
      whatsappNumber: kavita.whatsappNumber,
      active: true,
      approvalStatus: "approved",
    })
    .returning();

  await db.insert(listingPhotosTable).values([
    { listingId: listing!.id, url: photo("listing-grocery-1"), sortOrder: 0 },
    { listingId: listing!.id, url: photo("listing-grocery-2"), sortOrder: 1 },
  ]);

  console.log("Seeding jobs...");
  await db.insert(jobsTable).values([
    {
      userId: userByEmail["kavita@finallyon.in"]!.id,
      posterName: "Kavita Desai",
      listingType: "opening",
      title: "Shop Helper Needed – Gandevi Kirana",
      category: "Retail",
      description: "Looking for a reliable shop helper for morning and evening shifts.",
      salary: "₹10,000–₹12,000/month",
      employmentType: "Full-time",
      experience: "1+ years",
      city: "Navsari",
      area: "Gandevi",
      districtName: "Navsari",
      districtId: navsari!.id,
      areaId: areaByName["Gandevi"],
      contact: kavita.phone,
      whatsappNumber: kavita.whatsappNumber,
      approvalStatus: "approved",
      active: true,
    },
    {
      userId: userByEmail["ramesh@finallyon.in"]!.id,
      posterName: "Ramesh Patel",
      listingType: "opening",
      title: "Electrician Apprentice – Navsari City",
      category: "Electrician",
      description: "Training provided. Must be willing to travel within Navsari district.",
      salary: "₹8,000–₹10,000/month",
      employmentType: "Full-time",
      experience: "Fresher welcome",
      city: "Navsari",
      area: "Navsari City",
      districtName: "Navsari",
      districtId: navsari!.id,
      areaId: areaByName["Navsari City"],
      contact: userByEmail["ramesh@finallyon.in"]!.phone,
      whatsappNumber: userByEmail["ramesh@finallyon.in"]!.whatsappNumber,
      approvalStatus: "approved",
      active: true,
    },
  ]);

  console.log("Seeding waitlist leads...");
  await db.insert(waitlistLeadsTable).values([
    {
      name: "Amit Joshi",
      phone: "+91 98250 12345",
      email: "amit@example.com",
      district: "Surat",
      category: "Electrician",
      status: "new",
    },
    {
      name: "Neha Patel",
      phone: "+91 98250 54321",
      email: "neha@example.com",
      district: "Valsad",
      category: "Beautician",
      status: "contacted",
    },
  ]);

  console.log("Seeding sample reviews...");
  await db.insert(reviewsTable).values([
    {
      profileId: profileIds[0]!,
      reviewerName: "Suresh Bhai",
      rating: 5,
      comment: "Quick response and neat wiring work. Highly recommended in Navsari.",
    },
    {
      profileId: profileIds[1]!,
      reviewerName: "Divya Mehta",
      rating: 5,
      comment: "Bridal makeup was perfect. Very professional.",
    },
  ]);

  console.log("");
  console.log("Seed complete.");
  console.log("");
  console.log("Login credentials:");
  console.log("  Admin:    admin@finallyon.in / admin123");
  console.log("  Demo:     demo@finallyon.in / demo123");
  console.log("  Provider: ramesh@finallyon.in / provider123");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
