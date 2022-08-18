export interface MyProfile {
  id: number;
  login: string;
  fullName: string;
  intro: string|null;
  email: string;
  role: string|null;
  // password: string;
  avatar: string|null;
  birthYear: number|null;
  birthMonth: number|null;
  birthDay: number|null;
  currentLocation: string|null;
  // verified: boolean;
  education: IEducation[];
  experience: IExperience[];
  skills: ISkill[];
  projects: IProject[];
  isPublic: boolean;
  linkedin?: string|null,
  github?: string|null,
  telegram?: string|null
  sendNotifications: boolean;
  lang: 'EN'|'RU';
}

export type ProfileDTO = Omit<MyProfile, 'skills'|'projects'|'education'|'experience'>;

export type IProfile = Omit<MyProfile, 'sendNotifications'|'lang'|'isPublic'>;

export type IProfileRefresh = Omit<MyProfile, 'id'|'login'|'email'|'verified'|'education'|'experience'|'skills'|'projects'>;

export type IProfileUpdate = Partial<IProfileRefresh>;

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
  title: string,
  role: string,
  place: string|null,
  description: string,
  image: string|null,
  links: IProjectLink[],
  tags: string[]
}

export interface IImage {
  id: number,
  publicUrl: string,
  key: string,
  profileId: number,
}

export interface IExperience {
  id: number;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  role: string;
  place: string;
  companyLogo?: string|null
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
