import dotenv from 'dotenv'
import { eq } from 'drizzle-orm'
import { getDb } from '../src/db/index.js'
import { teslaModel, vehicle } from '../src/db/schema.js'

dotenv.config()

const TESLA_MODELS = [
	{
		name: 'Model 3',
		slug: 'model-3',
		tagline: 'The most affordable Tesla sedan',
		bodyType: 'Sedan',
		productionStart: 2017,
		isActive: true,
		sortOrder: 1,
	},
	{
		name: 'Model Y',
		slug: 'model-y',
		tagline: 'The versatile electric SUV',
		bodyType: 'SUV',
		productionStart: 2020,
		isActive: false,
		sortOrder: 2,
	},
	{
		name: 'Model S',
		slug: 'model-s',
		tagline: 'The flagship luxury sedan',
		bodyType: 'Sedan',
		productionStart: 2012,
		isActive: false,
		sortOrder: 3,
	},
	{
		name: 'Model X',
		slug: 'model-x',
		tagline: 'The luxury electric SUV',
		bodyType: 'SUV',
		productionStart: 2015,
		isActive: false,
		sortOrder: 4,
	},
	{
		name: 'Cybertruck',
		slug: 'cybertruck',
		tagline: 'The electric pickup truck',
		bodyType: 'Truck',
		productionStart: 2023,
		isActive: false,
		sortOrder: 5,
	},
	{
		name: 'Semi',
		slug: 'semi',
		tagline: 'The electric semi truck',
		bodyType: 'Semi',
		productionStart: 2022,
		isActive: false,
		sortOrder: 6,
	},
	{
		name: 'Roadster',
		slug: 'roadster',
		tagline: 'The next generation supercar',
		bodyType: 'Roadster',
		productionStart: 2008,
		productionEnd: 2012,
		isActive: false,
		sortOrder: 7,
	},
] as const

const VEHICLES = [
	{
		title: '2025 Tesla Model 3 Standard Range Plus RWD',
		slug: 'model-3-2025-standard-range-plus-rwd',
		modelSlug: 'model-3',
		year: 2025,
		trimName: 'Standard Range Plus',
		driveType: 'RWD',
		basePriceMSRP: 38990,
		destinationFee: 1640,
		federalTaxCredit: 7500,
		effectivePrice: 33130,
		rangeEPA: 272,
		acceleration060: '5.8',
		topSpeed: 125,
		horsepower: 271,
		seatingCapacity: 5,
		isCurrentModel: true,
	},
	{
		title: '2025 Tesla Model 3 Long Range AWD',
		slug: 'model-3-2025-long-range-awd',
		modelSlug: 'model-3',
		year: 2025,
		trimName: 'Long Range',
		driveType: 'AWD',
		basePriceMSRP: 42990,
		destinationFee: 1640,
		federalTaxCredit: 7500,
		effectivePrice: 37130,
		rangeEPA: 341,
		acceleration060: '4.4',
		topSpeed: 125,
		horsepower: 346,
		seatingCapacity: 5,
		isCurrentModel: true,
	},
	{
		title: '2025 Tesla Model 3 Performance AWD',
		slug: 'model-3-2025-performance-awd',
		modelSlug: 'model-3',
		year: 2025,
		trimName: 'Performance',
		driveType: 'AWD',
		basePriceMSRP: 54990,
		destinationFee: 1640,
		federalTaxCredit: 7500,
		effectivePrice: 49130,
		rangeEPA: 303,
		acceleration060: '2.9',
		topSpeed: 163,
		horsepower: 510,
		seatingCapacity: 5,
		isCurrentModel: true,
	},
	{
		title: '2024 Tesla Model 3 Standard Range Plus RWD',
		slug: 'model-3-2024-standard-range-plus-rwd',
		modelSlug: 'model-3',
		year: 2024,
		trimName: 'Standard Range Plus',
		driveType: 'RWD',
		basePriceMSRP: 38990,
		destinationFee: 1390,
		rangeEPA: 272,
		acceleration060: '5.8',
		topSpeed: 125,
		horsepower: 271,
		seatingCapacity: 5,
		isCurrentModel: false,
	},
	{
		title: '2024 Tesla Model 3 Long Range AWD',
		slug: 'model-3-2024-long-range-awd',
		modelSlug: 'model-3',
		year: 2024,
		trimName: 'Long Range',
		driveType: 'AWD',
		basePriceMSRP: 45990,
		destinationFee: 1390,
		rangeEPA: 341,
		acceleration060: '4.4',
		topSpeed: 125,
		horsepower: 346,
		seatingCapacity: 5,
		isCurrentModel: false,
	},
	{
		title: '2024 Tesla Model 3 Performance AWD',
		slug: 'model-3-2024-performance-awd',
		modelSlug: 'model-3',
		year: 2024,
		trimName: 'Performance',
		driveType: 'AWD',
		basePriceMSRP: 52990,
		destinationFee: 1390,
		rangeEPA: 303,
		acceleration060: '3.1',
		topSpeed: 163,
		horsepower: 510,
		seatingCapacity: 5,
		isCurrentModel: false,
	},
] as const

