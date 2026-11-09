import prisma from "../../config/database";
import {
  UpdateProfileInput,
  AddSkillInput,
  UpdateSkillInput
} from "./user.validation";

export const getUserProfile = async (userId: string) => {
  return prisma.profile.findUnique({
    where: { userId }
  });
};

export const updateUserProfile = async (
  userId: string,
  data: UpdateProfileInput
) => {
  return prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      ...data
    },
    update: data
  });
};

export const addUserSkill = async (
  userId: string,
  data: AddSkillInput
) => {
  return prisma.userSkill.create({
    data: {
      userId,
      skillName: data.skillName,
      proficiency: data.proficiency
    }
  });
};

export const getUserSkills = async (userId: string) => {
  return prisma.userSkill.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};

export const updateUserSkill = async (
  userId: string,
  skillId: string,
  data: UpdateSkillInput
) => {
  const skill = await prisma.userSkill.findFirst({
    where: {
      id: skillId,
      userId
    }
  });

  if (!skill) {
    return null;
  }

  return prisma.userSkill.update({
    where: { id: skillId },
    data
  });
};

export const deleteUserSkill = async (
  userId: string,
  skillId: string
) => {
  const skill = await prisma.userSkill.findFirst({
    where: {
      id: skillId,
      userId
    }
  });

  if (!skill) {
    return false;
  }

  await prisma.userSkill.delete({
    where: { id: skillId }
  });

  return true;
};
