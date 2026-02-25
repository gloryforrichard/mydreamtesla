import { boolean, integer, json, numeric, pgTable, serial, text, timestamp, varchar, index } from "drizzle-orm/pg-core";

// https://www.better-auth.com/docs/concepts/database#core-schema
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	normalizedEmail: text('normalized_email').unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	role: text('role'),
	banned: boolean('banned'),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires'),
	customerId: text('customer_id'),
}, (table) => ({
	userIdIdx: index("user_id_idx").on(table.id),
	userCustomerIdIdx: index("user_customer_id_idx").on(table.customerId),
	userRoleIdx: index("user_role_idx").on(table.role),
}));

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	impersonatedBy: text('impersonated_by')
}, (table) => ({
	sessionTokenIdx: index("session_token_idx").on(table.token),
	sessionUserIdIdx: index("session_user_id_idx").on(table.userId),
}));

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
}, (table) => ({
	accountUserIdIdx: index("account_user_id_idx").on(table.userId),
	accountAccountIdIdx: index("account_account_id_idx").on(table.accountId),
	accountProviderIdIdx: index("account_provider_id_idx").on(table.providerId),
}));

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

// https://www.better-auth.com/docs/plugins/api-key#schema
export const apikey = pgTable("apikey", {
  id: text("id").primaryKey(),
  name: text("name"),
  start: text("start"),
  prefix: text("prefix"),
  key: text("key").notNull(),
  userId: text("user_id") .notNull() .references(() => user.id, { onDelete: "cascade" }),
  refillInterval: integer("refill_interval"),
  refillAmount: integer("refill_amount"),
  lastRefillAt: timestamp("last_refill_at"),
  enabled: boolean("enabled").default(true),
  rateLimitEnabled: boolean("rate_limit_enabled").default(true),
  rateLimitTimeWindow: integer("rate_limit_time_window").default(86400000),
  rateLimitMax: integer("rate_limit_max").default(10),
  requestCount: integer("request_count").default(0),
  remaining: integer("remaining"),
  lastRequest: timestamp("last_request"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  permissions: text("permissions"),
  metadata: text("metadata"),
}, (table) => ({
  apikeyKeyIdx: index("apikey_key_idx").on(table.key),
  apikeyUserIdIdx: index("apikey_user_id_idx").on(table.userId),
}));

export const payment = pgTable("payment", {
	id: text("id").primaryKey(),
	priceId: text('price_id').notNull(),
	type: text('type').notNull(),
	scene: text('scene'), // payment scene: 'lifetime', 'credit', 'subscription'
	interval: text('interval'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	customerId: text('customer_id').notNull(),
	subscriptionId: text('subscription_id'),
	sessionId: text('session_id'),
	invoiceId: text('invoice_id').unique(), // unique constraint for avoiding duplicate processing
	status: text('status').notNull(),
	paid: boolean('paid').notNull().default(false), // indicates whether payment is completed (set in invoice.paid event)
	periodStart: timestamp('period_start'),
	periodEnd: timestamp('period_end'),
	cancelAtPeriodEnd: boolean('cancel_at_period_end'),
	trialStart: timestamp('trial_start'),
	trialEnd: timestamp('trial_end'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
	paymentTypeIdx: index("payment_type_idx").on(table.type),
	paymentSceneIdx: index("payment_scene_idx").on(table.scene),
	paymentPriceIdIdx: index("payment_price_id_idx").on(table.priceId),
	paymentUserIdIdx: index("payment_user_id_idx").on(table.userId),
	paymentCustomerIdIdx: index("payment_customer_id_idx").on(table.customerId),
	paymentStatusIdx: index("payment_status_idx").on(table.status),
	paymentPaidIdx: index("payment_paid_idx").on(table.paid),
	paymentSubscriptionIdIdx: index("payment_subscription_id_idx").on(table.subscriptionId),
	paymentSessionIdIdx: index("payment_session_id_idx").on(table.sessionId),
	paymentInvoiceIdIdx: index("payment_invoice_id_idx").on(table.invoiceId),
}));

export const userCredit = pgTable("user_credit", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
	currentCredits: integer("current_credits").notNull().default(0),
	lastRefreshAt: timestamp("last_refresh_at"), // deprecated
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
	userCreditUserIdIdx: index("user_credit_user_id_idx").on(table.userId),
}));

export const creditTransaction = pgTable("credit_transaction", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
	type: text("type").notNull(),
	description: text("description"),
	amount: integer("amount").notNull(),
	remainingAmount: integer("remaining_amount"),
	paymentId: text("payment_id"), // field name is paymentId, but actually it's invoiceId
	expirationDate: timestamp("expiration_date"),
	expirationDateProcessedAt: timestamp("expiration_date_processed_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
	creditTransactionUserIdIdx: index("credit_transaction_user_id_idx").on(table.userId),
	creditTransactionTypeIdx: index("credit_transaction_type_idx").on(table.type),
}));

