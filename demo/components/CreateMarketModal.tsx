
import React, { useState, useEffect, useRef } from 'react';
import { X, Trophy, Coins, Calendar, Shield, Users, DollarSign, Target, CheckCircle2, ChevronDown, Plus, Trash2, Clock, Lock, ArrowRight, AlertTriangle, ClipboardList, Ban, Lightbulb, ChevronUp, Image as ImageIcon, UploadCloud, Layers, Info, Wallet, Sparkles, ArrowUpDown, Scale, Hash, Minus, Timer } from 'lucide-react';
import { Market, User } from '../types';

interface CreateMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (marketData: Partial<Market>) => void;
  onRecharge?: () => void;
  user: User | null;
}

type MainCategory = 'SPORTS' | 'CRYPTO';
type MarketMode = 'STANDARD' | 'BOOKMAKER';
type PlayCategoryType = 'FUN' | 'OU' | 'HDP' | 'CS';

// Mock Data
const MOCK_LEAGUES = [
    { id: 'nba', label: 'NBA (美国职业篮球联赛)', sport: 'basketball' },
    { id: 'premier_league', label: '英超 (Premier League)', sport: 'football' },
    { id: 'euro_2024', label: '欧洲杯 (UEFA Euro 2024)', sport: 'football' },
    { id: 'lpl', label: 'LPL (英雄联盟职业联赛)', sport: 'esports' },
    { id: 'mlb', label: 'MLB (美职棒)', sport: 'baseball' },
    { id: 'wimbledon', label: '温网 (Wimbledon)', sport: 'tennis' },
    { id: 'general_volleyball', label: '国际排球 (International)', sport: 'volleyball' },
];

// Mock Teams for Champion Mode
const LEAGUE_TEAMS: Record<string, string[]> = {
    'nba': ['凯尔特人', '独行侠', '森林狼', '掘金', '雷霆', '快船', '尼克斯', '步行者', '湖人', '勇士', '热火', '雄鹿'],
    'premier_league': ['曼城', '阿森纳', '利物浦', '维拉', '热刺', '切尔西', '纽卡斯尔', '曼联', '西汉姆', '水晶宫'],
    'euro_2024': ['英格兰', '法国', '德国', '葡萄牙', '西班牙', '意大利', '荷兰', '比利时', '克罗地亚', '丹麦', '土耳其'],
    'lpl': ['BLG', 'TES', 'JDG', 'NIP', 'LNG', 'FPX', 'WBG', 'OMG', 'WE', 'IG'],
    'mlb': ['道奇', '扬基', '费城人', '勇士', '金莺', '守护者', '酿酒人', '水手', '双城', '皇家'],
    'wimbledon': ['阿尔卡拉斯', '德约科维奇', '辛纳', '兹维列夫', '梅德韦杰夫', '胡尔卡奇', '德米纳尔', '鲁德'],
    'general_volleyball': ['中国', '巴西', '美国', '意大利', '塞尔维亚', '土耳其', '波兰', '多米尼加']
};

const MOCK_MATCHES: Record<string, Array<{id: string, name: string, teamA: string, teamB: string, date: string}>> = {
    'nba': [
        { id: 'm1', name: '凯尔特人 vs 独行侠', teamA: '凯尔特人', teamB: '独行侠', date: '2024-06-20' },
        { id: 'm2', name: '湖人 vs 勇士', teamA: '湖人', teamB: '勇士', date: '2024-06-22' },
        { id: 'm3', name: '掘金 vs 森林狼', teamA: '掘金', teamB: '森林狼', date: '2024-06-25' },
    ],
    'premier_league': [
        { id: 'm4', name: '曼城 vs 阿森纳', teamA: '曼城', teamB: '阿森纳', date: '2024-05-15' },
        { id: 'm5', name: '利物浦 vs 曼联', teamA: '利物浦', teamB: '曼联', date: '2024-05-18' },
    ],
    'lpl': [
        { id: 'm6', name: 'BLG vs T1', teamA: 'BLG', teamB: 'T1', date: '2024-11-02' },
        { id: 'm7', name: 'TES vs GEN', teamA: 'TES', teamB: 'GEN', date: '2024-10-28' },
    ],
    'euro_2024': [
        { id: 'm8', name: '德国 vs 苏格兰', teamA: '德国', teamB: '苏格兰', date: '2024-06-15' },
        { id: 'm9', name: '西班牙 vs 克罗地亚', teamA: '西班牙', teamB: '克罗地亚', date: '2024-06-16' },
    ],
    'mlb': [
         { id: 'm10', name: '扬基 vs 红袜', teamA: '扬基', teamB: '红袜', date: '2024-07-05' },
    ],
    'wimbledon': [
         { id: 'm11', name: '阿尔卡拉斯 vs 德约科维奇', teamA: '阿尔卡拉斯', teamB: '德约科维奇', date: '2024-07-14' },
    ],
    'general_volleyball': [
         { id: 'm12', name: '中国女排 vs 巴西女排', teamA: '中国', teamB: '巴西', date: '2024-08-01' },
    ]
};

const FUN_TEMPLATES = [
    { 
        id: 'champion', 
        name: '冠军预测 (Champion)', 
        rule: '哪支队伍会获胜/夺冠？', 
        defaultOutcomes: [], 
        allowAddRemove: false, 
        readonlyOptions: true 
    },
    { 
        id: 'first_score', 
        name: '获得首分 (First Score)', 
        rule: '哪支队伍/选手将获得本场比赛的第一分？', 
        defaultOutcomes: ['主队', '客队'], 
        allowAddRemove: false, 
        readonlyOptions: false 
    },
    { 
        id: 'mvp', 
        name: '全场MVP (MVP)', 
        rule: '谁将当选本场比赛的MVP？', 
        defaultOutcomes: ['球员A', '球员B', '其他'], 
        allowAddRemove: true, 
        readonlyOptions: false 
    },
    { 
        id: 'score_odd_even', 
        name: '比分单双 (Odd/Even)', 
        rule: '全场比赛总得分是单数还是双数？', 
        defaultOutcomes: ['单数 (Odd)', '双数 (Even)'], 
        allowAddRemove: false, 
        readonlyOptions: true 
    },
    { 
        id: 'first_blood', 
        name: '一血 (First Blood)', 
        rule: '哪支队伍将获得第一滴血？', 
        defaultOutcomes: ['主队', '客队'], 
        allowAddRemove: false, 
        readonlyOptions: false 
    },
];

