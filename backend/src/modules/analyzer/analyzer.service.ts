import prisma from "../../config/database";

const SKILL_DICTIONARY = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "FastAPI",
  "Django",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Kubernetes",
  "Git",
  "GitHub",
  "REST API",
  "GraphQL",
  "AWS",
  "Azure",
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Pandas",
  "NumPy"
];

const extractSkills = (jobDescription: string): string[] => {
  const normalizedText = jobDescription.toLowerCase();

  return SKILL_DICTIONARY.filter(skill => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const pattern = new RegExp(
      `(^|[^a-z0-9+#.])${escapedSkill.toLowerCase()}(?=$|[^a-z0-9+#.])`,
      "i"
    );

    return pattern.test(normalizedText);
  });
};

// Analyze a job description and save the result
export const analyzeJobDescription = async (
  userId: string,
  jobDescription: string
) => {
  const requiredSkills = extractSkills(jobDescription);

  const userSkills = await prisma.userSkill.findMany({
    where: { userId },
    select: {
      skillName: true,
      proficiency: true
    }
  });

  const userSkillMap = new Map(
    userSkills.map(skill => [
      skill.skillName.toLowerCase().trim(),
      skill
    ])
  );

  const matchedSkills = requiredSkills.filter(skill =>
    userSkillMap.has(skill.toLowerCase())
  );

  const missingSkills = requiredSkills.filter(skill =>
    !userSkillMap.has(skill.toLowerCase())
  );

  const totalRequiredSkills = requiredSkills.length;

  const matchScore = totalRequiredSkills === 0
    ? 0
    : Math.round(
        (matchedSkills.length / totalRequiredSkills) * 100
      );

  // Save analysis in PostgreSQL
  const savedAnalysis = await prisma.jobAnalysis.create({
    data: {
      userId,
      jobDescription,
      matchScore,
      totalRequiredSkills,
      matchedSkills,
      missingSkills
    }
  });

  return savedAnalysis;
};

// Get the logged-in user's analysis history
export const getAnalysisHistory = async (userId: string) => {
  return prisma.jobAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};

// Get one analysis by ID, belonging to the logged-in user
export const getAnalysisById = async (
  userId: string,
  analysisId: string
) => {
  return prisma.jobAnalysis.findFirst({
    where: {
      id: analysisId,
      userId
    }
  });
};