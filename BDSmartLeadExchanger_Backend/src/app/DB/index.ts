import { User } from '../modules/Auth/auth.model';

const superUser = {
  name: 'MD Morshed Hossain Saidy',
  userName: 'morshed321',
  email: 'bdsmartleadexchanger@gmail.com',
  phoneNumber: '01571141226',
  country: 'Bangladesh',
  city: 'Dhaka',
  affiliateNetworkName: 'N/A',
  publisherId: 'N/A',
  password: 'admin123',
  role: 'superAdmin',
  ProfileImage:
    'https://i.ibb.co.com/TMdYQ8r5/Whats-App-Image-2025-08-27-at-11-13-05-b41682ea.jpg',
  image:
    'https://i.ibb.co.com/TMdYQ8r5/Whats-App-Image-2025-08-27-at-11-13-05-b41682ea.jpg',
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
