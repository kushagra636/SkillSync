import prisma from "../../config/database";

export const getDashboardData = async (userId: string) => {
  const [
    totalSkills,
    totalAnalyses,
    proficiencyCounts,
    latestAnalysis,
    analyses,
    recentSkills,
    profile
  ] = await Promise.all([
    prisma.userSkill.count({
      where: { userId }
    }),

    prisma.jobAnalysis.count({
      where: { userId }
    }),

    prisma.userSkill.groupBy({
      by: ["proficiency"],
      where: { userId },
      _count: {
        _all: true
      }
    }),

    prisma.jobAnalysis.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    }),

    prisma.jobAnalysis.findMany({
      where: { userId },
      select: {
        missingSkills: true
      }
    }),

    prisma.userSkill.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        skillName: true,
        proficiency: true,
        createdAt: true
      }
    }),

    prisma.profile.findUnique({
      where: { userId },
      select: {
        experience: true,
        education: true
      }
    })
  ]);

  // Calculate average proficiency:
  // BEGINNER = 1, INTERMEDIATE = 2, ADVANCED = 3
  const proficiencyValues: Record<string, number> = {
    BEGINNER: 1,
    INTERMEDIATE: 2,
    ADVANCED: 3
  };

  const totalProficiencyPoints = proficiencyCounts.reduce(
    (sum, item) =>
      sum + proficiencyValues[item.proficiency] * item._count._all,
    0
  );

  const averageProficiency = totalSkills === 0
    ? 0
    : Number((totalProficiencyPoints / totalSkills).toFixed(2));

  // Count how frequently each skill is missing
  const missingSkillCounts: Record<string, number> = {};

  for (const analysis of analyses) {
    for (const skill of analysis.missingSkills) {
      const normalizedSkill = skill.trim();

      missingSkillCounts[normalizedSkill] =
        (missingSkillCounts[normalizedSkill] || 0) + 1;
    }
  }

  const skillGaps = Object.entries(missingSkillCounts)
    .map(([skillName, count]) => ({
      skillName,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Build recent activity from analyses and added skills
  const recentAnalyses = await prisma.jobAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      matchScore: true,
      createdAt: true
    }
  });

  const recentActivity = [
    ...recentSkills.map(skill => ({
      id: skill.id,
      type: "SKILL_ADDED" as const,
      title: `Added ${skill.skillName}`,
      description: `Proficiency: ${skill.proficiency}`,
      createdAt: skill.createdAt
    })),

    ...recentAnalyses.map(analysis => ({
      id: analysis.id,
      type: "JOB_ANALYZED" as const,
      title: "Analyzed a job description",
      description: `Match score: ${analysis.matchScore}%`,
      createdAt: analysis.createdAt
    }))
  ]
    .sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )
    .slice(0, 10);

  return {
    overview: {
      totalSkills,
      totalAnalyses,
      averageProficiency
    },

    proficiencyBreakdown: proficiencyCounts.map(item => ({
      proficiency: item.proficiency,
      count: item._count._all
    })),

    latestAnalysis,

    skillGaps,

    recentActivity,

    profile
  };
};
