import mongoose from "mongoose";
import { getDaoProducts } from "../src/daos/products/products.dao.js";
import Logger from "../src/utils/logger.js";
import { MONGO_URL } from "../src/config/config.js";

const daoProducts = getDaoProducts();
mongoose
  .connect(MONGO_URL)
  .then(() => {
    Logger.debug("connected to db");
    return insertProducts();
  })

  .catch((err) => {
    Logger.error("error connecting to db", err);
  })
  .finally(() => {
    mongoose.disconnect();
  });

async function insertProducts() {
  const products = [
    {
      title: "Samsung Galaxy S21 Ultra",
      description:
        "Latest generation smartphone with 108MP camera and 100x zoom",
      code: "PROD001",
      price: 1199,
      status: true,
      stock: 50,
      category: "Tech",
      thumbnails: [
        "https://example.com/images/galaxy-s21-ultra-1.jpg",
        "https://example.com/images/galaxy-s21-ultra-2.jpg",
      ],
      trending: true,
      featured: true,
    },
    {
      title: "Apple AirPods Pro",
      description: "Wireless earbuds with active noise cancellation",
      code: "PROD002",
      price: 249,
      status: true,
      stock: 100,
      category: "Tech",
      thumbnails: [
        "https://example.com/images/airpods-pro-1.jpg",
        "https://example.com/images/airpods-pro-2.jpg",
      ],
      trending: true,
      featured: false,
    },
    {
      title: "Fitbit Versa 3",
      description: "Smartwatch with built-in GPS and heart rate monitoring",
      code: "PROD003",
      price: 229,
      status: true,
      stock: 75,
      category: "Wellness",
      thumbnails: [
        "https://example.com/images/fitbit-versa-3-1.jpg",
        "https://example.com/images/fitbit-versa-3-2.jpg",
      ],
      trending: false,
      featured: true,
    },
    {
      title: "Philips Hue Starter Kit",
      description: "Smart lighting kit with 3 bulbs and connection bridge",
      code: "PROD004",
      price: 199,
      status: true,
      stock: 60,
      category: "Home & Living",
      thumbnails: [
        "https://example.com/images/philips-hue-1.jpg",
        "https://example.com/images/philips-hue-2.jpg",
      ],
      trending: true,
      featured: false,
    },
    {
      title: "TRX All-in-One Suspension Training",
      description: "Suspension training system for home workouts",
      code: "PROD005",
      price: 169,
      status: true,
      stock: 40,
      category: "Wellness",
      thumbnails: [
        "https://example.com/images/trx-1.jpg",
        "https://example.com/images/trx-2.jpg",
      ],
      trending: false,
      featured: true,
    },
    {
      title: "Nature's Bounty Omega-3 Fish Oil",
      description: "Fish oil supplement with 1400mg of Omega-3",
      code: "PROD006",
      price: 29,
      status: true,
      stock: 200,
      category: "Wellness",
      thumbnails: [
        "https://example.com/images/fish-oil-1.jpg",
        "https://example.com/images/fish-oil-2.jpg",
      ],
      trending: false,
      featured: false,
    },
    {
      title: "Estée Lauder Advanced Night Repair",
      description: "Anti-aging facial serum for nighttime use",
      code: "PROD007",
      price: 75,
      status: true,
      stock: 80,
      category: "Wellness",
      thumbnails: [
        "https://example.com/images/estee-lauder-1.jpg",
        "https://example.com/images/estee-lauder-2.jpg",
      ],
      trending: true,
      featured: false,
    },
    {
      title: "Dyson Pure Cool Purifying Fan",
      description: "2-in-1 fan and air purifier with remote control",
      code: "PROD008",
      price: 549,
      status: true,
      stock: 30,
      category: "Home & Living",
      thumbnails: [
        "https://example.com/images/dyson-pure-cool-1.jpg",
        "https://example.com/images/dyson-pure-cool-2.jpg",
      ],
      trending: true,
      featured: true,
    },
    {
      title: "IKEA POÄNG Armchair",
      description: "Scandinavian design armchair with birch frame",
      code: "PROD009",
      price: 199,
      status: true,
      stock: 50,
      category: "Home & Living",
      thumbnails: [
        "https://example.com/images/poang-1.jpg",
        "https://example.com/images/poang-2.jpg",
      ],
      trending: false,
      featured: false,
    },
    {
      title: "KitchenAid Artisan Stand Mixer",
      description: "Professional stand mixer with 4.8L stainless steel bowl",
      code: "PROD010",
      price: 399,
      status: true,
      stock: 40,
      category: "Home & Living",
      thumbnails: [
        "https://example.com/images/kitchenaid-1.jpg",
        "https://example.com/images/kitchenaid-2.jpg",
      ],
      trending: true,
      featured: true,
    },
    {
      title: "Brooklinen Luxe Core Sheet Set",
      description: "480 thread count cotton sheet set",
      code: "PROD011",
      price: 149,
      status: true,
      stock: 100,
      category: "Home & Living",
      thumbnails: [
        "https://example.com/images/brooklinen-1.jpg",
        "https://example.com/images/brooklinen-2.jpg",
      ],
      trending: false,
      featured: false,
    },
    {
      title: "SimpleHuman 58L Sensor Can",
      description: "Motion sensor trash can with recycling compartments",
      code: "PROD012",
      price: 200,
      status: true,
      stock: 60,
      category: "Home & Living",
      thumbnails: [
        "https://example.com/images/simplehuman-1.jpg",
        "https://example.com/images/simplehuman-2.jpg",
      ],
      trending: false,
      featured: false,
    },
    {
      title: "Levi's 501 Original Fit Jeans",
      description: "Classic straight-cut jeans for men",
      code: "PROD013",
      price: 69,
      status: true,
      stock: 150,
      category: "Fashion & Accessories",
      thumbnails: [
        "https://example.com/images/levis-501-1.jpg",
        "https://example.com/images/levis-501-2.jpg",
      ],
      trending: true,
      featured: true,
    },
    {
      title: "Michael Kors Jet Set Tote",
      description: "Saffiano leather tote bag with top zip closure",
      code: "PROD014",
      price: 298,
      status: true,
      stock: 70,
      category: "Fashion & Accessories",
      thumbnails: [
        "https://example.com/images/michael-kors-1.jpg",
        "https://example.com/images/michael-kors-2.jpg",
      ],
      trending: true,
      featured: false,
    },
    {
      title: "Patagonia Better Sweater Fleece Jacket",
      description: "Full-zip jacket made from recycled fleece",
      code: "PROD015",
      price: 139,
      status: true,
      stock: 80,
      category: "Fashion & Accessories",
      thumbnails: [
        "https://example.com/images/patagonia-1.jpg",
        "https://example.com/images/patagonia-2.jpg",
      ],
      trending: false,
      featured: false,
    },
    {
      title: "Organic Valley Grass-Fed Milk",
      description: "Organic milk from grass-fed cows, 1 gallon",
      code: "PROD016",
      price: 6.99,
      status: true,
      stock: 100,
      category: "Food & Drink",
      thumbnails: [
        "https://example.com/images/organic-valley-1.jpg",
        "https://example.com/images/organic-valley-2.jpg",
      ],
      trending: false,
      featured: false,
    },
    {
      title: "Blue Apron Meal Kit Subscription",
      description: "Weekly meal kit subscription for 2 people, 3 recipes",
      code: "PROD017",
      price: 59.94,
      status: true,
      stock: 500,
      category: "Food & Drink",
      thumbnails: [
        "https://example.com/images/blue-apron-1.jpg",
        "https://example.com/images/blue-apron-2.jpg",
      ],
      trending: true,
      featured: true,
    },
    {
      title: "La Colombe Draft Latte 4-Pack",
      description: "Pack of 4 cans of frothy draft latte coffee",
      code: "PROD018",
      price: 14,
      status: true,
      stock: 200,
      category: "Food & Drink",
      thumbnails: [
        "https://example.com/images/la-colombe-1.jpg",
        "https://example.com/images/la-colombe-2.jpg",
      ],
      trending: false,
      featured: false,
    },
    {
      title: "Bestsellers Book Bundle",
      description: "Pack of 5 bestselling fiction books",
      code: "PROD019",
      price: 75,
      status: true,
      stock: 50,
      category: "Leisure",
      thumbnails: [
        "https://example.com/images/book-bundle-1.jpg",
        "https://example.com/images/book-bundle-2.jpg",
      ],
      trending: false,
      featured: false,
    },
    {
      title: "Cricut Maker 3",
      description: "Cutting and engraving machine for crafts",
      code: "PROD020",
      price: 399,
      status: true,
      stock: 40,
      category: "Leisure",
      thumbnails: [
        "https://example.com/images/cricut-maker-1.jpg",
        "https://example.com/images/cricut-maker-2.jpg",
      ],
      trending: true,
      featured: true,
    },
  ];
  try {
    await daoProducts.create(products);
    Logger.debug("Products inserted successfully");
  } catch (err) {
    console.error("error inserting products", err);
    throw err;
  }
}
