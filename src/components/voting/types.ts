export type VoteOption = "A" | "B" | "C" | "D" | "E";

export type VoteRecord = {
  id: number;
  option: VoteOption;
  label: string;
  description: string;
  color: string;
};

export type VotingSession = {
  id: number;
  title: string;
  description: string;
  options: VoteRecord[];
  userVote: VoteOption | null;
  hasVoted: boolean;
};

export type VoteResult = {
  option: VoteOption;
  count: number;
  percentage: number;
};

export type VotingResults = {
  sessionId: number;
  totalVotes: number;
  results: VoteResult[];
};
