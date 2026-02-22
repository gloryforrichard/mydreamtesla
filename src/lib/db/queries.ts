import { and, eq, asc, desc } from 'drizzle-orm'
import { getDb } from '@/db/index'
import { teslaModel, vehicle } from '@/db/schema'

export async function getAllModels() {
	const db = await getDb()
	return db
		.select()
		.from(teslaModel)
		.where(eq(teslaModel.isActive, true))
		.orderBy(asc(teslaModel.sortOrder))
}

export async function getModelBySlug(slug: string) {
	const db = await getDb()
	const results = await db
		.select()
		.from(teslaModel)
		.where(eq(teslaModel.slug, slug))
		.limit(1)
	return results[0] ?? null
}

export async function getVehicleBySlug(slug: string) {
	const db = await getDb()
	const results = await db
		.select()
		.from(vehicle)
		.where(eq(vehicle.slug, slug))
		.limit(1)
	return results[0] ?? null
}

export async function getVehiclesForModel(modelId: number) {
	const db = await getDb()
	return db
		.select()
		.from(vehicle)
		.where(eq(vehicle.modelId, modelId))
		.orderBy(desc(vehicle.year), asc(vehicle.trimName))
}

export async function getCurrentVehiclesForModel(modelId: number) {
	const db = await getDb()
	return db
		.select()
		.from(vehicle)
		.where(
			and(
				eq(vehicle.modelId, modelId),
				eq(vehicle.isCurrentModel, true),
			),
		)
		.orderBy(asc(vehicle.trimName))
}
