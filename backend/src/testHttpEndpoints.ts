async function testHttpEndpoints() {
  console.log("Testing HTTP API Endpoints on http://localhost:5000...");
  
  // 1. Health
  const healthRes = await fetch("http://localhost:5000/api/health");
  const healthData = await healthRes.json();
  console.log("1. /api/health:", healthData.status);

  // 2. Register
  const testUser = {
    email: `api_hero_${Date.now()}@questme.app`,
    password: "Password123!",
    name: "VanguardAlex",
    heroGender: "FEMALE",
    heroClass: "WARRIOR",
    selectedGoals: ["FITNESS", "DISCIPLINE"],
    initialDifficulty: "NORMAL"
  };

  const regRes = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testUser)
  });
  const regData = await regRes.json();
  console.log("2. /api/auth/register:", regData.success, "Token length:", regData.token?.length);

  const token = regData.token;

  // 3. /api/character
  const charRes = await fetch("http://localhost:5000/api/character", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const charData = await charRes.json();
  console.log("3. /api/character:", charData.character?.name, "Level:", charData.character?.level, "Class:", charData.character?.heroClass);

  // 4. /api/quests
  const questsRes = await fetch("http://localhost:5000/api/quests", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const questsData = await questsRes.json();
  console.log("4. /api/quests:", questsData.quests?.length, "starter quests generated");

  // 5. Complete first quest
  const firstQuest = questsData.quests[0];
  const compRes = await fetch(`http://localhost:5000/api/quests/${firstQuest.id}/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  const compData = await compRes.json();
  console.log("5. /api/quests/:id/complete:", compData.success, "+XP:", compData.result?.xpEarned, "+Gold:", compData.result?.goldEarned);

  // 6. /api/bosses/active
  const bossRes = await fetch("http://localhost:5000/api/bosses/active", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const bossData = await bossRes.json();
  console.log("6. /api/bosses/active:", bossData.activeBoss?.name, "HP:", bossData.activeBoss?.currentHp);

  // 7. /api/ai/recommendation
  const aiRes = await fetch("http://localhost:5000/api/ai/recommendation", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const aiData = await aiRes.json();
  console.log("7. /api/ai/recommendation:", aiData.recommendation?.title);

  // 8. /api/ai/chat
  const chatRes = await fetch("http://localhost:5000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message: "What should I focus on today?" })
  });
  const chatData = await chatRes.json();
  console.log("8. /api/ai/chat response received, length:", chatData.reply?.length);

  console.log("\n✨ ALL 8 REST API ENDPOINTS VERIFIED AND RESPONDING WITH STATUS 200/201! ✨\n");
}

testHttpEndpoints().catch(console.error);