async function seedVehicles() {
	const db = await getDb()

	try {
		// Upsert tesla models
		let insertedModels = 0
		const modelIdMap = new Map<string, number>()

		for (const model of TESLA_MODELS) {
			const existing = await db
				.select({ id: teslaModel.id })
				.from(teslaModel)
				.where(eq(teslaModel.slug, model.slug))
				.limit(1)

			if (existing.length > 0) {
				await db
					.update(teslaModel)
					.set({
						name: model.name,
						tagline: model.tagline,
						bodyType: model.bodyType,
						productionStart: model.productionStart,
						productionEnd: 'productionEnd' in model ? model.productionEnd : undefined,
						isActive: model.isActive,
						sortOrder: model.sortOrder,
						updatedAt: new Date(),
					})
					.where(eq(teslaModel.slug, model.slug))
				modelIdMap.set(model.slug, existing[0].id)
			} else {
				const result = await db
					.insert(teslaModel)
					.values({
						name: model.name,
						slug: model.slug,
						tagline: model.tagline,
						bodyType: model.bodyType,
						productionStart: model.productionStart,
						productionEnd: 'productionEnd' in model ? model.productionEnd : undefined,
						isActive: model.isActive,
						sortOrder: model.sortOrder,
					})
					.returning({ id: teslaModel.id })
				modelIdMap.set(model.slug, result[0].id)
				insertedModels++
			}
		}

		console.log(`Tesla models: ${insertedModels} inserted, ${TESLA_MODELS.length - insertedModels} updated`)

		// Upsert vehicles
		let insertedVehicles = 0

		for (const v of VEHICLES) {
			const modelId = modelIdMap.get(v.modelSlug)
			if (!modelId) {
				console.error(`Model not found for slug: ${v.modelSlug}`)
				continue
			}

			const existing = await db
				.select({ id: vehicle.id })
				.from(vehicle)
				.where(eq(vehicle.slug, v.slug))
				.limit(1)

			const vehicleData = {
				title: v.title,
				modelId,
				year: v.year,
				trimName: v.trimName,
				driveType: v.driveType,
				basePriceMSRP: v.basePriceMSRP,
				destinationFee: v.destinationFee,
				federalTaxCredit: 'federalTaxCredit' in v ? v.federalTaxCredit : undefined,
				effectivePrice: 'effectivePrice' in v ? v.effectivePrice : undefined,
				rangeEPA: v.rangeEPA,
				acceleration060: v.acceleration060,
				topSpeed: v.topSpeed,
				horsepower: v.horsepower,
				seatingCapacity: v.seatingCapacity,
				isCurrentModel: v.isCurrentModel,
			}

			if (existing.length > 0) {
				await db
					.update(vehicle)
					.set({ ...vehicleData, lastUpdated: new Date() })
					.where(eq(vehicle.slug, v.slug))
			} else {
				await db
					.insert(vehicle)
					.values({ ...vehicleData, slug: v.slug })
				insertedVehicles++
			}
		}

		console.log(`Vehicles: ${insertedVehicles} inserted, ${VEHICLES.length - insertedVehicles} updated`)
		console.log('Seed completed successfully')
	} catch (error) {
		console.error('Seed failed:', error)
		throw error
	}

	process.exit(0)
}

seedVehicles()
