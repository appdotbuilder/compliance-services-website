import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createContactFormInputSchema, 
  createServiceInputSchema, 
  updateCompanyInfoInputSchema 
} from './schema';

// Import handlers
import { createContactForm } from './handlers/create_contact_form';
import { getServices } from './handlers/get_services';
import { getServiceBySlug } from './handlers/get_service_by_slug';
import { getCompanyInfo } from './handlers/get_company_info';
import { createService } from './handlers/create_service';
import { updateCompanyInfo } from './handlers/update_company_info';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Contact form endpoints
  createContactForm: publicProcedure
    .input(createContactFormInputSchema)
    .mutation(({ input }) => createContactForm(input)),

  // Service endpoints
  getServices: publicProcedure
    .query(() => getServices()),

  getServiceBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => getServiceBySlug(input.slug)),

  createService: publicProcedure
    .input(createServiceInputSchema)
    .mutation(({ input }) => createService(input)),

  // Company information endpoints
  getCompanyInfo: publicProcedure
    .query(() => getCompanyInfo()),

  updateCompanyInfo: publicProcedure
    .input(updateCompanyInfoInputSchema)
    .mutation(({ input }) => updateCompanyInfo(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();