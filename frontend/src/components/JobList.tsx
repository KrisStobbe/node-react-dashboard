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
import WorkIcon from "@mui/icons-material/Work";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { Job, JobStatus } from "../types";

interface JobListProps {
  jobs: Job[];
  selectedJobId: string | null;
  onSelect: (jobId: string) => void;
}

/**
 * JobList renders a table of jobs filtering out completed jobs.
 * Each job can be selected to perform further actions.
 *
 * @param jobs - Array of job objects to display.
 * @param selectedJobId - Currently selected job ID, if any.
 * @param onSelect - Callback function to handle selecting a job.
 */
const JobList: React.FC<JobListProps> = ({ jobs, selectedJobId, onSelect }) => {
  /** Filter for jobs that have the status of "SCHEDULED" */
  const filteredJobs = jobs.filter((job) => job.status == JobStatus.SCHEDULED);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left"></TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Location Type</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow
              key={job.id}
              selected={selectedJobId === job.id}
              onClick={() => onSelect(job.id)}
              sx={{
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                cursor: "pointer",
                height: 53,
              }}
            >
              <TableCell align="left" sx={{ padding: "6px" }}>
                {selectedJobId === job.id ? (
                  <WorkIcon color="primary" />
                ) : (
                  <WorkOutlineIcon color="action" />
                )}
              </TableCell>
              <TableCell component="th" scope="row">
                {new Date(job.datetime).toLocaleString()}
              </TableCell>
              <TableCell>
                {job.location_type.charAt(0).toUpperCase() +
                  job.location_type.slice(1).toLowerCase()}
              </TableCell>
              <TableCell>
                {job.status.charAt(0).toUpperCase() +
                  job.status.slice(1).toLowerCase()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default JobList;
