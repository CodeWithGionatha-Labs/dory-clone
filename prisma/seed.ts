import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import cuid from "cuid";
import colors from "tailwindcss/colors";

const prisma = new PrismaClient();

// NOTE: IMPORTANT to replace with an user id registered in Kinde
const myUserId = "kp_4fc8a0fbaaf04a0abbeac48eaa501595";

const runSeed = async () => {
  await resetDB();

  process.stdout.write("Generating users...");
  const myUser = await prisma.user.create({
    data: {
      id: myUserId,
      displayName: "Alice",
      email: "yaroyac242@biscoine.com",
      color: colors.red["500"],
    },
  });

  const otherUsers = await prisma.user.createManyAndReturn({
    data: Array.from({ length: 10 }).map(() => ({
      id: cuid(),
      email: faker.internet.email(),
      displayName: faker.internet.displayName(),
      createdAt: faker.date.recent(),
      color: faker.helpers.arrayElement([
        colors.green[500],
        colors.red[500],
        colors.pink[500],
        colors.purple[500],
        colors.yellow[500],
        colors.emerald[500],
      ]),
    })),
  });

  printCheckMark();

  process.stdout.write("Generating events...");
  const event = await prisma.event.create({
    data: {
      ownerId: myUser.id,
      displayName: faker.commerce.productName(),
      shortDescription: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      createdAt: faker.date.recent(),
      participants: {
        createMany: {
          data: Array.from({ length: 10 }).map((_, index) => ({
            userId: otherUsers[index % otherUsers.length].id,
          })),
        },
      },
    },
  });
  printCheckMark();

  process.stdout.write("Generating questions...");
  for (let i = 0; i < 30; i++) {
    await prisma.question.create({
      data: {
        eventId: event.id,
        authorId: otherUsers[i % otherUsers.length].id,
        body: faker.lorem.paragraph(),
        isPinned: faker.datatype.boolean({ probability: 0.2 }),
        isResolved: faker.datatype.boolean({ probability: 0.25 }),
        createdAt: faker.date.recent(),
        upvotes: {
          createMany: {
            data: Array.from({
              length: faker.number.int({
                min: 0,
                max: 8,
              }),
            }).map((_, index) => ({
              authorId: otherUsers[index % otherUsers.length].id,
            })),
          },
        },
      },
    });
  }
  printCheckMark();

  process.stdout.write("Generating polls...");
  const polls = await prisma.poll.createManyAndReturn({
    data: [
      {
        eventId: event.id,
        body: faker.lorem.paragraph(),
        createdAt: faker.date.recent(),
        isLive: true,
      },
      {
        eventId: event.id,
        body: faker.lorem.paragraph(),
        createdAt: faker.date.recent(),
        isLive: false,
      },
    ],
  });

  // generate the options and votes for the polls
  const optionVotes = [
    otherUsers.slice(0, 4).map((usr) => usr.id), // first option
    otherUsers.slice(4, 6).map((usr) => usr.id), // second option
    otherUsers.slice(6, 10).map((usr) => usr.id), // third option
    [], // fourth option
  ] as const;

  for (const poll of polls) {
    // option per poll
    for (let i = 0; i < 4; i++) {
      await prisma.pollOption.create({
        data: {
          pollId: poll.id,
          body: faker.lorem.word(3),
          index: i,
          votes: {
            createMany: {
              data: Array.from({ length: optionVotes[i].length }).map(
                (_, userIndex) => ({
                  authorId: optionVotes[i][userIndex],
                  pollId: poll.id,
                })
              ),
            },
          },
        },
      });
    }
  }
  printCheckMark();

  console.log("Seeding complete 🎉");
};

const resetDB = async () => {
  process.stdout.write("Resetting database...");

  await prisma.event.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.question.deleteMany();
  await prisma.user.deleteMany();

  printCheckMark();
};

const printCheckMark = () => process.stdout.write("✅\n");

runSeed()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => async () => {
    await prisma.$disconnect();
  });
