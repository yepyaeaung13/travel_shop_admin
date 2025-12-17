import { User } from "@/types/users.types";

// Simulated seeded regions, cities, townships
export const regions = [
  { id: 1, name: "Yangon Region" },
  { id: 2, name: "Mandalay Region" },
];

export const cities = [
  { id: 1, name: "Yangon", regionId: 1 },
  { id: 2, name: "Twante", regionId: 1 },
  { id: 3, name: "Mandalay", regionId: 2 },
];

export const townships = [
  { id: 1, name: "Downtown", cityId: 1 },
  { id: 2, name: "Bahan", cityId: 1 },
  { id: 3, name: "Chanayethazan", cityId: 3 },
];

const statuses = ["Active", "Inactive", "Block"];
const roles = ["Customer", "Admin", "Seller"];
const areaTypes = ["Condo", "Apartment", "House"];

const dummyUsers: User[] = Array.from({ length: 100 }, (_, i) => {
  const region = regions[i % regions.length];
  const validCities = cities.filter((c) => c.regionId === region.id);
  const city = validCities[i % validCities.length];
  const validTownships = townships.filter((t) => t.cityId === city.id);
  const township = validTownships[i % validTownships.length];

  // Add gender property, alternating between 'male' and 'female'
  const genders = ["male", "female"];
  const gender = genders[i % genders.length];

  return {
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    phoneNumber: Math.random() > 0.5 ? `09${Math.floor(100000000 + Math.random() * 900000000)}` : null,
    password: "hashed_password",
    regionId: region.id,
    cityId: city.id,
    townshipId: township.id,
    address: `Street ${i + 1}`,
    areaType: areaTypes[i % areaTypes.length],
    floorNo: Math.random() > 0.5 ? `${Math.floor(Math.random() * 20 + 1)}F` : null,
    unit: Math.random() > 0.5 ? `Unit-${i + 1}` : null,
    preferences: null,
    totalOrderAmount: Math.random() > 0.3 ? parseFloat((Math.random() * 1000).toFixed(2)) : null,
    totalOrderCount: Math.random() > 0.3 ? Math.floor(Math.random() * 20) : null,
    status: statuses[i % statuses.length],
    role: roles[i % roles.length],
    age: 18 + (i % 42),
    gender: gender,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

export type GetDummyUsersParams = {
  page: number;
  size: number;
  searchText?: string;
  statusFilter?: string;
  roleFilter?: string;
};

export const getDummyUsers = ({
  page,
  size,
  searchText = "",
  statusFilter = "all",
  roleFilter = "all",
}: GetDummyUsersParams) => {
  let filtered = dummyUsers;

  if (searchText.trim()) {
    const search = searchText.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
    );
  }

  if (statusFilter !== "all") {
    filtered = filtered.filter((user) => user.status === statusFilter);
  }

  if (roleFilter !== "all") {
    filtered = filtered.filter((user) => user.role === roleFilter);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / size);
  const paginated = filtered.slice((page - 1) * size, page * size);

  return {
    data: paginated,
    meta: {
      page,
      size,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
