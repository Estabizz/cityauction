import { PrismaClient, UserAccountType, BidderStatus, OrganizationType, PropertyCategoryType, PossessionStatus, AuctionType, AuctionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CityAuction database seeding...');

  // 1. Roles & Permissions
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Full system control, server settings, and audit logs' },
    { name: 'ADMIN', description: 'Platform administration, auction and KYC management' },
    { name: 'BIDDER', description: 'KYC-verified bidder eligible for online bidding' },
    { name: 'REGISTERED', description: 'Basic registered user with favourites and alerts' },
    { name: 'PUBLIC', description: 'Unregistered public visitor' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // 2. Demo Users
  const passwordHash = await bcrypt.hash('CityAuction@2026', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cityauction.com' },
    update: {},
    create: {
      email: 'admin@cityauction.com',
      phone: '+919876543210',
      passwordHash,
      fullName: 'Chief Auction Administrator',
      accountType: UserAccountType.INDIVIDUAL,
      pan: 'ABCDE1234F',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
    },
  });

  const bidderUser = await prisma.user.upsert({
    where: { email: 'bidder@cityauction.com' },
    update: {},
    create: {
      email: 'bidder@cityauction.com',
      phone: '+919876543211',
      passwordHash,
      fullName: 'Vikramaditya Sharma',
      accountType: UserAccountType.INDIVIDUAL,
      pan: 'VWXYZ5678G',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
    },
  });

  // Assign roles
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: superAdminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: superAdminRole.id },
    });
  }

  const bidderRole = await prisma.role.findUnique({ where: { name: 'BIDDER' } });
  if (bidderRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: bidderUser.id, roleId: bidderRole.id } },
      update: {},
      create: { userId: bidderUser.id, roleId: bidderRole.id },
    });
  }

  // Bidder Profile
  await prisma.bidderProfile.upsert({
    where: { userId: bidderUser.id },
    update: {},
    create: {
      userId: bidderUser.id,
      bankAccountName: 'Vikramaditya Sharma',
      bankAccountNumber: '109823471029',
      bankIfsc: 'SBIN0001234',
      status: BidderStatus.APPROVED,
    },
  });

  // 3. Indian Locations (States & Major Cities)
  const statesData = [
    { name: 'Maharashtra', code: 'MH', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Navi Mumbai'] },
    { name: 'Delhi', code: 'DL', cities: ['New Delhi', 'North Delhi', 'South Delhi', 'Dwarka', 'Rohini'] },
    { name: 'Karnataka', code: 'KA', cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'] },
    { name: 'Gujarat', code: 'GJ', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'] },
    { name: 'Tamil Nadu', code: 'TN', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'] },
    { name: 'Telangana', code: 'TS', cities: ['Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad'] },
    { name: 'Uttar Pradesh', code: 'UP', cities: ['Noida', 'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi'] },
    { name: 'West Bengal', code: 'WB', cities: ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol'] },
    { name: 'Rajasthan', code: 'RJ', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner'] },
    { name: 'Haryana', code: 'HR', cities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'] },
    { name: 'Punjab', code: 'PB', cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Mohali'] },
    { name: 'Kerala', code: 'KL', cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'] },
    { name: 'Madhya Pradesh', code: 'MP', cities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior'] },
    { name: 'Chandigarh', code: 'CH', cities: ['Chandigarh'] },
    { name: 'Andhra Pradesh', code: 'AP', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore'] },
  ];

  const cityMap = new Map<string, number>();

  for (const st of statesData) {
    const stateLoc = await prisma.location.upsert({
      where: { slug: st.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        name: st.name,
        slug: st.name.toLowerCase().replace(/\s+/g, '-'),
        type: 'STATE',
        stateCode: st.code,
      },
    });

    for (const cityName of st.cities) {
      const citySlug = `${cityName.toLowerCase().replace(/\s+/g, '-')}-${st.code.toLowerCase()}`;
      const cityLoc = await prisma.location.upsert({
        where: { slug: citySlug },
        update: {},
        create: {
          name: cityName,
          slug: citySlug,
          type: 'CITY',
          parentId: stateLoc.id,
          stateCode: st.code,
        },
      });
      cityMap.set(`${cityName}_${st.name}`, cityLoc.id);
    }
  }

  // 4. Organizations (Banks, ARCs, NBFCs)
  const orgsData = [
    { name: 'State Bank of India', slug: 'sbi', type: OrganizationType.BANK, contactEmail: 'recovery@sbi.co.in', contactPhone: '+91-22-22740000', logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=120&auto=format&fit=crop&q=80' },
    { name: 'Punjab National Bank', slug: 'pnb', type: OrganizationType.BANK, contactEmail: 'eauction@pnb.co.in', contactPhone: '+91-11-28044000', logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=120&auto=format&fit=crop&q=80' },
    { name: 'Bank of Baroda', slug: 'bob', type: OrganizationType.BANK, contactEmail: 'sarfaesi@bankofbaroda.co.in', contactPhone: '+91-22-66985000', logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80' },
    { name: 'Canara Bank', slug: 'canara-bank', type: OrganizationType.BANK, contactEmail: 'recovery@canarabank.com', contactPhone: '+91-80-22221581', logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80' },
    { name: 'Union Bank of India', slug: 'union-bank', type: OrganizationType.BANK, contactEmail: 'eauction@unionbankofindia.com', contactPhone: '+91-22-22892000', logo: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=120&auto=format&fit=crop&q=80' },
    { name: 'HDFC Bank Ltd', slug: 'hdfc-bank', type: OrganizationType.BANK, contactEmail: 'distressedassets@hdfcbank.com', contactPhone: '+91-22-66521000', logo: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=120&auto=format&fit=crop&q=80' },
    { name: 'ICICI Bank Ltd', slug: 'icici-bank', type: OrganizationType.BANK, contactEmail: 'npa.sales@icicibank.com', contactPhone: '+91-22-26531414', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80' },
    { name: 'Axis Bank Ltd', slug: 'axis-bank', type: OrganizationType.BANK, contactEmail: 'specialassets@axisbank.com', contactPhone: '+91-22-24252525', logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&auto=format&fit=crop&q=80' },
    { name: 'Kotak Mahindra Bank', slug: 'kotak-bank', type: OrganizationType.BANK, contactEmail: 'eauctions@kotak.com', contactPhone: '+91-22-61660001', logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80' },
    { name: 'Omkara Assets Reconstruction Pvt Ltd', slug: 'omkara-arc', type: OrganizationType.ARC, contactEmail: 'contact@omkaraarc.com', contactPhone: '+91-22-26544000', logo: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=120&auto=format&fit=crop&q=80' },
    { name: 'Edelweiss Asset Reconstruction Co', slug: 'edelweiss-arc', type: OrganizationType.ARC, contactEmail: 'arc@edelweissfin.com', contactPhone: '+91-22-40094400', logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&auto=format&fit=crop&q=80' },
    { name: 'JM Financial ARC', slug: 'jm-financial-arc', type: OrganizationType.ARC, contactEmail: 'eauction@jmfl.com', contactPhone: '+91-22-66303030', logo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=120&auto=format&fit=crop&q=80' },
    { name: 'Debts Recovery Tribunal II Mumbai', slug: 'drt-mumbai-2', type: OrganizationType.DRT, contactEmail: 'registrar@drtmumbai2.gov.in', contactPhone: '+91-22-22610111', logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120&auto=format&fit=crop&q=80' },
    { name: 'Debts Recovery Tribunal Delhi', slug: 'drt-delhi', type: OrganizationType.DRT, contactEmail: 'registrar@drtdelhi.gov.in', contactPhone: '+91-11-23381234', logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120&auto=format&fit=crop&q=80' },
    { name: 'LIC Housing Finance Ltd', slug: 'lichfl', type: OrganizationType.HOUSING_FINANCE, contactEmail: 'sarfaesi@lichousing.com', contactPhone: '+91-22-22178600', logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&auto=format&fit=crop&q=80' },
    { name: 'Tata Capital Housing Finance Ltd', slug: 'tata-capital', type: OrganizationType.HOUSING_FINANCE, contactEmail: 'eauctions@tatacapital.com', contactPhone: '+91-22-66069000', logo: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=120&auto=format&fit=crop&q=80' },
  ];

  const orgMap = new Map<string, string>();
  for (const org of orgsData) {
    const createdOrg = await prisma.organization.upsert({
      where: { slug: org.slug },
      update: {},
      create: {
        name: org.name,
        slug: org.slug,
        type: org.type,
        contactEmail: org.contactEmail,
        contactPhone: org.contactPhone,
        logo: org.logo,
        description: `Authorized lender/institution disposing distressed and NPA assets under SARFAESI / DRT provisions.`,
        website: `https://www.${org.slug}.com`,
        isActive: true,
      },
    });
    orgMap.set(org.slug, createdOrg.id);
  }

  // 5. Property Categories & SubTypes
  const categoriesData = [
    {
      name: 'Residential',
      slug: 'residential',
      type: PropertyCategoryType.RESIDENTIAL,
      icon: 'Home',
      description: 'Apartments, independent bungalows, villas, row houses, and residential plots.',
      subtypes: ['Residential Flat', 'Independent House', 'Bungalow / Villa', 'Row House', 'Penthouse', 'Residential Plot', 'Residential Land & Building'],
    },
    {
      name: 'Commercial',
      slug: 'commercial',
      type: PropertyCategoryType.COMMERCIAL,
      icon: 'Building2',
      description: 'Office spaces, retail shops, commercial complexes, godowns, and showrooms.',
      subtypes: ['Commercial Office', 'Retail Shop', 'Showroom', 'Commercial Complex', 'Godown / Warehouse', 'Hotel / Resort', 'Commercial Vacant Land'],
    },
    {
      name: 'Industrial',
      slug: 'industrial',
      type: PropertyCategoryType.INDUSTRIAL,
      icon: 'Factory',
      description: 'Factories, industrial sheds, manufacturing plants, industrial plots, and machinery.',
      subtypes: ['Industrial Factory', 'Industrial Shed', 'Plant & Machinery', 'Industrial Plot', 'Industrial Complex', 'Industrial Site & Building'],
    },
    {
      name: 'Agricultural',
      slug: 'agricultural',
      type: PropertyCategoryType.AGRICULTURAL,
      icon: 'Tractor',
      description: 'Farmland, agricultural plots, orchards, poultry farms, and agro-processing units.',
      subtypes: ['Agricultural Land', 'Farm House', 'Poultry Farm', 'Orchard / Plantation', 'Agro Land with Shed'],
    },
    {
      name: 'Land / Plot',
      slug: 'land',
      type: PropertyCategoryType.LAND,
      icon: 'Map',
      description: 'Non-agricultural plots, commercial vacant land, residential plots, and open land parcels.',
      subtypes: ['NA Open Plot', 'Residential Plot', 'Commercial Plot', 'Industrial Plot', 'Vacant Barren Land'],
    },
    {
      name: 'Other Assets',
      slug: 'other',
      type: PropertyCategoryType.OTHER,
      icon: 'Package',
      description: 'Vehicles, construction equipment, commodities, IT assets, and going concerns.',
      subtypes: ['Heavy Vehicles / Fleet', 'Construction Machinery', 'Movable Stocks / Inventory', 'Company Going Concern', 'Scrap / Miscellaneous'],
    },
  ];

  const catMap = new Map<string, number>();
  const subTypeMap = new Map<string, number>();

  for (const cat of categoriesData) {
    const createdCat = await prisma.propertyCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        type: cat.type,
        icon: cat.icon,
        description: cat.description,
      },
    });
    catMap.set(cat.slug, createdCat.id);

    for (const st of cat.subtypes) {
      const stSlug = st.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const createdSt = await prisma.propertySubType.upsert({
        where: { slug: stSlug },
        update: {},
        create: {
          name: st,
          slug: stSlug,
          categoryId: createdCat.id,
        },
      });
      subTypeMap.set(st, createdSt.id);
    }
  }

  // 6. Realistic Indian Bank Auction Listings
  const sampleAuctions = [
    {
      title: '3 BHK Luxury Apartment in Lodha Bellissimo, Mahalaxmi',
      slug: '3-bhk-luxury-apartment-lodha-bellissimo-mahalaxmi-mumbai',
      category: 'residential',
      subtype: 'Residential Flat',
      city: 'Mumbai',
      state: 'Maharashtra',
      org: 'sbi',
      reservePrice: 48500000,
      emd: 4850000,
      bidIncrement: 100000,
      area: 2150,
      areaUnit: 'sq ft',
      possession: PossessionStatus.PHYSICAL,
      auctionType: AuctionType.SARFAESI,
      status: AuctionStatus.UPCOMING,
      address: 'Flat No. 2402, 24th Floor, Tower B, Lodha Bellissimo, N.M. Joshi Marg, Mahalaxmi, Mumbai - 400011',
      description: 'All that piece and parcel of residential premises bearing Flat No. 2402 on the 24th floor, Tower B, admeasuring carpet area 1680 sq.ft (built-up 2150 sq.ft) with two covered stilt car parking spaces, together with undivided proportionate share in the common areas.',
      officer: 'Mr. Rakesh Saxena (Chief Manager, Stressed Assets Resolution Branch)',
      phone: '+91-22-22741234',
      email: 'sarb.mumbai@sbi.co.in',
      daysFromNow: 12,
      submissionDays: 10,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Commercial Office Space in Cyber City, DLF Phase II, Gurugram',
      slug: 'commercial-office-space-cyber-city-dlf-phase-2-gurugram',
      category: 'commercial',
      subtype: 'Commercial Office',
      city: 'Gurugram',
      state: 'Haryana',
      org: 'pnb',
      reservePrice: 32000000,
      emd: 3200000,
      bidIncrement: 50000,
      area: 4200,
      areaUnit: 'sq ft',
      possession: PossessionStatus.PHYSICAL,
      auctionType: AuctionType.SARFAESI,
      status: AuctionStatus.LIVE,
      address: 'Unit No. 504-506, 5th Floor, Building 10-C, DLF Cyber City, Phase-II, Gurugram, Haryana - 122002',
      description: 'Fully furnished grade-A commercial office space comprising reception, 65 workstations, 4 managerial cabins, 2 conference rooms, server room, and cafeteria. High rental yield potential in premier corporate hub.',
      officer: 'Ms. Sunita Bansal (Assistant General Manager)',
      phone: '+91-124-4112000',
      email: 'sarb.gurugram@pnb.co.in',
      daysFromNow: 1,
      submissionDays: 0,
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Industrial Manufacturing Plant with Heavy Shed & Machinery, Peenya',
      slug: 'industrial-plant-peenya-industrial-area-bangalore',
      category: 'industrial',
      subtype: 'Industrial Factory',
      city: 'Bangalore',
      state: 'Karnataka',
      org: 'canara-bank',
      reservePrice: 65000000,
      emd: 6500000,
      bidIncrement: 200000,
      area: 28000,
      areaUnit: 'sq ft',
      possession: PossessionStatus.SYMBOLIC,
      auctionType: AuctionType.DRT,
      status: AuctionStatus.UPCOMING,
      address: 'Plot No. 42-A & 43, 2nd Phase, Peenya Industrial Area, Bangalore North, Karnataka - 560058',
      description: 'Industrial land admeasuring 28,000 sq.ft along with built-up RCC industrial shed of 18,500 sq.ft, overhead 10T EOT crane, 250 KVA HT power connection, effluent treatment facility, and administrative block.',
      officer: 'Mr. K. Narayana Murthy (Recovery Officer, DRT Bangalore)',
      phone: '+91-80-22123456',
      email: 'arm.bangalore@canarabank.com',
      daysFromNow: 18,
      submissionDays: 15,
      images: [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=900&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: '4 BHK Independent Bungalow with Private Lawn, Koregaon Park',
      slug: '4-bhk-independent-bungalow-koregaon-park-pune',
      category: 'residential',
      subtype: 'Bungalow / Villa',
      city: 'Pune',
      state: 'Maharashtra',
      org: 'bob',
      reservePrice: 72000000,
      emd: 7200000,
      bidIncrement: 200000,
      area: 5400,
      areaUnit: 'sq ft',
      possession: PossessionStatus.PHYSICAL,
      auctionType: AuctionType.SARFAESI,
      status: AuctionStatus.UPCOMING,
      address: 'Plot No. 18, Lane No. 5, Koregaon Park, Haveli Taluka, Pune, Maharashtra - 411001',
      description: 'Prime independent ground + 1 storey residential bungalow constructed on freehold NA plot admeasuring 500 sq. meters (5,382 sq.ft). Features landscaped garden, servant quarters, and 4-car parking portico.',
      officer: 'Mr. Deepak Chawla (Chief Manager & Authorized Officer)',
      phone: '+91-20-26129876',
      email: 'sarb.pune@bankofbaroda.com',
      daysFromNow: 21,
      submissionDays: 18,
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Prime Retail Corner Showroom in CG Road, Navrangpura',
      slug: 'retail-corner-showroom-cg-road-navrangpura-ahmedabad',
      category: 'commercial',
      subtype: 'Showroom',
      city: 'Ahmedabad',
      state: 'Gujarat',
      org: 'union-bank',
      reservePrice: 28000000,
      emd: 2800000,
      bidIncrement: 50000,
      area: 2600,
      areaUnit: 'sq ft',
      possession: PossessionStatus.PHYSICAL,
      auctionType: AuctionType.SARFAESI,
      status: AuctionStatus.UPCOMING,
      address: 'Shop No. G-1 & G-2, Ground Floor, Samarth Commercial Complex, Near Municipal Market, C.G. Road, Ahmedabad - 380009',
      description: 'High visibility road-facing double height corner showroom with wide frontage on premier retail corridor C.G. Road. Suitable for flagship brand showroom, bank branch, jewelry store, or healthcare clinic.',
      officer: 'Mr. Bhavesh Patel (Authorized Officer)',
      phone: '+91-79-26567890',
      email: 'sarb.ahmedabad@unionbankofindia.com',
      daysFromNow: 14,
      submissionDays: 11,
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Freehold Industrial Land Parcel in Sanand GIDC Phase II',
      slug: 'freehold-industrial-land-sanand-gidc-ahmedabad',
      category: 'land',
      subtype: 'Industrial Plot',
      city: 'Ahmedabad',
      state: 'Gujarat',
      org: 'omkara-arc',
      reservePrice: 45000000,
      emd: 4500000,
      bidIncrement: 100000,
      area: 82000,
      areaUnit: 'sq ft',
      possession: PossessionStatus.PHYSICAL,
      auctionType: AuctionType.NPA,
      status: AuctionStatus.UPCOMING,
      address: 'Plot No. C-14, Sanand GIDC Phase-II, Taluka Sanand, District Ahmedabad, Gujarat - 382110',
      description: 'Prime industrial plot located within Sanand Automobile & Engineering hub. Excellent highway connectivity to NH-8A, dedicated water connection, high-tension electric substation boundary line.',
      officer: 'Mr. Arvind Joshi (Vice President, NPA Recovery)',
      phone: '+91-22-26544010',
      email: 'sanand.sales@omkaraarc.com',
      daysFromNow: 25,
      submissionDays: 22,
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: '2 BHK Affordable Residential Flat in Sector 75, Noida',
      slug: '2-bhk-affordable-flat-sector-75-noida',
      category: 'residential',
      subtype: 'Residential Flat',
      city: 'Noida',
      state: 'Uttar Pradesh',
      org: 'lichfl',
      reservePrice: 5800000,
      emd: 580000,
      bidIncrement: 25000,
      area: 1050,
      areaUnit: 'sq ft',
      possession: PossessionStatus.PHYSICAL,
      auctionType: AuctionType.SARFAESI,
      status: AuctionStatus.UPCOMING,
      address: 'Flat No. 602, 6th Floor, Tower Emerald, Golf City Society, Sector 75, Noida, UP - 201301',
      description: 'Well-maintained 2 BHK apartment near Sector 50 Metro Station. Club house, power backup, covered parking, gated security. Clean encumbrance certificate on record.',
      officer: 'Mr. Amitav Ray (Authorized Officer)',
      phone: '+91-120-4321000',
      email: 'recovery.noida@lichousing.com',
      daysFromNow: 8,
      submissionDays: 6,
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Fertile Agricultural Farmland of 4.5 Acres near Devanahalli',
      slug: 'fertile-agricultural-farmland-devanahalli-bangalore-rural',
      category: 'agricultural',
      subtype: 'Agricultural Land',
      city: 'Bangalore',
      state: 'Karnataka',
      org: 'sbi',
      reservePrice: 38000000,
      emd: 3800000,
      bidIncrement: 100000,
      area: 196020,
      areaUnit: 'sq ft',
      possession: PossessionStatus.PHYSICAL,
      auctionType: AuctionType.SARFAESI,
      status: AuctionStatus.CLOSING_SOON,
      address: 'Sy. No. 84/2 & 84/3, Kundana Hobli, Devanahalli Taluk, Bangalore Rural District, Karnataka - 562110',
      description: 'Clear title agricultural red-soil land with 2 active borewells, motor pumpset, drip irrigation lines, and tar road approach. Just 18 km from Kempegowda International Airport.',
      officer: 'Mr. M. S. Venkatesh (Assistant General Manager)',
      phone: '+91-80-25987100',
      email: 'sarb.devanahalli@sbi.co.in',
      daysFromNow: 2,
      submissionDays: 1,
      images: [
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Commercial Godown & Logistics Warehouse Complex, Bhiwandi',
      slug: 'commercial-godown-warehouse-bhiwandi-thane',
      category: 'commercial',
      subtype: 'Godown / Warehouse',
      city: 'Thane',
      state: 'Maharashtra',
      org: 'axis-bank',
      reservePrice: 84000000,
      emd: 8400000,
      bidIncrement: 250000,
      area: 45000,
      areaUnit: 'sq ft',
      possession: PossessionStatus.PHYSICAL,
      auctionType: AuctionType.SARFAESI,
      status: AuctionStatus.UPCOMING,
      address: 'Survey No. 112, Hissa No. 4, Mankoli-Anjurphata Road, Dapode, Bhiwandi, Thane, Maharashtra - 421302',
      description: 'Pre-engineered building (PEB) structure warehouse with 12m clear height, 6 loading docks with hydraulic levelers, fire sprinkler systems, wide internal asphalt roads for 40ft container turning.',
      officer: 'Mr. Prashant Kulkarni (Vice President, Special Assets)',
      phone: '+91-22-24253333',
      email: 'bhiwandi.auction@axisbank.com',
      daysFromNow: 16,
      submissionDays: 13,
      images: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: '3 BHK Sea-Facing Penthouse in ECR Kottivakkam, Chennai',
      slug: '3-bhk-sea-facing-penthouse-ecr-kottivakkam-chennai',
      category: 'residential',
      subtype: 'Penthouse',
      city: 'Chennai',
      state: 'Tamil Nadu',
      org: 'hdfc-bank',
      reservePrice: 39000000,
      emd: 3900000,
      bidIncrement: 100000,
      area: 3100,
      areaUnit: 'sq ft',
      possession: PossessionStatus.PHYSICAL,
      auctionType: AuctionType.SARFAESI,
      status: AuctionStatus.UPCOMING,
      address: 'Penthouse A-14, Oceanique Towers, East Coast Road, Kottivakkam, Chennai, Tamil Nadu - 600041',
      description: 'Panoramic unobstructed Bay of Bengal view. Duplex penthouse with private terrace jacuzzi, modular Italian kitchen, home automation, 2 reserved basement parking slots.',
      officer: 'Mr. S. Ramanathan (Deputy General Manager, Retail Recovery)',
      phone: '+91-44-28567890',
      email: 'ecr.recovery@hdfcbank.com',
      daysFromNow: 15,
      submissionDays: 12,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Commercial Office Floor in HITEC City Phase I, Madhapur',
      slug: 'commercial-office-floor-hitec-city-madhapur-hyderabad',
      category: 'commercial',
      subtype: 'Commercial Office',
      city: 'Hyderabad',
      state: 'Telangana',
      org: 'icici-bank',
      reservePrice: 51000000,
      emd: 5100000,
      bidIncrement: 150000,
      area: 6800,
      areaUnit: 'sq ft',
      possession: PossessionStatus.PHYSICAL,
      auctionType: AuctionType.SARFAESI,
      status: AuctionStatus.LIVE,
      address: '3rd Floor, Cyber Heights, Plot No. 8 & 9, Madhapur, HITEC City, Hyderabad, Telangana - 500081',
      description: 'Full commercial floor plate in IT corridor with 100% DG power backup, central chilled water air conditioning, high speed OTIS elevators, dedicated fiber optic ducting.',
      officer: 'Mr. K. Chandrasekhar (Chief Manager)',
      phone: '+91-40-23118900',
      email: 'sarb.hyderabad@icicibank.com',
      daysFromNow: 1,
      submissionDays: 0,
      images: [
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80',
      ],
    },
    {
      title: 'Residential Villa in Silver Oak Enclave, Sector 8, Chandigarh',
      slug: 'residential-villa-sector-8-chandigarh',
      category: 'residential',
      subtype: 'Bungalow / Villa',
      city: 'Chandigarh',
      state: 'Chandigarh',
      org: 'pnb',
      reservePrice: 95000000,
      emd: 9500000,
      bidIncrement: 250000,
      area: 6200,
      areaUnit: 'sq ft',
      possession: PossessionStatus.PHYSICAL,
      auctionType: AuctionType.SARFAESI,
      status: AuctionStatus.UPCOMING,
      address: 'Kothi No. 142, Sector 8-A, Chandigarh (UT) - 160018',
      description: 'Prestigious corner plot single-owner duplex kothi in VIP sector of Chandigarh. Built on 1 Kanal (500 sq. yards), front lawn, back courtyard, Italian marble flooring.',
      officer: 'Mr. Harpreet Singh (Chief Manager)',
      phone: '+91-172-2789123',
      email: 'chandigarh.sarb@pnb.co.in',
      daysFromNow: 20,
      submissionDays: 17,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
      ],
    },
  ];

  const now = new Date();

  for (let i = 0; i < sampleAuctions.length; i++) {
    const item = sampleAuctions[i];
    const locId = cityMap.get(`${item.city}_${item.state}`);
    const orgId = orgMap.get(item.org) || orgMap.get('sbi')!;
    const catId = catMap.get(item.category) || 1;
    const subTypeId = subTypeMap.get(item.subtype);

    // Calculate realistic auction dates
    const startDateTime = new Date(now.getTime() + item.daysFromNow * 24 * 60 * 60 * 1000);
    const endDateTime = new Date(startDateTime.getTime() + 4 * 60 * 60 * 1000); // 4 hours window
    const submissionDeadline = new Date(now.getTime() + item.submissionDays * 24 * 60 * 60 * 1000);
    const inspectionDate = new Date(now.getTime() + Math.max(1, item.submissionDays - 3) * 24 * 60 * 60 * 1000);

    // Create Property
    const property = await prisma.property.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        title: item.title,
        slug: item.slug,
        description: item.description,
        address: item.address,
        locationId: locId || 1,
        organizationId: orgId,
        categoryId: catId,
        subTypeId: subTypeId,
        area: item.area,
        areaUnit: item.areaUnit,
        possessionStatus: item.possession,
        estimatedValue: item.reservePrice * 1.25, // Market value 25% higher than reserve
      },
    });

    // Create Images
    for (let imgIdx = 0; imgIdx < item.images.length; imgIdx++) {
      await prisma.propertyImage.create({
        data: {
          propertyId: property.id,
          url: item.images[imgIdx],
          altText: `${item.title} - Photo ${imgIdx + 1}`,
          sortOrder: imgIdx,
          isPrimary: imgIdx === 0,
        },
      });
    }

    // Create Property Documents
    await prisma.propertyDocument.createMany({
      data: [
        {
          propertyId: property.id,
          name: 'SARFAESI Sale Notice & Terms (Form IV)',
          type: 'SALE_NOTICE',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          fileSize: 1450000,
          mimeType: 'application/pdf',
          isPublic: true,
        },
        {
          propertyId: property.id,
          name: 'Title Search & Non-Encumbrance Report',
          type: 'TITLE_DEED',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          fileSize: 2850000,
          mimeType: 'application/pdf',
          isPublic: true,
        },
        {
          propertyId: property.id,
          name: 'Bidder Application & Tender Submission Form',
          type: 'APPLICATION_FORM',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          fileSize: 620000,
          mimeType: 'application/pdf',
          isPublic: true,
        },
      ],
    });

    // Create Auction
    const auctionNumber = `CA-${item.state.slice(0, 2).toUpperCase()}-${2026}-${1000 + i}`;
    await prisma.auction.upsert({
      where: { auctionNumber },
      update: {},
      create: {
        auctionNumber,
        propertyId: property.id,
        organizationId: orgId,
        type: item.auctionType,
        status: item.status,
        reservePrice: item.reservePrice,
        emd: item.emd,
        bidIncrement: item.bidIncrement,
        startDateTime,
        endDateTime,
        submissionDeadline,
        inspectionDate,
        contactOfficerName: item.officer,
        contactOfficerPhone: item.phone,
        contactOfficerEmail: item.email,
        description: item.description,
        terms: '1. The auction sale is strictly conducted on "As is where is", "As is what is", and "Whatever there is" basis under Rule 8 & 9 of the Security Interest (Enforcement) Rules, 2002.\n2. Earnest Money Deposit (EMD) must be submitted before the deadline via RTGS/NEFT/Online Payment Gateway.\n3. The successful bidder shall deposit 25% of the sale price (inclusive of EMD) immediately on the same day or by the next working day.\n4. Balance 75% must be deposited within 15 days of confirmation of sale.',
        isOnline: true,
        publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // 7. Seed FAQs
  const faqCategories = [
    {
      name: 'General & Overview',
      slug: 'general',
      faqs: [
        { q: 'What is a Bank Auction or NPA property?', a: 'When a borrower defaults on a secured bank loan, the lending institution can initiate recovery proceedings under the SARFAESI Act, 2002 or through the Debts Recovery Tribunal (DRT). The mortgaged property is auctioned publicly to recover dues, typically at 20% to 40% below prevalent open market rates.' },
        { q: 'What is the SARFAESI Act?', a: 'The Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002 enables banks and financial institutions to auction commercial or residential properties without civil court intervention when a borrower defaults.' },
        { q: 'Can anyone participate in bank e-auctions?', a: 'Yes. Any Indian citizen of legal age, NRI, sole proprietorship, partnership firm, LLP, or registered corporate entity holding a valid PAN and completing KYC verification can participate.' },
      ],
    },
    {
      name: 'Bidding & EMD',
      slug: 'bidding-emd',
      faqs: [
        { q: 'What is Earnest Money Deposit (EMD)?', a: 'EMD is a mandatory security deposit (usually 10% of the reserve price) required by the bank to ensure only serious bidders participate. If you do not win the auction, the EMD is refunded in full without interest to your registered bank account within 3 to 7 working days.' },
        { q: 'How does live online bidding work?', a: 'Once your KYC and EMD are verified, you gain access to the secure online bid room during the scheduled auction window. Bids start at or above the reserve price, and each increment must equal or exceed the minimum bid increment configured by the bank.' },
        { q: 'What is the auto-extension rule in e-auctions?', a: 'If a bid is placed within the last 5 minutes of the auction, the timer automatically extends by another 5 minutes to ensure all participants have a fair opportunity to counter-bid.' },
      ],
    },
    {
      name: 'Legal & Possession',
      slug: 'legal-possession',
      faqs: [
        { q: 'What is the difference between Physical and Symbolic possession?', a: 'Physical possession means the bank has taken actual physical custody of the property with locks, and the buyer receives immediate key handover upon full payment. Symbolic possession means the bank has legal claim but actual physical eviction of the occupant may require Section 14 magistrate intervention.' },
        { q: 'Who pays pending society dues, property tax, and electricity charges?', a: 'Under standard SARFAESI auctions, properties are sold on an "as is where is" basis. Bidders should inspect the title and confirm outstanding municipal dues mentioned in the official Sale Notice before placing a bid.' },
      ],
    },
  ];

  for (const fc of faqCategories) {
    const createdFaqCat = await prisma.faqCategory.upsert({
      where: { slug: fc.slug },
      update: {},
      create: { name: fc.name, slug: fc.slug },
    });

    for (let idx = 0; idx < fc.faqs.length; idx++) {
      await prisma.faq.create({
        data: {
          question: fc.faqs[idx].q,
          answer: fc.faqs[idx].a,
          categoryId: createdFaqCat.id,
          sortOrder: idx,
          isPublished: true,
        },
      });
    }
  }

  // 8. Seed Blog Posts
  const blogCat = await prisma.blogCategory.upsert({
    where: { slug: 'auction-guides' },
    update: {},
    create: { name: 'Auction Guides & Insights', slug: 'auction-guides' },
  });

  const blogs = [
    {
      title: 'Complete Step-by-Step Guide to Buying Bank Auction Properties in India (2026)',
      slug: 'complete-guide-to-buying-bank-auction-properties-india',
      excerpt: 'Discover the complete legal process, due diligence checklist, EMD mechanics, and how to safely purchase distressed assets at 20-40% below market value.',
      content: `Bank auctions represent one of the most lucrative real estate investment avenues in India today. Understanding the SARFAESI legal framework, conducting thorough title searches, checking for physical vs symbolic possession, and managing auction financing are essential steps for any prospective bidder.`,
      featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80',
    },
    {
      title: 'Physical vs Symbolic Possession: Crucial Differences Every Bidder Must Know',
      slug: 'physical-vs-symbolic-possession-differences-every-bidder-must-know',
      excerpt: 'Why symbolic possession properties require Section 14 CMM orders, and how physical possession guarantees immediate key handover.',
      content: `One of the most critical fields in any bank auction sale notice is Possession Status. Purchasing a property under physical possession carries minimal risk, while symbolic possession requires familiarity with the District Magistrate recovery proceedings.`,
      featuredImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
    },
    {
      title: 'Understanding EMD: Rules, Payment Methods, and Refund Timelines',
      slug: 'understanding-emd-rules-payment-methods-refund-timelines',
      excerpt: 'Learn how Earnest Money Deposit works, bank account verification requirements, and how refunds are automatically processed for unsuccessful bidders.',
      content: `The Earnest Money Deposit (EMD) acts as proof of genuine intent in property e-auctions. This article breaks down RTGS/NEFT requirements, online payment gateways, forfeiture rules, and refund timelines.`,
      featuredImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  for (const b of blogs) {
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        content: b.content,
        featuredImage: b.featuredImage,
        categoryId: blogCat.id,
        authorId: adminUser.id,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        seoTitle: b.title,
        seoDescription: b.excerpt,
      },
    });
  }

  console.log('✅ CityAuction database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
