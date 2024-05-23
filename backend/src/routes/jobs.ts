import { Router, Request, Response } from "express";
import { getJobs, getProvidersForJob } from "../services/jobService";
const router = Router();

/**
 * Route to get all jobs.
 * @route GET /jobs
 */
router.get("/jobs", async (req: Request, res: Response) => {
  try {
    console.log("[GET] /jobs");
    const jobs = await getJobs();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
});

/**
 * Route to get providers for a specific job based on weighted preferences.
 * @route GET /jobs/:jobId/providers
 * @param costWeight - Weight for cost preference (default is 0 if not provided)
 * @param ratingWeight - Weight for rating preference (default is 0 if not provided)
 * @param turnoverWeight - Weight for turnover preference (default is 0 if not provided)
 * @param proximityWeight - Weight for proximity preference (default is 0 if not provided)
 */
router.get("/jobs/:jobId/providers", async (req: Request, res: Response) => {
  try {
    console.log(
      `[GET] /jobs/${req.params.jobId}/providers - costWeight: ${req.query.costWeight} - ratingWeight: ${req.query.ratingWeight} - turnoverWeight: ${req.query.turnoverWeight} - proximityWeight: ${req.query.proximityWeight}`,
    );
    const costWeight = parseFloat(req.query.costWeight as string);
    const ratingWeight = parseFloat(req.query.ratingWeight as string);
    const turnoverWeight = parseFloat(req.query.turnoverWeight as string);
    const proximityWeight = parseFloat(req.query.proximityWeight as string);

    const preferences = {
      costWeight: isNaN(costWeight) ? 0 : costWeight,
      ratingWeight: isNaN(ratingWeight) ? 0 : ratingWeight,
      turnoverWeight: isNaN(turnoverWeight) ? 0 : turnoverWeight,
      proximityWeight: isNaN(proximityWeight) ? 0 : proximityWeight,
    };

    const providersWithScores = await getProvidersForJob(
      req.params.jobId,
      preferences,
    );
    res.json(providersWithScores);
  } catch (error) {
    res.status(500).json({ message: "Error fetching providers", error });
  }
});

export default router;
