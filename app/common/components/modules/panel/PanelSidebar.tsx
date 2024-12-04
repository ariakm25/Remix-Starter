import { Link, NavLink } from '@remix-run/react';
import {
  HomeIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
} from 'lucide-react';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';
import { cn } from '~/common/utils/ui';

export const menuItems = [
  {
    name: 'Dashboard',
    icon: HomeIcon,
    to: '/panel',
    exact: true,
  },
  {
    name: 'Orders',
    icon: ShoppingCartIcon,
    to: '/panel/orders',
    badge: 6,
  },
  {
    name: 'Products',
    icon: PackageIcon,
    to: '/panel/products',
  },
  {
    name: 'Users',
    icon: UsersIcon,
    to: '/panel/users',
  },
  {
    name: 'Analytics',
    icon: LineChartIcon,
    to: '/panel/analytics',
  },
];

export const PanelSidebar = () => {
  return (
    <div className="hidden border-r md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <LayoutDashboardIcon className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </Link>
        </div>
        <div className="flex-1">
          <ScrollArea>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {menuItems.map((item) => (
                <NavLink
                  end={item.exact}
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-4 rounded px-3 py-3 text-muted-foreground',
                      isActive
                        ? 'text-primary-foreground bg-primary'
                        : 'hover:bg-primary/10 hover:text-foreground'
                    )
                  }>
                  {({ isActive }) => (
                    <>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? 'outline' : 'default'}
                          className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
