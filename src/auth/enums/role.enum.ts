// role.enum.ts
export enum Roles {
  Entrepreneur = 'entrepreneur',
  Investor = 'investor',
  Engager = 'engager',
  Admin = 'admin',
}

export enum Permission {
  CreatePitch = 'CREATE_PITCH',
  ReadPitch = 'READ_PITCH',
  UpdatePitch = 'UPDATE_PITCH',
  DeletePitch = 'DELETE_PITCH',
  CreateAccount = 'CREATE_ACCOUNT',
  UpdateAccount = 'UPDATE_ACCOUNT',
  DeleteAccount = 'DELETE_ACCOUNT',
  UpvotePitch = 'UPVOTE_PITCH',
  CommentPitch = 'COMMENT_PITCH',
  ViewAnalytics = 'VIEW_ANALYTICS',
  ShortlistInvestor = 'SHORTLIST_INVESTOR',
  ViewShortlistedInvestors = 'VIEW_SHORTLISTED_INVESTORS',
  ViewInvestorProfile = 'VIEW_INVESTOR_PROFILE',
  SendMessageToInvestor = 'SEND_MESSAGE_TO_INVESTOR',
  ReceiveMessageFromInvestor = 'RECEIVE_MESSAGE_FROM_INVESTOR',
  ReceiveAlerts = 'RECEIVE_ALERTS',
  ViewMatchedPitches = 'VIEW_MATCHED_PITCHES',
  SearchStartups = 'SEARCH_STARTUPS',
  FilterStartups = 'FILTER_STARTUPS',
  ViewPitchProfile = 'VIEW_PITCH_PROFILE',
  ShowInterestInPitch = 'SHOW_INTEREST_IN_PITCH',
  ShortlistPitch = 'SHORTLIST_PITCH',
  ViewShortlistedPitches = 'VIEW_SHORTLISTED_PITCHES',
  DownloadPitchDocuments = 'DOWNLOAD_PITCH_DOCUMENTS',
  AdminAccess = 'ADMIN_ACCESS',
  ManageInvestors = 'MANAGE_INVESTORS',
  ManageStartups = 'MANAGE_STARTUPS',
  ManageUsers = 'MANAGE_USERS',
  ManageRoles = 'MANAGE_ROLES',
  ManagePermissions = 'MANAGE_PERMISSIONS',
}
