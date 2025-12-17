import { customerColumnsSchema } from "./columns";
import { faker } from "@faker-js/faker";
faker.seed(123); // for react hydration
function createRandomUser() {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    customerName: faker.internet.username(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
    phoneNo: faker.phone.number({ style: "international" }),
    totalOrder: faker.number.int({ min: 1, max: 100 }),
    totalSpend: faker.number.int({ min: 1000, max: 100000 }),
    status: faker.helpers.arrayElement([
      "Active",
      "Inactive",
      "Deleted",
      "Banned",
    ]),
  };
}

export const Customerdata = customerColumnsSchema.parse(
  faker.helpers.multiple(createRandomUser, {
    count: 50,
  }),
);
