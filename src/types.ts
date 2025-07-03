export type Participant = {
  id: string;
  name: string;
  login_time: string;
  is_identified: boolean;
  satisfaction: number;
};

export type Match = {
  id: string;
  participant1_id: string;
  participant2_id: string;
  match_time: string;
};

export type Meeting = {
  id: string;
  match_id: string;
  start_time: string;
  anticipation: boolean;
};

export type Insight = {
  id: string;
  type: string;
  description: string;
  action_link: string;
};

export type TopMatching = {
  id: number;
  participant_id: string;
  score: number;
};

export type Anticipation = {
  id: number;
  participant_id: string;
  anticipation_score: number;
}; 