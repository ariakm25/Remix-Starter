import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../../ui/dropdown-menu';
import {
  MenuIcon,
  CircleUserIcon,
  ChevronDownIcon,
  LogOutIcon,
  Settings2Icon,
  UserIcon,
} from 'lucide-react';
import { Button } from '../../ui/button';
import {
  SheetTrigger,
  SheetContent,
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../../ui/sheet';
import { Link, NavLink, useSubmit } from '@remix-run/react';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';
import { menuItems } from './PanelSidebar';
import { cn } from '~/common/utils/ui';
import { AuthSession } from 'server/session.server';

export const PanelHeader = ({ user }: { user: AuthSession['user'] }) => {
  const submit = useSubmit();

  const handleLogout = () =>
    submit(null, { method: 'post', action: '/auth/logout' });

  return (
    <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <div>
            <SheetHeader>
              <SheetTitle>Acme Inc</SheetTitle>
              <SheetDescription>Welcome Back</SheetDescription>
            </SheetHeader>
          </div>
          <ScrollArea>
            <nav className="grid gap-2 text-lg font-medium">
              {menuItems.map(({ name, icon: Icon, to, badge, exact }) => (
                <NavLink
                  end={exact}
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'mx-[-0.65rem] flex items-center gap-4 rounded px-3 py-2 text-muted-foreground hover:text-foreground',
                      {
                        'text-foreground': isActive,
                      }
                    )
                  }>
                  {({ isActive }) => (
                    <>
                      <Icon className="h-5 w-5" />
                      <span>{name}</span>
                      {badge && (
                        <Badge variant={isActive ? 'outline' : 'default'}>
                          {badge}
                        </Badge>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1"></div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 rounded-full bg-muted p-2 cursor-pointer">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <CircleUserIcon className="h-6 w-6" />
              )}
              <span>{user.name}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/panel/profile" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/panel/settings" className="flex items-center gap-2">
                <Settings2Icon className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                variant={'ghost'}
                className="flex p-0 gap-2 h-auto w-full justify-start"
                onClick={handleLogout}>
                <LogOutIcon className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
