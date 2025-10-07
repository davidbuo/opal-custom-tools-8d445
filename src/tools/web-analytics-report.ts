import { tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";

interface WebAnalyticsReportParameters {
  company_name?: string;
}

interface ReportData {
  sessions: number;
  prevSessions: number;
  users: number;
  prevUsers: number;
  engagementRate: number;
  prevEngagementRate: number;
  keyEvents: number;
  prevKeyEvents: number;
  sessionKeyEventRate: number;
  prevSessionKeyEventRate: number;
  pages: Array<{
    path: string;
    sessions: number;
    prevSessions: number;
    keyEventRate: number;
    prevKeyEventRate: number;
  }>;
  channels: Array<{
    name: string;
    sessions: number;
    prevSessions: number;
    keyEventRate: number;
    prevKeyEventRate: number;
  }>;
}

function generateRealisticData(): ReportData {
  // Base metrics with realistic software company numbers
  const sessions = 45678;
  const prevSessions = 42134;
  const users = 34521;
  const prevUsers = 31897;
  const engagementRate = 68.5;
  const prevEngagementRate = 65.2;
  const keyEvents = 3421;
  const prevKeyEvents = 2987;
  const sessionKeyEventRate = 7.5;
  const prevSessionKeyEventRate = 7.1;

  // Top 20 pages data
  const pages = [
    { path: "/pricing", sessions: 8234, prevSessions: 7456, keyEventRate: 12.3, prevKeyEventRate: 11.8 },
    { path: "/product/features", sessions: 6892, prevSessions: 6321, keyEventRate: 9.2, prevKeyEventRate: 8.7 },
    { path: "/", sessions: 6543, prevSessions: 6109, keyEventRate: 5.1, prevKeyEventRate: 4.9 },
    { path: "/demo", sessions: 5234, prevSessions: 4876, keyEventRate: 15.6, prevKeyEventRate: 14.2 },
    { path: "/solutions/enterprise", sessions: 3876, prevSessions: 3421, keyEventRate: 11.4, prevKeyEventRate: 10.9 },
    { path: "/blog/product-updates", sessions: 2987, prevSessions: 3201, keyEventRate: 6.8, prevKeyEventRate: 7.2 },
    { path: "/resources/documentation", sessions: 2654, prevSessions: 2398, keyEventRate: 8.3, prevKeyEventRate: 7.9 },
    { path: "/contact-sales", sessions: 2341, prevSessions: 2087, keyEventRate: 18.9, prevKeyEventRate: 17.4 },
    { path: "/about", sessions: 1987, prevSessions: 1876, keyEventRate: 3.2, prevKeyEventRate: 3.4 },
    { path: "/integrations", sessions: 1765, prevSessions: 1543, keyEventRate: 9.7, prevKeyEventRate: 9.1 },
    { path: "/case-studies", sessions: 1543, prevSessions: 1321, keyEventRate: 10.5, prevKeyEventRate: 9.8 },
    { path: "/product/security", sessions: 1432, prevSessions: 1287, keyEventRate: 7.6, prevKeyEventRate: 7.3 },
    { path: "/free-trial", sessions: 1298, prevSessions: 1109, keyEventRate: 22.4, prevKeyEventRate: 21.1 },
    { path: "/blog/best-practices", sessions: 1187, prevSessions: 1254, keyEventRate: 5.9, prevKeyEventRate: 6.3 },
    { path: "/resources/webinars", sessions: 1065, prevSessions: 943, keyEventRate: 13.2, prevKeyEventRate: 12.5 },
    { path: "/careers", sessions: 987, prevSessions: 1021, keyEventRate: 4.1, prevKeyEventRate: 4.3 },
    { path: "/partners", sessions: 876, prevSessions: 798, keyEventRate: 8.8, prevKeyEventRate: 8.2 },
    { path: "/product/api", sessions: 765, prevSessions: 687, keyEventRate: 11.3, prevKeyEventRate: 10.7 },
    { path: "/customers", sessions: 698, prevSessions: 643, keyEventRate: 6.4, prevKeyEventRate: 6.1 },
    { path: "/resources/ebooks", sessions: 621, prevSessions: 589, keyEventRate: 16.7, prevKeyEventRate: 15.9 },
  ];

  // Channel data
  const channels = [
    { name: "Organic Search", sessions: 18234, prevSessions: 16543, keyEventRate: 8.9, prevKeyEventRate: 8.3 },
    { name: "Direct", sessions: 12876, prevSessions: 12109, keyEventRate: 6.2, prevKeyEventRate: 6.0 },
    { name: "Paid Search", sessions: 6543, prevSessions: 5987, keyEventRate: 11.4, prevKeyEventRate: 10.8 },
    { name: "Organic Social", sessions: 3987, prevSessions: 4201, keyEventRate: 4.3, prevKeyEventRate: 4.7 },
    { name: "Referral", sessions: 2234, prevSessions: 1987, keyEventRate: 9.6, prevKeyEventRate: 8.9 },
    { name: "Email", sessions: 1543, prevSessions: 1421, keyEventRate: 13.7, prevKeyEventRate: 13.2 },
    { name: "Paid Social", sessions: 987, prevSessions: 876, keyEventRate: 7.8, prevKeyEventRate: 7.4 },
    { name: "Display", sessions: 654, prevSessions: 598, keyEventRate: 5.1, prevKeyEventRate: 4.8 },
    { name: "Affiliate", sessions: 421, prevSessions: 387, keyEventRate: 10.2, prevKeyEventRate: 9.7 },
  ];

  return {
    sessions,
    prevSessions,
    users,
    prevUsers,
    engagementRate,
    prevEngagementRate,
    keyEvents,
    prevKeyEvents,
    sessionKeyEventRate,
    prevSessionKeyEventRate,
    pages,
    channels,
  };
}

function formatNumber(num: number): string {
  return num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function formatPercentage(num: number): string {
  if (num >= 10) {
    return `${Math.round(num)}%`;
  }
  return `${num.toFixed(1)}%`;
}

function calculateChange(current: number, previous: number, isPercentage: boolean = false): string {
  const diff = current - previous;
  const percentChange = ((current - previous) / previous) * 100;
  const arrow = diff >= 0 ? "▲" : "🔻";

  if (isPercentage) {
    const ptsDiff = current - previous;
    return `${arrow} ${formatPercentage(Math.abs(percentChange))} (${ptsDiff >= 0 ? "+" : ""}${ptsDiff.toFixed(1)} pts)`;
  }

  return `${arrow} ${formatPercentage(Math.abs(percentChange))}`;
}

function getCurrentMonth(): string {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return lastMonth.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function getPreviousMonth(): string {
  const now = new Date();
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  return twoMonthsAgo.toLocaleString("en-US", { month: "long", year: "numeric" });
}

async function webAnalyticsReport(parameters: WebAnalyticsReportParameters) {
  const companyName = parameters.company_name || "Software Company";
  const data = generateRealisticData();
  const currentMonth = getCurrentMonth();
  const previousMonth = getPreviousMonth();

  // Generate insights based on data
  const trafficGrowth = ((data.sessions - data.prevSessions) / data.prevSessions) * 100;
  const userGrowth = ((data.users - data.prevUsers) / data.prevUsers) * 100;
  const keyEventGrowth = ((data.keyEvents - data.prevKeyEvents) / data.prevKeyEvents) * 100;

  const report = `# Executive Summary – ${currentMonth} Web Performance (Google Analytics)

## Takeaways

**Traffic momentum:**
Sessions increased ${formatPercentage(trafficGrowth)} month-over-month, driven primarily by organic search growth and improved paid search performance. The upward trend indicates strong brand visibility and effective content distribution.

**User behavior:**
Engagement rate improved to ${formatPercentage(data.engagementRate)} (up ${formatPercentage(((data.engagementRate - data.prevEngagementRate) / data.prevEngagementRate) * 100)}), suggesting content relevance and user experience enhancements are resonating. High-intent pages like /demo and /free-trial show particularly strong engagement.

**Conversion trends:**
Key events grew ${formatPercentage(keyEventGrowth)} with a session key event rate of ${formatPercentage(data.sessionKeyEventRate)}, up ${(data.sessionKeyEventRate - data.prevSessionKeyEventRate).toFixed(1)} pts. Conversion-focused pages (/contact-sales, /free-trial) are performing exceptionally well, indicating effective CTAs and value proposition clarity.

**Growth signals:**
Strong performance in bottom-funnel pages (pricing, demo, free trial) combined with increased organic search traffic suggests healthy pipeline growth. Enterprise solutions pages showing consistent growth indicates success in upmarket positioning.

---

## Key metrics

| Metric | Value | Change vs. Prev. Period | Notes |
|--------|-------|-------------------------|-------|
| Sessions | ${formatNumber(data.sessions)} | ${calculateChange(data.sessions, data.prevSessions)} | Strong growth driven by organic search and paid campaigns |
| Users | ${formatNumber(data.users)} | ${calculateChange(data.users, data.prevUsers)} | New user acquisition accelerating, indicating effective top-of-funnel strategies |
| Engagement rate | ${formatPercentage(data.engagementRate)} | ${calculateChange(data.engagementRate, data.prevEngagementRate, true)} | Improved content quality and UX optimizations showing positive impact |
| Key events | ${formatNumber(data.keyEvents)} | ${calculateChange(data.keyEvents, data.prevKeyEvents)} | Conversion optimization efforts paying off across high-intent pages |

---

## Page breakdown

| Pages | Sessions | Change vs. Prev. Period | Notes |
|-------|----------|-------------------------|-------|
| ${data.pages[0].path} | ${formatNumber(data.pages[0].sessions)} | ${calculateChange(data.pages[0].sessions, data.pages[0].prevSessions)} | Top performer with ${formatPercentage(data.pages[0].keyEventRate)} event rate, clear value proposition resonating |
| ${data.pages[1].path} | ${formatNumber(data.pages[1].sessions)} | ${calculateChange(data.pages[1].sessions, data.pages[1].prevSessions)} | Feature discovery driving consideration, ${formatPercentage(data.pages[1].keyEventRate)} conversion rate |
| ${data.pages[2].path} | ${formatNumber(data.pages[2].sessions)} | ${calculateChange(data.pages[2].sessions, data.pages[2].prevSessions)} | Homepage bounce rate improving, better messaging clarity |
| ${data.pages[3].path} | ${formatNumber(data.pages[3].sessions)} | ${calculateChange(data.pages[3].sessions, data.pages[3].prevSessions)} | Highest converting page at ${formatPercentage(data.pages[3].keyEventRate)}, demo requests up significantly |
| ${data.pages[4].path} | ${formatNumber(data.pages[4].sessions)} | ${calculateChange(data.pages[4].sessions, data.pages[4].prevSessions)} | Enterprise focus gaining traction, strong qualified lead indicator |
| ${data.pages[5].path} | ${formatNumber(data.pages[5].sessions)} | ${calculateChange(data.pages[5].sessions, data.pages[5].prevSessions)} | Blog driving awareness but lower conversion focus |
| ${data.pages[6].path} | ${formatNumber(data.pages[6].sessions)} | ${calculateChange(data.pages[6].sessions, data.pages[6].prevSessions)} | Technical audience engagement, developer-focused content performing well |
| ${data.pages[7].path} | ${formatNumber(data.pages[7].sessions)} | ${calculateChange(data.pages[7].sessions, data.pages[7].prevSessions)} | Sales qualified leads source, ${formatPercentage(data.pages[7].keyEventRate)} conversion exceptional |
| ${data.pages[8].path} | ${formatNumber(data.pages[8].sessions)} | ${calculateChange(data.pages[8].sessions, data.pages[8].prevSessions)} | Brand awareness content, informational intent |
| ${data.pages[9].path} | ${formatNumber(data.pages[9].sessions)} | ${calculateChange(data.pages[9].sessions, data.pages[9].prevSessions)} | Integration ecosystem interest growing, product-led growth signal |
| ${data.pages[10].path} | ${formatNumber(data.pages[10].sessions)} | ${calculateChange(data.pages[10].sessions, data.pages[10].prevSessions)} | Social proof driving conversions, high engagement from enterprise prospects |
| ${data.pages[11].path} | ${formatNumber(data.pages[11].sessions)} | ${calculateChange(data.pages[11].sessions, data.pages[11].prevSessions)} | Security concerns being addressed proactively, trust-building content |
| ${data.pages[12].path} | ${formatNumber(data.pages[12].sessions)} | ${calculateChange(data.pages[12].sessions, data.pages[12].prevSessions)} | Top conversion page at ${formatPercentage(data.pages[12].keyEventRate)}, PQL acquisition strong |
| ${data.pages[13].path} | ${formatNumber(data.pages[13].sessions)} | ${calculateChange(data.pages[13].sessions, data.pages[13].prevSessions)} | Educational content, nurture track performance solid |
| ${data.pages[14].path} | ${formatNumber(data.pages[14].sessions)} | ${calculateChange(data.pages[14].sessions, data.pages[14].prevSessions)} | Lead generation performing well, webinar strategy effective |
| ${data.pages[15].path} | ${formatNumber(data.pages[15].sessions)} | ${calculateChange(data.pages[15].sessions, data.pages[15].prevSessions)} | Employer brand content, slight decline in hiring focus |
| ${data.pages[16].path} | ${formatNumber(data.pages[16].sessions)} | ${calculateChange(data.pages[16].sessions, data.pages[16].prevSessions)} | Partnership ecosystem growing, channel strategy development |
| ${data.pages[17].path} | ${formatNumber(data.pages[17].sessions)} | ${calculateChange(data.pages[17].sessions, data.pages[17].prevSessions)} | Developer documentation critical for adoption, technical SEO working |
| ${data.pages[18].path} | ${formatNumber(data.pages[18].sessions)} | ${calculateChange(data.pages[18].sessions, data.pages[18].prevSessions)} | Customer stories resonating, consideration-stage content |
| ${data.pages[19].path} | ${formatNumber(data.pages[19].sessions)} | ${calculateChange(data.pages[19].sessions, data.pages[19].prevSessions)} | Lead magnet performing well, ${formatPercentage(data.pages[19].keyEventRate)} conversion strong |

---

## Channel breakdown

| Channel | Sessions | Change vs. Prev. Period | Notes |
|---------|----------|-------------------------|-------|
| ${data.channels[0].name} | ${formatNumber(data.channels[0].sessions)} | ${calculateChange(data.channels[0].sessions, data.channels[0].prevSessions)} | SEO momentum building, content strategy and technical improvements driving visibility |
| ${data.channels[1].name} | ${formatNumber(data.channels[1].sessions)} | ${calculateChange(data.channels[1].sessions, data.channels[1].prevSessions)} | Brand awareness solid, direct traffic indicates strong recall and loyalty |
| ${data.channels[2].name} | ${formatNumber(data.channels[2].sessions)} | ${calculateChange(data.channels[2].sessions, data.channels[2].prevSessions)} | Paid campaigns efficient, highest conversion rate at ${formatPercentage(data.channels[2].keyEventRate)} justifies spend |
| ${data.channels[3].name} | ${formatNumber(data.channels[3].sessions)} | ${calculateChange(data.channels[3].sessions, data.channels[3].prevSessions)} | Social organic declining slightly, algorithm changes or content strategy needs review |
| ${data.channels[4].name} | ${formatNumber(data.channels[4].sessions)} | ${calculateChange(data.channels[4].sessions, data.channels[4].prevSessions)} | Partnership and PR efforts gaining traction, quality backlinks increasing |
| ${data.channels[5].name} | ${formatNumber(data.channels[5].sessions)} | ${calculateChange(data.channels[5].sessions, data.channels[5].prevSessions)} | Email nurture highly effective, best conversion rate at ${formatPercentage(data.channels[5].keyEventRate)} |
| ${data.channels[6].name} | ${formatNumber(data.channels[6].sessions)} | ${calculateChange(data.channels[6].sessions, data.channels[6].prevSessions)} | Paid social scaling up, LinkedIn and Twitter campaigns showing promise |
| ${data.channels[7].name} | ${formatNumber(data.channels[7].sessions)} | ${calculateChange(data.channels[7].sessions, data.channels[7].prevSessions)} | Display awareness campaigns, upper-funnel brand building focus |
| ${data.channels[8].name} | ${formatNumber(data.channels[8].sessions)} | ${calculateChange(data.channels[8].sessions, data.channels[8].prevSessions)} | Affiliate partnerships developing, strong conversion quality |

---

## Opportunities

**Opportunity: Amplify paid search investment** – With ${formatPercentage(data.channels[2].keyEventRate)} conversion rate and ${formatPercentage(((data.channels[2].sessions - data.channels[2].prevSessions) / data.channels[2].prevSessions) * 100)} MoM growth, there's clear ROI justification for increased budget allocation to high-intent keywords.

**Opportunity: Optimize social organic strategy** – Organic social showing -${formatPercentage(Math.abs(((data.channels[3].sessions - data.channels[3].prevSessions) / data.channels[3].prevSessions) * 100))} decline. Recommend content audit, posting schedule optimization, and increased focus on LinkedIn for B2B audience.

**Opportunity: Scale bottom-funnel content** – Pages like /demo (+${formatPercentage(((data.pages[3].sessions - data.pages[3].prevSessions) / data.pages[3].prevSessions) * 100)}) and /free-trial (+${formatPercentage(((data.pages[12].sessions - data.pages[12].prevSessions) / data.pages[12].prevSessions) * 100)}) with conversion rates above ${formatPercentage(15)} should receive more traffic through targeted campaigns and internal linking.

**Opportunity: Double down on email nurture** – Email channel delivering ${formatPercentage(data.channels[5].keyEventRate)} conversion rate. Opportunity to expand segmentation, personalization, and automated workflows for better lead nurturing.

**Opportunity: Enhance enterprise positioning** – /solutions/enterprise traffic up ${formatPercentage(((data.pages[4].sessions - data.pages[4].prevSessions) / data.pages[4].prevSessions) * 100)}. Create more enterprise-specific content, case studies, and ROI calculators to capture growing upmarket demand.

**Instruction:** This report is based on simulated data for ${companyName}. Data represents typical patterns for a B2B SaaS company with strong digital presence. For actual implementation, connect to Google Analytics 4 API using the Data API with proper authentication and date range parameters.`;

  return {
    report,
    metadata: {
      company: companyName,
      period: currentMonth,
      comparison_period: previousMonth,
      generated_at: new Date().toISOString(),
    },
  };
}

tool({
  name: "web_analytics_report",
  description:
    "Generates a comprehensive web analytics report for a software company with executive summary, key metrics, page breakdown, channel breakdown, and actionable opportunities. Returns realistic dummy data formatted as a detailed markdown report suitable for digital marketing analysis.",
  parameters: [
    {
      name: "company_name",
      type: ParameterType.String,
      description: "Name of the company for the report (optional, defaults to 'Software Company')",
      required: false,
    },
  ],
})(webAnalyticsReport);
