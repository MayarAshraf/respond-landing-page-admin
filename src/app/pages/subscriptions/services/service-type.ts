import { Package } from '@pages/packages/services/service-type';
import { User } from '@pages/users/services/service-type';

export interface Subscription {
  id: number;
  package: Package;
  user: User;
  status: string;
  image: string;
  start_date: string;
  end_date: string;
  amount: number;
}
