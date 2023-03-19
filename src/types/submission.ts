import { UserDataProps } from './user';

export type CommentDataProps = {
  id: number;
  url_id: number;
  comment: string;
  issued_by: number;
  hide: boolean;
  createdAt: string;
  updatedAt: string;
};

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
  confirmed_takendown: null | boolean;
  takendown: null | boolean;
  updatedAt: string;
  usid: string;
};

export type SubmissionDataProps = {
  comments: CommentDataProps[];
  url_data: UrlDataProps;
  user_data: UserDataProps;
};
