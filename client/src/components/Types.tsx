export type Ticket = {
  data: {
    question: string;
    location: string;
    contact: string;
  };
  id: number;
  status: number;
  requested_by: string;
  claimed_by: string | null;
  minutes: number;
};

export type User = {
  id: number;
  email: string;
  name: string;
  skills: string;
  admin_is: boolean;
  mentor_is: boolean;
};

// In server_constants.py
export type ClientSettings = {
  app_name: string;
  app_contact_email: string;
  app_creator: string;
  queue_status: string;
  queue_message: string;
  readonly_master_url: string;
  mentor_password_key: string;
  github_client_id: string;
}