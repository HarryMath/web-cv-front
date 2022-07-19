export interface MyProfile {
  id: number;
  login: string;
  fullName: string;
  intro: string;
  email: string;
  role: string;
  password: string;
  avatar: string|null;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  currentLocation: string|null;
  verified: boolean;
  education: IEducation[];
  experience: IExperience[];
  skills: ISkill[];
  sendNotifications: boolean;
  lang: 'EN'|'RU';
}

export type IProfile = Omit<MyProfile, 'sendNotifications'|'lang'>;

export interface IEducation {
  id: number;
  institutionName: string;
  label: string;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  description: string | null;
  profileId: number;
}

export interface IProjectLink {
  label: string;
  link: string;
}
export interface IProject {
  id: number,
  name: string,
  role: string,
  place: string|null,
  description: string,
  image: string|null,
  links: IProjectLink[],
  tags: string[]
}

export interface IExperience {
  id: number;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  role: string;
  place: string;
  description: string;
  location: string;
  link: string | null;
  profileId: number;
}
export type IExperienceRefresh = Omit<IExperience, 'profileId'>;
export type IExperienceUpdate = Partial<IExperienceRefresh>;

export interface ISkill {
  id: number;
  skillGroup: 'Programming languages'|'Web technologies'|'Databases'
    |'Infrastructure'|'Operating systems'|'Foreign languages'|string;
  skillName: string;
  skillLevel: number;
  profileId: number;
}

export interface ISkillsGroup {
  name: string;
  skills: ISkill[];
}