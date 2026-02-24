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

/** All model slugs — for sitemap */
export async function getAllModelSlugs() {
	const db = await getDb()
	return db
		.select({ slug: teslaModel.slug, updatedAt: teslaModel.updatedAt })
		.from(teslaModel)
		.where(eq(teslaModel.isActive, true))
}

/** All vehicle slugs — for sitemap */
export async function getAllVehicleSlugs() {
	const db = await getDb()
	return db
		.select({ slug: vehicle.slug, lastUpdated: vehicle.lastUpdated })
		.from(vehicle)
}

/** Get vehicles by a list of slugs — for comparison pages */
export async function getVehiclesBySlugList(slugs: string[]) {
	const db = await getDb()
	const results = await Promise.all(
		slugs.map((s) =>
			db.select().from(vehicle).where(eq(vehicle.slug, s)).limit(1)
		),
	)
	return results.map((r) => r[0]).filter(Boolean)
}

/** Get one representative vehicle per model (cheapest current trim) for homepage tiles */
export async function getRepresentativeVehicles() {
	const db = await getDb()
	const models = await db
		.select()
		.from(teslaModel)
		.where(eq(teslaModel.isActive, true))
		.orderBy(asc(teslaModel.sortOrder))

	const result: Array<{
		model: typeof models[number]
		vehicle: Awaited<ReturnType<typeof getVehiclesForModel>>[number] | null
		vehicleCount: number
	}> = []

	for (const model of models) {
		const vehicles = await db
			.select()
			.from(vehicle)
			.where(
				and(
					eq(vehicle.modelId, model.id),
					eq(vehicle.isCurrentModel, true),
				),
			)
			.orderBy(asc(vehicle.basePriceMSRP))

		result.push({
			model,
			vehicle: vehicles[0] ?? null,
			vehicleCount: vehicles.length,
		})
	}

	return result
}

/** All vehicles with model info — for comparison builder dropdown */
export async function getAllVehicles() {
	const db = await getDb()
	const allModels = await db
		.select()
		.from(teslaModel)
		.where(eq(teslaModel.isActive, true))
		.orderBy(asc(teslaModel.sortOrder))

	const allVehicles = await db
		.select()
		.from(vehicle)
		.orderBy(asc(vehicle.modelId), desc(vehicle.year), asc(vehicle.trimName))

	return { models: allModels, vehicles: allVehicles }
}

/** Get total counts for stats section */
export async function getSiteCounts() {
	const db = await getDb()
	const models = await db.select().from(teslaModel).where(eq(teslaModel.isActive, true))
	const vehicles = await db.select().from(vehicle)
	const years = new Set(vehicles.map((v) => v.year))
	return {
		modelCount: models.length,
		vehicleCount: vehicles.length,
		yearCount: years.size,
	}
}
