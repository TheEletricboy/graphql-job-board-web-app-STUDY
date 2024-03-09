import { getCompany } from "./db/companies.js";
import { getJobs } from "./db/jobs.js";

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
  },
  Job: {
    date: (job) => toIsoDate(job),
    company: (job) => getCompany(job.companyId),
  },
};

const toIsoDate = (job) => job.createdAt.slice(0, "yyy-mm-dd".length);
