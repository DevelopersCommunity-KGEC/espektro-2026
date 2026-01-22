export interface ClubRole {
  _id: string;
  clubId: string;
  role: string;
  userId: string;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "super-admin" | "pending";
  clubRoles: ClubRole[];
}

export interface ClubTeamMember {
  _id: string;
  clubId: string;
  role: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
}
