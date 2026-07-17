import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Sedia Ergonomica Pro",
      description: "Sedia ergonomica con supporto lombare regolabile.",
      price: "199.90",
      stock: 25,
      images: [
        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      ],
      category: "Arredo Ufficio",
    },
    {
      name: "Scrivania Rovere 140cm",
      description: "Scrivania in rovere naturale con passacavi integrato.",
      price: "349.00",
      stock: 12,
      images: ["https://images.unsplash.com/photo-1519710164239-da123dc03ef4"],
      category: "Scrivanie",
    },
    {
      name: "Lampada LED Minimal",
      description: "Lampada da tavolo LED dimmerabile a basso consumo.",
      price: "59.50",
      stock: 40,
      images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c"],
      category: "Illuminazione",
    },
    {
      name: "Libreria Modulare 5 Ripiani",
      description: "Libreria modulare in metallo e legno, stile industriale.",
      price: "229.99",
      stock: 8,
      images: ["https://images.unsplash.com/photo-1594026112284-02bb6f3352fe"],
      category: "Arredo Casa",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        category: product.category,
      },
      create: product,
    });
  }

  console.log(`Seed completato: ${products.length} prodotti inseriti/aggiornati.`);
}

main()
  .catch((error) => {
    console.error("Errore durante il seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
