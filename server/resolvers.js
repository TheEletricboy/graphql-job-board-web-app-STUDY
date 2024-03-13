import { getCompany } from "./db/companies.js";
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from "./db/jobs.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    company: async (_root, args) => {
      const company = await getCompany(args.id);

      if (!company) {
        throw notFoundError("No Company found with an id: " + args.id);
      }

      return company;
    },
    job: async (_root, args) => {
      const job = await getJob(args.id);

      if (!job) {
        return notFoundError("No Job found");
      }

      return job;
    },
    jobs: () => getJobs(),
  },
  Mutation: {
    createJob: (_root, { input: { title, description } }) => {
      // TODO: change later, purely for dev testing
      const companyId = "FjcJCHJALA4i";
      return createJob({ companyId, title, description });
    },
    deleteJob: (_root, { id }) => {
      return deleteJob(id);
    },
    updateJob: (_root, { input: { id, title, description } }) => {
      return updateJob({ id, title, description });
    },
  },
  Job: {
    date: (job) => toIsoDate(job),
    company: (job) => getCompany(job.companyId),
  },
  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
};

const toIsoDate = (job) => job.createdAt.slice(0, "yyy-mm-dd".length);

const notFoundError = (message) => {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
};
