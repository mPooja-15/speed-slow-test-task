import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop"
    ],
    rating: 4.8,
    reviews: 324,
    category: "Electronics",
    subcategory: "Audio",
    brand: "AudioTech",
    sku: "ATH-WH001",
    stock: 50,
    isOnSale: true,
    isFeatured: true,
    tags: ["wireless", "noise-cancelling", "bluetooth", "premium"],
    specifications: {
      "Connectivity": "Bluetooth 5.0",
      "Battery Life": "30 hours",
      "Weight": "250g",
      "Driver Size": "40mm"
    },
    weight: 0.25,
    dimensions: {
      length: 18,
      width: 16,
      height: 8
    },
    shippingInfo: {
      weight: 0.3,
      dimensions: {
        length: 20,
        width: 18,
        height: 10
      },
      freeShipping: true,
      shippingCost: 0
    }
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking watch with heart rate monitoring, GPS, and smartphone connectivity. Track your workouts and health metrics.",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=500&fit=crop"
    ],
    rating: 4.6,
    reviews: 156,
    category: "Electronics",
    subcategory: "Wearables",
    brand: "FitTech",
    sku: "FT-SW001",
    stock: 75,
    isOnSale: true,
    isFeatured: true,
    tags: ["fitness", "smartwatch", "health", "tracking"],
    specifications: {
      "Display": "1.4 inch AMOLED",
      "Battery Life": "7 days",
      "Water Resistance": "5ATM",
      "GPS": "Built-in"
    },
    weight: 0.045,
    dimensions: {
      length: 4.5,
      width: 3.8,
      height: 1.2
    },
    shippingInfo: {
      weight: 0.05,
      dimensions: {
        length: 6,
        width: 5,
        height: 2
      },
      freeShipping: true,
      shippingCost: 0
    }
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt. Perfect for everyday wear with a modern fit and soft feel.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=500&fit=crop"
    ],
    rating: 4.4,
    reviews: 89,
    category: "Fashion",
    subcategory: "T-Shirts",
    brand: "EcoWear",
    sku: "EW-TS001",
    stock: 200,
    isFeatured: false,
    tags: ["organic", "cotton", "sustainable", "comfortable"],
    specifications: {
      "Material": "100% Organic Cotton",
      "Fit": "Regular",
      "Care": "Machine wash cold",
      "Origin": "Made in USA"
    },
    weight: 0.18,
    dimensions: {
      length: 28,
      width: 20,
      height: 0.2
    },
    shippingInfo: {
      weight: 0.2,
      dimensions: {
        length: 30,
        width: 22,
        height: 1
      },
      freeShipping: false,
      shippingCost: 5.99
    }
  },
  {
    name: "Professional Camera Lens",
    description: "High-quality professional camera lens with excellent optical performance. Perfect for portrait and landscape photography.",
    price: 899.99,
    originalPrice: 1199.99,
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop"
    ],
    rating: 4.9,
    reviews: 234,
    category: "Electronics",
    subcategory: "Photography",
    brand: "PhotoPro",
    sku: "PP-CL001",
    stock: 25,
    isOnSale: true,
    isFeatured: true,
    tags: ["camera", "lens", "professional", "photography"],
    specifications: {
      "Focal Length": "50mm",
      "Aperture": "f/1.4",
      "Mount": "Canon EF",
      "Filter Size": "77mm"
    },
    weight: 0.815,
    dimensions: {
      length: 8.5,
      width: 8.5,
      height: 8.5
    },
    shippingInfo: {
      weight: 1.0,
      dimensions: {
        length: 12,
        width: 12,
        height: 12
      },
      freeShipping: true,
      shippingCost: 0
    }
  },
  {
    name: "Minimalist Desk Lamp",
    description: "Sleek and modern desk lamp with adjustable brightness and color temperature. Perfect for home office or study area.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop"
    ],
    rating: 4.3,
    reviews: 67,
    category: "Home",
    subcategory: "Lighting",
    brand: "LuxLight",
    sku: "LL-DL001",
    stock: 100,
    isFeatured: false,
    tags: ["desk", "lamp", "minimalist", "adjustable"],
    specifications: {
      "Power": "10W LED",
      "Brightness": "800 lumens",
      "Color Temperature": "2700K-6500K",
      "Material": "Aluminum"
    },
    weight: 1.2,
    dimensions: {
      length: 15,
      width: 8,
      height: 45
    },
    shippingInfo: {
      weight: 1.5,
      dimensions: {
        length: 18,
        width: 12,
        height: 50
      },
      freeShipping: false,
      shippingCost: 8.99
    }
  }
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@speedysell.com',
      password: 'admin123',
      phone: '+1234567890',
      role: 'admin',
      isEmailVerified: true
    });
    console.log('Admin user created');

    // Create regular user
    const regularUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '+1987654321',
      role: 'user',
      isEmailVerified: true
    });
    console.log('Regular user created');

    // Add createdBy field to products
    const productsWithUser = sampleProducts.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    // Create products
    const products = await Product.create(productsWithUser);
    console.log(`${products.length} products created`);

    console.log('Database seeded successfully!');
    console.log('\nSample users:');
    console.log('Admin - Email: admin@speedysell.com, Password: admin123');
    console.log('User - Email: john@example.com, Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 