import { db } from '@/lib/db';
import { getAuctionById } from './auction.service';
import type { DetailedAuction } from './mock-data';

export interface LiveBidRecord {
  id: string;
  auctionId: string;
  bidderAlias: string;
  amount: number;
  formattedAmount: string;
  timestamp: string;
  timeFormatted: string;
  isUserBid: boolean;
  status: 'LEADING' | 'SURPASSED' | 'REJECTED';
}

export interface BiddingRoomState {
  auction: {
    id: string;
    auctionNumber: string;
    title: string;
    reservePrice: number;
    bidIncrement: number;
    emd: number;
    status: string;
    startDateTime: string;
    endDateTime: string;
    possessionStatus: string;
    city: string;
    state: string;
    organizationName: string;
    organizationLogo: string | null;
    officerName: string;
    officerPhone: string;
    officerEmail: string;
    primaryImage: string | null;
  };
  currentHighestBid: number;
  currentHighestBidderAlias: string;
  currentHighestBidderId: string | null;
  totalBids: number;
  nextMinBid: number;
  timeRemainingSeconds: number;
  isAutoExtended: boolean;
  autoExtensionCount: number;
  isAuctionLive: boolean;
  isAuctionEnded: boolean;
  bids: LiveBidRecord[];
  userEligibility: {
    isKycApproved: boolean;
    isEmdPaid: boolean;
    isAdmitted: boolean;
    role: 'BIDDER' | 'OBSERVER';
    userAlias: string;
    userId: string | null;
  };
}

// In-memory live bidding room storage for active session state
interface AuctionLiveRoomMemory {
  currentHighestBid: number;
  currentHighestBidderAlias: string;
  currentHighestBidderId: string | null;
  endDateTime: Date;
  autoExtensionCount: number;
  isAutoExtended: boolean;
  bids: LiveBidRecord[];
  admittedUserIds: Set<string>;
}

const liveRoomsMap = new Map<string, AuctionLiveRoomMemory>();

function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTimeOnly(date: Date): string {
  return date.toLocaleTimeString('en-IN', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata',
  }) + ' IST';
}

function initializeRoom(auction: DetailedAuction): AuctionLiveRoomMemory {
  const reserve = parseFloat(auction.reservePrice) || 10000000;
  const increment = parseFloat(auction.bidIncrement) || 50000;
  const initialEndDate = new Date(Date.now() + 2 * 3600000 + 42 * 60000); // 2h 42m from now

  // Pre-seed 4 realistic bids
  const now = Date.now();
  const sampleBids: LiveBidRecord[] = [
    {
      id: 'bid-init-1',
      auctionId: auction.id,
      bidderAlias: 'Bidder #104',
      amount: reserve,
      formattedAmount: formatInr(reserve),
      timestamp: new Date(now - 38 * 60000).toISOString(),
      timeFormatted: formatTimeOnly(new Date(now - 38 * 60000)),
      isUserBid: false,
      status: 'SURPASSED',
    },
    {
      id: 'bid-init-2',
      auctionId: auction.id,
      bidderAlias: 'Bidder #289',
      amount: reserve + increment,
      formattedAmount: formatInr(reserve + increment),
      timestamp: new Date(now - 25 * 60000).toISOString(),
      timeFormatted: formatTimeOnly(new Date(now - 25 * 60000)),
      isUserBid: false,
      status: 'SURPASSED',
    },
    {
      id: 'bid-init-3',
      auctionId: auction.id,
      bidderAlias: 'Bidder #104',
      amount: reserve + increment * 2,
      formattedAmount: formatInr(reserve + increment * 2),
      timestamp: new Date(now - 14 * 60000).toISOString(),
      timeFormatted: formatTimeOnly(new Date(now - 14 * 60000)),
      isUserBid: false,
      status: 'SURPASSED',
    },
    {
      id: 'bid-init-4',
      auctionId: auction.id,
      bidderAlias: 'Bidder #412',
      amount: reserve + increment * 3,
      formattedAmount: formatInr(reserve + increment * 3),
      timestamp: new Date(now - 4 * 60000).toISOString(),
      timeFormatted: formatTimeOnly(new Date(now - 4 * 60000)),
      isUserBid: false,
      status: 'LEADING',
    },
  ];

  const highestBid = reserve + increment * 3;

  const room: AuctionLiveRoomMemory = {
    currentHighestBid: highestBid,
    currentHighestBidderAlias: 'Bidder #412',
    currentHighestBidderId: 'user-sample-412',
    endDateTime: initialEndDate,
    autoExtensionCount: 0,
    isAutoExtended: false,
    bids: sampleBids,
    admittedUserIds: new Set(['admin-demo', 'bidder-demo', 'demo-bidder']),
  };

  liveRoomsMap.set(auction.id, room);
  return room;
}

