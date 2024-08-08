export const getOptionVotesAsPercentage = ({
  optionVotes,
  totalVotes,
}: {
  optionVotes: number;
  totalVotes: number;
}) => {
  return totalVotes === 0 ? 0 : Math.round((optionVotes / totalVotes) * 100);
};
