import { UserDataProps } from './user';

export type UrlDataProps = {
  createdAt: string;
  domainname: string;
  eligible: null | boolean;
  exists_in_db: null | boolean;
  exists_in_repo: null | boolean;
  id: number;
  pr_submitted: null | boolean;
  proof: null | string;
  pull_request_id: null | number;
  status_id: number;
  submitted_by: number;
  takendown: null | boolean;
  updatedAt: string;
  usid: string;
};

export type SubmissionDataProps = {
  url_data: UrlDataProps;
  user_data: UserDataProps;
};
