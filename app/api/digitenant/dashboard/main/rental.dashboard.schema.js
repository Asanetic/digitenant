// Rental Management — Dashboard
//
// Backend file: save as dashboard.schema.js next to route.js and processor.js.
// Tenant filtering is handled by the dashboard backend using the login token.
//
// Values assumed (change here if your data uses others):
//   payment_status  = COMPLETED
//   lease_status    = ACTIVE
//   request_status  = anything not completed/closed/resolved/cancelled counts as open
//   payout_status   = pending
//   message_status  = failed
//
// Arrears are total_amount - paid_amount where due_date has passed, so they are right even if
// balance_amount and invoice_status were never filled in (e.g. imported data).
// Occupancy comes from active leases, not from properties_units.unit_status.
// Arrears and occupancy are "as at today" and ignore the date filter on purpose.
// Per-property charts read rent_invoices.property_id. Invoices created before that column
// existed show as 'Unassigned' until they are back-filled.
//
// APP is the app namespace used in links, e.g. /rental/rentinvoices/list.

const APP = 'rental';

export default {
  brand: 'Rental Management',
  tz: 'Africa/Nairobi',
  cacheMs: 15000,
  refreshMs: 60000,

  layout: [
    // ==================================================
    // 1. DATE FILTER
    // ==================================================
    { kind: 'filters', id: 'filters', date: true, fields: [] },

    // ==================================================
    // 2. KPI CARDS
    // ==================================================
    {
      kind: 'stats',
      id: 'kpis',
      items: [
        {
          id: 'collected',
          label: 'Collected',
          prefix: 'KES ',
          compare: true,
          className: 'od-grad-emerald',
          query: {
            table: 'rent_payments', agg: 'sum', col: 'amount', dateCol: 'payment_date',
            where: [{ col: 'payment_status', eq: 'completed', lower: true }],
          },
        },
        {
          id: 'billed',
          label: 'Billed',
          prefix: 'KES ',
          compare: true,
          className: 'od-grad-ocean',
          query: { table: 'rent_invoices', agg: 'sum', col: 'total_amount', dateCol: 'invoice_date' },
        },
        {
          id: 'collectionRate',
          label: 'Collection rate %',
          query: {
            sql: `SELECT ROUND(COALESCE(100 * SUM(i.paid_amount) / NULLIF(SUM(i.total_amount), 0), 0)) AS value
              FROM {db}.rent_invoices i
              WHERE (:site IS NULL OR i.hive_site_id = :site)
                AND (:from IS NULL OR i.invoice_date >= :from)
                AND (:to IS NULL OR i.invoice_date < DATE_ADD(:to, INTERVAL 1 DAY))`,
          },
        },
        {
          id: 'arrears',
          label: 'Arrears',
          prefix: 'KES ',
          className: 'od-grad-rose',
          query: {
            sql: `SELECT COALESCE(SUM(i.total_amount - i.paid_amount), 0) AS value
              FROM {db}.rent_invoices i
              WHERE (:site IS NULL OR i.hive_site_id = :site)
                AND i.due_date < CURDATE() AND i.total_amount > i.paid_amount`,
          },
        },
        {
          id: 'occupancy',
          label: 'Occupancy %',
          query: {
            sql: `SELECT ROUND(COALESCE(100 * COUNT(DISTINCT l.unit_id) / NULLIF(COUNT(DISTINCT u.unit_id), 0), 0)) AS value
              FROM {db}.properties_units u
              LEFT JOIN {db}.tenants_leases l
                ON l.unit_id = u.unit_id AND l.lease_status = 'active'
               AND (:site IS NULL OR l.hive_site_id = :site)
              WHERE (:site IS NULL OR u.hive_site_id = :site)`,
          },
        },
        {
          id: 'vacant',
          label: 'Vacant units',
          query: {
            sql: `SELECT COUNT(DISTINCT u.unit_id) - COUNT(DISTINCT l.unit_id) AS value
              FROM {db}.properties_units u
              LEFT JOIN {db}.tenants_leases l
                ON l.unit_id = u.unit_id AND l.lease_status = 'active'
               AND (:site IS NULL OR l.hive_site_id = :site)
              WHERE (:site IS NULL OR u.hive_site_id = :site)`,
          },
        },
      ],
    },

    // ==================================================
    // 3. NEEDS YOUR ATTENTION
    // ==================================================
    {
      kind: 'attention',
      id: 'attention',
      title: 'Needs your attention',
      items: [
        {
          id: 'overdueInvoices',
          text: '{n} invoices are overdue',
          tone: 'danger',
          href: `/${APP}/rentinvoices/list`,
          query: {
            sql: `SELECT COUNT(*) AS value
              FROM {db}.rent_invoices i
              WHERE (:site IS NULL OR i.hive_site_id = :site)
                AND i.due_date < CURDATE() AND i.total_amount > i.paid_amount`,
          },
        },
        {
          id: 'leasesExpiring',
          text: '{n} leases end within 60 days',
          tone: 'warn',
          href: `/${APP}/tenantsleases/list`,
          query: {
            sql: `SELECT COUNT(*) AS value
              FROM {db}.tenants_leases l
              WHERE (:site IS NULL OR l.hive_site_id = :site)
                AND l.lease_status = 'active'
                AND l.end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 60 DAY)`,
          },
        },
        {
          id: 'openMaintenance',
          text: '{n} maintenance requests are waiting',
          tone: 'warn',
          href: `/${APP}/maintenancerequests/list`,
          query: {
            sql: `SELECT COUNT(*) AS value
              FROM {db}.maintenance_requests m
              WHERE (:site IS NULL OR m.hive_site_id = :site)
                AND LOWER(COALESCE(NULLIF(m.request_status, ''), 'open')) NOT IN ('completed', 'closed', 'resolved', 'cancelled')`,
          },
        },
        {
          id: 'payoutsDue',
          text: '{n} landlord payouts are pending',
          tone: 'info',
          href: `/${APP}/propertiespayouts/list`,
          hrefFilter: { col: 'payout_status', value: 'pending' },
          query: { table: 'properties_payouts', where: [{ col: 'payout_status', eq: 'pending', lower: true }] },
        },
        {
          id: 'failedSms',
          text: '{n} SMS messages failed to send',
          tone: 'warn',
          href: `/${APP}/messageslog/list`,
          hrefFilter: { col: 'message_status', value: 'failed' },
          query: { table: 'messages_log', where: [{ col: 'message_status', eq: 'failed', lower: true }] },
        },
      ],
    },

    // ==================================================
    // 4. MONTHLY TRENDS
    // ==================================================
    {
      kind: 'chart',
      id: 'collectionsMonthly',
      type: 'trend',
      title: 'Collections by Month',
      prefix: 'KES ',
      span: 6,
      query: {
        table: 'rent_payments', agg: 'sum', col: 'amount',
        where: [{ col: 'payment_status', eq: 'completed', lower: true }],
        groupBy: { month: 'payment_date' },
      },
    },
    {
      kind: 'chart',
      id: 'billedMonthly',
      type: 'trend',
      title: 'Billed by Month',
      prefix: 'KES ',
      span: 6,
      query: { table: 'rent_invoices', agg: 'sum', col: 'total_amount', groupBy: { month: 'invoice_date' } },
    },

    // ==================================================
    // 5. BY PROPERTY AND BY METHOD
    // ==================================================
    {
      kind: 'chart',
      id: 'arrearsByProperty',
      type: 'hbar',
      title: 'Arrears by Property',
      prefix: 'KES ',
      span: 6,
      query: {
        sql: `SELECT COALESCE(p.property_name, 'Unassigned') AS label,
                SUM(i.total_amount - i.paid_amount) AS value
              FROM {db}.rent_invoices i
              LEFT JOIN {db}.properties_list p
                ON p.property_id = i.property_id
               AND (:site IS NULL OR p.hive_site_id = :site)
              WHERE (:site IS NULL OR i.hive_site_id = :site)
                AND i.due_date < CURDATE() AND i.total_amount > i.paid_amount
              GROUP BY COALESCE(p.property_name, 'Unassigned')
              ORDER BY value DESC`,
      },
    },
    {
      kind: 'chart',
      id: 'incomeByProperty',
      type: 'hbar',
      title: 'Income by Property',
      prefix: 'KES ',
      span: 6,
      query: {
        sql: `SELECT COALESCE(p.property_name, 'Unassigned') AS label,
                SUM(pay.amount) AS value
              FROM {db}.rent_payments pay
              LEFT JOIN {db}.rent_invoices i
                ON i.invoice_id = pay.invoice_id
               AND (:site IS NULL OR i.hive_site_id = :site)
              LEFT JOIN {db}.properties_list p
                ON p.property_id = i.property_id
               AND (:site IS NULL OR p.hive_site_id = :site)
              WHERE (:site IS NULL OR pay.hive_site_id = :site)
                AND pay.payment_status = 'completed'
                AND (:from IS NULL OR pay.payment_date >= :from)
                AND (:to IS NULL OR pay.payment_date < DATE_ADD(:to, INTERVAL 1 DAY))
              GROUP BY COALESCE(p.property_name, 'Unassigned')
              ORDER BY value DESC`,
      },
    },
    {
      kind: 'chart',
      id: 'paymentMethods',
      type: 'hbar',
      title: 'Payment Methods',
      prefix: 'KES ',
      span: 12,
      query: {
        table: 'rent_payments', agg: 'sum', col: 'amount', dateCol: 'payment_date',
        where: [{ col: 'payment_status', eq: 'completed', lower: true }],
        groupBy: 'payment_method',
      },
    },

    // ==================================================
    // 6. LISTS
    // Hidden until each ref is registered as a grid in the frontend folder.
    // ==================================================
    { kind: 'grid', id: 'overdueTenants', ref: 'overdueTenants', title: 'Overdue Tenants', hidden: true },
    { kind: 'grid', id: 'expiringLeases', ref: 'expiringLeases', title: 'Leases Ending Soon', hidden: true },
    { kind: 'grid', id: 'recentPayments', ref: 'recentPayments', title: 'Recent Payments', hidden: true },
  ],
};
