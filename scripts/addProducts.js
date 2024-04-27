import mongoose from "mongoose";
import { getDaoProducts } from "../src/daos/products/products.dao.js";
import Logger from "../src/utils/logger.js";

const daoProducts = getDaoProducts();
mongoose
  .connect(
    "mongodb+srv://lucianomostaccio:nose123@lucianobackendcourse.i2t7sxi.mongodb.net/?retryWrites=true&w=majority&appName=LucianoBackendCourse"
  )
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
      title: "Product 01",
      description: "Description of product 1",
      code: "PROD001",
      price: 10000,
      stock: 50,
      category: "category 1",
      thumbnails: ["images/imagen1deprod1.jpg"],
    },
    {
      title: "Product 02",
      description: "Description of product 2",
      code: "PROD002",
      price: 5000,
      stock: 70,
      category: "category 2",
      thumbnails: [
        "images/imagen1deprod2.jpg",
        "images/otraimagen2.jpg",
        "images/otraimagenmas2.jpg",
      ],
    },
    {
      title: "Product 03",
      description: "Description of product 3",
      code: "PROD003",
      price: 35000,
      stock: 80,
      category: "category 1",
      thumbnails: [
        "images/imagen1deprod3.jpg",
        "images/otraimagen3.jpg",
        "images/otraimagenmas3.jpg",
      ],
    },
    {
      title: "Product 04",
      description: "Description of product 4",
      code: "PROD004",
      price: 12000,
      stock: 50,
      category: "category 3",
      thumbnails: ["images/imagen1deprod4.jpg", "images/otraimagen4.jpg"],
    },
    {
      title: "Product 05",
      description: "Description of product 5",
      code: "PROD005",
      price: 35000,
      stock: 70,
      category: "category 1",
      thumbnails: ["images/imagen1deprod5.jpg"],
    },
    {
      title: "Product 06",
      description: "Description of product 6",
      code: "PROD006",
      price: 9000,
      stock: 30,
      category: "category 3",
      thumbnails: [
        "images/imagen1deprod6.jpg",
        "images/otraimagen6.jpg",
        "images/otraimagenmas6.jpg",
      ],
    },
    {
      title: "Product 07",
      description: "Description of product 7",
      code: "PROD007",
      price: 15000,
      stock: 50,
      category: "category 2",
      thumbnails: ["images/imagen1deprod7.jpg", "images/otraimagen7.jpg"],
    },
    {
      title: "Product 08",
      description: "Description of product 8",
      code: "PROD008",
      price: 35000,
      stock: 60,
      category: "category 3",
      thumbnails: ["images/imagen1deprod8.jpg"],
    },
    {
      title: "Product 09",
      description: "Description of product 9",
      code: "PROD009",
      price: 15000,
      stock: 30,
      category: "category 2",
      thumbnails: [
        "images/imagen1deprod9.jpg",
        "images/otraimagen9.jpg",
        "images/otraimagenmas9.jpg",
      ],
    },
    {
      title: "Product 10",
      description: "Description of product 10",
      code: "PROD010",
      price: 20000,
      stock: 40,
      category: "category 3",
      thumbnails: ["images/imagen1deprod10.jpg", "images/otraimagen10.jpg"],
    },
  ];
  try {
    await daoProducts.create(products);
    Logger.debug("Productos insertados correctamente");
  } catch (err) {
    console.error("Error al insertar productos", err);
    throw err;
  }
}