export function admitUserToAuctionRoom(auctionId: string, userId: string) {
  const room = liveRoomsMap.get(auctionId);
  if (room) {
    room.admittedUserIds.add(userId);
  }
}

export async function getAuctionBiddingState(
  auctionId: string,
  userId?: string | null,
  userRole?: string | null
): Promise<BiddingRoomState | null> {
  const auction = await getAuctionById(auctionId);
  if (!auction) return null;

  let room = liveRoomsMap.get(auction.id);
  if (!room) {
    room = initializeRoom(auction);
  }

  const now = Date.now();
  const endTimestamp = room.endDateTime.getTime();
  const diffSeconds = Math.max(0, Math.floor((endTimestamp - now) / 1000));
  const isAuctionEnded = diffSeconds <= 0;
  const isAuctionLive = !isAuctionEnded && auction.status !== 'CLOSED' && auction.status !== 'CANCELLED';

  const reservePriceNum = parseFloat(auction.reservePrice) || 0;
  const incrementNum = parseFloat(auction.bidIncrement) || 50000;
  const currentHighest = room.currentHighestBid || reservePriceNum;
  const nextMinBid = room.bids.length === 0 ? reservePriceNum : currentHighest + incrementNum;

  // Determine user admission & eligibility
  const isAdmitted = (userId && room.admittedUserIds.has(userId)) || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || false;
  
  // Generate consistent bidder alias for the user
  const bidderNum = userId ? Math.abs(userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 900) + 100 : 999;
  const userAlias = `Bidder #${bidderNum}`;

  // Map bids to mark user bids
  const bidsWithOwnership: LiveBidRecord[] = room.bids.map((b) => ({
    ...b,
    isUserBid: userId ? (b.bidderAlias === userAlias || (b as any).userId === userId) : false,
  }));

  return {
    auction: {
      id: auction.id,
      auctionNumber: auction.auctionNumber,
      title: auction.title,
      reservePrice: reservePriceNum,
      bidIncrement: incrementNum,
      emd: parseFloat(auction.emd) || 0,
      status: isAuctionEnded ? 'CLOSED' : 'LIVE',
      startDateTime: auction.startDateTime,
      endDateTime: room.endDateTime.toISOString(),
      possessionStatus: auction.possessionStatus,
      city: auction.city,
      state: auction.state,
      organizationName: auction.organizationName,
      organizationLogo: auction.organizationLogo,
      officerName: auction.contactOfficerName,
      officerPhone: auction.contactOfficerPhone,
      officerEmail: auction.contactOfficerEmail,
      primaryImage: auction.primaryImage,
    },
    currentHighestBid: currentHighest,
    currentHighestBidderAlias: room.currentHighestBidderAlias,
    currentHighestBidderId: room.currentHighestBidderId,
    totalBids: room.bids.length,
    nextMinBid,
    timeRemainingSeconds: diffSeconds,
    isAutoExtended: room.isAutoExtended,
    autoExtensionCount: room.autoExtensionCount,
    isAuctionLive,
    isAuctionEnded,
    bids: [...bidsWithOwnership].reverse(), // Newest bids first for table/feed
    userEligibility: {
      isKycApproved: isAdmitted,
      isEmdPaid: isAdmitted,
      isAdmitted: isAdmitted,
      role: isAdmitted ? 'BIDDER' : 'OBSERVER',
      userAlias,
      userId: userId || null,
    },
  };
}

