// Centralized mock data — only consumed by services/apiClient.ts
export const MOCK_USER = {
  id: "u_001",
  name: "Aarav Sharma",
  classId: 10,
  className: "Class 10",
  phone: "+91 98765 43210",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
  totalXp: 450,
};

export const CLASSES = Array.from({ length: 12 }, (_, i) => {
  const id = i + 1;
  const price = id <= 5 ? 1499 : id <= 10 ? 2499 : 3499;
  return {
    id,
    name: `Class ${id}`,
    label: id <= 5 ? "Primary" : id <= 8 ? "Middle" : id <= 10 ? "Secondary" : "Senior Secondary",
    price,
    originalPrice: price + 1000,
  };
});

export const COUPONS: Record<string, number> = {
  STUDENT10: 0.1,
  WELCOME20: 0.2,
};

export const SUBJECTS = [
  { id: "math", name: "Mathematics", icon: "Sigma", progress: 62, color: "purple", chapters: 14 },
  { id: "science", name: "Science", icon: "FlaskConical", progress: 45, color: "teal", chapters: 12 },
  { id: "english", name: "English", icon: "BookOpen", progress: 78, color: "pink", chapters: 10 },
  { id: "social", name: "Social Studies", icon: "Globe2", progress: 33, color: "amber", chapters: 16 },
  { id: "hindi", name: "Hindi", icon: "Languages", progress: 55, color: "rose", chapters: 11 },
  { id: "computer", name: "Computer", icon: "Cpu", progress: 88, color: "cyan", chapters: 9 },
];

export const LEADERBOARD = [
  { rank: 1, name: "Priya Verma", xp: 600, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
  { rank: 2, name: "Rohan Iyer", xp: 580, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" },
  { rank: 3, name: "Ananya Das", xp: 555, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya" },
  { rank: 4, name: "Kabir Khan", xp: 530, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir" },
  { rank: 5, name: "Isha Gupta", xp: 510, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isha" },
];

export const TOP_XP = 600;

export const DAILY_GOALS = [
  { id: "g1", title: "Watch 1 video lesson", done: true, xp: 20 },
  { id: "g2", title: "Solve 10 practice questions", done: false, xp: 30 },
  { id: "g3", title: "Take 1 mock test", done: false, xp: 50 },
];
