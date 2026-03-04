import postgres from 'postgres';
import * as XLSX from 'xlsx';

const DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5433/mksaas';

async function main() {
  const sql = postgres(DATABASE_URL, { prepare: false });

  // Get all vehicles with model name
  const rows = await sql`
    SELECT
      m.name AS model_name,
      m.slug AS model_slug,
      m.body_type,
      v.id,
      v.title,
      v.slug,
      v.year,
      v.trim_name,
      v.ca_trim_name,
      v.drive_type,
      v.base_price_msrp,
      v.destination_fee,
      v.federal_tax_credit,
      v.effective_price,
      v.range_epa,
      v.ca_range_epa_km,
      v.acceleration_060,
      v.ca_acceleration_0100,
      v.top_speed,
      v.ca_top_speed_kmh,
      v.horsepower,
      v.ca_horsepower,
      v.torque,
      v.quarter_mile,
      v.battery_capacity,
      v.battery_type,
      v.supercharger_rate_max,
      v.ca_supercharger_rate_max,
      v.charging_time_10_50,
      v.onboard_charger,
      v.charge_port,
      v.length,
      v.width,
      v.height,
      v.wheelbase,
      v.curb_weight,
      v.ground_clearance,
      v.cargo_volume,
      v.frunk_volume,
      v.towing_capacity,
      v.seating_capacity,
      v.display_size,
      v.has_rear_display,
      v.sound_system,
      v.wheel_options,
      v.color_options,
      v.ncap_rating,
      v.autopilot_standard,
      v.fsd_available,
      v.fsd_price,
      v.energy_consumption,
      v.mpge,
      v.pros_and_cons,
      v.key_changes_from_prior_year,
      v.is_current_model,
      v.ca_available,
      v.discontinued_date,
      v.last_updated
    FROM vehicle v
    JOIN tesla_model m ON v.model_id = m.id
    ORDER BY m.sort_order, m.name, v.year DESC, v.trim_name
  `;

  // Transform for spreadsheet
  const data = rows.map((r: Record<string, unknown>) => {
    const prosAndCons = r.pros_and_cons as {
      pros: string[];
      cons: string[];
    } | null;
    return {
      Model: r.model_name,
      'Body Type': r.body_type,
      Year: r.year,
      'Trim (US)': r.trim_name,
      'Trim (CA)': r.ca_trim_name ?? '',
      'Drive Type': r.drive_type,
      Title: r.title,
      Slug: r.slug,
      // Pricing
      'Base MSRP ($)': r.base_price_msrp ?? '',
      'Destination Fee ($)': r.destination_fee ?? '',
      'Federal Tax Credit ($)': r.federal_tax_credit ?? '',
      'Effective Price ($)': r.effective_price ?? '',
      // Performance (US)
      'Range EPA (mi)': r.range_epa ?? '',
      '0-60 mph (s)': r.acceleration_060 ?? '',
      'Top Speed (mph)': r.top_speed ?? '',
      'Horsepower (hp)': r.horsepower ?? '',
      'Torque (lb-ft)': r.torque ?? '',
      'Quarter Mile (s)': r.quarter_mile ?? '',
      // Performance (CA)
      'CA Range (km)': r.ca_range_epa_km ?? '',
      'CA 0-100 (s)': r.ca_acceleration_0100 ?? '',
      'CA Top Speed (km/h)': r.ca_top_speed_kmh ?? '',
      'CA Horsepower': r.ca_horsepower ?? '',
      'CA Supercharger Max (kW)': r.ca_supercharger_rate_max ?? '',
      'CA Available':
        r.ca_available != null ? (r.ca_available ? 'Yes' : 'No') : '',
      // Battery & Charging
      'Battery (kWh)': r.battery_capacity ?? '',
      'Battery Type': r.battery_type ?? '',
      'Supercharger Max (kW)': r.supercharger_rate_max ?? '',
      'Charge 10→50%': r.charging_time_10_50 ?? '',
      'Onboard Charger (kW)': r.onboard_charger ?? '',
      'Charge Port': r.charge_port ?? '',
      // Dimensions
      'Length (in)': r.length ?? '',
      'Width (in)': r.width ?? '',
      'Height (in)': r.height ?? '',
      'Wheelbase (in)': r.wheelbase ?? '',
      'Curb Weight (lbs)': r.curb_weight ?? '',
      'Ground Clearance (in)': r.ground_clearance ?? '',
      'Cargo Volume (cu ft)': r.cargo_volume ?? '',
      'Frunk Volume (cu ft)': r.frunk_volume ?? '',
      'Towing Capacity (lbs)': r.towing_capacity ?? '',
      // Interior
      Seating: r.seating_capacity ?? '',
      'Display Size': r.display_size ?? '',
      'Rear Display':
        r.has_rear_display != null ? (r.has_rear_display ? 'Yes' : 'No') : '',
      'Sound System': r.sound_system ?? '',
      'Wheel Options': Array.isArray(r.wheel_options)
        ? (r.wheel_options as string[]).join(', ')
        : '',
      'Color Options': Array.isArray(r.color_options)
        ? (r.color_options as string[]).join(', ')
        : '',
      // Safety
      'NCAP Rating': r.ncap_rating ?? '',
      Autopilot: r.autopilot_standard ?? '',
      'FSD Available':
        r.fsd_available != null ? (r.fsd_available ? 'Yes' : 'No') : '',
      'FSD Price ($)': r.fsd_price ?? '',
      // Efficiency
      'Energy (Wh/mi)': r.energy_consumption ?? '',
      MPGe: r.mpge ?? '',
      // Content
      Pros: prosAndCons?.pros?.join('; ') ?? '',
      Cons: prosAndCons?.cons?.join('; ') ?? '',
      'Key Changes': r.key_changes_from_prior_year ?? '',
      // Meta
      'Current Model': r.is_current_model ? 'Yes' : 'No',
      Discontinued: r.discontinued_date ?? '',
    };
  });

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // Auto-width columns
  const colWidths = Object.keys(data[0] || {}).map((key) => {
    const maxLen = Math.max(
      key.length,
      ...data.map(
        (row: Record<string, unknown>) => String(row[key] ?? '').length
      )
    );
    return { wch: Math.min(maxLen + 2, 50) };
  });
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'All Trims');

  const outPath = './docs/data/tesla-all-trims.xlsx';
  XLSX.writeFile(wb, outPath);

  console.log(`Exported ${data.length} vehicles to ${outPath}`);
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
