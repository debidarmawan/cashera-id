# MySQL Database Setup for Cashera POS

This guide will help you set up MySQL database connection for the Cashera POS system.

## Prerequisites

- MySQL server running (local or remote)
- Node.js and npm installed
- Project dependencies installed (`npm install`)

## Database Setup

### 1. Create MySQL Database

Connect to your MySQL server and create a new database:

```sql
CREATE DATABASE cashera_pos;
```

### 2. Update Environment Variables

Edit the `.env` file in your project root and update the `DATABASE_URL`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/cashera_pos"
```

Replace:
- `username` with your MySQL username
- `password` with your MySQL password
- `localhost:3306` with your MySQL server host and port
- `cashera_pos` with your database name

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Push Database Schema

This will create all the tables in your MySQL database:

```bash
npm run db:push
```

### 5. Seed Database (Optional)

Populate the database with sample data:

```bash
npm run db:seed
```

## Available Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## Database Schema

The POS system includes the following tables:

- **products** - Product catalog
- **customers** - Customer information
- **sales** - Sales transactions
- **sale_items** - Individual items in each sale
- **pos_settings** - POS system configuration

## API Endpoints

The following API endpoints are available:

- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/dashboard` - Get dashboard statistics

## Troubleshooting

### Connection Issues

1. Verify MySQL server is running
2. Check username/password in DATABASE_URL
3. Ensure database exists
4. Check firewall settings if using remote MySQL

### Schema Issues

1. Run `npm run db:generate` to regenerate Prisma client
2. Run `npm run db:push` to sync schema with database
3. Check Prisma logs for detailed error messages

### Development

- Use `npm run db:studio` to view and edit data in a web interface
- Check the `src/lib/database.ts` file for available database operations
- All database operations are handled through the service layer

## Production Considerations

- Use connection pooling for production
- Set up proper database backups
- Use environment-specific database URLs
- Consider using Prisma Accelerate for better performance
