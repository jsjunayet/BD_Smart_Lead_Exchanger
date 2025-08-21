import { User } from '../modules/Auth/auth.model';

const superUser = {
  name: 'Super Admin',
  userName: 'superadmin',
  email: 'junayetshiblu0@gamil.com',
  phoneNumber: '01700000000',
  country: 'Bangladesh',
  city: 'Dhaka',
  affiliateNetworkName: 'N/A',
  publisherId: 'N/A',
  password: 'admin123',
  role: 'superAdmin',
  image:
    'https://res.cloudinary.com/dzxzxdsnq/image/upload/v1753603481/A-0001Junayet.jpg',
  isApproved: true,
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: 'superAdmin' });

  if (!isSuperAdminExits) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
