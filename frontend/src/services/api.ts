import {
  User,
  Character,
  Quest,
  Skill,
  Boss,
  Item,
  Achievement,
  WorldRegion,
  NotificationItem,
  AIRecommendation,
  QuestCompletionResult
} from "../types";

const BASE_URL = "/api";

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("questme_auth_token");
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("questme_auth_token", token);
    } else {
      localStorage.removeItem("questme_auth_token");
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("questme_auth_token");
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>)
    };

    const currentToken = this.getToken();
    if (currentToken) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  }

  // --- Auth ---
  public async register(body: any): Promise<{ success: boolean; token: string; user: User }> {
    const data = await this.request<{ success: boolean; token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body)
    });
    this.setToken(data.token);
    return data;
  }

  public async login(body: any): Promise<{ success: boolean; token: string; user: User }> {
    const data = await this.request<{ success: boolean; token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body)
    });
    this.setToken(data.token);
    return data;
  }

  public logout() {
    this.setToken(null);
  }

  public async getProfile(): Promise<{ success: boolean; user: any }> {
    return this.request<{ success: boolean; user: any }>("/auth/me");
  }

  public async updateProfile(body: any): Promise<{ success: boolean; profile: any }> {
    return this.request<{ success: boolean; profile: any }>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(body)
    });
  }

  // --- Quests ---
  public async getQuests(params?: { category?: string; type?: string; completed?: boolean }): Promise<{ success: boolean; quests: Quest[] }> {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.type) query.append("type", params.type);
    if (params?.completed !== undefined) query.append("completed", String(params.completed));

    const qs = query.toString();
    return this.request<{ success: boolean; quests: Quest[] }>(`/quests${qs ? `?${qs}` : ""}`);
  }

  public async createQuest(body: Partial<Quest>): Promise<{ success: boolean; quest: Quest }> {
    return this.request<{ success: boolean; quest: Quest }>("/quests", {
      method: "POST",
      body: JSON.stringify(body)
    });
  }

  public async updateQuest(id: string, body: Partial<Quest>): Promise<{ success: boolean; quest: Quest }> {
    return this.request<{ success: boolean; quest: Quest }>(`/quests/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
  }

  public async deleteQuest(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/quests/${id}`, {
      method: "DELETE"
    });
  }

  public async completeQuest(id: string): Promise<{ success: boolean; result: QuestCompletionResult }> {
    return this.request<{ success: boolean; result: QuestCompletionResult }>(`/quests/${id}/complete`, {
      method: "POST"
    });
  }

  // --- Character ---
  public async getCharacter(): Promise<{ success: boolean; character: Character }> {
    return this.request<{ success: boolean; character: Character }>("/character");
  }

  // --- Skills ---
  public async getSkills(): Promise<{ success: boolean; skills: Skill[] }> {
    return this.request<{ success: boolean; skills: Skill[] }>("/skills");
  }

  public async unlockSkill(id: string): Promise<{ success: boolean; skill: Skill; message: string }> {
    return this.request<{ success: boolean; skill: Skill; message: string }>(`/skills/${id}/unlock`, {
      method: "POST"
    });
  }

  // --- Bosses ---
  public async getBosses(): Promise<{ success: boolean; bosses: Boss[] }> {
    return this.request<{ success: boolean; bosses: Boss[] }>("/bosses");
  }

  public async getActiveBoss(): Promise<{ success: boolean; activeBoss: Boss }> {
    return this.request<{ success: boolean; activeBoss: Boss }>("/bosses/active");
  }

  // --- Shop & Inventory ---
  public async getShopItems(category?: string): Promise<{ success: boolean; items: Item[] }> {
    const qs = category ? `?category=${category}` : "";
    return this.request<{ success: boolean; items: Item[] }>(`/shop/items${qs}`);
  }

  public async purchaseItem(itemId: string): Promise<{ success: boolean; message: string; item: Item; remainingGold: number; remainingCrystals: number }> {
    return this.request<{ success: boolean; message: string; item: Item; remainingGold: number; remainingCrystals: number }>(`/shop/${itemId}/purchase`, {
      method: "POST"
    });
  }

  public async equipItem(itemId: string): Promise<{ success: boolean; message: string; isEquipped: boolean; item: Item }> {
    return this.request<{ success: boolean; message: string; isEquipped: boolean; item: Item }>(`/shop/${itemId}/equip`, {
      method: "POST"
    });
  }

  public async getInventory(): Promise<{ success: boolean; inventory: any[] }> {
    return this.request<{ success: boolean; inventory: any[] }>("/inventory");
  }

  // --- World ---
  public async getWorldRegions(): Promise<{ success: boolean; currentLevel: number; regions: WorldRegion[] }> {
    return this.request<{ success: boolean; currentLevel: number; regions: WorldRegion[] }>("/world/regions");
  }

  // --- Achievements ---
  public async getAchievements(): Promise<{ success: boolean; totalCount: number; unlockedCount: number; achievements: Achievement[] }> {
    return this.request<{ success: boolean; totalCount: number; unlockedCount: number; achievements: Achievement[] }>("/achievements");
  }

  // --- Analytics ---
  public async getAnalytics(): Promise<{ success: boolean; summary: any; categoryDistribution: any[]; activityTimeline: any[]; attributeRadar: any[] }> {
    return this.request<{ success: boolean; summary: any; categoryDistribution: any[]; activityTimeline: any[]; attributeRadar: any[] }>("/analytics");
  }

  // --- AI Quest Master ---
  public async getDailyRecommendation(): Promise<{ success: boolean; recommendation: AIRecommendation }> {
    return this.request<{ success: boolean; recommendation: AIRecommendation }>("/ai/recommendation");
  }

  public async acceptRecommendation(id: string): Promise<{ success: boolean; quest: Quest; message: string }> {
    return this.request<{ success: boolean; quest: Quest; message: string }>(`/ai/recommendation/${id}/accept`, {
      method: "POST"
    });
  }

  public async chatWithMentor(message: string): Promise<{ success: boolean; reply: string; timestamp: string }> {
    return this.request<{ success: boolean; reply: string; timestamp: string }>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message })
    });
  }

  public async getChatHistory(): Promise<{ success: boolean; history: Array<{ role: string; content: string; createdAt: string }> }> {
    return this.request<{ success: boolean; history: Array<{ role: string; content: string; createdAt: string }> }>("/ai/chat/history");
  }

  public async getInsights(): Promise<{ success: boolean; insights: any }> {
    return this.request<{ success: boolean; insights: any }>("/ai/insights");
  }

  // --- Notifications ---
  public async getNotifications(): Promise<{ success: boolean; notifications: NotificationItem[]; unreadCount: number }> {
    return this.request<{ success: boolean; notifications: NotificationItem[]; unreadCount: number }>("/notifications");
  }

  public async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/notifications/${id}/read`, {
      method: "PATCH"
    });
  }
}

export const api = new ApiClient();
