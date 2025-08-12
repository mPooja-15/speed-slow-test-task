import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Speedy Sell Flow API',
      version: '1.0.0',
      description: 'A comprehensive e-commerce API for Speedy Sell Flow application',
      contact: {
        name: 'Speedy Sell Team',
        email: 'support@speedysell.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.speedysell.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'User role'
            },
            isEmailVerified: {
              type: 'boolean',
              default: false,
              description: 'Email verification status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Product ID'
            },
            name: {
              type: 'string',
              description: 'Product name'
            },
            description: {
              type: 'string',
              description: 'Product description'
            },
            price: {
              type: 'number',
              description: 'Current price'
            },
            originalPrice: {
              type: 'number',
              description: 'Original price before discount'
            },
            image: {
              type: 'string',
              description: 'Product image URL'
            },
            category: {
              type: 'string',
              description: 'Product category'
            },
            brand: {
              type: 'string',
              description: 'Product brand'
            },
            stock: {
              type: 'number',
              description: 'Available stock quantity'
            },
            rating: {
              type: 'number',
              description: 'Average rating (1-5)'
            },
            reviews: {
              type: 'number',
              description: 'Number of reviews'
            },
            isOnSale: {
              type: 'boolean',
              description: 'Whether product is on sale'
            },
            isFeatured: {
              type: 'boolean',
              description: 'Whether product is featured'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Product tags'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Order ID'
            },
            orderNumber: {
              type: 'string',
              description: 'Unique order number'
            },
            user: {
              type: 'string',
              description: 'User ID who placed the order'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    type: 'string',
                    description: 'Product ID'
                  },
                  name: {
                    type: 'string',
                    description: 'Product name'
                  },
                  quantity: {
                    type: 'number',
                    description: 'Quantity ordered'
                  },
                  price: {
                    type: 'number',
                    description: 'Price per unit'
                  },
                  image: {
                    type: 'string',
                    description: 'Product image URL'
                  }
                }
              }
            },
            shippingAddress: {
              type: 'object',
              properties: {
                address: {
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                postalCode: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                }
              }
            },
            paymentMethod: {
              type: 'string',
              description: 'Payment method used'
            },
            paymentResult: {
              type: 'object',
              properties: {
                id: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                update_time: {
                  type: 'string'
                },
                email_address: {
                  type: 'string'
                }
              }
            },
            itemsPrice: {
              type: 'number',
              description: 'Total price of items'
            },
            taxPrice: {
              type: 'number',
              description: 'Tax amount'
            },
            shippingPrice: {
              type: 'number',
              description: 'Shipping cost'
            },
            totalPrice: {
              type: 'number',
              description: 'Total order amount'
            },
            isPaid: {
              type: 'boolean',
              description: 'Payment status'
            },
            paidAt: {
              type: 'string',
              format: 'date-time',
              description: 'Payment date'
            },
            isDelivered: {
              type: 'boolean',
              description: 'Delivery status'
            },
            deliveredAt: {
              type: 'string',
              format: 'date-time',
              description: 'Delivery date'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              default: 'pending',
              description: 'Order status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'object',
              description: 'Additional error details'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Products',
        description: 'Product management and catalog endpoints'
      },
      {
        name: 'Orders',
        description: 'Order processing and management endpoints'
      },
      {
        name: 'Admin',
        description: 'Admin-only endpoints for system management'
      }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js',
    './server.js'
  ]
};

const specs = swaggerJsdoc(options);

export default specs; 