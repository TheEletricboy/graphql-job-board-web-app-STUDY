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
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing Authentication!");
      }
      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing Authentication!");
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) {
        return notFoundError("No Job found");
      }

      return job;
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user: { companyId } }
    ) => {
      if (!user) {
        throw unauthorizedError("Missing Authentication!");
      }
      const job = await updateJob({ id, title, description, companyId });
      if (!job) {
        return notFoundError("No Job found");
      }

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

const unauthorizedError = (message) => {
  return new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" },
  });
};