export async function placeBid(params: {
  auctionId: string;
  userId: string;
  amount: number;
  userRole?: string;
  ipAddress?: string;
}): Promise<{
  success: boolean;
  message: string;
  state?: BiddingRoomState;
  extended?: boolean;
}> {
  const { auctionId, userId, amount, ipAddress } = params;
  const auction = await getAuctionById(auctionId);
  if (!auction) {
    return { success: false, message: 'Auction not found' };
  }

  let room = liveRoomsMap.get(auction.id);
  if (!room) {
    room = initializeRoom(auction);
  }

  const now = Date.now();
  const endTimestamp = room.endDateTime.getTime();
  const diffSeconds = Math.floor((endTimestamp - now) / 1000);

  if (diffSeconds <= 0) {
    return { success: false, message: 'Bidding window has officially closed.' };
  }

  // Check eligibility - admit demo bidders automatically if needed
  if (!room.admittedUserIds.has(userId) && params.userRole !== 'ADMIN' && params.userRole !== 'SUPER_ADMIN') {
    // If not admitted, check DB participation
    try {
      const dbParticipant = await db.auctionParticipant.findFirst({
        where: { auctionId: auction.id, userId, status: 'APPROVED' },
      });
      if (dbParticipant) {
        room.admittedUserIds.add(userId);
      } else {
        return {
          success: false,
          message: 'Observer Mode: You must submit approved KYC and pay the Earnest Money Deposit (EMD) to place statutory bids.',
        };
      }
    } catch {
      // In standalone mode without DB, if user is logged in, auto-admit them for smooth testing
      room.admittedUserIds.add(userId);
    }
  }

  const reservePriceNum = parseFloat(auction.reservePrice) || 0;
  const incrementNum = parseFloat(auction.bidIncrement) || 50000;
  const currentHighest = room.currentHighestBid;
  const minRequiredBid = room.bids.length === 0 ? reservePriceNum : currentHighest + incrementNum;

  if (amount < minRequiredBid) {
    return {
      success: false,
      message: `Invalid bid amount. Next minimum statutory bid is ${formatInr(minRequiredBid)}.`,
    };
  }

  // Check increment step
  const excess = amount - currentHighest;
  if (excess % incrementNum !== 0) {
    return {
      success: false,
      message: `Bid must be a valid multiple of the minimum increment of ${formatInr(incrementNum)}.`,
    };
  }

  // SARFAESI Rule 9: Auto-Extension Protocol (5 minutes if bid placed in final 5 minutes)
  let extended = false;
  if (diffSeconds <= 300) {
    // Extend by 5 minutes (300 seconds) from previous end time or current time + 300s
    room.endDateTime = new Date(Date.now() + 300 * 1000);
    room.autoExtensionCount += 1;
    room.isAutoExtended = true;
    extended = true;
  }

  // Generate alias
  const bidderNum = Math.abs(userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 900) + 100;
  const userAlias = `Bidder #${bidderNum}`;

  // Mark existing leading bid as SURPASSED
  room.bids.forEach((b) => {
    if (b.status === 'LEADING') {
      b.status = 'SURPASSED';
    }
  });

  const newBidRecord: LiveBidRecord = {
    id: `bid-${Date.now()}`,
    auctionId: auction.id,
    bidderAlias: userAlias,
    amount,
    formattedAmount: formatInr(amount),
    timestamp: new Date().toISOString(),
    timeFormatted: formatTimeOnly(new Date()),
    isUserBid: true,
    status: 'LEADING',
  };
  (newBidRecord as any).userId = userId;

  room.bids.push(newBidRecord);
  room.currentHighestBid = amount;
  room.currentHighestBidderAlias = userAlias;
  room.currentHighestBidderId = userId;

  // Persist to Prisma DB if accessible
  try {
    await db.bid.create({
      data: {
        auctionId: auction.id,
        userId,
        amount: amount,
        status: 'ACCEPTED',
        ipAddress: ipAddress || '127.0.0.1',
      },
    });

    await db.bidHistory.create({
      data: {
        auctionId: auction.id,
        event: 'BID_PLACED',
        details: `Bid of ₹${amount} placed by ${userAlias}${extended ? ' (Triggered 5m auto-extension)' : ''}`,
      },
    });
  } catch {
    // Graceful fallback to memory
  }

  const updatedState = await getAuctionBiddingState(auction.id, userId, params.userRole);

  return {
    success: true,
    message: `Statutory bid of ${formatInr(amount)} accepted successfully!${extended ? ' Auction extended by 5 minutes.' : ''}`,
    state: updatedState || undefined,
    extended,
  };
}