// Tesla vehicle data tables

export const teslaModel = pgTable('tesla_model', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	tagline: varchar('tagline', { length: 255 }),
	description: text('description'),
	bodyType: varchar('body_type', { length: 50 }).notNull(),
	productionStart: integer('production_start'),
	productionEnd: integer('production_end'),
	isActive: boolean('is_active').default(true),
	sortOrder: integer('sort_order').default(0),
	seoTitle: varchar('seo_title', { length: 70 }),
	seoDescription: varchar('seo_description', { length: 160 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
	teslaModelSlugIdx: index("tesla_model_slug_idx").on(table.slug),
	teslaModelIsActiveIdx: index("tesla_model_is_active_idx").on(table.isActive),
}));

export const vehicle = pgTable('vehicle', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }).notNull().unique(),
	modelId: integer('model_id').references(() => teslaModel.id).notNull(),
	year: integer('year').notNull(),
	trimName: varchar('trim_name', { length: 100 }).notNull(),
	caTrimName: varchar('ca_trim_name', { length: 100 }),
	driveType: varchar('drive_type', { length: 50 }).notNull(),

	// Pricing
	basePriceMSRP: integer('base_price_msrp'),
	destinationFee: integer('destination_fee'),
	federalTaxCredit: integer('federal_tax_credit'),
	effectivePrice: integer('effective_price'),

	// Performance
	rangeEPA: integer('range_epa'),
	caRangeEPAkm: integer('ca_range_epa_km'),
	acceleration060: numeric('acceleration_060'),
	caAcceleration0100: numeric('ca_acceleration_0100'),
	topSpeed: integer('top_speed'),
	caTopSpeedKmh: integer('ca_top_speed_kmh'),
	horsepower: integer('horsepower'),
	caHorsepower: integer('ca_horsepower'),
	torque: integer('torque'),
	quarterMile: numeric('quarter_mile'),

	// Battery & Charging
	batteryCapacity: numeric('battery_capacity'),
	batteryType: varchar('battery_type', { length: 50 }),
	superchargerRateMax: integer('supercharger_rate_max'),
	caSuperchargerRateMax: integer('ca_supercharger_rate_max'),
	chargingTime1050: varchar('charging_time_10_50', { length: 50 }),
	onboardCharger: numeric('onboard_charger'),
	chargePort: varchar('charge_port', { length: 50 }),

	// Dimensions & Weight
	length: numeric('length'),
	width: numeric('width'),
	height: numeric('height'),
	wheelbase: numeric('wheelbase'),
	curbWeight: integer('curb_weight'),
	groundClearance: numeric('ground_clearance'),
	cargoVolume: numeric('cargo_volume'),
	frunkVolume: numeric('frunk_volume'),
	towingCapacity: integer('towing_capacity'),

	// Interior & Comfort
	seatingCapacity: integer('seating_capacity'),
	displaySize: varchar('display_size', { length: 50 }),
	hasRearDisplay: boolean('has_rear_display'),
	soundSystem: varchar('sound_system', { length: 100 }),
	wheelOptions: json('wheel_options').$type<string[]>(),
	colorOptions: json('color_options').$type<string[]>(),

	// Safety & Autopilot
	ncapRating: integer('ncap_rating'),
	autopilotStandard: varchar('autopilot_standard', { length: 100 }),
	fsdAvailable: boolean('fsd_available'),
	fsdPrice: integer('fsd_price'),

	// Efficiency
	energyConsumption: integer('energy_consumption'),
	mpge: integer('mpge'),

	// Content
	prosAndCons: json('pros_and_cons').$type<{ pros: string[]; cons: string[] }>(),
	keyChangesFromPriorYear: text('key_changes_from_prior_year'),

	// SEO
	seoTitle: varchar('seo_title', { length: 70 }),
	seoDescription: varchar('seo_description', { length: 160 }),

	// Meta
	isCurrentModel: boolean('is_current_model').default(true),
	caAvailable: boolean('ca_available').default(true),
	discontinuedDate: varchar('discontinued_date', { length: 20 }),
	lastUpdated: timestamp('last_updated').defaultNow(),
	createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
	vehicleSlugIdx: index("vehicle_slug_idx").on(table.slug),
	vehicleModelIdIdx: index("vehicle_model_id_idx").on(table.modelId),
	vehicleYearIdx: index("vehicle_year_idx").on(table.year),
	vehicleIsCurrentIdx: index("vehicle_is_current_idx").on(table.isCurrentModel),
}));
