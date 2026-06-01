import { db } from './index';
import { representatives, customerTypes, representativeAccounts } from './schema';
import { eq, like, and, desc } from 'drizzle-orm';

// Representatives queries
export async function getAllRepresentatives() {
  return db
    .select()
    .from(representatives)
    .where(eq(representatives.isArchived, false))
    .orderBy(desc(representatives.createdAt));
}

export async function searchRepresentatives(query: string) {
  return db
    .select()
    .from(representatives)
    .where(
      and(
        eq(representatives.isArchived, false),
        like(representatives.name, `%${query}%`)
      )
    )
    .orderBy(desc(representatives.createdAt));
}

export async function getRepresentativeById(id: string) {
  const rep = await db
    .select()
    .from(representatives)
    .where(eq(representatives.id, id))
    .limit(1);
  return rep[0];
}

export async function createRepresentative(data: {
  name: string;
  mobile?: string;
  email?: string;
  designation?: string;
}) {
  return db
    .insert(representatives)
    .values(data)
    .returning();
}

export async function updateRepresentative(
  id: string,
  data: Partial<typeof representatives.$inferInsert>
) {
  return db
    .update(representatives)
    .set(data)
    .where(eq(representatives.id, id))
    .returning();
}

export async function archiveRepresentative(id: string) {
  return db
    .update(representatives)
    .set({ isArchived: true })
    .where(eq(representatives.id, id))
    .returning();
}

// Customer Types queries
export async function getAllCustomerTypes() {
  return db
    .select()
    .from(customerTypes)
    .where(eq(customerTypes.isArchived, false))
    .orderBy(customerTypes.sortOrder);
}

export async function getCustomerTypeById(id: string) {
  const type = await db
    .select()
    .from(customerTypes)
    .where(eq(customerTypes.id, id))
    .limit(1);
  return type[0];
}

export async function createCustomerType(data: {
  name: string;
  description?: string;
  sortOrder?: number;
}) {
  return db
    .insert(customerTypes)
    .values(data)
    .returning();
}

export async function updateCustomerType(
  id: string,
  data: Partial<typeof customerTypes.$inferInsert>
) {
  return db
    .update(customerTypes)
    .set(data)
    .where(eq(customerTypes.id, id))
    .returning();
}

export async function archiveCustomerType(id: string) {
  return db
    .update(customerTypes)
    .set({ isArchived: true })
    .where(eq(customerTypes.id, id))
    .returning();
}

// Representative Accounts queries
export async function getAccountsByRepresentative(representativeId: string) {
  return db
    .select()
    .from(representativeAccounts)
    .where(
      and(
        eq(representativeAccounts.representativeId, representativeId),
        eq(representativeAccounts.isArchived, false)
      )
    )
    .orderBy(desc(representativeAccounts.createdAt));
}

export async function createAccount(data: typeof representativeAccounts.$inferInsert) {
  return db
    .insert(representativeAccounts)
    .values(data)
    .returning();
}

export async function updateAccount(
  id: string,
  data: Partial<typeof representativeAccounts.$inferInsert>
) {
  return db
    .update(representativeAccounts)
    .set(data)
    .where(eq(representativeAccounts.id, id))
    .returning();
}

export async function archiveAccount(id: string) {
  return db
    .update(representativeAccounts)
    .set({ isArchived: true })
    .where(eq(representativeAccounts.id, id))
    .returning();
}

// Dashboard stats
export async function getDashboardStats() {
  const totalReps = await db
    .select()
    .from(representatives)
    .where(eq(representatives.isArchived, false));

  const totalTypes = await db
    .select()
    .from(customerTypes)
    .where(eq(customerTypes.isArchived, false));

  const totalAccounts = await db
    .select()
    .from(representativeAccounts)
    .where(eq(representativeAccounts.isArchived, false));

  return {
    representativesCount: totalReps.length,
    customerTypesCount: totalTypes.length,
    accountsCount: totalAccounts.length,
  };
}
