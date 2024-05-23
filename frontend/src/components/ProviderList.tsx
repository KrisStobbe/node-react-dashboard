import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Provider } from "../types";
import { sortProvidersByScore, calculateRank } from "../utils/providerUtils";

interface ProviderListProps {
  providers: Provider[];
}

/**
 * ProviderList displays a sorted table of providers with their scores and ranks.
 * Top providers receive a special trophy icon next to their rank.
 *
 * @param providers - List of providers to display, which will be sorted by score.
 */
const ProviderList: React.FC<ProviderListProps> = ({ providers }) => {
  /** Sort providers by their total score in descending order */
  const sortedProviders = sortProvidersByScore(providers);

  /**
   * Determines the color of the trophy icon based on the provider's rank.
   *
   * @param rank - The rank of the provider in the list.
   * @returns The color corresponding to the rank for the trophy icon.
   */
  const getTrophyColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return "gold";
      case 2:
        return "silver";
      case 3:
        return "#cd7f32"; // Bronze color
      default:
        return "action"; // Default icon color
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Provider Name</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedProviders.map((item, index) => {
            const rank = calculateRank(sortedProviders, index);
            return (
              <TableRow
                key={index}
                sx={{
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                  cursor: "pointer",
                  height: 53,
                }}
              >
                <TableCell component="th" scope="row">
                  {rank}
                  {rank <= 3 && (
                    <EmojiEventsIcon
                      sx={{ color: getTrophyColor(rank), ml: 1 }}
                    />
                  )}
                </TableCell>
                <TableCell>{item.full_name}</TableCell>
                <TableCell>{item.totalScore.toFixed(3)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProviderList;
