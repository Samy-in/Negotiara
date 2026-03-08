let prisma;
try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
    console.log('Using real Prisma client');
} catch (err) {
    console.error('Prisma Client not found. Falling back to Mock DB for prototype.');

    // Minimal Mock for Auth
    prisma = {
        user: {
            findUnique: async ({ where }) => {
                // Return a mock user if email matches a test one
                if (where.email === 'test@negotiara.com') {
                    return { id: 'test-id', name: 'Test User', email: 'test@negotiara.com', password: 'hashed_password', role: 'SHIPPER' };
                }
                return null;
            },
            create: async ({ data }) => {
                return { ...data, id: 'new-test-id' };
            }
        },
        $connect: async () => { throw new Error('Mock mode'); }
    };
}

module.exports = prisma;
