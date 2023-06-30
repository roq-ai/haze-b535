import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { commandValidationSchema } from 'validationSchema/commands';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.command
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCommandById();
    case 'PUT':
      return updateCommandById();
    case 'DELETE':
      return deleteCommandById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCommandById() {
    const data = await prisma.command.findFirst(convertQueryToPrismaUtil(req.query, 'command'));
    return res.status(200).json(data);
  }

  async function updateCommandById() {
    await commandValidationSchema.validate(req.body);
    const data = await prisma.command.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCommandById() {
    const data = await prisma.command.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