const SPORT_TYPES = [
  { id: 'football', label: '足球', icon: '⚽' },
  { id: 'basketball', label: '篮球', icon: '🏀' },
  { id: 'tennis', label: '网球', icon: '🎾' },
  { id: 'baseball', label: '棒球', icon: '⚾' },
  { id: 'esports', label: '电竞', icon: '🎮' },
  { id: 'volleyball', label: '排球', icon: '🏐' },
];

const PRESET_IMAGES = [
    'https://picsum.photos/id/1058/800/600',
    'https://picsum.photos/id/1060/800/600',
    'https://picsum.photos/id/147/800/600',
    'https://picsum.photos/id/175/800/600',
    'https://picsum.photos/id/1031/800/600',
    'https://picsum.photos/id/1033/800/600',
    'https://picsum.photos/id/1015/800/600',
    'https://picsum.photos/id/1016/800/600',
    'https://picsum.photos/id/1050/800/600',
    'https://picsum.photos/id/1047/800/600',
];

const MATCH_SCOPES = [
    { id: 'FULL', label: '全场' },
    { id: 'HALF1', label: '上半场' },
    { id: 'HALF2', label: '下半场' },
];

interface FunGroup {
    id: string;
    category: PlayCategoryType; 
    templateId: string;
    scopeId: string; 
    question: string;
    outcomes: string[];
    liquidity: number;
    bookmakerIndex: number;
    paramValue?: number;
    handicapSide?: 'HOME' | 'AWAY';
    lockedCount?: number; 
}

