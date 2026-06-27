const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URL

// ─── Connect ────────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const db = mongoose.connection.db;

  // ─── Clear all collections ──────────────────────────────────────────────
  console.log("🗑️  Clearing all collections...");
  await Promise.all([
    db.collection("users").deleteMany({}),
    db.collection("products").deleteMany({}),
    db.collection("coupons").deleteMany({}),
    db.collection("orders").deleteMany({}),
    db.collection("news").deleteMany({}),
    db.collection("presses").deleteMany({}),
    db.collection("subscribers").deleteMany({}),
  ]);
  console.log("✅ All collections cleared");

  // ─── IDs ────────────────────────────────────────────────────────────────
  const adminId        = new mongoose.Types.ObjectId("665f00000000000000000001");
  const rahulId        = new mongoose.Types.ObjectId("665f00000000000000000002");
  const priyaId        = new mongoose.Types.ObjectId("665f00000000000000000003");
  const arjunId        = new mongoose.Types.ObjectId("665f00000000000000000004");

  const teeId          = new mongoose.Types.ObjectId("665f00000000000000000101");
  const cargoId        = new mongoose.Types.ObjectId("665f00000000000000000102");
  const hoodieId       = new mongoose.Types.ObjectId("665f00000000000000000103");
  const coordId        = new mongoose.Types.ObjectId("665f00000000000000000104");
  const sweatshirtId   = new mongoose.Types.ObjectId("665f00000000000000000105");

  // ─── Users ──────────────────────────────────────────────────────────────
  await db.collection("users").insertMany([
    {
      _id: adminId,
      email: "admin@store.com",
      name: "Admin User",
      // bcrypt hash of "password123"
      hashedPassword: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8i",
      phone: "9876543210",
      role: "ADMIN",
      createdAt: new Date("2024-01-01T10:00:00Z"),
      updatedAt: new Date("2024-01-01T10:00:00Z"),
    },
    {
      _id: rahulId,
      email: "rahul.sharma@gmail.com",
      name: "Rahul Sharma",
      hashedPassword: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8i",
      phone: "9123456780",
      role: "CUSTOMER",
      createdAt: new Date("2024-02-10T08:30:00Z"),
      updatedAt: new Date("2024-02-10T08:30:00Z"),
    },
    {
      _id: priyaId,
      email: "priya.mehta@gmail.com",
      name: "Priya Mehta",
      hashedPassword: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8i",
      phone: "9988776655",
      role: "CUSTOMER",
      createdAt: new Date("2024-03-15T11:00:00Z"),
      updatedAt: new Date("2024-03-15T11:00:00Z"),
    },
    {
      _id: arjunId,
      email: "arjun.patel@gmail.com",
      name: "Arjun Patel",
      hashedPassword: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8i",
      phone: "9871122334",
      role: "CUSTOMER",
      createdAt: new Date("2024-04-20T14:00:00Z"),
      updatedAt: new Date("2024-04-20T14:00:00Z"),
    },
  ]);
  console.log("✅ Users seeded");

  // ─── Products (Unsplash images — free, no auth needed) ──────────────────
  await db.collection("products").insertMany([
    {
      _id: teeId,
      name: "Classic White Oversized Tee",
      description:
        "A premium 100% cotton oversized t-shirt with a relaxed fit. Perfect for casual outings or layering. Pre-washed for a soft feel from day one.",
      price: 999,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format",
      ],
      category: "T-Shirts",
      sizes: [
        { size: "S", countInStock: 15 },
        { size: "M", countInStock: 20 },
        { size: "L", countInStock: 18 },
        { size: "XL", countInStock: 10 },
      ],
      createdAt: new Date("2024-01-05T09:00:00Z"),
      updatedAt: new Date("2024-01-05T09:00:00Z"),
    },
    {
      _id: cargoId,
      name: "Vintage Wash Cargo Pants",
      description:
        "Relaxed-fit cargo pants with multiple pockets and a vintage wash finish. Made from a cotton-twill blend for durability and comfort.",
      price: 2499,
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format",
      ],
      category: "Bottoms",
      sizes: [
        { size: "28", countInStock: 8 },
        { size: "30", countInStock: 12 },
        { size: "32", countInStock: 10 },
        { size: "34", countInStock: 5 },
      ],
      createdAt: new Date("2024-01-10T10:00:00Z"),
      updatedAt: new Date("2024-01-10T10:00:00Z"),
    },
    {
      _id: hoodieId,
      name: "Embroidered Floral Hoodie",
      description:
        "A heavyweight fleece hoodie featuring hand-feel embroidery on the chest. Kangaroo pocket, adjustable drawstring, and ribbed cuffs.",
      price: 3299,
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&auto=format",
        "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&auto=format",
      ],
      category: "Hoodies",
      sizes: [
        { size: "S", countInStock: 6 },
        { size: "M", countInStock: 14 },
        { size: "L", countInStock: 9 },
        { size: "XL", countInStock: 4 },
      ],
      createdAt: new Date("2024-01-15T12:00:00Z"),
      updatedAt: new Date("2024-01-15T12:00:00Z"),
    },
    {
      _id: coordId,
      name: "Linen Summer Co-ord Set",
      description:
        "A breathable linen co-ord set with a button-down shirt and matching shorts. Ideal for summer vacations and beach trips.",
      price: 3799,
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format",
      ],
      category: "Co-ords",
      sizes: [{ size: "One Size", countInStock: 25 }],
      createdAt: new Date("2024-02-01T08:00:00Z"),
      updatedAt: new Date("2024-02-01T08:00:00Z"),
    },
    {
      _id: sweatshirtId,
      name: "Graphic Print Sweatshirt",
      description:
        "A bold graphic-print sweatshirt in French terry fabric. Crew neck, dropped shoulders, and a signature logo print on the back.",
      price: 1899,
      images: [
        "https://images.unsplash.com/photo-1572495532056-8583af1cbad4?w=600&auto=format",
        "https://images.unsplash.com/photo-1548778052-311f4bc2b502?w=600&auto=format",
      ],
      category: "Sweatshirts",
      sizes: [
        { size: "S", countInStock: 0 },
        { size: "M", countInStock: 7 },
        { size: "L", countInStock: 13 },
      ],
      createdAt: new Date("2024-02-20T09:30:00Z"),
      updatedAt: new Date("2024-02-20T09:30:00Z"),
    },
  ]);
  console.log("✅ Products seeded");

  // ─── Coupons ────────────────────────────────────────────────────────────
  await db.collection("coupons").insertMany([
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000201"),
      code: "WELCOME20",
      discountType: "PERCENTAGE",
      discountValue: 20,
      maxDiscountAmount: 500,
      isActive: true,
      expiryDate: new Date("2025-12-31T23:59:59Z"),
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000202"),
      code: "FLAT200",
      discountType: "FIXED",
      discountValue: 200,
      maxDiscountAmount: null,
      isActive: true,
      expiryDate: new Date("2025-06-30T23:59:59Z"),
      createdAt: new Date("2024-02-01T00:00:00Z"),
      updatedAt: new Date("2024-02-01T00:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000203"),
      code: "SUMMER15",
      discountType: "PERCENTAGE",
      discountValue: 15,
      maxDiscountAmount: 300,
      isActive: true,
      expiryDate: new Date("2025-08-31T23:59:59Z"),
      createdAt: new Date("2024-03-01T00:00:00Z"),
      updatedAt: new Date("2024-03-01T00:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000204"),
      code: "EXPIRED50",
      discountType: "FIXED",
      discountValue: 50,
      maxDiscountAmount: null,
      isActive: false,
      expiryDate: new Date("2023-12-31T23:59:59Z"),
      createdAt: new Date("2023-11-01T00:00:00Z"),
      updatedAt: new Date("2023-12-31T00:00:00Z"),
    },
  ]);
  console.log("✅ Coupons seeded");

  // ─── Orders ─────────────────────────────────────────────────────────────
  await db.collection("orders").insertMany([
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000301"),
      user: rahulId,
      orderItems: [
        {
          name: "Classic White Oversized Tee",
          qty: 2,
          size: "M",
          price: 999,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format",
          product: teeId,
        },
        {
          name: "Vintage Wash Cargo Pants",
          qty: 1,
          size: "30",
          price: 2499,
          image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format",
          product: cargoId,
        },
      ],
      shippingAddress: {
        address: "12 MG Road, Koramangala",
        city: "Bengaluru",
        postalCode: "560034",
        country: "India",
        phone: "9123456780",
      },
      paymentMethod: "Razorpay",
      paymentResult: {
        id: "pay_QAbc123XYZ",
        status: "captured",
        update_time: "2024-05-01T10:15:00Z",
        email_address: "rahul.sharma@gmail.com",
      },
      itemsPrice: 4497,
      shippingPrice: 0,
      discountAmount: 500,
      totalPrice: 3997,
      isPaid: true,
      paidAt: new Date("2024-05-01T10:15:00Z"),
      isDelivered: true,
      deliveredAt: new Date("2024-05-05T14:00:00Z"),
      createdAt: new Date("2024-05-01T09:50:00Z"),
      updatedAt: new Date("2024-05-05T14:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000302"),
      user: priyaId,
      orderItems: [
        {
          name: "Embroidered Floral Hoodie",
          qty: 1,
          size: "S",
          price: 3299,
          image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&auto=format",
          product: hoodieId,
        },
      ],
      shippingAddress: {
        address: "45 Andheri West, Near Station",
        city: "Mumbai",
        postalCode: "400058",
        country: "India",
        phone: "9988776655",
      },
      paymentMethod: "Razorpay",
      paymentResult: {
        id: "pay_QDef456ABC",
        status: "captured",
        update_time: "2024-05-10T12:00:00Z",
        email_address: "priya.mehta@gmail.com",
      },
      itemsPrice: 3299,
      shippingPrice: 99,
      discountAmount: 0,
      totalPrice: 3398,
      isPaid: true,
      paidAt: new Date("2024-05-10T12:00:00Z"),
      isDelivered: false,
      createdAt: new Date("2024-05-10T11:45:00Z"),
      updatedAt: new Date("2024-05-10T12:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000303"),
      user: arjunId,
      orderItems: [
        {
          name: "Linen Summer Co-ord Set",
          qty: 1,
          size: "One Size",
          price: 3799,
          image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format",
          product: coordId,
        },
        {
          name: "Graphic Print Sweatshirt",
          qty: 1,
          size: "L",
          price: 1899,
          image: "https://images.unsplash.com/photo-1572495532056-8583af1cbad4?w=600&auto=format",
          product: sweatshirtId,
        },
      ],
      shippingAddress: {
        address: "7 Civil Lines, Near Collectorate",
        city: "Bhagalpur",
        postalCode: "812001",
        country: "India",
        phone: "9871122334",
      },
      paymentMethod: "Razorpay",
      paymentResult: {
        id: "",
        status: "",
        update_time: "",
        email_address: "",
      },
      itemsPrice: 5698,
      shippingPrice: 99,
      discountAmount: 200,
      totalPrice: 5597,
      isPaid: false,
      isDelivered: false,
      createdAt: new Date("2024-05-20T16:30:00Z"),
      updatedAt: new Date("2024-05-20T16:30:00Z"),
    },
  ]);
  console.log("✅ Orders seeded");

  // ─── News ────────────────────────────────────────────────────────────────
  await db.collection("news").insertMany([
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000401"),
      title: "Our Summer 2024 Collection Has Arrived",
      content:
        "We are thrilled to announce the launch of our Summer 2024 collection featuring breathable linens, pastel co-ords, and bold graphic prints. Designed for the modern explorer, this collection blends comfort with style. Shop now and get 15% off with code SUMMER15.",
      createdAt: new Date("2024-04-01T08:00:00Z"),
      updatedAt: new Date("2024-04-01T08:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000402"),
      title: "Free Shipping on Orders Above ₹2000",
      content:
        "Starting May 1st, all orders above ₹2000 will qualify for free standard shipping across India. We are committed to making fashion more accessible and delivering your favourite pieces right to your doorstep without any extra cost.",
      createdAt: new Date("2024-04-28T09:00:00Z"),
      updatedAt: new Date("2024-04-28T09:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000403"),
      title: "Sustainability Report 2023: Our Journey Towards Greener Fashion",
      content:
        "This year, we reduced our water usage by 30%, switched to recycled packaging for over 60% of our shipments, and partnered with certified ethical factories. Read our full sustainability report to learn how we are building a fashion brand that cares for the planet.",
      createdAt: new Date("2024-03-15T10:00:00Z"),
      updatedAt: new Date("2024-03-15T10:00:00Z"),
    },
  ]);
  console.log("✅ News seeded");

  // ─── Presses ─────────────────────────────────────────────────────────────
  await db.collection("presses").insertMany([
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000501"),
      headline: "Vogue India: The Indie Labels Redefining Indian Streetwear",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format",
      redirectLink: "https://www.vogue.in",
      createdAt: new Date("2024-02-14T00:00:00Z"),
      updatedAt: new Date("2024-02-14T00:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000502"),
      headline: "Hypebeast: 10 South Asian Brands You Need to Know in 2024",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format",
      redirectLink: "https://hypebeast.com",
      createdAt: new Date("2024-01-20T00:00:00Z"),
      updatedAt: new Date("2024-01-20T00:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000503"),
      headline: "Forbes India: How Gen-Z Entrepreneurs Are Disrupting Fast Fashion",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format",
      redirectLink: "https://www.forbesindia.com",
      createdAt: new Date("2024-03-05T00:00:00Z"),
      updatedAt: new Date("2024-03-05T00:00:00Z"),
    },
  ]);
  console.log("✅ Presses seeded");

  // ─── Subscribers ─────────────────────────────────────────────────────────
  await db.collection("subscribers").insertMany([
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000601"),
      email: "rahul.sharma@gmail.com",
      status: "ACTIVE",
      createdAt: new Date("2024-02-10T08:35:00Z"),
      updatedAt: new Date("2024-02-10T08:35:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000602"),
      email: "priya.mehta@gmail.com",
      status: "ACTIVE",
      createdAt: new Date("2024-03-15T11:05:00Z"),
      updatedAt: new Date("2024-03-15T11:05:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000603"),
      email: "sneha.kapoor@outlook.com",
      status: "UNSUBSCRIBED",
      createdAt: new Date("2024-01-20T07:00:00Z"),
      updatedAt: new Date("2024-04-01T10:00:00Z"),
    },
    {
      _id: new mongoose.Types.ObjectId("665f00000000000000000604"),
      email: "vikram.nair@yahoo.com",
      status: "ACTIVE",
      createdAt: new Date("2024-04-10T15:00:00Z"),
      updatedAt: new Date("2024-04-10T15:00:00Z"),
    },
  ]);
  console.log("✅ Subscribers seeded");

  console.log("\n🎉 Database seeded successfully!");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});