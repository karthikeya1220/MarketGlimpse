import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import NavItems from '@/components/NavItems';
import UserDropdown from '@/components/UserDropdown';

const Header = ({ user }: { user: User }) => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/" className="flex items-center space-x-2 group">
          <TrendingUp className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
          <span className="text-xl font-bold text-white group-hover:text-gray-100 transition-colors">
            MarketGlimpse
          </span>
        </Link>
        <nav className="hidden sm:block">
          <NavItems />
        </nav>

        <UserDropdown user={user} />
      </div>
    </header>
  );
};
export default Header;