export const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ isOpen, onClose, onSubmit, onRecharge, user }) => {
  // Form State
  const [mainCategory, setMainCategory] = useState<MainCategory>('SPORTS');
  const [sportType, setSportType] = useState<string>('football');
  
  // Selection State
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [isCustomMatch, setIsCustomMatch] = useState(false);
  const [isChampionMode, setIsChampionMode] = useState(false);

  // Core Data
  const [customMatchName, setCustomMatchName] = useState('');
  const [teams, setTeams] = useState<string[]>(['', '']); 
  
  // Multi-Group Fun Mode Configs (Now effectively Single Group)
  const [funGroups, setFunGroups] = useState<FunGroup[]>([]);

  const [marketMode, setMarketMode] = useState<MarketMode>('BOOKMAKER'); 
  const [standardLiquidity, setStandardLiquidity] = useState<number>(1000); 
  const [endDate, setEndDate] = useState('');

  // Image
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI State
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isBalanceError, setIsBalanceError] = useState(false); 

  // Calculate Total Liquidity 
  const totalLiquidity = funGroups.reduce((acc, g) => acc + (g.liquidity || 0), 0);
  const userBalance = user?.balance || 0;

  // Min Liquidity validation
  const MIN_LIQUIDITY_PER_GROUP = 1000;

  // Helper
  const formatSigned = (val: number) => val > 0 ? `+${val}` : `${val}`;

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setMainCategory('SPORTS');
      setSportType('football');
      // Initialize League
      const footballLeagues = MOCK_LEAGUES.filter(l => l.sport === 'football');
      if (footballLeagues.length > 0) handleLeagueChange(footballLeagues[0].id);
      
      // Initialize with ONE default group
      const defaultTemplate = FUN_TEMPLATES.find(t => t.id === 'mvp') || FUN_TEMPLATES[0];

      setFunGroups([{ 
          id: `g_${Date.now()}`, 
          category: 'FUN',
          templateId: defaultTemplate.id, 
          scopeId: 'FULL', 
          question: defaultTemplate.rule, 
          outcomes: [...defaultTemplate.defaultOutcomes], 
          liquidity: 1000,
          bookmakerIndex: 0,
          handicapSide: 'HOME',
          lockedCount: 0
      }]);

      setMarketMode('BOOKMAKER'); 
      setStandardLiquidity(1000);
      setShowConfirmation(false);
      setErrorMessage('');
      setIsBalanceError(false);
      setSelectedImage(PRESET_IMAGES[0]);
      setIsChampionMode(false);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const pad = (n: number) => n < 10 ? '0' + n : n;
      const year = tomorrow.getFullYear();
      const month = pad(tomorrow.getMonth() + 1);
      const day = pad(tomorrow.getDate());
      setEndDate(`${year}-${month}-${day}T23:59`);
    }
  }, [isOpen]);

  // Error Message Auto-Dismiss
  useEffect(() => {
    if (errorMessage) {
        const timer = setTimeout(() => {
             setErrorMessage('');
             setIsBalanceError(false);
        }, 5000);
        return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const filteredLeagues = MOCK_LEAGUES.filter(l => l.sport === sportType);

  const resetMatchData = () => {
    setSelectedLeagueId('');
    setSelectedMatchId('');
    setIsCustomMatch(false);
    setIsChampionMode(false);
    setCustomMatchName('');
    setTeams(['', '']);
  };

  const handleSportChange = (sportId: string) => {
      setSportType(sportId);
      const leagues = MOCK_LEAGUES.filter(l => l.sport === sportId);
      if (leagues.length > 0) {
          handleLeagueChange(leagues[0].id);
      } else {
          resetMatchData();
      }
      setFunGroups(prev => prev.map(g => ({...g, scopeId: 'FULL'})));
  };

  const handleLeagueChange = (leagueId: string) => {
      setSelectedLeagueId(leagueId);
      setSelectedMatchId('');
      setIsCustomMatch(false);
      setIsChampionMode(false);
      setCustomMatchName('');
      setTeams(['', '']);
  };

  const handleMatchChange = (matchId: string) => {
      if (matchId === 'custom_match') {
          return;
      }

      // Handle Champion Mode
      if (matchId === 'champion') {
          setIsChampionMode(true);
          setSelectedMatchId('champion');
          const leagueLabel = MOCK_LEAGUES.find(l => l.id === selectedLeagueId)?.label.split(' ')[0] || '';
          setCustomMatchName(`${leagueLabel} 冠军预测`);
          
          // Get teams for this league
          const leagueTeams = LEAGUE_TEAMS[selectedLeagueId] || ['队伍 1', '队伍 2', '队伍 3'];
          setTeams(leagueTeams);

          // Auto-setup Fun Group for Champion (Replace existing)
          setFunGroups([{ 
              id: `g${Date.now()}`, 
              category: 'FUN',
              templateId: 'champion', 
              scopeId: 'FULL', 
              question: '哪支队伍会获胜/夺冠？', 
              outcomes: leagueTeams, 
              liquidity: 1000,
              bookmakerIndex: 0,
              handicapSide: 'HOME',
              lockedCount: 0
          }]);
          return;
      }

      // Standard Match Selection
      setIsChampionMode(false);
      const match = MOCK_MATCHES[selectedLeagueId]?.find(m => m.id === matchId);
      if (match) {
          setIsCustomMatch(false);
          setSelectedMatchId(matchId);
          setCustomMatchName(match.name);
          setTeams([match.teamA, match.teamB]);
          setEndDate(`${match.date}T23:59`);
      } else {
          setSelectedMatchId('');
          setCustomMatchName('');
          setTeams(['', '']);
      }
  };

  const handleTeamChange = (index: number, value: string) => {
      const newTeams = [...teams];
      newTeams[index] = value;
      setTeams(newTeams);

      // If in Champion mode, sync changes to the Fun Group outcomes
      if (isChampionMode && funGroups.length > 0) {
          const newGroups = [...funGroups];
          // Assume the first group is the champion group
          const newOutcomes = [...newGroups[0].outcomes];
          newOutcomes[index] = value;
          newGroups[0].outcomes = newOutcomes;
          setFunGroups(newGroups);
      }
  };

  // Helper to find index in main array by ID
  const findGroupIndex = (id: string) => funGroups.findIndex(g => g.id === id);

  const updateFunGroup = (id: string, field: keyof FunGroup, value: any) => {
      const index = findGroupIndex(id);
      if (index === -1) return;
      const newGroups = [...funGroups];
      newGroups[index] = { ...newGroups[index], [field]: value };
      setFunGroups(newGroups);
  };

  const updateFunGroupOutcome = (groupId: string, outcomeIndex: number, val: string) => {
      // In Champion Mode, outcomes are read-only in the Rules section (synced from Teams)
      const index = findGroupIndex(groupId);
      if (index === -1) return;
      const group = funGroups[index];
      if (group.templateId === 'champion') return;

      const newGroups = [...funGroups];
      const newOutcomes = [...newGroups[index].outcomes];
      newOutcomes[outcomeIndex] = val;
      newGroups[index].outcomes = newOutcomes;
      setFunGroups(newGroups);
  };

  const addOutcomeToGroup = (groupId: string) => {
      const index = findGroupIndex(groupId);
      if (index === -1) return;
      
      const newGroups = [...funGroups];
      // For CS, default to 0-0 or empty
      const defaultVal = newGroups[index].category === 'CS' ? '0-0' : `选项 ${newGroups[index].outcomes.length + 1}`;
      newGroups[index].outcomes.push(defaultVal);
      setFunGroups(newGroups);
  };

  const removeOutcomeFromGroup = (groupId: string, outcomeIndex: number) => {
      const index = findGroupIndex(groupId);
      if (index === -1) return;

      const newGroups = [...funGroups];
      if (newGroups[index].outcomes.length <= 2) return;
      newGroups[index].outcomes = newGroups[index].outcomes.filter((_, i) => i !== outcomeIndex);
      // Reset index if out of bounds
      if (newGroups[index].bookmakerIndex >= newGroups[index].outcomes.length) {
          newGroups[index].bookmakerIndex = 0;
      }
      setFunGroups(newGroups);
  };

  const applyTemplateToGroup = (groupId: string, templateId: string) => {
      const index = findGroupIndex(groupId);
      if (index === -1) return;
      const template = FUN_TEMPLATES.find(t => t.id === templateId);
      if (template) {
          const newGroups = [...funGroups];
          newGroups[index].templateId = templateId;
          newGroups[index].question = template.id === 'custom' ? '' : template.rule;
          newGroups[index].outcomes = [...template.defaultOutcomes];
          newGroups[index].bookmakerIndex = 0;
          setFunGroups(newGroups);
      }
  };

  // Helper to get scope text for Question generation
  const getScopeLabel = (scopeId: string) => {
      return MATCH_SCOPES.find(s => s.id === scopeId)?.label || '全场';
  };

  const handleScopeChange = (groupId: string, newScope: string) => {
      const index = findGroupIndex(groupId);
      if (index === -1) return;
      const newGroups = [...funGroups];
      const group = newGroups[index];
      
      group.scopeId = newScope;

      // Constraint: If CS (Correct Score) is selected but scope is NOT Full, switch to FUN (Default)
      if (group.category === 'CS' && newScope !== 'FULL') {
          group.category = 'FUN';
          const defaultTemplate = FUN_TEMPLATES[0];
          group.templateId = defaultTemplate.id;
          group.outcomes = [...defaultTemplate.defaultOutcomes];
          group.lockedCount = 0;
          group.bookmakerIndex = 0;
      }

      // Re-generate question based on new scope
      regenerateQuestion(group);
      
      setFunGroups(newGroups);
  };

  const changeGroupCategory = (groupId: string, newCategory: PlayCategoryType) => {
      const index = findGroupIndex(groupId);
      if (index === -1) return;
      
      const newGroups = [...funGroups];
      const group = newGroups[index];
      group.category = newCategory;
      group.bookmakerIndex = 0; // Reset bookmaker
      group.handicapSide = 'HOME'; // Reset HDP side
      group.lockedCount = 0; // Reset Locked

      if (newCategory === 'FUN') {
          const defaultTemplate = FUN_TEMPLATES[0];
          group.templateId = defaultTemplate.id;
          group.outcomes = [...defaultTemplate.defaultOutcomes];
      } else if (newCategory === 'OU') {
          // Over / Under
          const val = 0.5;
          group.paramValue = val;
          group.outcomes = [`大 (Over) ${val}`, `小 (Under) ${val}`];
      } else if (newCategory === 'HDP') {
          // Handicap
          const val = 0.5;
          group.paramValue = val;
          const homeName = teams[0] || '主队';
          const awayName = teams[1] || '客队';
          // Default HOME give points
          group.outcomes = [`${homeName} (${val})`, `${awayName} (${-val})`];
      } else if (newCategory === 'CS') {
          // Correct Score (Final Score)
          group.outcomes = ['1-0', '0-1', '1-1'];
          group.lockedCount = 3; // Lock the first 3
      }
      
      regenerateQuestion(group);
      setFunGroups(newGroups);
  };

  const handleParamChange = (groupId: string, val: number) => {
      const index = findGroupIndex(groupId);
      if (index === -1) return;
      const newGroups = [...funGroups];
      const group = newGroups[index];
      group.paramValue = val;

      const homeName = teams[0] || '主队';
      const awayName = teams[1] || '客队';

      if (group.category === 'OU') {
          group.outcomes = [`大 (Over) ${val}`, `小 (Under) ${val}`];
      } else if (group.category === 'HDP') {
          // Re-evaluate based on handicapSide
          const isHomeGiving = group.handicapSide !== 'AWAY';
          if (isHomeGiving) {
              group.outcomes = [`${homeName} (${val})`, `${awayName} (${-1 * val})`];
          } else {
               group.outcomes = [`${awayName} (${val})`, `${homeName} (${-1 * val})`];
          }
      }
      regenerateQuestion(group);
      setFunGroups(newGroups);
  }

  const handleHandicapSideChange = (groupId: string, side: 'HOME' | 'AWAY') => {
      const index = findGroupIndex(groupId);
      if (index === -1) return;
      
      const newGroups = [...funGroups];
      const group = newGroups[index];
      group.handicapSide = side;
      group.bookmakerIndex = side === 'HOME' ? 0 : 1; 
      
      const val = group.paramValue || 0.5;
      const homeName = teams[0] || '主队';
      const awayName = teams[1] || '客队';
      
      if (side === 'HOME') {
           group.outcomes = [`${homeName} (${val})`, `${awayName} (${-1 * val})`];
      } else {
           group.outcomes = [`${awayName} (${val})`, `${homeName} (${-1 * val})`];
      }
      
      regenerateQuestion(group);
      setFunGroups(newGroups);
  };

  // Helper to unify Question Generation
  const regenerateQuestion = (group: FunGroup) => {
      const scopeText = getScopeLabel(group.scopeId);
      const val = group.paramValue || 0.5;

      if (group.category === 'OU') {
          group.question = `${scopeText}总得分 是否大于 ${val}?`;
      } else if (group.category === 'HDP') {
          if (group.handicapSide === 'HOME') {
              group.question = `${scopeText}让分盘 (主队 ${val}): 谁赢?`;
          } else {
              group.question = `${scopeText}让分盘 (客队 ${val}): 谁赢?`;
          }
      } else if (group.category === 'CS') {
          group.question = `${scopeText}准确比分是多少?`;
      } else if (group.category === 'FUN') {
          // Keep template rule or generic if custom
          const template = FUN_TEMPLATES.find(t => t.id === group.templateId);
          if (template) {
               // If template rule doesn't have scope, prepend it (simple heuristic)
               if (!template.rule.includes('全场') && !template.rule.includes('上半场')) {
                   // Some templates like 'First Blood' might differ, but for MVP/Winner it works
                   group.question = template.rule; 
               } else {
                   group.question = template.rule;
               }
          } else {
              group.question = `${scopeText} 结果预测`;
          }
      }
  };

  const fixHalfInteger = (val: number) => {
      const intPart = Math.floor(val);
      return intPart + 0.5;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setSelectedImage(reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  // Generate Market Config
  const getMarketConfig = () => {
    const finalTeams = teams.map((t, i) => t || `队伍 ${i + 1}`);
    const baseMatchName = isCustomMatch ? (customMatchName || finalTeams.join(' vs ')) : customMatchName;
    
    let generatedTitle = baseMatchName;
    let generatedOutcomes: { label: string; id: string; groupName?: string }[] = [];
    let bookmakerOutcomeIds: string[] = [];
    let mainBookmakerOutcomeId: string | undefined = undefined;

    // Only process the first group since we now enforce single-group
    const group = funGroups[0];
    if (group) {
        // If question is present and it's not the default "Winner" type question, maybe append it to title or treat as subtitle?
        // For simplicity, we just use the outcomes directly under the main title.
        const gName = group.question || `玩法规则`;
        
        group.outcomes.forEach((outLabel, oIdx) => {
            const oId = `o${oIdx}`; // Simple IDs
            generatedOutcomes.push({
                label: outLabel || `选项 ${oIdx+1}`,
                id: oId,
                groupName: gName
            });
            
            if (marketMode === 'BOOKMAKER') {
                    if (oIdx === group.bookmakerIndex) {
                        bookmakerOutcomeIds.push(oId);
                        mainBookmakerOutcomeId = oId;
                    }
            }
        });
    }

    const leagueLabel = MOCK_LEAGUES.find(l => l.id === selectedLeagueId)?.label || sportType.toUpperCase();

    return {
        title: generatedTitle,
        league: leagueLabel.split(' ')[0],
        outcomes: generatedOutcomes,
        bookmakerOutcomeIds, 
        mainBookmakerOutcomeId 
    };
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsBalanceError(false);
    
    if (funGroups.length === 0) {
        setErrorMessage("请配置玩法。");
        return;
    }

    const invalidGroup = funGroups.find(g => g.liquidity < MIN_LIQUIDITY_PER_GROUP);
    if (invalidGroup) {
        setErrorMessage(`流动性最低为 ${MIN_LIQUIDITY_PER_GROUP} U。`);
        return;
    }
    
    if (totalLiquidity > userBalance) {
        setErrorMessage(`您的余额不足 (${userBalance.toFixed(2)} U)，需 ${totalLiquidity.toFixed(2)} U。`);
        setIsBalanceError(true);
        return;
    }

    if (funGroups.some(g => !g.question.trim())) {
        setErrorMessage("请填写玩法规则描述。");
        return;
    }

    if (teams.some(t => !t.trim())) {
        setErrorMessage("请完整输入所有队伍名称或选择比赛。");
        return;
    }
    if (!selectedImage) {
        setErrorMessage("请选择一张市场封面图片。");
        return;
    }

    setShowConfirmation(true);
  };

  const handleFinalConfirm = () => {
    const config = getMarketConfig();
    
    const formattedEndDate = endDate.replace('T', ' ').replace(/-/g, '/');

    const newMarket: Partial<Market> = {
        title: config.title,
        league: config.league,
        endDate: formattedEndDate,
        volume: totalLiquidity,
        isUserCreated: true,
        createdBy: user?.username || '我 (当前用户)',
        image: selectedImage,
        bookmakerSideId: config.mainBookmakerOutcomeId, 
        outcomes: config.outcomes.map((o) => {
             // Extract group index to find specific liquidity assignment
             let amount = 0;
             let isBookmakerForGroup = false;

             // Since we only have one group, check against funGroups[0]
             const group = funGroups[0];
             if (group) {
                 const oIdx = parseInt(o.id.replace('o',''));
                 isBookmakerForGroup = (oIdx === group.bookmakerIndex);
                 if (isBookmakerForGroup) {
                    amount = group.liquidity;
                 }
             }

             const isLocked = config.bookmakerOutcomeIds.includes(o.id);
             const percentage = totalLiquidity > 0 ? Math.floor((amount / totalLiquidity) * 100) : 0;

             return {
                id: o.id,
                label: o.label,
                groupName: o.groupName,
                price: 50,
                odds: 2.0, 
                betCount: isLocked ? 1 : 0, 
                betCountPercentage: isLocked ? 100 : 0,
                totalAmount: amount, 
                totalAmountPercentage: percentage,
                color: 'text-blue-600',
                isBookmakerSide: isLocked,
                myPosition: isLocked ? amount : 0
            }
        })
    };

    onSubmit(newMarket);
    setShowConfirmation(false);
    setTimeout(() => {
        alert("创建成功！市场已上线。");
        onClose();
    }, 100);
  };

  // Only use the first group
  const activeGroup = funGroups[0];

  if (!isOpen) return null;
  const confirmationConfig = showConfirmation ? getMarketConfig() : null;

  return (
    <>
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl transform transition-all flex flex-col max-h-[95vh] overflow-hidden relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10 relative">
          <div>
            <h2 className="text-lg font-black text-gray-900 leading-tight">创建预测市场</h2>
            <p className="text-xs text-gray-500 font-medium">配置赛事信息与做市规则</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Toast */}
        {errorMessage && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2 fade-in duration-300 w-max max-w-[90%]">
                <div className="bg-red-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-red-500/20 flex items-start gap-3">
                    <div className="bg-white/20 p-1 rounded-full mt-0.5 shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5 fill-white text-red-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-xs sm:text-sm">{errorMessage}</span>
                        {isBalanceError && onRecharge && (
                            <button 
                                onClick={() => {
                                    onRecharge();
                                }}
                                className="self-start px-3 py-1 bg-white text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1 shadow-sm"
                            >
                                <Wallet className="w-3 h-3" />
                                立即充值 &rarr;
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          <form id="create-market-form" onSubmit={handlePreSubmit} className="flex flex-col">
            
            {/* SECTION 1: Event Information */}
            <div className="bg-white px-6 py-6 pb-8 border-b border-gray-100 shadow-sm space-y-6">
                
                {/* 1. Market Category & Sport Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">市场选择</label>
                        <div className="flex bg-gray-100 rounded-lg p-0.5 w-fit">
                            <button type="button" onClick={() => setMainCategory('SPORTS')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${mainCategory === 'SPORTS' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>体育赛事</button>
                            <button type="button" className="px-4 py-1.5 text-xs font-bold rounded-md transition-all text-gray-300 cursor-not-allowed">加密货币</button>
                        </div>
                    </div>
                </div>

                {/* Sport Type Icons */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {SPORT_TYPES.map(type => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => handleSportChange(type.id)}
                            className={`group flex flex-col items-center gap-2 px-4 py-3 rounded-2xl min-w-[80px] transition-all border ${sportType === type.id ? 'bg-gray-900 text-white border-gray-900 shadow-lg' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">{type.icon}</span>
                            <span className="text-xs font-bold">{type.label}</span>
                        </button>
                    ))}
                </div>

                {/* League & Match */}
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1.5 block ml-1">所属联赛</label>
                        <div className="relative">
                            <select value={selectedLeagueId} onChange={(e) => handleLeagueChange(e.target.value)} className="w-full appearance-none bg-gray-50 border-0 text-gray-900 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold">
                                {filteredLeagues.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1.5 block ml-1">赛事名称</label>
                        <div className="relative">
                            <select value={selectedMatchId} onChange={(e) => handleMatchChange(e.target.value)} className="w-full appearance-none bg-gray-50 border-0 text-gray-900 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold">
                                <option value="">-- 选择赛事 --</option>
                                <option value="champion">🏆 谁是冠军 (Who is Champion)</option>
                                {MOCK_MATCHES[selectedLeagueId]?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Teams Display - Dynamic Grid based on count */}
                <div>
                     <div className="flex justify-between items-center mb-1.5 ml-1">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{isChampionMode ? '参赛队伍 (支持编辑)' : '对阵队伍'}</label>
                         {isChampionMode && <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">冠军模式: 自动加载 {teams.length} 支队伍</span>}
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm relative overflow-hidden">
                        <div className={`grid gap-4 relative z-10 ${teams.length > 2 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-2'}`}>
                            {teams.map((team, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shadow-sm shrink-0 ${index % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>{index + 1}</div>
                                    <input 
                                        type="text" 
                                        placeholder={`队伍 ${index + 1}`} 
                                        value={team} 
                                        readOnly={!isCustomMatch && !isChampionMode} 
                                        onChange={(e) => handleTeamChange(index, e.target.value)} 
                                        className={`w-full bg-transparent border-b border-gray-200 py-1.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-blue-500 transition-colors ${!isCustomMatch && !isChampionMode ? 'cursor-not-allowed text-gray-600' : ''}`} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div>
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">市场封面</label>
                     <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                         <div className="sm:col-span-1 aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group">
                             <img src={selectedImage} alt="Cover" className="w-full h-full object-cover" />
                         </div>
                         <div className="sm:col-span-3 space-y-3">
                             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                {PRESET_IMAGES.map((img, idx) => (
                                    <button key={idx} type="button" onClick={() => setSelectedImage(img)} className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-blue-600' : 'border-transparent opacity-70'}`}>
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                             </div>
                             <div className="flex items-center gap-3">
                                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                 <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200"><UploadCloud className="w-4 h-4" /> 上传图片</button>
                             </div>
                         </div>
                     </div>
                </div>
            </div>

            {/* SECTION 2: Rules (Single Group) */}
            <div className="px-6 py-8 space-y-8">
                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase">
                        <Target className="w-4 h-4 text-blue-600" />
                        预测玩法规则
                    </h3>
                    
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm space-y-5">
                        
                        {/* Editor for the Single Group */}
                        {activeGroup && (
                            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 p-4 relative group">
                                <div className="flex flex-col gap-3 mb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-1.5 py-0.5 rounded">
                                                核心玩法
                                            </span>
                                        </div>
                                        
                                        {/* Scope Selector (Full/Half) */}
                                        <div className="flex bg-gray-100 rounded-lg p-0.5">
                                            {MATCH_SCOPES.map(scope => (
                                                <button
                                                    key={scope.id}
                                                    type="button"
                                                    disabled={isChampionMode && scope.id !== 'FULL'}
                                                    onClick={() => handleScopeChange(activeGroup.id, scope.id)}
                                                    className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-[10px] font-bold transition-all ${activeGroup.scopeId === scope.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'} ${isChampionMode && scope.id !== 'FULL' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {scope.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Category Tabs */}
                                    <div className="flex bg-gray-100 rounded-lg p-0.5 self-start">
                                        {[
                                            { id: 'FUN', label: '趣味', icon: Sparkles },
                                            { id: 'OU', label: '大小', icon: ArrowUpDown },
                                            { id: 'HDP', label: '让分', icon: Scale },
                                            { id: 'CS', label: '波胆 (比分)', icon: Hash },
                                        ]
                                        .filter(cat => {
                                            if (isChampionMode) return cat.id === 'FUN';
                                            // Hide Correct Score if scope is not FULL
                                            if (activeGroup.scopeId !== 'FULL' && cat.id === 'CS') return false;
                                            return true;
                                        })
                                        .map(cat => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => changeGroupCategory(activeGroup.id, cat.id as PlayCategoryType)}
                                                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-[10px] font-bold transition-all ${activeGroup.category === cat.id ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                <cat.icon className="w-3 h-3" />
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Top Control Bar based on Category */}
                                    {activeGroup.category === 'FUN' && (
                                        <select 
                                            className={`w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-purple-500/20 ${isChampionMode ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                                            value={activeGroup.templateId}
                                            onChange={(e) => applyTemplateToGroup(activeGroup.id, e.target.value)}
                                            disabled={isChampionMode}
                                        >
                                            {FUN_TEMPLATES.filter(t => isChampionMode || t.id !== 'champion').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    )}

                                    {/* OU Specific Layout */}
                                    {activeGroup.category === 'OU' && (
                                        <div className="flex gap-4">
                                            <div className="flex-1 flex flex-col gap-2">
                                                <div className="border border-gray-400 rounded p-4 flex justify-center items-center text-sm font-bold text-gray-800 bg-white">
                                                    大 (Over) {Math.ceil(activeGroup.paramValue || 0.5)}
                                                </div>
                                                <div className="border border-gray-400 rounded p-4 flex justify-center items-center text-sm font-bold text-gray-800 bg-white">
                                                    小 (Under) {Math.floor(activeGroup.paramValue || 0.5)}
                                                </div>
                                            </div>
                                            <div className="flex-1 border border-gray-400 rounded flex flex-col items-center justify-center p-4 bg-white">
                                                <div className="text-xs font-bold text-gray-900 mb-2">基准分</div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            let val = (activeGroup.paramValue || 0) - 1;
                                                            val = fixHalfInteger(val);
                                                            if (val < 0.5) val = 0.5;
                                                            handleParamChange(activeGroup.id, val);
                                                        }}
                                                        className="text-xl font-bold px-2"
                                                    >
                                                        <Minus className="w-5 h-5" />
                                                    </button>
                                                    <div className="border border-gray-400 px-4 py-2 text-sm font-bold min-w-[80px] text-center">
                                                        {activeGroup.paramValue}
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            let val = (activeGroup.paramValue || 0) + 1;
                                                            val = fixHalfInteger(val);
                                                            if (val < 0.5) val = 0.5;
                                                            handleParamChange(activeGroup.id, val);
                                                        }}
                                                        className="text-xl font-bold px-2"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* HDP Specific Layout */}
                                    {activeGroup.category === 'HDP' && (
                                        <div className="flex gap-4">
                                            <div className="flex-1 flex flex-col gap-2">
                                                <div className={`border rounded p-4 flex justify-between items-center bg-white cursor-pointer ${activeGroup.handicapSide === 'HOME' ? 'border-orange-400' : 'border-gray-400'}`} onClick={() => handleHandicapSideChange(activeGroup.id, 'HOME')}>
                                                    <span className="text-sm font-bold text-gray-800">
                                                        主队 ({formatSigned(activeGroup.handicapSide === 'HOME' ? (activeGroup.paramValue || 0) : -(activeGroup.paramValue || 0))})
                                                    </span>
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeGroup.handicapSide === 'HOME' ? 'border-orange-400 bg-orange-200' : 'border-gray-400'}`}>
                                                        {activeGroup.handicapSide === 'HOME' && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                                                    </div>
                                                </div>
                                                <div className={`border rounded p-4 flex justify-between items-center bg-white cursor-pointer ${activeGroup.handicapSide === 'AWAY' ? 'border-orange-400' : 'border-gray-400'}`} onClick={() => handleHandicapSideChange(activeGroup.id, 'AWAY')}>
                                                    <span className="text-sm font-bold text-gray-800">
                                                        客队 ({formatSigned(activeGroup.handicapSide === 'AWAY' ? (activeGroup.paramValue || 0) : -(activeGroup.paramValue || 0))})
                                                    </span>
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeGroup.handicapSide === 'AWAY' ? 'border-orange-400 bg-orange-200' : 'border-gray-400'}`}>
                                                        {activeGroup.handicapSide === 'AWAY' && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 border border-gray-400 rounded flex flex-col items-center justify-center p-4 bg-white">
                                                <div className="text-xs font-bold text-gray-900 mb-2">让分值</div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            let val = (activeGroup.paramValue || 0) - 1;
                                                            val = fixHalfInteger(val);
                                                            handleParamChange(activeGroup.id, val);
                                                        }}
                                                        className="text-xl font-bold px-2"
                                                    >
                                                        <Minus className="w-5 h-5" />
                                                    </button>
                                                    <div className="border border-gray-400 px-4 py-2 text-sm font-bold min-w-[80px] text-center">
                                                        {activeGroup.paramValue}
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            let val = (activeGroup.paramValue || 0) + 1;
                                                            val = fixHalfInteger(val);
                                                            handleParamChange(activeGroup.id, val);
                                                        }}
                                                        className="text-xl font-bold px-2"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Question Input */}
                                    {activeGroup.category === 'FUN' && (
                                        <input 
                                            type="text" 
                                            value={activeGroup.question}
                                            onChange={(e) => updateFunGroup(activeGroup.id, 'question', e.target.value)}
                                            placeholder="输入问题描述"
                                            readOnly={isChampionMode}
                                            className={`w-full bg-white border border-purple-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-purple-500/20 outline-none ${isChampionMode ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                                        />
                                    )}
                                    
                                    {/* Outcomes List */}
                                    {(activeGroup.category === 'FUN' || activeGroup.category === 'CS') && (
                                    <div className={`grid ${activeGroup.category === 'CS' ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                                        {activeGroup.outcomes.map((out, oIdx) => {
                                            const isCSInput = activeGroup.category === 'CS';
                                            const isLockedCS = activeGroup.category === 'CS' && oIdx < (activeGroup.lockedCount || 0);
                                            
                                            // Determine if can add/remove based on template
                                            const currentTemplate = FUN_TEMPLATES.find(t => t.id === activeGroup.templateId) || FUN_TEMPLATES[0];
                                            const canAddRemove = activeGroup.category === 'CS' || (activeGroup.category === 'FUN' && currentTemplate.allowAddRemove);
                                            const isReadOnly = isChampionMode || (activeGroup.category === 'FUN' && currentTemplate.readonlyOptions);

                                            return (
                                            <div key={oIdx} className="relative">
                                                {isCSInput ? (
                                                    <div className={`bg-white border rounded-xl p-2 flex items-center gap-2 shadow-sm ${isLockedCS ? 'bg-gray-50 border-gray-200' : 'border-gray-200'}`}>
                                                        <span className="text-[10px] font-bold text-gray-400 min-w-[24px]">比分</span>
                                                        <div className="flex flex-1 items-center gap-2">
                                                            <div className="flex-1 relative border border-gray-200 rounded-lg overflow-hidden flex items-center bg-white">
                                                                <span className="bg-gray-50 text-gray-400 px-2 text-[10px] font-bold py-1 border-r border-gray-200">主</span>
                                                                <input 
                                                                    type="number"
                                                                    min="0"
                                                                    readOnly={isLockedCS}
                                                                    className={`w-full text-center text-sm font-black text-gray-900 outline-none py-1 ${isLockedCS ? 'cursor-not-allowed bg-gray-50' : ''}`}
                                                                    value={out.split('-')[0] || '0'}
                                                                    onChange={(e) => {
                                                                        const newH = e.target.value;
                                                                        const currentA = out.split('-')[1] || '0';
                                                                        updateFunGroupOutcome(activeGroup.id, oIdx, `${newH}-${currentA}`);
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="font-black text-gray-300">:</span>
                                                            <div className="flex-1 relative border border-gray-200 rounded-lg overflow-hidden flex items-center bg-white">
                                                                <span className="bg-gray-50 text-gray-400 px-2 text-[10px] font-bold py-1 border-r border-gray-200">客</span>
                                                                    <input 
                                                                    type="number"
                                                                    min="0"
                                                                    readOnly={isLockedCS}
                                                                    className={`w-full text-center text-sm font-black text-gray-900 outline-none py-1 ${isLockedCS ? 'cursor-not-allowed bg-gray-50' : ''}`}
                                                                    value={out.split('-')[1] || '0'}
                                                                    onChange={(e) => {
                                                                        const currentH = out.split('-')[0] || '0';
                                                                        const newA = e.target.value;
                                                                        updateFunGroupOutcome(activeGroup.id, oIdx, `${currentH}-${newA}`);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* Bookmaker & Remove Buttons for CS */}
                                                        <div className="flex items-center gap-1 pl-2 border-l border-gray-100">
                                                            {marketMode === 'BOOKMAKER' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => updateFunGroup(activeGroup.id, 'bookmakerIndex', oIdx)}
                                                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${activeGroup.bookmakerIndex === oIdx ? 'bg-purple-600 border-purple-600' : 'border-gray-300 hover:border-purple-400'}`}
                                                                title="庄家立场"
                                                            >
                                                                {activeGroup.bookmakerIndex === oIdx && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                                            </button>
                                                            )}
                                                            {!isLockedCS && (
                                                                <button type="button" onClick={() => removeOutcomeFromGroup(activeGroup.id, oIdx)} className="text-gray-300 hover:text-red-500 p-1"><X className="w-3.5 h-3.5" /></button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <input 
                                                            value={out}
                                                            readOnly={isReadOnly}
                                                            onChange={(e) => updateFunGroupOutcome(activeGroup.id, oIdx, e.target.value)}
                                                            className={`w-full bg-white border rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-purple-400 ${marketMode === 'BOOKMAKER' && activeGroup.bookmakerIndex === oIdx ? 'border-purple-500 ring-1 ring-purple-500 bg-purple-50' : 'border-gray-200'} ${isReadOnly ? 'text-gray-500 bg-gray-50 cursor-not-allowed' : 'text-gray-900'}`}
                                                        />
                                                        {marketMode === 'BOOKMAKER' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => updateFunGroup(activeGroup.id, 'bookmakerIndex', oIdx)}
                                                                className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border ${activeGroup.bookmakerIndex === oIdx ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}
                                                                title="庄家立场"
                                                            />
                                                        )}
                                                        {canAddRemove && activeGroup.outcomes.length > 2 && (
                                                            <button type="button" onClick={() => removeOutcomeFromGroup(activeGroup.id, oIdx)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500"><X className="w-3 h-3" /></button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            )
                                        })}
                                        {(activeGroup.category === 'CS' || (activeGroup.category === 'FUN' && (FUN_TEMPLATES.find(t => t.id === activeGroup.templateId)?.allowAddRemove))) && (
                                            <button type="button" onClick={() => addOutcomeToGroup(activeGroup.id)} className="text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-200 border-dashed rounded-lg flex items-center justify-center gap-1 hover:bg-purple-100 py-2">
                                                <Plus className="w-3 h-3" /> 选项
                                            </button>
                                        )}
                                    </div>
                                    )}

                                    {/* Group Liquidity */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <label className="text-[10px] font-bold text-gray-400">初始流动性:</label>
                                        <div className="relative flex-1">
                                            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                            <input 
                                                type="number" 
                                                value={activeGroup.liquidity}
                                                onChange={(e) => updateFunGroup(activeGroup.id, 'liquidity', parseInt(e.target.value) || 0)}
                                                className={`w-full bg-white border rounded-lg pl-6 pr-2 py-1.5 text-xs font-black outline-none ${activeGroup.liquidity < MIN_LIQUIDITY_PER_GROUP ? 'border-red-300 text-red-500' : 'border-gray-200 text-gray-900'}`}
                                            />
                                        </div>
                                        {activeGroup.liquidity < MIN_LIQUIDITY_PER_GROUP && <span className="text-[9px] text-red-500 font-bold">Min {MIN_LIQUIDITY_PER_GROUP}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Settings Section */}
                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase"><Coins className="w-4 h-4 text-purple-600" /> 资金设置</h3>
                    
                    <div className="relative p-4 rounded-2xl border-2 text-left bg-white border-purple-600 shadow-lg shadow-purple-100 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-600 text-white shrink-0"><Shield className="w-4 h-4" /></div>
                        <div>
                            <div className="text-sm font-bold text-purple-900 mb-1">做庄模式 (Bookmaker)</div>
                            <div className="text-[10px] text-gray-400 font-medium leading-tight">锁定赔率与流动性，您作为庄家接受用户对赌</div>
                        </div>
                    </div>
                </div>
                
                {/* End Date */}
                <div>
                     <label className="text-xs font-bold text-gray-400 mb-1.5 block ml-1">截止时间</label>
                     <div className="relative">
                        <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={!isCustomMatch} className={`w-full bg-white border-0 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none shadow-sm pr-10 ${!isCustomMatch ? 'bg-gray-100 text-gray-500' : ''}`} />
                        {!isCustomMatch && <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
                    </div>
                </div>

            </div>

            {/* SECTION 4: Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                     <div className="w-full sm:flex-1">
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-bold text-gray-500">
                                总流动性 (自动计算)
                            </label>
                            {user && (
                                <span className="text-xs font-medium text-gray-400">
                                    余额: <span className={`${totalLiquidity > userBalance ? 'text-red-500' : 'text-gray-900'} font-bold`}>${userBalance.toFixed(2)}</span>
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><DollarSign className="w-5 h-5" /></div>
                            <input 
                                type="number" 
                                value={totalLiquidity}
                                readOnly
                                className={`w-full pl-10 pr-4 py-3.5 border rounded-2xl text-xl font-black focus:outline-none focus:ring-4 transition-all bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed ${totalLiquidity > userBalance ? 'border-red-200 bg-red-50 text-red-400' : ''}`}
                            />
                        </div>
                     </div>
                     <button type="submit" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold shadow-xl transition-transform active:scale-[0.98] flex items-center justify-center gap-2">
                        <Trophy className="w-5 h-5" /> 立即创建
                     </button>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    {/* Confirmation Modal */}
    {showConfirmation && confirmationConfig && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowConfirmation(false)}></div>
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-gray-900 px-8 py-6 text-white shrink-0 flex justify-between items-center">
                     <div>
                        <h3 className="text-xl font-black leading-none mb-1">确认创建盘口</h3>
                        <p className="text-gray-400 text-xs mt-1">请仔细核对您的做市信息，确认后将锁定流动性</p>
                     </div>
                     <button onClick={() => setShowConfirmation(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8 overflow-y-auto">
                    
                    {/* 1. Summary Card */}
                    <div className="flex gap-6 items-stretch">
                        <div className="w-32 aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 shadow-sm shrink-0">
                            <img src={selectedImage} className="w-full h-full object-cover" alt="Market" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-gray-100 text-gray-600 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-gray-200">{confirmationConfig.league}</span>
                                {marketMode === 'BOOKMAKER' && <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1"><Shield className="w-3 h-3" /> 做庄模式</span>}
                            </div>
                            <h4 className="text-lg font-black text-gray-900 leading-tight mb-3 line-clamp-2">{confirmationConfig.title}</h4>
                            <div className="flex items-center gap-4">
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold block">总流动性池</span>
                                    <span className="text-xl font-black text-gray-900 flex items-center gap-0.5"><span className="text-sm text-gray-400">$</span>{totalLiquidity.toLocaleString()}</span>
                                </div>
                                <div className="w-px h-8 bg-gray-100"></div>
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold block">结束时间</span>
                                    <span className="text-sm font-bold text-gray-700">{endDate.replace('T', ' ')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full"></div>

                    {/* 2. Outcome Groups Breakdown - Simplified for Single Group */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h5 className="font-bold text-gray-900 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-gray-500" />
                                玩法配置预览
                            </h5>
                        </div>
                        
                        <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <h6 className="text-sm font-bold text-gray-900">核心玩法</h6>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {confirmationConfig.outcomes.map((outcome) => {
                                    const isBookmakerPosition = confirmationConfig.bookmakerOutcomeIds.includes(outcome.id);
                                    return (
                                        <div 
                                            key={outcome.id} 
                                            className={`relative rounded-xl p-3 flex flex-col transition-all ${isBookmakerPosition ? 'bg-purple-50 border-2 border-purple-500 shadow-sm' : 'bg-white border border-gray-200'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-sm font-bold ${isBookmakerPosition ? 'text-purple-900' : 'text-gray-700'}`}>{outcome.label}</span>
                                                {isBookmakerPosition && (
                                                    <div className="bg-purple-600 text-white p-1 rounded-md shadow-sm">
                                                        <Shield className="w-3 h-3 fill-white" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {isBookmakerPosition ? (
                                                <div className="mt-auto pt-2 border-t border-purple-200/50">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className="text-[10px] font-black text-purple-600 bg-white/50 px-1.5 py-0.5 rounded border border-purple-200">庄家持仓</span>
                                                        <span className="text-[10px] text-purple-400">初始赔率 2.00</span>
                                                    </div>
                                                    <p className="text-[10px] text-purple-800 leading-tight">您将作为庄家持有此选项，接受其他用户对此选项的反向投注。</p>
                                                </div>
                                            ) : (
                                                <div className="mt-auto pt-2">
                                                        <span className="text-[10px] text-gray-400 font-medium">闲家可投选项</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
                    <button onClick={() => setShowConfirmation(false)} className="flex-1 py-4 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-white hover:shadow-sm hover:text-gray-900 transition-all">返回修改</button>
                    <button onClick={handleFinalConfirm} className="flex-[2] py-4 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-black shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                        <CheckCircle2 className="w-5 h-5" />
                        确认并支付 ${totalLiquidity}
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};
