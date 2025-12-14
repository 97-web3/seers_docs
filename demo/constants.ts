
import { Market, SportCategory } from './types';

export const MOCK_MARKETS: Market[] = [
  // 1. Official - Football (El Clásico)
  {
    id: '1',
    title: '西班牙国家德比：皇家马德里 vs 巴塞罗那',
    league: 'La Liga',
    image: 'https://picsum.photos/id/1058/800/600',
    teamHomeImage: 'https://ui-avatars.com/api/?name=RMA&background=fff&color=00529F&size=128&bold=true&length=3',
    teamAwayImage: 'https://ui-avatars.com/api/?name=FCB&background=A50044&color=EDBB00&size=128&bold=true&length=3',
    endDate: '2024/04/22 03:00',
    volume: 5200000,
    isUserCreated: false,
    outcomes: [
      { 
        id: 'o_rma', 
        label: '皇家马德里', 
        price: 48, 
        odds: 2.10,
        betCount: 25420,
        betCountPercentage: 48,
        totalAmount: 2496000,
        totalAmountPercentage: 48,
        color: 'text-blue-600'
      },
      { 
        id: 'o_draw', 
        label: '平局', 
        price: 24, 
        odds: 4.20,
        betCount: 8300,
        betCountPercentage: 20,
        totalAmount: 1040000,
        totalAmountPercentage: 20,
        color: 'text-gray-600'
      },
      { 
        id: 'o_fcb', 
        label: '巴塞罗那', 
        price: 32, 
        odds: 3.10,
        betCount: 16500,
        betCountPercentage: 32,
        totalAmount: 1664000,
        totalAmountPercentage: 32,
        color: 'text-red-700'
      }
    ]
  },
  // 2. User (Bookmaker) - NBA Futures (Standard)
  {
    id: '3',
    title: '【庄家盘】2025年NBA总冠军预测',
    league: 'NBA Futures',
    image: 'https://picsum.photos/id/1060/800/600',
    endDate: '2025/06/15 19:00',
    volume: 45000,
    isUserCreated: true,
    createdBy: 'CryptoWhale_99',
    bookmakerSideId: 'o5', // Bookmaker backs Nuggets
    outcomes: [
      { 
        id: 'o5', 
        label: '掘金', 
        price: 18,
        odds: 5.50,
        betCount: 1,
        betCountPercentage: 100,
        totalAmount: 20000,
        totalAmountPercentage: 80,
        image: 'https://ui-avatars.com/api/?name=DEN&background=0E2240&color=FEC524&size=128&bold=true&length=3',
        isBookmakerSide: true
      },
      { 
        id: 'o6', 
        label: '湖人', 
        price: 12,
        odds: 8.33,
        betCount: 145,
        betCountPercentage: 100,
        totalAmount: 5400,
        totalAmountPercentage: 20,
        image: 'https://ui-avatars.com/api/?name=LAL&background=552583&color=FDB927&size=128&bold=true&length=3'
      }
    ]
  },
  // 3. User (Bookmaker) - Simplified to Single Group
  {
    id: 'user_fun_simple_1',
    title: '【庄家盘】欧冠决赛：谁将打入首粒进球？',
    league: 'Champions League',
    image: 'https://picsum.photos/id/1033/800/600',
    endDate: '2024/06/02 03:00',
    volume: 125000,
    isUserCreated: true,
    createdBy: 'SoccerKing_88',
    bookmakerSideId: 'bm_opt3', 
    outcomes: [
      { 
        id: 'bm_opt1', label: '维尼修斯 (Real Madrid)', 
        price: 30, odds: 3.33, betCount: 450, betCountPercentage: 35, 
        totalAmount: 43750, totalAmountPercentage: 35, color: 'text-gray-900'
      },
      { 
        id: 'bm_opt2', label: '贝林厄姆 (Real Madrid)', 
        price: 30, odds: 4.00, betCount: 300, betCountPercentage: 25, 
        totalAmount: 31250, totalAmountPercentage: 25, color: 'text-gray-900'
      },
      { 
        id: 'bm_opt3', label: '其他球员 / 无进球', 
        price: 40, odds: 2.50, betCount: 1, betCountPercentage: 100, 
        totalAmount: 50000, totalAmountPercentage: 40, color: 'text-gray-500',
        isBookmakerSide: true 
      }
    ]
  },
  // 4. User (Bookmaker) - Premier League
  {
    id: 'user_new_1',
    title: '【庄家盘】曼联 vs 利物浦：谁能获胜？',
    league: 'Premier League',
    image: 'https://picsum.photos/id/1067/800/600',
    teamHomeImage: 'https://ui-avatars.com/api/?name=MUN&background=DA291C&color=fff&size=128&bold=true&length=3',
    teamAwayImage: 'https://ui-avatars.com/api/?name=LIV&background=C8102E&color=fff&size=128&bold=true&length=3',
    endDate: '2024/09/01 23:30',
    volume: 12000,
    isUserCreated: true,
    createdBy: 'RedDevil_Fan',
    bookmakerSideId: 'u1_o1', // Bookmaker backs Man Utd
    outcomes: [
      { 
        id: 'u1_o1', 
        label: '曼联', 
        price: 40,
        odds: 2.50,
        betCount: 1,
        betCountPercentage: 100,
        totalAmount: 5000,
        totalAmountPercentage: 60,
        color: 'text-red-600',
        isBookmakerSide: true
      },
      { 
        id: 'u1_o2', 
        label: '利物浦', 
        price: 35,
        odds: 2.85,
        betCount: 450,
        betCountPercentage: 100,
        totalAmount: 3500,
        totalAmountPercentage: 40,
        color: 'text-red-800'
      }
    ]
  },
  // 5. User (Bookmaker) - Crypto Market
  {
    id: 'user_crypto_1',
    title: '【庄家盘】比特币BTC年底价格能否突破 $100,000？',
    league: 'Crypto',
    image: 'https://picsum.photos/id/1059/800/600', // Money/Tech related
    endDate: '2024/12/31 23:59',
    volume: 250000,
    isUserCreated: true,
    createdBy: 'Satoshi_Nakamoto_Jr',
    bookmakerSideId: 'crypto_yes', // Bookmaker believes YES
    outcomes: [
      { 
        id: 'crypto_yes', label: '能 (Yes)', 
        price: 50, odds: 2.80, betCount: 1, betCountPercentage: 100, 
        totalAmount: 150000, totalAmountPercentage: 60, 
        image: 'https://ui-avatars.com/api/?name=YES&background=16a34a&color=fff&size=128&bold=true',
        isBookmakerSide: true
      },
      { 
        id: 'crypto_no', label: '不能 (No)', 
        price: 50, odds: 1.50, betCount: 890, betCountPercentage: 100, 
        totalAmount: 100000, totalAmountPercentage: 40,
        image: 'https://ui-avatars.com/api/?name=NO&background=dc2626&color=fff&size=128&bold=true'
      }
    ]
  },
  // 6. User (Bookmaker) - Entertainment
  {
    id: 'user_ent_1',
    title: '【庄家盘】谁将出演下一任 007 詹姆斯·邦德？',
    league: 'Entertainment',
    image: 'https://picsum.photos/id/1015/800/600',
    endDate: '2024/12/01 12:00',
    volume: 8800,
    isUserCreated: true,
    createdBy: 'MovieBuff_007',
    bookmakerSideId: 'ent_at', // Bookmaker backs Aaron Taylor-Johnson
    outcomes: [
      { 
        id: 'ent_at', label: '亚伦·泰勒-约翰逊 (Aaron Taylor-Johnson)', 
        price: 40, odds: 2.00, betCount: 1, betCountPercentage: 100, 
        totalAmount: 5000, totalAmountPercentage: 55, color: 'text-gray-900',
        isBookmakerSide: true
      },
      { 
        id: 'ent_hc', label: '亨利·卡维尔 (Henry Cavill)', 
        price: 30, odds: 3.50, betCount: 120, betCountPercentage: 100, 
        totalAmount: 2000, totalAmountPercentage: 25, color: 'text-gray-800'
      },
      { 
        id: 'ent_other', label: '其他演员', 
        price: 30, odds: 4.00, betCount: 80, betCountPercentage: 100, 
        totalAmount: 1800, totalAmountPercentage: 20, color: 'text-gray-500'
      }
    ]
  },
  // 7. Official - Euro 2024
  {
    id: '2',
    title: '2024欧洲杯：英格兰 vs 塞尔维亚',
    league: 'UEFA Euro 2024',
    image: 'https://picsum.photos/id/1058/800/600',
    teamHomeImage: 'https://ui-avatars.com/api/?name=ENG&background=fff&color=CE1124&size=128&bold=true&length=3',
    teamAwayImage: 'https://ui-avatars.com/api/?name=SRB&background=C6363C&color=fff&size=128&bold=true&length=3',
    endDate: '2024/06/17 03:00',
    volume: 850000,
    isUserCreated: false,
    outcomes: [
      { 
        id: 'o3', label: '英格兰', price: 60, odds: 1.54, betCount: 8500, betCountPercentage: 65, totalAmount: 510000, totalAmountPercentage: 60, color: 'text-blue-600' 
      },
      { 
        id: 'o_draw', label: '平局', price: 25, odds: 3.80, betCount: 2000, betCountPercentage: 15, totalAmount: 212500, totalAmountPercentage: 25, color: 'text-gray-600' 
      },
      { 
        id: 'o4', label: '塞尔维亚', price: 15, odds: 6.50, betCount: 2650, betCountPercentage: 20, totalAmount: 127500, totalAmountPercentage: 15, color: 'text-red-600' 
      }
    ]
  },
  // 8. Official - Esports
  {
    id: '4',
    title: '谁将赢得下一届英雄联盟S赛冠军？',
    league: 'Esports',
    image: 'https://picsum.photos/id/1078/800/600',
    endDate: '2024/11/02 18:00',
    volume: 320000,
    isUserCreated: false,
    outcomes: [
      { 
        id: 'o_t1', label: 'T1', price: 30, odds: 2.85, betCount: 4200, betCountPercentage: 35, totalAmount: 96000, totalAmountPercentage: 30,
        image: 'https://ui-avatars.com/api/?name=T1&background=E50914&color=fff&size=128&bold=true'
      },
      { 
        id: 'o_gen', label: 'Gen.G', price: 25, odds: 3.33, betCount: 3050, betCountPercentage: 30, totalAmount: 80000, totalAmountPercentage: 25,
        image: 'https://ui-avatars.com/api/?name=GenG&background=AA8a00&color=fff&size=128&bold=true'
      },
      { 
        id: 'o_blg', label: 'BLG', price: 20, odds: 5.00, betCount: 2050, betCountPercentage: 20, totalAmount: 64000, totalAmountPercentage: 20,
        image: 'https://ui-avatars.com/api/?name=BLG&background=00A1D6&color=fff&size=128&bold=true'
      },
      { 
        id: 'o_other', label: '其他', price: 15, odds: 6.66, betCount: 1050, betCountPercentage: 10, totalAmount: 48000, totalAmountPercentage: 15,
        image: 'https://ui-avatars.com/api/?name=Other&background=333&color=fff&size=128&bold=true'
      },
      { 
        id: 'o_dk', label: 'DK', price: 10, odds: 8.50, betCount: 500, betCountPercentage: 5, totalAmount: 32000, totalAmountPercentage: 10,
        image: 'https://ui-avatars.com/api/?name=DK&background=007f7f&color=fff&size=128&bold=true'
      }
    ]
  },
  // 9. User (Bookmaker) - CS2 Major
  {
    id: 'user_new_2',
    title: '【庄家盘】CS2 Major: NAVI vs Faze',
    league: 'CS2 Major',
    image: 'https://picsum.photos/id/1079/800/600',
    endDate: '2024/12/10 04:00',
    volume: 8500,
    isUserCreated: true,
    createdBy: 'S1mple_Simp',
    bookmakerSideId: 'u2_o2', // Bookmaker backs Faze
    outcomes: [
      { 
        id: 'u2_o1', label: 'NAVI', price: 55, odds: 1.82, betCount: 320, betCountPercentage: 100, totalAmount: 3200, totalAmountPercentage: 45,
        image: 'https://ui-avatars.com/api/?name=NAVI&background=FFF200&color=000&size=128&bold=true'
      },
      { 
        id: 'u2_o2', label: 'Faze', price: 45, odds: 2.22, betCount: 1, betCountPercentage: 100, totalAmount: 4000, totalAmountPercentage: 55,
        image: 'https://ui-avatars.com/api/?name=Faze&background=E4322C&color=fff&size=128&bold=true',
        isBookmakerSide: true
      }
    ]
  },
  // 10. Official - Wimbledon
  {
    id: '5',
    title: '温布尔登：阿尔卡拉斯卫冕成功？',
    league: 'Wimbledon',
    image: 'https://picsum.photos/id/1077/800/600',
    endDate: '2024/07/14 14:00',
    volume: 150000,
    isUserCreated: false,
    isBookmarked: true,
    outcomes: [
      { 
        id: 'o9', label: '是 (Yes)', price: 40, odds: 2.50, betCount: 980, betCountPercentage: 35, totalAmount: 60000, totalAmountPercentage: 40,
        image: 'https://ui-avatars.com/api/?name=Yes&background=16a34a&color=fff&size=128&bold=true'
      },
      { 
        id: 'o10', label: '否 (No)', price: 60, odds: 1.67, betCount: 1820, betCountPercentage: 65, totalAmount: 90000, totalAmountPercentage: 60,
        image: 'https://ui-avatars.com/api/?name=No&background=dc2626&color=fff&size=128&bold=true'
      }
    ]
  },
  // 11. User (Bookmaker) - Basketball Player Prop
  {
    id: 'user_player_prop_1',
    title: '【庄家盘】勒布朗·詹姆斯 vs 斯蒂芬·库里 本场得分谁更高？',
    league: 'NBA Player Props',
    image: 'https://picsum.photos/id/1071/800/600',
    endDate: '2024/04/10 20:00',
    volume: 32000,
    isUserCreated: true,
    createdBy: 'KingJamesFan',
    bookmakerSideId: 'lbj_high', // Bookmaker backs LeBron
    outcomes: [
      { 
        id: 'lbj_high', label: '勒布朗·詹姆斯 (LeBron)', 
        price: 50, odds: 1.90, betCount: 1, betCountPercentage: 100, 
        totalAmount: 16000, totalAmountPercentage: 50, color: 'text-purple-600',
        isBookmakerSide: true
      },
      { 
        id: 'curry_high', label: '斯蒂芬·库里 (Curry)', 
        price: 50, odds: 1.90, betCount: 150, betCountPercentage: 100, 
        totalAmount: 16000, totalAmountPercentage: 50, color: 'text-blue-600'
      }
    ]
  },
  // 12. Official - MLB
  {
    id: '6_mlb',
    title: 'MLB: 扬基队 vs 红袜队',
    league: 'MLB',
    image: 'https://picsum.photos/id/1052/800/600',
    teamHomeImage: 'https://ui-avatars.com/api/?name=NYY&background=0C2340&color=fff&size=128&bold=true&length=3',
    teamAwayImage: 'https://ui-avatars.com/api/?name=BOS&background=BD3039&color=fff&size=128&bold=true&length=3',
    endDate: '2024/07/05 19:00',
    volume: 68000,
    isUserCreated: false,
    outcomes: [
      { 
        id: 'o_nyy', label: '扬基', price: 55, odds: 1.82, betCount: 1200, betCountPercentage: 60, totalAmount: 37400, totalAmountPercentage: 55, color: 'text-blue-900' 
      },
      { 
        id: 'o_bos', label: '红袜', price: 45, odds: 2.22, betCount: 800, betCountPercentage: 40, totalAmount: 30600, totalAmountPercentage: 45, color: 'text-red-700' 
      }
    ]
  },
  // 13. Official - Copa America
  {
    id: '7_copa',
    title: '美洲杯: 阿根廷 vs 加拿大',
    league: 'Copa America',
    image: 'https://picsum.photos/id/1040/800/600',
    teamHomeImage: 'https://ui-avatars.com/api/?name=ARG&background=75AADB&color=fff&size=128&bold=true&length=3',
    teamAwayImage: 'https://ui-avatars.com/api/?name=CAN&background=FF0000&color=fff&size=128&bold=true&length=3',
    endDate: '2024/06/20 20:00',
    volume: 420000,
    isUserCreated: false,
    outcomes: [
      { 
        id: 'o_arg', label: '阿根廷', price: 80, odds: 1.25, betCount: 5000, betCountPercentage: 85, totalAmount: 336000, totalAmountPercentage: 80, color: 'text-blue-400' 
      },
      { 
        id: 'o_can', label: '加拿大', price: 10, odds: 10.00, betCount: 500, betCountPercentage: 8, totalAmount: 42000, totalAmountPercentage: 10, color: 'text-red-600' 
      },
      { 
        id: 'o_draw_copa', label: '平局', price: 10, odds: 10.00, betCount: 400, betCountPercentage: 7, totalAmount: 42000, totalAmountPercentage: 10, color: 'text-gray-500' 
      }
    ]
  }
];

export const CATEGORIES = [
  { 
    id: SportCategory.ALL, 
    icon: '🏆', 
    count: 124 
  },
  { 
    id: SportCategory.FOOTBALL, // Swapped: Football first
    icon: '⚽', 
    count: 52,
    leagues: ['UEFA Euro 2024', 'Premier League', 'La Liga', 'Serie A', 'Copa America', 'Champions League', '其它'] 
  },
  { 
    id: SportCategory.BASKETBALL, // Swapped: Basketball second
    icon: '🏀', 
    count: 45,
    leagues: ['NBA', 'EuroLeague', 'CBA', 'NBA Futures', 'NBA Player Props', '其它'] 
  },
  { 
    id: SportCategory.TENNIS, 
    icon: '🎾', 
    count: 12,
    leagues: ['Wimbledon', 'US Open', 'Roland Garros', 'Aus Open', '其它'] 
  },
  { 
    id: SportCategory.BASEBALL, 
    icon: '⚾', 
    count: 8,
    leagues: ['MLB', 'NPB', '其它'] 
  },
  { 
    id: SportCategory.ESPORTS, 
    icon: '🎮', 
    count: 7,
    leagues: ['Esports', 'LPL', 'LCK', 'CS2 Major', '其它'] 
  },
];
